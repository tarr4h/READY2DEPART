package com.web.trv.comn.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.model.DrivingVo;
import com.web.trv.comn.model.Tmap;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

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

    private static ObjectMapper objectMapper;

    public static UserVo getLoginUser() throws Exception {
        return (UserVo) Utilities.getSession().getAttribute("loginUser");
    }

    public static HttpSession getSession() throws Exception {
        ServletRequestAttributes servletContainer = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if(servletContainer != null){
            HttpServletRequest request = servletContainer.getRequest();
            return request.getSession();
        } else {
            throw new Exception("SERVLETCONTAINER NULL");
        }
    }

    public static DrivingVo getDriving(double startLat, double startLng, double goalLat, double goalLng){
        RestTemplate restTemplate = new RestTemplate();

        String apiKeyId = "qf1nz5j1ox";
        String apiKey = "zKk2iApYsA7XFiXgqTTdtguAsvgSJlXZJ59a1HhL";
        String drivingUrl = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Accept", "*/*");
        headers.add("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36");
        headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
        headers.set("X-NCP-APIGW-API-KEY", apiKey);

        HttpEntity<HttpHeaders> request = new HttpEntity<>(headers);

        URI uri = UriComponentsBuilder.fromHttpUrl(drivingUrl)
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
            log.debug("response : {}", response);
            log.debug("responseBody : {}", response.getBody());
            log.debug("jsonToVo = {}", jsonToVo);
            return jsonToVo;
        } catch(JsonProcessingException e){
            log.error("NAVERMAP API RESPONSE ERROR = {}", e.getMessage());
            return null;
        }
    }

    public static int sec2min(int sec){
        double doubleRange = (double) sec / 60;
        return (int) (Math.ceil(doubleRange));
    }

    public static int miliSec2min(int milisec){
        double doubleRange = (double) milisec / 1000;
        int double2int = (int) (Math.ceil(doubleRange));
        return sec2min(double2int);
    }

    public static String addMinToTimeFmt(String timeFormat, int min){
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.getDefault());
        try{
            Date date = sdf.parse(timeFormat);
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            cal.add(Calendar.MINUTE, min);
            timeFormat = sdf.format(cal.getTime());
        } catch (ParseException e){
            log.error("PARSING EXCEPTION = {}", e.getMessage());
        }

        return timeFormat;
    }

    public static int minBetweenTimeStr(String timeFormat1, String timeFormat2){
        int result = 0;
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.getDefault());
        try{
            Date date1 = sdf.parse(timeFormat1);
            Calendar cal1 = Calendar.getInstance();
            cal1.setTime(date1);

            Date date2 = sdf.parse(timeFormat2);
            Calendar cal2 = Calendar.getInstance();
            cal2.setTime(date2);

            if(cal1.getTimeInMillis() > cal2.getTimeInMillis()){
                throw new Exception("timeFormat1이 2보다 큽니다.");
            }

            int gap = (int) (cal2.getTimeInMillis() - cal1.getTimeInMillis());
            result = miliSec2min(gap);
        } catch (Exception e){
            log.error("PARSING EXCEPTION = {}", e.getMessage());
        }

        return result;
    }

    public static int getRandom6Number(){
        return (int) Math.floor(Math.random() * 1000000);
    }

    public static int parseInt(Object obj){
        try {
            if(obj instanceof String){
                return Integer.parseInt(String.valueOf(obj));
            } else {
                return (int) obj;
            }
        } catch (NullPointerException e){
            throw new NullPointerException("PARSE INT >> OBJ == NULL");
        }
    }

    public static Map<String, Object> beanToMap(Object obj) {
        if(obj == null) return null;
        return objectMapper.convertValue(obj, Tmap.class);
    }
}
