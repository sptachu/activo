import com.google.gson.Gson;
import spark.Request;
import spark.Response;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;

import static spark.Spark.*;

public class App {
    static User loggedUser;
    static ArrayList<User> userArr = new ArrayList<User>();
    static ArrayList<Activity> activityArr = new ArrayList<Activity>();
    
    public static void main(String[] args) {
        userArr.add(new User("a", "2"));
        userArr.add(new User("b", "3"));
        User adminUser = new User("admin", "admin");
        adminUser.switchAccountType();
        userArr.add(adminUser);
        staticFiles.location("/public");
        get("/test", (req, res) -> "test");
        post("/login", (req, res) -> login(req, res));
        post("/logout", (req,res) -> logout(req, res));
        post("/goToAddActivitySite", (req, res) -> goToAddActivitySite(req,res));
        post("/addActivity", (req, res) -> addActivity(req,res));
        post("/getCurrentUser", (req, res) -> getCurrentUser(req,res));
        post("/getUserList", (req, res) -> getUserList(req,res));
        post("/deleteActivities", (req, res) -> deleteActivities(req,res));
        post("/deleteUsers", (req, res) -> deleteUsers(req,res));
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

    public static String goToAddActivitySite(Request req, Response res){
        if (loggedUser != null){
            System.out.println("Przekierowanie do strony dodawania aktywności");
            return "teraz mozesz dodac aktywnosc";
        } else {
            System.out.println("Nie można dodac aktywnosci - użytkownik nie jest zalogowany");
            return "nie mozna dodac aktywnosci";
        }
    }

    public static boolean addActivity(Request req, Response res){
        Gson gson = new Gson();
        Activity activityParams = gson.fromJson(req.body(), Activity.class);
        if (loggedUser != null) {
            Activity activity = new Activity(activityParams.title, activityParams.location, activityParams.duration, activityParams.time, activityParams.type, activityParams.distance,activityParams.elevation, loggedUser);// dystans zawsze musi byc podany w km
            activityArr.add(activity);
            loggedUser.activities.add(activity); // dodanie aktywności do listy aktywności użytkownika oprócz tego że jest tez w ogolnej liscie aktywnosci
            loggedUser.activityCount += 1;
            System.out.println("Pomyślnie dodano aktywność");
            return(true);
        } else {
            System.out.println("Nie można dodać aktywności - najpierw się zaloguj");
            return(false);
        }
    }

    public static String getCurrentUser(Request req, Response res) {
        Gson gson = new Gson();
        return(gson.toJson(loggedUser));
    }

    public static String getUserList(Request req, Response res) {
        Gson gson = new Gson();
        return(gson.toJson(userArr));
    }

    public static boolean deleteActivities(Request req, Response res) {
        if (loggedUser != null){
            Gson gson = new Gson();
            String[] received = gson.fromJson(req.body(), String[].class);
            ArrayList<String> toDelete = new ArrayList<String>(Arrays.asList(received));
            for (int i = 0;i< toDelete.size();i+=1){
                System.out.println(toDelete.get(i));
                for(int j = 0;j<activityArr.size();j+=1){
                    if (Objects.equals(toDelete.get(i), activityArr.get(j).id)){
                        activityArr.remove(j);
                    }
                }
                for(int g = 0;g<userArr.size();g+=1){
                    for(int h = 0;h<userArr.get(g).activities.size();h+=1){
                        if (Objects.equals(toDelete.get(i), userArr.get(g).activities.get(h).id)){
                            userArr.get(g).activities.remove(h);
                        }
                    }
                }
            }

            return(true);
        } else {
            return(false);
        }
    }
    public static boolean deleteUsers(Request req, Response res) {
        if (loggedUser != null){
            Gson gson = new Gson();
            String[] received = gson.fromJson(req.body(), String[].class);
            ArrayList<String> toDelete = new ArrayList<String>(Arrays.asList(received));
            for (int i = 0;i< toDelete.size();i+=1){
                System.out.println(toDelete.get(i));
                for(int j = 0;j<userArr.size();j+=1){
                    if (Objects.equals(toDelete.get(i), userArr.get(j).username)){
                        userArr.remove(j);
                    }
                }
                for(int g = 0;g<activityArr.size();g+=1){
                    if (Objects.equals(toDelete.get(i), activityArr.get(g).user)){
                        userArr.get(g).activities.remove(g);
                    }
                }
            }

            return(true);
        } else {
            return(false);
        }
    }


}
