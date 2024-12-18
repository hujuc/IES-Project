package pt.ua.deti.ies.backend.responses;

public class LoginResponse {
    private String token;

    private long expiresIn;

    public String getToken() {
        return token;
    }

     public void setToken(java.lang.String token) {
         this.token = token;
     }

     public long getExpiresIn() {
         return expiresIn;
     }

     public void setExpiresIn(long expiresIn) {
         this.expiresIn = expiresIn;
     }
}