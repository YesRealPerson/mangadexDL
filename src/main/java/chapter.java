import java.util.ArrayList;

public class chapter {
    private String id;
    private int num;
    private ArrayList<String> others;

    public chapter(int num, String id, ArrayList<String> others){
        this.num = num;
        this.id = id;
        this.others = others;
    }

    public int getNum(){return num;}
    public String getId(){return id;}
    public ArrayList<String> getOthers(){return others;}
    public void addOthers(String add) {this.others.add(add);}
}
