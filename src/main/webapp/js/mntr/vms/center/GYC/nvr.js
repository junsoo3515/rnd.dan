var NVR = {
	hDevice : 0,
	XnsSdkWindow : $('<object/>', {
		id : 'xnsSdkWindow',
		classid : 'clsid:C3F99E59-433D-4A79-A188-B36ACE8F78F8',
		width : '100%',
		height : '100%'
	}),
	XnsSdkDevice : $('<object/>', {
		id : 'xnsSdkDevice',
		classid : 'clsid:9BED9251-E8E7-4B67-B281-ADC06BA7988D',
		width : '100%',
		height : '1px',
	}),
	init : function() {
		this.getDevice.Initialize();
		this.getWindow.Initialize(0, 0);
	},
	destroy : function() {
		this.getDevice.ReleaseDevice(this.hDevice);
	},
	connect : function() {
		if (this.hDevice == 0) {
			this.hDevice = this.getDevice.CreateDevice(1);
			if (this.hDevice == 0) {
				return;
			}
			console.log('CreateDevice');
		}
		
		this.getDevice.SetConnectionInfo(this.hDevice, 'Samsung', 'Samsung NVR', 1, '192.168.5.73', 554, 8180, 'admin', 'son2793;');
		this.getDevice.ConnectNonBlock(this.hDevice, false, true);
	},
	getDevice : function() {
		return document.getElementById('xnsSdkDevice');
	},
	getWindow : function() {
		return document.getElementById('xnsSdkWindow');
	}
}