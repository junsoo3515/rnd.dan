package kr.co.ucp.dan.cmm;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class ImageResize {

	public static void reSize(String path, String[] fileNm, int[] imgSize, int cnt) throws Exception {
		int arrayCnt = 0;
		String fullPath = "";
		
		for(int i=0; i<fileNm.length; i++){
			fullPath =  path + File.separator + fileNm[i];
			arrayCnt = imgSize[i];
			
			BufferedImage bi = ImageIO.read(new File(fullPath));
			
			Image img = bi.getScaledInstance(arrayCnt, arrayCnt, Image.SCALE_DEFAULT);
			
			BufferedImage oi = new BufferedImage(arrayCnt, arrayCnt, BufferedImage.TYPE_INT_RGB);
			Graphics g = oi.getGraphics();
			g.drawImage(img, 0, 0, new Panel());
			
			ImageIO.write(oi, "png", new File(fullPath));
		}
	}
}




