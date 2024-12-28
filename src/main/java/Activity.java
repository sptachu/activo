public class Activity {
    public String location;
    public long duration;
    public long time;
    public String type;
    public User user;

    public Activity(String location, long duration, long time, String type, User user) {
        this.location = location;
        this.duration = duration;
        this.time = time;
        this.type = type;
        this.user = user;
    }
}
