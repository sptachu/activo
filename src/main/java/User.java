import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class User {
    public boolean ifAdmin;
    public String username;
    public String password;
    public int activityCount;
    public String totalActiveTime = "0:00:00";
    public String goalTotalActiveTime = "10:00:00";
    public String timeDifference = timeToGoal(totalActiveTime, goalTotalActiveTime);
    public String tenKmRunTime = "100:00:00";
    public String goalTenKmRunTime = "0:45:00";
    public  String timeDifferenceRun = timeToGoal(tenKmRunTime, goalTenKmRunTime);
    public String fortyKmBikeTime = "100:00:00";
    public String goalFortyKmBikeTime = "1:30:00";
    public String timeDifferenceBike = timeToGoal(fortyKmBikeTime, goalFortyKmBikeTime);
    public String fourHundredMetersSwimTime = "100:00:00";
    public String goalFourHundredMetersSwimTime = "0:06:00";
    public String timeDifferenceSwim = timeToGoal(fourHundredMetersSwimTime, goalFourHundredMetersSwimTime);
    public double totalDistance = 0.0;
    public double goalTotalDistance = 300.0;
    public double distanceDifference = goalTotalDistance - totalDistance;

    ArrayList<User> friends = new ArrayList<User>();
    public ArrayList<Activity> activities = new ArrayList<Activity>();

    public User(String username, String password) {

        this.activityCount = 0;
        this.goalTotalActiveTime = "10:00:00"; // nie wiem dlaczego przy tworzeniu nowego urzytkownika nie dodaja sie te cele tylko jest null
        this.goalTenKmRunTime = "0:45:00";
        this.goalFortyKmBikeTime = "1:30:00";
        this.goalFourHundredMetersSwimTime = "0:06:00";
        this.goalTotalDistance = 300.0;
        this.username = username;
        this.password = password;
        this.ifAdmin = false;
    }

    public User (String username, String password, boolean ifAdmin, String goalTotalActiveTime, String goalTenKmRunTime, String goalFortyKmBikeTime, String goalFourHundredMetersSwimTime, double goalTotalDistance) {
        this.username = username;
        this.password = password;
        this.ifAdmin = ifAdmin;
        this.activityCount = 0;
        this.goalTotalActiveTime = goalTotalActiveTime;
        this.goalTenKmRunTime = goalTenKmRunTime;
        this.goalFortyKmBikeTime = goalFortyKmBikeTime;
        this.goalFourHundredMetersSwimTime = goalFourHundredMetersSwimTime;
        this.goalTotalDistance = goalTotalDistance;
    }

    public void switchAccountType() {
        if (this.ifAdmin) {
            this.ifAdmin = false;
        } else {
            this.ifAdmin = true;
        }
    }

    public static String toFancyTime(long totalSeconds) {
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;
        return String.format("%d:%02d:%02d", hours, minutes, seconds);
    }

    public static long toSeconds(String timeString) {
        try {
            String[] parts = timeString.split(":");
            long hours = Long.parseLong(parts[0]);
            long minutes = Long.parseLong(parts[1]);
            long seconds = Long.parseLong(parts[2]);
            return hours * 3600 + minutes * 60 + seconds;
        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
            System.err.println("Invalid time format: " + e.getMessage());
            throw new IllegalArgumentException("Invalid numeric values in time");
        }
        // program jest bardziej "debiloodporny" - urzytkownik moze podac czas tak jak mu sie podoba,
        // na przyklad tylko w sekundach albo tylko w minutach. program i tak go zrozumie
    }

    public static String timeToGoal(String time, String goalTime) {
        if(time == null || goalTime == null) {
            return "No time set";
        } else {
            long timeInSeconds = toSeconds(time);
            long goalTimeInSeconds = toSeconds(goalTime);
            long timeToGoalInSeconds = goalTimeInSeconds - timeInSeconds;
            if (timeInSeconds < goalTimeInSeconds) {
                return "Time is faster than the goal time!";
            } else if (timeToGoalInSeconds < 60) {
                return timeToGoalInSeconds + " seconds";
            } else if (timeToGoalInSeconds < 3600) {
                long minutes = timeToGoalInSeconds / 60;
                long seconds = timeToGoalInSeconds % 60;
                return minutes + "m " + seconds + "s";
            } else {
                return toFancyTime(timeToGoalInSeconds);
            }
        }
    }
}
