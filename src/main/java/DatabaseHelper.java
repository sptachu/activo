import java.sql.*;
import java.util.ArrayList;

public class DatabaseHelper {
    private static final String DB_URL = "jdbc:sqlite:users.db";
    public static final String DRIVER = "org.sqlite.JDBC";

    private Connection conn;
    private Statement stat;

    public DatabaseHelper() {
        try {
            Class.forName(DatabaseHelper.DRIVER);
        } catch (ClassNotFoundException e) {
            System.err.println("Brak sterownika JDBC");
            e.printStackTrace();
        }

        try {
            conn = DriverManager.getConnection(DB_URL);
            stat = conn.createStatement();
        } catch (SQLException e) {
            System.err.println("Problem z otwarciem polaczenia");
            e.printStackTrace();
        }

        createTables();
    }

    public boolean createTables() {
        String createUsers = "CREATE TABLE IF NOT EXISTS users (id_user INTEGER PRIMARY KEY AUTOINCREMENT, ifAdmin INTEGER, username TEXT, password TEXT, goalTotalActiveTime TEXT, goalTenKmRunTime TEXT, goalFortyKmBikeTime TEXT, goalFourHundredMetersSwimTime TEXT, goalTotalDistance REAL)";
        String createActivities = "CREATE TABLE IF NOT EXISTS activities (id_activity INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT, duration TEXT, time TEXT, type TEXT, distance REAL, elevation INTEGER, user TEXT, trueID TEXT)";
        try {
            stat.execute(createUsers);
            stat.execute(createActivities);
        } catch (SQLException e) {
            System.err.println("Blad przy tworzeniu tabeli");
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean insertUsers(boolean ifAdmin, String username, String password, String goalTotalActiveTime, String goalTenKmRunTime, String goalFortyKmBikeTime, String goalFourHundredMetersSwimTime, double goalTotalDistance) {
        try {
            // Check if the user already exists
            PreparedStatement checkStmt = conn.prepareStatement("SELECT COUNT(*) FROM users WHERE username = ?");
            checkStmt.setString(1, username);
            ResultSet rs = checkStmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                System.err.println("User with username " + username + " already exists.");
                return true;
            }

            // Insert the new user
            PreparedStatement prepStmt = conn.prepareStatement(
                    "INSERT INTO users (ifAdmin, username, password, goalTotalActiveTime, goalTenKmRunTime, goalFortyKmBikeTime, goalFourHundredMetersSwimTime, goalTotalDistance) VALUES (?, ?, ?, ?, ?, ?, ?, ?);");
            prepStmt.setBoolean(1, ifAdmin);
            prepStmt.setString(2, username);
            prepStmt.setString(3, password);
            prepStmt.setString(4, goalTotalActiveTime);
            prepStmt.setString(5, goalTenKmRunTime);
            prepStmt.setString(6, goalFortyKmBikeTime);
            prepStmt.setString(7, goalFourHundredMetersSwimTime);
            prepStmt.setDouble(8, goalTotalDistance);
            prepStmt.execute();
        } catch (SQLException e) {
            System.err.println("Error inserting user");
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean insertActivities(String title, String location, String duration, String time, String type, double distance, int elevation, String user, String trueID) {
        try {
            PreparedStatement prepStmt = conn.prepareStatement(
                    "INSERT INTO activities (title, location, duration, time, type, distance, elevation, user, trueID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            prepStmt.setString(1, title);
            prepStmt.setString(2, location);
            prepStmt.setString(3, duration);
            prepStmt.setString(4, time);
            prepStmt.setString(5, type);
            prepStmt.setDouble(6, distance);
            prepStmt.setInt(7, elevation);
            prepStmt.setString(8, user);
            prepStmt.setString(9, trueID);
            prepStmt.execute();
        } catch (SQLException e) {
            System.err.println("Blad przy wstawianiu aktywnosci");
            e.printStackTrace();
            return false;
        }
        return true;
    }


    public boolean deleteActivity(String trueID) {
        try {
            PreparedStatement prepStmt = conn.prepareStatement("DELETE FROM activities WHERE trueID = ?");
            prepStmt.setString(1, trueID);
            prepStmt.execute();
        } catch (SQLException e) {
            System.err.println("Error deleting activity");
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean deleteUser(String username) {
        try {
            PreparedStatement prepStmt = conn.prepareStatement("DELETE FROM users WHERE username = ?");
            prepStmt.setString(1, username);
            prepStmt.execute();
            try {
                PreparedStatement prepStmt2 = conn.prepareStatement("DELETE FROM activities WHERE user = ?");
                prepStmt2.setString(1, username);
                prepStmt2.execute();
            } catch (SQLException e) {
                System.err.println("Error deleting user activities");
                e.printStackTrace();
                return false;
            }
        } catch (SQLException e) {
            System.err.println("Error deleting user");
            e.printStackTrace();
            return false;
        }
        return true;
    }


    public ArrayList<User> selectUsers() {
        ArrayList<User> userss = new ArrayList<>();
        try {
            ResultSet result = stat.executeQuery("SELECT * FROM users");
            int id, activityCount;
            boolean ifAdmin;
            String username, password;
            while(result.next()) {
                id = result.getInt("id_user");
                ifAdmin = result.getBoolean("ifAdmin");
                username = result.getString("username");
                password = result.getString("password");
                String goalTotalActiveTime = result.getString("goalTotalActiveTime");
                String goalTenKmRunTime = result.getString("goalTenKmRunTime");
                String goalFortyKmBikeTime = result.getString("goalFortyKmBikeTime");
                String goalFourHundredMetersSwimTime = result.getString("goalFourHundredMetersSwimTime");
                double goalTotalDistance = result.getDouble("goalTotalDistance");
                userss.add(new User(username, password, ifAdmin, goalTotalActiveTime, goalTenKmRunTime, goalFortyKmBikeTime, goalFourHundredMetersSwimTime, goalTotalDistance));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
        return userss;
    }

    public ArrayList<Activity> selectActivities() {
        ArrayList<Activity> activitiess = new ArrayList<>();
        try {
            ResultSet result = stat.executeQuery("SELECT * FROM activities");
            int id, elevation;
            double distance;
            String title, location, duration, time, type, user, trueID;
            while(result.next()) {
                id = result.getInt("id_activity");
                title = result.getString("title");
                location = result.getString("location");
                duration = result.getString("duration");
                time = result.getString("time");
                type = result.getString("type");
                distance = result.getDouble("distance");
                elevation = result.getInt("elevation");
                user = result.getString("user");
                trueID = result.getString("trueID");
                activitiess.add(new Activity(trueID ,title, location, duration, time, type, distance, elevation, user));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
        return activitiess;
    }

    public void closeConnection() {
        try {
            conn.close();
        } catch (SQLException e) {
            System.err.println("Problem z zamknieciem polaczenia");
            e.printStackTrace();
        }
    }
}