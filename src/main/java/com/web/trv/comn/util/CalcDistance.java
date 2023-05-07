package com.web.trv.comn.util;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.comn.util.CalcDistance
 *  - CalcDistance.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : CalcDistance
 * @description :
 * @date : 2023-05-07
 */

@Slf4j
public class CalcDistance {

    // X, Y : 기준 locationX, locationY - A, B : 비교할 locationX, locationY
    public static boolean calculateArea(String X, String Y, String A, String B, int limit) {
        if(X.equals(A) && Y.equals(B)) {
            return true;
        }

        BigDecimal aX1 = BigDecimal.valueOf(Double.parseDouble(X));
        BigDecimal aY1 = BigDecimal.valueOf(Double.parseDouble(Y));
        BigDecimal bX1 = BigDecimal.valueOf(Double.parseDouble(A));
        BigDecimal bY1 = BigDecimal.valueOf(Double.parseDouble(B));

        String locationX = aX1.subtract(bX1).toString();
        String locationY = aY1.subtract(bY1).toString();

        log.debug("locationX = {}", locationX);
        log.debug("locationY = {}", locationY);

        double result1 = getSqrtDistance(locationX, "X");
        double result2 = getSqrtDistance(locationY, "Y");
        double finalResult = Math.sqrt((result1 * result1) + (result2 * result2));

        log.debug("finalResult = {}", finalResult);

        // int : 반경(km)
        boolean bool = finalResult < limit;

        return bool;
    }

    public static double getSqrtDistance(String location, String XY){
        double xa = Double.parseDouble(location.substring(0, location.indexOf(".")));
        double xbCal = Double.parseDouble(location.substring(location.lastIndexOf("."))) * 60;
        String xbCal2 = Double.toString(xbCal);
        double xb = Double.parseDouble(xbCal2.substring(0, xbCal2.indexOf(".")));

        double xcCal = (xbCal - xb) * 60;
        String xcCal2 = Double.toString(xcCal);
        double xc = Double.parseDouble(xcCal2);

        double result;
        if(XY.equals("X")){
            result = (xa * 88.9) + (xb * 1.48) + (xc * 0.025);
        } else {
            result = (xa * 111.3) + (xb * 1.86) + (xc * 0.031);
        }

        return result;
    }

    public static Map<String, Object> getMaxDistance(String latitude, String longitude){
        Map<String, Object> distance = new HashMap<>();

        double maxLatitude = Double.parseDouble(latitude) + 0.0927;
        double maxLongitude = Double.parseDouble(longitude) + 0.074;
        double minLatitude = Double.parseDouble(latitude) - 0.0927;
        double minLongitude = Double.parseDouble(longitude) - 0.074;

        String maxLatitudeStr = Double.toString(maxLatitude);
        String maxLongitudeStr = Double.toString(maxLongitude);
        String minLatitudeStr = Double.toString(minLatitude);
        String minLongitudeStr = Double.toString(minLongitude);

        distance.put("maxLatitude", maxLatitudeStr);
        distance.put("maxLongitude", maxLongitudeStr);
        distance.put("minLatitude", minLatitudeStr);
        distance.put("minLongitude", minLongitudeStr);

        return distance;
    }

}
