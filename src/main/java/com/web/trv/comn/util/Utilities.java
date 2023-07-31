package com.web.trv.comn.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.model.DrivingVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.net.URI;
import java.nio.charset.StandardCharsets;

/**
 * <pre>
 * com.web.trv.comn.util.Utilities
 *   - Utilities.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : Utilities
 * @description :
 * @date : 2023/07/19
 */
@Slf4j
public class Utilities {

    public static UserVo getLoginUser(){
        ServletRequestAttributes servletContainer = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if(servletContainer != null){
            HttpServletRequest request = servletContainer.getRequest();
            HttpSession session = request.getSession();
            return (UserVo) session.getAttribute("loginUser");
        } else {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public static DrivingVo getDriving(double startLat, double startLng, double goalLat, double goalLng){
        final String apiKeyId = "qf1nz5j1ox";
        final String apiKey = "zKk2iApYsA7XFiXgqTTdtguAsvgSJlXZJ59a1HhL";
        final String url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Accept", "*/*");
        headers.add("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36");
        headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
        headers.set("X-NCP-APIGW-API-KEY", apiKey);

        HttpEntity<HttpHeaders> request = new HttpEntity<>(headers);

        URI uri = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("start", startLng + "," + startLat)
                .queryParam("goal", goalLng + "," + goalLat)
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUri();

        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, request, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        try{
//            Map<String, Object> jsonMap = objectMapper.readValue(response.getBody(), Map.class);
            DrivingVo jsonToVo = objectMapper.readValue(response.getBody(), DrivingVo.class);
            log.debug("jsonToVo = {}", jsonToVo);
            return jsonToVo;
        } catch(JsonProcessingException e){
            log.error("NAVERMAP API RESPONSE ERROR = {}", e.getMessage());
            return null;
        }
    }
}
