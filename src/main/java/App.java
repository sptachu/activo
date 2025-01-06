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
    static DatabaseHelper dbHelper;
    
    public static void main(String[] args) {
        dbHelper = new DatabaseHelper();


        //zawsze jak dodaje urzytkownika do arraylisty to dodaje tez do bazy danych
//        userArr.add(new User("a", "2"));
//        dbHelper.insertUsers(userArr.get(0).ifAdmin, userArr.get(0).username, userArr.get(0).password);
//        userArr.add(new User("b", "3"));
//        dbHelper.insertUsers(userArr.get(1).ifAdmin, userArr.get(1).username, userArr.get(1).password);

//        User adminUser = new User("admin", "admin");
//        adminUser.switchAccountType();
//        userArr.add(adminUser);
//        dbHelper.insertUsers(adminUser.ifAdmin, adminUser.username, adminUser.password);
        userArr = dbHelper.selectUsers();
        activityArr = dbHelper.selectActivities();
        for(User user : userArr){
            String lastActivityId = "-1";
            for(Activity activity : activityArr){
                if(Objects.equals(activity.user, user.username)){
                    user.activities.add(activity);
//                    user.activityCount += 1;
                    lastActivityId = activity.id.substring(activity.id.lastIndexOf(':') + 1);
                }
            }
            user.activityCount = Integer.parseInt(lastActivityId) + 1;
        }



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
        post("/deleteUser", (req, res) -> deleteUser(req,res));
        post("/getActivityList", (req, res) -> getActivityList(req,res));
        post("/register", (req, res) -> register(req,res));
    }

//    public static void printAllActivities() {
//        for(Activity xd : userArr.getFirst().activities)
//            System.out.println(xd.title);
//    }

    public static boolean login(Request req, Response res) {
        Gson gson = new Gson();
        User logData = gson.fromJson(req.body(), User.class);

        if (loggedUser == null){
            boolean logInStatus = false;
            for (User user: userArr) {
                if (Objects.equals(user.username, logData.username) && Objects.equals(user.password, logData.password)){
                    loggedUser = user;
                    logInStatus = true;
                    for(Activity activity : loggedUser.activities){
                        updateGoals(activity);
                    }
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
            long durationRepairer = User.toSeconds(activityParams.duration);
            activityParams.duration = User.toFancyTime(durationRepairer);
            // te dwie linijki powyzej naprawiaja czas do formatu w ktorym minuty i sekundy nie sa wieksze ni 60
            // tak zeby czas pomimo bledu uzytkownika byl zapisany w poprawny sposob

            Activity activity = new Activity(
                    activityParams.title,
                    activityParams.location,
                    activityParams.duration,
                    activityParams.time,
                    activityParams.type,
                    activityParams.distance,   // dystans zawsze musi byc podany w km
                    activityParams.elevation,
                    loggedUser
            );
            activityArr.add(activity);
            loggedUser.activities.add(activity); // dodanie aktywności do listy aktywności użytkownika oprócz tego że jest tez w ogolnej liscie aktywnosci
            loggedUser.activityCount += 1;

            // linijka ponizej tymczasowo zakomentowana, bo nie dziala przez to ze sie cele nie dodaja nw czemu
            updateGoals(activity);
            dbHelper.insertActivities(activity.title, activity.location, activity.duration, activity.time, activity.type, activity.distance, activity.elevation, activity.user, activity.id);
            System.out.println("Pomyślnie dodano aktywność" + "total active time: " + loggedUser.totalActiveTime + " total distance: " + loggedUser.totalDistance);
            return(true);
        } else {
            System.out.println("Nie można dodać aktywności - najpierw się zaloguj");
            return(false);
        }
    }

    public static void updateGoals(Activity acti) {
        //calkowity czas aktywnosci update
        long totalActiveTimeSec = User.toSeconds(loggedUser.totalActiveTime);
        long actDurationSec = User.toSeconds(acti.duration);
        totalActiveTimeSec += actDurationSec;
        loggedUser.totalActiveTime = User.toFancyTime(totalActiveTimeSec);
        loggedUser.timeDifference = User.timeToGoal(loggedUser.totalActiveTime, loggedUser.goalTotalActiveTime);

        //calkowita odleglosc update
        loggedUser.totalDistance += acti.distance;
        loggedUser.distanceDifference = loggedUser.goalTotalDistance - loggedUser.totalDistance;

        //najszybsze czasy update
        if (acti.type.equals("run")&& acti.distance >= 10) {
            long actTime = User.toSeconds(acti.duration);
            double actTimeD = actTime;
            actTimeD = actTimeD * (10 /  acti.distance);
            actTime = (long) actTimeD;
            if (actTime < User.toSeconds(loggedUser.tenKmRunTime)) {
                loggedUser.tenKmRunTime = User.toFancyTime(actTime);
                loggedUser.timeDifferenceRun = User.timeToGoal(loggedUser.tenKmRunTime, loggedUser.goalTenKmRunTime);
            }
        }

        if (acti.type.equals("bike") && acti.distance >= 40) {
            long actTime = User.toSeconds(acti.duration);
            double actTimeD = actTime;
            actTimeD = actTimeD * (40 /  acti.distance);
            actTime = (long) actTimeD;
            if (actTime < User.toSeconds(loggedUser.fortyKmBikeTime)) {
                loggedUser.fortyKmBikeTime = User.toFancyTime(actTime);
                loggedUser.timeDifferenceBike = User.timeToGoal(loggedUser.fortyKmBikeTime, loggedUser.goalFortyKmBikeTime);
            }
        }

        if (acti.type.equals("swim") && acti.distance >= 0.4) {
            long actTime = User.toSeconds(acti.duration);
            double actTimeD = actTime;
            actTimeD = actTimeD * (0.4 /  acti.distance);
            actTime = (long) actTimeD;
            if (actTime < User.toSeconds(loggedUser.fourHundredMetersSwimTime)) {
                loggedUser.fourHundredMetersSwimTime = User.toFancyTime(actTime);
                loggedUser.timeDifferenceSwim = User.timeToGoal(loggedUser.fourHundredMetersSwimTime, loggedUser.goalFourHundredMetersSwimTime);
            }
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
                for(int j = activityArr.size()-1;j>=0;j-=1){
                    if (Objects.equals(toDelete.get(i), activityArr.get(j).id)){
                        dbHelper.deleteActivity(activityArr.get(j).id);
                        activityArr.remove(j);
                    }
                }
                for(int g = userArr.size()-1;g>=0;g-=1){
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
                for(int j = userArr.size()-1;j>=0;j-=1){
                    if (Objects.equals(toDelete.get(i), userArr.get(j).username)){
                        dbHelper.deleteUser(userArr.get(j).username);
                        userArr.remove(j);
                    }
                }
                for(int g = activityArr.size()-1;g>=0;g-=1){
                    if (Objects.equals(toDelete.get(i), activityArr.get(g).user)){
                        activityArr.remove(g);
                    }
                }
            }

            return(true);
        } else {
            return(false);
        }
    }

    public static boolean deleteUser(Request req, Response res){
        if (loggedUser != null) {
            for(int j = userArr.size()-1;j>=0;j-=1){
                if (Objects.equals(loggedUser.username, userArr.get(j).username)){
                    dbHelper.deleteUser(userArr.get(j).username);
                    userArr.remove(j);
                }
            }
            for(int g = activityArr.size()-1;g>=0;g-=1){
                if (Objects.equals(loggedUser.username, activityArr.get(g).user)){
                    activityArr.remove(g);
                }
            }
            loggedUser = null;
            return (true);
        } else {
            return (false);
        }
    }

    public static String getActivityList(Request req, Response res){
        Gson gson = new Gson();
        return(gson.toJson(activityArr));
    }

    public static Integer register(Request req, Response res){
        Gson gson = new Gson();
        User userData = gson.fromJson(req.body(), User.class);

        if (Objects.equals(userData.username, "") || Objects.equals(userData.password, "")) {
            return(2);
        }

        for(int i = 0;i<userArr.size();i+=1){
            if(Objects.equals(userData.username, userArr.get(i).username)){
                return(1);
            }
        }

        userArr.add(new User(userData.username, userData.password));
        dbHelper.insertUsers(userArr.getLast().ifAdmin, userData.username, userData.password, userArr.getLast().goalTotalActiveTime, userArr.getLast().goalTenKmRunTime, userArr.getLast().goalFortyKmBikeTime, userArr.getLast().goalFourHundredMetersSwimTime, userArr.getLast().goalTotalDistance);
        return(0);
    }

}
