import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class User {
    public boolean ifAdmin;
    public String username;
    public String password;
    public String totalActiveTime;
    public String goalTotalActiveTime;
    public String timeDifference = timeToGoal(totalActiveTime, goalTotalActiveTime);
    public String tenKmRunTime;
    public String goalTenKmRunTime;
    public  String timeDifferenceRun = timeToGoal(tenKmRunTime, goalTenKmRunTime);
    public String fortyKmBikeTime;
    public String goalFortyKmBikeTime;
    public String timeDifferenceBike = timeToGoal(fortyKmBikeTime, goalFortyKmBikeTime);
    public String fourHundredMetersSwimTime;
    public String goalFourHundredMetersSwimTime;
    public String timeDifferenceSwim = timeToGoal(fourHundredMetersSwimTime, goalFourHundredMetersSwimTime);
    public int totalDistance;
    public int goalTotalDistance;
    public int distanceDifference = goalTotalDistance - totalDistance;

    ArrayList<User> friends = new ArrayList<User>();

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static String toFancyTime(long totalSeconds) {
        Duration duration = Duration.ofSeconds(totalSeconds);
        LocalTime time = LocalTime.MIDNIGHT.plus(duration); // Start from midnight
        return time.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public static long toSeconds(String timeString) {
        try {
            LocalTime time = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm:ss"));
            return time.toSecondOfDay();
        } catch (DateTimeParseException e) {
            System.err.println("Niepoprawny format czasu: " + e.getMessage());
            throw new IllegalArgumentException("Niepoprawne wartości liczbowe w czasie");
        }
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
