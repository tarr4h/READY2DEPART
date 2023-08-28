package com.web.trv.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.trv.auth.dao.AuthDao;
import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.util.EncUtil;
import com.web.trv.comn.util.Utilities;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.auth.service.AuthService
 *  - AuthService.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : AuthService
 * @description :
 * @date : 2023-04-19
 */

@Service
@Slf4j
public class AuthService {

    @Autowired
    AuthDao dao;

    @Value("${naver.service-id}")
    private String naverServiceId;
    @Value("${naver.access-key-id}")
    private String naverAccessKeyId;
    @Value("${naver.secret-key}")
    private String naverSecretKey;
    @Value("${naver.send-ph}")
    private String naverSendPh;

    public UserVo selectUser(Map<String, Object> param) {
        String enc = EncUtil.encryptPwd((String) param.get("pwd"), (String) param.get("id"));
        param.put("encPwd", enc);
        return dao.selectUser(param);
    }

    public void changeLoginUserStatus(Map<String, Object> param) {
        Map<String, Object> loginUser = dao.selectLoginUser(param);
        if(loginUser != null){
            if(loginUser.get("loginYn").equals("Y")){
                param.put("loginYn", "N");
            } else {
                param.put("loginYn", "Y");
            }
            log.debug("param = {}", param);
            dao.updateLoginUser(param);
        } else {
            dao.insertLoginUser(param);
        }
    }

    public Object join(Map<String, Object> param) {
        Map<String, Object> returnMap = new HashMap<>();
        boolean result = false;
        Map<String, Long> chkUser = dao.checkUserExist(param);
        if(chkUser.get("userIdDupCnt") != 0 || chkUser.get("phDupCnt") != 0 || chkUser.get("idDupCnt") != 0){
            returnMap.put("chkUser", chkUser);
        } else {
            param.put("encPwd", EncUtil.encryptPwd((String) param.get("password"), (String) param.get("id")));
            result = dao.insertUser(param) > 0;
        }
        returnMap.put("validate", result);
        return returnMap;
    }

    public String makeSignature(Long currentTimeMillis) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {
        String method = "POST";
        String url = "/sms/v2/services/" + naverServiceId + "/messages";
        String timestamp = currentTimeMillis.toString();

        String message = new StringBuilder()
                .append(method)
                .append(" ")
                .append(url)
                .append("\n")
                .append(timestamp)
                .append("\n")
                .append(naverAccessKeyId)
                .toString();

        SecretKeySpec sigingKey = new SecretKeySpec(naverSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(sigingKey);

        byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        return Base64.encodeBase64String(rawHmac);
    }

    @SuppressWarnings("unchecked")
    public Object sendVerifyPhRequest(Map<String, Object> param) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {
        Map<String, Long> chkUser = dao.checkUserExist(param);
        if(chkUser.get("phDupCnt") != 0){
            return false;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Long now = System.currentTimeMillis();
        headers.set("x-ncp-apigw-timestamp", now.toString());
        headers.set("x-ncp-iam-access-key", naverAccessKeyId);
        headers.set("x-ncp-apigw-signature-v2", makeSignature(now));

        URI uri = UriComponentsBuilder.fromUriString("https://sens.apigw.ntruss.com")
                .path("/sms/v2/services/{serviceId}/messages")
                .build()
                .expand(naverServiceId)
                .toUri();

        int verifyNum = Utilities.getRandom6Number();
        String toNumber = (String) param.get("ph");

        Map<String, Object> map = new HashMap<>();
        map.put("type", "SMS");
        map.put("contentType", "COMM");
        map.put("from", naverSendPh);
        map.put("subject", "READY2DEPART 인증");
        map.put("content", "인증번호는 [" + verifyNum + "] 입니다.");
        List<Map<String, Object>> messages = new ArrayList<>();
        Map<String, Object> message = new HashMap<>();
        message.put("to", toNumber);
        messages.add(message);
        map.put("messages", messages);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String body = objectMapper.writeValueAsString(map);
            HttpEntity<String> httpBody = new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
            Map<String, Object> response = restTemplate.postForObject(uri, httpBody, Map.class);

            if(response.get("statusCode") != null && response.get("statusCode").equals("202")){
                Utilities.getSession().setAttribute("verifyNumber", verifyNum);
            }
            return response;
        } catch (JsonProcessingException e){
            log.error("NAVER SMS API ERROR = {}", e.getMessage());
            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verifyPh(Map<String, Object> param) throws Exception {
        HttpSession session = Utilities.getSession();
        int verifyNumber = (int) session.getAttribute("verifyNumber");
        int resNum = Integer.parseInt(String.valueOf(param.get("reqVerifyNum")));
        session.removeAttribute("verifyNumber");
        return resNum == verifyNumber;
    }
}
