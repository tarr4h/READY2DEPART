package com.web.trv.comn.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * <pre>
 * com.web.trv.comn.util.EncUtil
 *   - EncUtil.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : EncUtil
 * @description :
 * @date : 2023/07/28
 */
public class EncUtil {

    public static String encryptPwd(String pwd, String salt) {
        try {
            MessageDigest dgst = MessageDigest.getInstance("SHA-256");
            dgst.update((pwd + salt).getBytes());
            byte[] pwdSalt = dgst.digest();

            StringBuilder sb = new StringBuilder();
            for(byte b : pwdSalt){
                sb.append(String.format("%02x", b));
            }

            return sb.toString();
        } catch (Exception e){
            throw new RuntimeException("error in encryptPwd", e);
        }
    }
}
