package pt.ua.deti.ies.backend.dto;

public class RegisterUserDto {

    private String houseId;
    private String email;
    private String name;
    private String password;
    private String profilePicture;

    public RegisterUserDto(String houseId, String email, String name, String password, String profilePicture) {
        this.houseId = houseId;
        this.email = email;
        this.name = name;
        this.password = password;
        this.profilePicture = profilePicture;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}