import java.util.ArrayList;

public class chapter {
    private String id;
    private int num;
    private ArrayList<String> others;
//    private String group;

    public chapter(int num, String id, ArrayList<String> others/*, String group*/){
        this.num = num;
        this.id = id;
        this.others = others;
//        this.group = group;
    }

    public int getNum(){return num;}
    public String getId(){return id;}
//    public String getGroup(){return group;}
    public ArrayList<String> getOthers(){return others;}
    public void addOthers(String add) {this.others.add(add);}
}
