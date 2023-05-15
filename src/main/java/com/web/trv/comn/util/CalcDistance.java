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

    private static final double EARTH_RADIUS = 6371;

    // X, Y : 기준 locationX, locationY - A, B : 비교할 locationX, locationY
    public static boolean calculateArea(String X, String Y, String A, String B, double limit) {
        if(X.equals(A) && Y.equals(B)) {
            return true;
        }
        double calc = getSqrtDistance(Double.parseDouble(X), Double.parseDouble(Y), Double.parseDouble(A), Double.parseDouble(B));

        return calc < limit;
    }

    public static double getSqrtDistance(double X, double Y, double A, double B){
        double latDistance = Math.toRadians(A - X);
        double lonDistance = Math.toRadians(B - Y);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(X)) * Math.cos(Math.toRadians(A))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    public static double getHorizontalSqrtDistance(double X, int radius){
        double a = radius / EARTH_RADIUS;
        double c = Math.sin(a / 2) * Math.sin(a / 2);
        double distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double X2 = X - Math.toDegrees(distance);
        return X2;
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
