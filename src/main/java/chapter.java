public class chapter {
    private String id;
    private int num;
    private String[] others;

    public chapter(int num, String id, String[] others){
        this.num = num;
        this.id = id;
        this.others = others;
    }

    public int getNum(){return num;}
    public String getId(){return id;}
    public String[] getOthers(){return others;}
}
