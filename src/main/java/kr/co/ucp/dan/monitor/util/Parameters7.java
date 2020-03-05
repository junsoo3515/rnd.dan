package kr.co.ucp.dan.monitor.util;


public class Parameters7 {
	public double tX;
	public double tY;
	public double tZ;
	public double tOmega;
	public double tPhi;
	public double tKappa;
	public double tScale;
	
	public Parameters7(double tX, double tY, double tZ, double tOmega, double tPhi, double tKappa, double tScale) {
		setParameters(tX, tY, tZ, tOmega, tPhi, tKappa, tScale);		
	}
	
	public void setParameters(double tX, double tY, double tZ, double tOmega, double tPhi, double tKappa, double tScale) {
	    double degrad;
	    degrad = Math.atan(1.0) / 45.0;
	   
		this.tX = tX;
		this.tY = tY;
		this.tZ = tZ;
		this.tOmega = tOmega / 3600.0 * degrad;
		this.tPhi = tPhi / 3600.0 * degrad;
		this.tKappa = tKappa / 3600.0 * degrad;
		this.tScale = tScale * 0.000001;
	}
	
	public void transform(Values3 src, Values3 dst) {
		double scale = 1.0 + tScale;

		dst.V1 = src.V1 + scale * (tKappa * src.V2 - tPhi * src.V3) + tX;
		dst.V2 = src.V2 + scale * (-tKappa * src.V1 + tOmega * src.V3) + tY;
		dst.V3 = src.V3 + scale * (tPhi * src.V1 - tOmega * src.V2) + tZ;
	}

	public void reverseTransfom(Values3 src, Values3 dst) {
		double xt, yt, zt;

		xt = (src.V1 - tX) * (1.0 + tScale);
		yt = (src.V2 - tY) * (1.0 + tScale);
		zt = (src.V3 - tZ) * (1.0 + tScale);
		   
		dst.V1 = 1.0 / (1 + tScale) * (xt - tKappa * yt + tPhi * zt);
		dst.V2 = 1.0 / (1 + tScale) * (tKappa * xt + yt - tOmega * zt);
		dst.V3 = 1.0 / (1 + tScale) * (-tPhi * xt + tOmega * yt + zt);
	}

}
