import java.util.ArrayList;

public class User {
    public boolean ifAdmin;
    public String username;
    public String password;
    ArrayList<Activity> goals = new ArrayList<Activity>();
    ArrayList<User> friends = new ArrayList<User>();

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
