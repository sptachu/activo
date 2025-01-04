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
        String createUsers = "CREATE TABLE IF NOT EXISTS users (id_user INTEGER PRIMARY KEY AUTOINCREMENT, ifAdmin INTEGER, username TEXT, password TEXT, activityCount INTEGER)";
        String createActivities = "CREATE TABLE IF NOT EXISTS activities (id_activity INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT, duration TEXT, time TEXT, type TEXT, distance REAL, elevation INTEGER, user TEXT )";
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

    public boolean insertUsers(boolean ifAdmin, String username, String password, int activityCount) {
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
                    "INSERT INTO users (ifAdmin, username, password, activityCount) VALUES (?, ?, ?, ?);");
            prepStmt.setBoolean(1, ifAdmin);
            prepStmt.setString(2, username);
            prepStmt.setString(3, password);
            prepStmt.setInt(4, activityCount);
            prepStmt.execute();
        } catch (SQLException e) {
            System.err.println("Error inserting user");
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean insertActivities(String title, String location, String duration, String time, String type, double distance, int elevation, String user) {
        try {
            PreparedStatement prepStmt = conn.prepareStatement(
                    "INSERT INTO activities (title, location, duration, time, type, distance, elevation, user) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            prepStmt.setString(1, title);
            prepStmt.setString(2, location);
            prepStmt.setString(3, duration);
            prepStmt.setString(4, time);
            prepStmt.setString(5, type);
            prepStmt.setDouble(6, distance);
            prepStmt.setInt(7, elevation);
            prepStmt.setString(8, user);
            prepStmt.execute();
        } catch (SQLException e) {
            System.err.println("Blad przy wstawianiu aktywnosci");
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
                userss.add(new User(username, password));
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
            String title, location, duration, time, type, user;
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
                activitiess.add(new Activity(user+":"+id ,title, location, duration, time, type, distance, elevation, user));
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