//import java.sql.*;
//import java.util.ArrayList;
//
//public class DatabaseHandler {
//
//    private static final String URL = "jdbc:sqlite:users.db"; // Ścieżka do bazy danych
//    private static Connection conn;
//
//    // Inicjalizacja połączenia z bazą danych
//    public static void initDatabase() {
//        try {
//            conn = DriverManager.getConnection(URL);
//            System.out.println("Połączono z bazą danych");
//
//            // Tworzenie tabeli użytkowników (jeśli nie istnieje)
//            String createUsersTable = "CREATE TABLE IF NOT EXISTS users (" +
//                    "username TEXT PRIMARY KEY, " +
//                    "password TEXT NOT NULL, " +
//                    "ifAdmin INTEGER NOT NULL, " +
//                    "activityCount INTEGER NOT NULL" +
//                    ")";
//            conn.createStatement().execute(createUsersTable);
//
//            // Tworzenie tabeli aktywności (jeśli nie istnieje)
//            String createActivitiesTable = "CREATE TABLE IF NOT EXISTS activities (" +
//                    "id TEXT PRIMARY KEY, " +
//                    "title TEXT NOT NULL, " +
//                    "location TEXT, " +
//                    "duration TEXT, " +
//                    "time TEXT, " +
//                    "type TEXT, " +
//                    "distance REAL, " +
//                    "elevation INTEGER, " +
//                    "user TEXT NOT NULL, " +
//                    "FOREIGN KEY(user) REFERENCES users(username)" +
//                    ")";
//            conn.createStatement().execute(createActivitiesTable);
//
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//    }
//
//    // Dodawanie użytkownika do bazy danych
//    public static void addUser(User user) {
//        String sql = "INSERT OR IGNORE INTO users(username, password, ifAdmin, activityCount) VALUES(?, ?, ?, ?)";
//        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
//            pstmt.setString(1, user.username);
//            pstmt.setString(2, user.password);
//            pstmt.setInt(3, user.ifAdmin ? 1 : 0);
//            pstmt.setInt(4, user.activityCount);
//            pstmt.executeUpdate();
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//    }
//
//    // Pobieranie listy użytkowników z bazy danych
//    public static ArrayList<User> getUsers() {
//        ArrayList<User> users = new ArrayList<>();
//        String sql = "SELECT * FROM users";
//        try (Statement stmt = conn.createStatement();
//             ResultSet rs = stmt.executeQuery(sql)) {
//            while (rs.next()) {
//                User user = new User(rs.getString("username"), rs.getString("password"));
//                user.ifAdmin = rs.getInt("ifAdmin") == 1;
//                user.activityCount = rs.getInt("activityCount");
//                users.add(user);
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        return users;
//    }
//
//    // Dodawanie aktywności do bazy danych
//    public static void addActivity(Activity activity) {
//        String sql = "INSERT OR IGNORE INTO activities(id, title, location, duration, time, type, distance, elevation, user) " +
//                "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
//        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
//            pstmt.setString(1, activity.id);
//            pstmt.setString(2, activity.title);
//            pstmt.setString(3, activity.location);
//            pstmt.setString(4, activity.duration);
//            pstmt.setString(5, activity.time);
//            pstmt.setString(6, activity.type);
//            pstmt.setDouble(7, activity.distance);
//            pstmt.setInt(8, activity.elevation);
//            pstmt.setString(9, activity.user);
//            pstmt.executeUpdate();
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//    }
//
//    // Pobieranie aktywności użytkownika
//    public static ArrayList<Activity> getActivities(String username) {
//        ArrayList<Activity> activities = new ArrayList<>();
//        String sql = "SELECT * FROM activities WHERE user = ?";
//        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
//            pstmt.setString(1, username);
//            try (ResultSet rs = pstmt.executeQuery()) {
//                while (rs.next()) {
//                    Activity activity = new Activity(
//                            rs.getString("title"),
//                            rs.getString("location"),
//                            rs.getString("duration"),
//                            rs.getString("time"),
//                            rs.getString("type"),
//                            rs.getDouble("distance"),
//                            rs.getInt("elevation"),
//                            new User(rs.getString("user"), "") // Placeholder User
//                    );
//                    activity.id = rs.getString("id");
//                    activities.add(activity);
//                }
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        return activities;
//    }
//}
//
