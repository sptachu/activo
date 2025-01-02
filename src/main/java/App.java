import com.google.gson.Gson;
import spark.Request;
import spark.Response;

import java.util.ArrayList;
import java.util.Objects;

import static spark.Spark.*;

public class App {
    static User loggedUser;
    static ArrayList<User> userArr = new ArrayList<User>();
    static ArrayList<Activity> activityArr = new ArrayList<Activity>();
    
    public static void main(String[] args) {
        userArr.add(new User("a", "2"));
        userArr.add(new User("b", "3"));
        staticFiles.location("/public");
        get("/test", (req, res) -> "test");
        post("/login", (req, res) -> login(req, res));
        post("/logout", (req,res) -> logout(req, res));
    }

    public static boolean login(Request req, Response res) {
        Gson gson = new Gson();
        User logData = gson.fromJson(req.body(), User.class);

        if (loggedUser == null){
            boolean logInStatus = false;
            for (User user: userArr) {
                if (Objects.equals(user.username, logData.username) && Objects.equals(user.password, logData.password)){
                    loggedUser = user;
                    logInStatus = true;
                    System.out.println("Logowanie udane - zalogowano " + user.username);
                    break;
                }
            }
            if (!logInStatus){
                System.out.println("Logowanie nieudane - złe dane");
            }

            return(logInStatus);
        } else {
            System.out.println("Logowanie nieudane - jakiś użytkownik jest już zalogowany, najpierw się wyloguj");
            return(false);
        }

    }

    public static String logout(Request req, Response res){
        if (loggedUser != null){
            loggedUser = null;
            System.out.println("Pomyślnie wylogowano");
            return "wylogowano";
        } else {
            System.out.println("Nie można wylogować - użytkownik nie jest zalogowany");
            return "nie mozna wylogowac";
        }
    }

    public void addActivity(String location, long duration, long time, String type){
        if (loggedUser != null) {
            Activity activity = new Activity(location, duration, time, type, loggedUser);
            activityArr.add(activity);
            System.out.println("Pomyślnie dodano aktywność");
        } else {
            System.out.println("Nie można dodać aktywności - najpierw się zaloguj");
        }
    }


}
