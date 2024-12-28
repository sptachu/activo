import static spark.Spark.*;

public class App {
    public static void main(String[] args) {
        staticFiles.location("/public");
        get("/test", (req, res) -> "test");
    }
}
