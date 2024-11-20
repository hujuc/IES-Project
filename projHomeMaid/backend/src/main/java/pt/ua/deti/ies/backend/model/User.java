package pt.ua.deti.ies.homemaid.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String houseId;
    private String email;
    private String name;
    private String password;
    private String profilePicture;

    public User(String houseId, String email, String name, String password, String profilePicture) {
        this.houseId = houseId;
        this.email = email;
        this.name = name;
        this.password = password;
        this.profilePicture = profilePicture;
    }

    public User() {
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "User{" +
                "houseId='" + houseId + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                '}';
    }
}