public class manga {
    private String title;
    private String id;
    private String desc;

    public manga(String title, String id, String desc){
        this.title = title;
        this.id = id;
        this.desc = desc;
    }

    public String getTitle(){return title;}
    public String getId(){return id;}
    public String getDesc(){return desc;}
}
