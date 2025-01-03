public class Activity {
    public String id;
    public String title;
    public String location;
    public String duration;
    public String time;
    public String type;
    public double distance;
    public String pace;
    public int elevation;
    public String user;

    public Activity(String title, String location, String duration, String time, String type, double distance,int elevation, User user) {
        this.title = title;
        this.location = location;
        this.duration = duration;
        this.time = time;
        this.type = type;
        this.distance = distance;
        this.elevation = elevation;
        switch (type) {
            case "run" -> this.pace = runPaceCalc(duration, distance);
            case "bike" -> this.pace = bikePaceCalc(duration, distance);
            case "swim" -> this.pace = swimPaceCalc(duration, distance);
        }

        this.id = user.username + ":" + user.activityCount;
        this.user = user.username;
    }


    private static String runPaceCalc(String duration, double distance) {
        long durationSeconds = User.toSeconds(duration);
        double pace = durationSeconds / distance;
        int paceInteger = (int) Math.round(pace);
        return Integer.toString(paceInteger / 60)+":"+Integer.toString(paceInteger % 60)+" /km";
    }


    private static String swimPaceCalc(String duration, double distance) {
    long durationSeconds = User.toSeconds(duration);
    double pacePer100m = (durationSeconds / (distance * 1000)) * 100;
    int paceInteger = (int) Math.round(pacePer100m);
    return (paceInteger / 60) + ":" + (paceInteger % 60) + " /100m";
    }

    private static String bikePaceCalc(String duration, double distance) {
    long durationSeconds = User.toSeconds(duration);
    double durationHours = durationSeconds / 3600.0;
    double pace = distance / durationHours;
    return String.format("%.2f km/h", pace);
    }


}
