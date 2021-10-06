import java.io.*;
import java.net.URL;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class main {
    public static void main(String[] args) throws Exception {
        while(true) {
            Scanner s = new Scanner(System.in);
            System.out.println("_________________________________________________________________________________________________");
            System.out.println("What are you searching for?");
            String search = s.nextLine();
            ArrayList<manga> result = Search(search);
            int x = 1;
            for (manga m : result) {
                System.out.println("_________________");
                System.out.println(x++);
                System.out.println(m.getTitle());
                System.out.println(m.getDesc());
            }
            System.out.println("Choose which title is correct");
            int select = s.nextInt() - 1;
            ArrayList<chapter> chapters = getChapters(result.get(select).getId());
            if(chapters.isEmpty()) continue;
            sortCList(chapters);
            for(int i = 0; i < chapters.size(); i++){ System.out.print(chapters.get(i).getNum()+", "); }
            System.out.println();
            System.out.println("Available chapters:");
            for (int i = 0; i < chapters.size(); i++) { chapters.get(i).getNum(); }

            System.out.println("Do you want to download all chapters or one?");
            String choice = s.next();
            choice.toLowerCase();
            //Download all
            if(choice.equals("all")) {
                for (int i = 0; i < chapters.size(); i++) {
                    int chapter = i + 1;
                    ArrayList<String> pages = getChapPages(chapters.get(i).getId());
                    //save images
                    for (int j = 0; j < pages.size(); j++) {
                        URL url = new URL(pages.get(j));
                        InputStream in = new BufferedInputStream(url.openStream());
                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        byte[] buf = new byte[1024];
                        int n = 0;
                        while (-1 != (n = in.read(buf))) {
                            out.write(buf, 0, n);
                        }
                        out.close();
                        in.close();
                        System.out.println("Saving "+ search + "." + String.valueOf(chapter));
                        byte[] response = out.toByteArray();
                        new File(System.getProperty("user.dir") + "/output/" + search + "." + String.valueOf(chapter)).mkdirs();
                        FileOutputStream fos = new FileOutputStream(System.getProperty("user.dir") + "/output/" + search + "." + String.valueOf(chapter) + "/" + String.valueOf(j) + ".jpg");
                        fos.write(response);
                        fos.close();
                    }
                }
            }


            //Download 1 chapter
            else {
                System.out.println("What chapter do you want to download?");
                int chapter = s.nextInt();
                chapter dwn = null;
                for (int i = 0; i < chapters.size(); i++) {
                    if (chapter == chapters.get(i).getNum()) {
                        dwn = chapters.get(i);
                        break;
                    }
                }
                ArrayList<String> pages = getChapPages(dwn.getId());
                //save images
                for (int i = 0; i < pages.size(); i++) {
                    URL url = new URL(pages.get(i));
                    InputStream in = new BufferedInputStream(url.openStream());
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    byte[] buf = new byte[1024];
                    int n = 0;
                    while (-1 != (n = in.read(buf))) {
                        out.write(buf, 0, n);
                    }
                    out.close();
                    in.close();
                    byte[] response = out.toByteArray();
                    new File(System.getProperty("user.dir") + "/output/" + search + "." + String.valueOf(chapter)).mkdirs();
                    FileOutputStream fos = new FileOutputStream(System.getProperty("user.dir") + "/output/" + search + "." + String.valueOf(chapter) + "/" + String.valueOf(i) + ".jpg");
                    fos.write(response);
                    fos.close();
                }
            }
        }
    }

    public static ArrayList<String> getChapPages(String id) throws Exception{
        ArrayList<String> urls = new ArrayList<String>();
        //get baseUrl
        HttpResponse<JsonNode> url = Unirest.get("https://api.mangadex.org/at-home/server" + "/{request}")
                .routeParam("request", id)
                .asJson();
        JSONObject temp = url.getBody().getObject();
        String baseUrl = temp.getString("baseUrl");

        //get hash and images
        HttpResponse<JsonNode> chapter = Unirest.get("https://api.mangadex.org/chapter" + "/{request}")
                .routeParam("request", id)
                .asJson();

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        JsonParser jp = new JsonParser();
        JsonElement je = jp.parse(chapter.getBody().toString());
        String prettyJsonString = gson.toJson(je);

        JSONObject json = new JSONObject(prettyJsonString);
        json = json.getJSONObject("data");
        json = json.getJSONObject("attributes");
        //hash
        String hash = json.getString("hash");
        //jpg names
        JSONArray jpgs = json.getJSONArray("data");
        for(int i = 0; i < jpgs.length(); i++){
            urls.add(baseUrl+"/data/"+hash+"/"+jpgs.get(i).toString());
        }
        return urls;
    }

    //returns sorted list of Chapters
    public static void sortCList(ArrayList<chapter> list){
        for(int i = 0; i < list.size()-1; i++){
            int min = i;
            for(int j = i+1; j < list.size(); j++) {
                if (list.get(j).getNum()<list.get(min).getNum()) min = j;
            }
            chapter temp = list.get(min);
            list.set(min, list.get(i));
            list.set(i, temp);
        }
//        for(int i = 0; i < list.size(); i++){
//            System.out.println(list.get(i).getNum());
//        }
    }

    //returns ArrayList with chapter name, id, description
    public static ArrayList<manga> Search(String query) throws Exception {
        HttpResponse<JsonNode> search = Unirest.get("https://api.mangadex.org/" + "/{request}")
                .queryString("title", query)
                .routeParam("request", "manga")
                .asJson();
//        System.out.println(search.getStatus());

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        JsonParser jp = new JsonParser();
        JsonElement je = jp.parse(search.getBody().toString());
        String prettyJsonString = gson.toJson(je);

        JSONObject json = new JSONObject(prettyJsonString);
        JSONArray items = json.getJSONArray("data");
        ArrayList<manga> titles = new ArrayList<manga>();
        for(int i = 0; i < items.length(); i++){
            JSONObject temp = items.getJSONObject(i);
            JSONObject attributes = temp.getJSONObject("attributes");
            //get ID
            String id = temp.getString("id");
            //get TITLE
            String title = "NOT ENGLISH";
            try {
                title = attributes
                        .getJSONObject("title")
                        .getString("en");
            }catch(Exception e){}
            //get DESC
            String desc = "NO DESCRIPTION";
            try{
                desc = attributes
                        .getJSONObject("description")
                        .getString("en");
            }catch(Exception e){}
            titles.add(new manga(title, id, desc));
        }
        return titles;
    }

    //returns ArrayList with list of available chapters
    public static ArrayList<chapter> getChapters(String id) throws Exception{
        ArrayList<chapter> chapIDs = new ArrayList<chapter>();
        HttpResponse<JsonNode> search = Unirest.get("https://api.mangadex.org/manga" + "/{request}/aggregate")
                .routeParam("request", id)
                .queryString("translatedLanguage[]", Arrays.asList("en"))
                .asJson();
        JSONObject s = new JSONObject(search);
        JSONObject tObj = s.getJSONObject("body");
        JSONArray tArr = tObj.getJSONArray("array");
        tObj = tArr.getJSONObject(0);
        try {
            tObj = tObj.getJSONObject("volumes");
        }catch(Exception e){
            System.out.println("No available chapters");
            return chapIDs;
        }
        tArr = tObj.names();
        for(int i = 0; i < tArr.length(); i++){
            JSONObject volumes = tObj.getJSONObject(tArr.get(i).toString());
            JSONObject volume = volumes.getJSONObject("chapters");
            JSONArray chNames = volume.names();
            for(int j = 0; j < chNames.length(); j++){
                JSONObject chapter = volume.getJSONObject(chNames.get(j).toString());
                int chNum = Integer.parseInt(chapter.getString("chapter"));
                String chId = chapter.getString("id");
                chapIDs.add(new chapter(chNum, chId));
            }
        }
        return chapIDs;
    }
}