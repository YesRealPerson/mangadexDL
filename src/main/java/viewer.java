import java.io.File;
import java.io.IOException;
// import java.swing.*;
// import java.awt.*;
import java.util.*;

public class viewer{
	public static void main(String[] args) throws IOException{
		String dirlink = "";
		for(String x : args){
			dirlink += x+" ";
		}
		System.out.println(dirlink);
		ArrayList<File> images = new ArrayList<File>();
		try{
		File dir = new File(dirlink);
		File files[] = dir.listFiles();
		for(File f : files){
			System.out.println(f.getName());
			if(f.getName().contains(".jpg")){
				images.add(f);
			}
		}
		}
		catch(Exception e){
			System.out.println(e);
		}
		System.out.println("-------------------------");
		for(File f : images){
			System.out.println(f.getAbsolutePath());
		}
		
		// JFrame window = new JFrame();
		// frame.setTitle(dirlink);
		
	}
}
