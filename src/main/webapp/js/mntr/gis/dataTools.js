Gis.DataTools = {
	curPathData: null,
	totalCountPathData: 0,
	curPathPage: 0,
	totPathPage: 0,
	pbtrListPage: 1
};

Gis.DataTools.ComboboxTool = {
	
	getData: function(comboId, dataId, pVal, comboCId, callback, callValue) {
		var uriCdData = "";
		if (comboCId == null) {
			comboCId = undefined;
		}
		if (dataId == "SIDO") {
			uriCdData = "getSido.do";
		} else if (dataId == "SIDO2") {
			uriCdData = "getSido2.do";
		}
		else if (dataId == "SGG") {
			uriCdData = "getSgg.do?sidoCd="+ ((pVal)?pVal:"");
		} else if (dataId == "SGG2") {
			uriCdData = "getSgg2.do?sidoCd=" + ((pVal)?pVal:"");
		}
		else if (dataId == "UMD") {
			uriCdData = "getUmd.do?sggCd=" + ((pVal)?pVal:"");
		} else if (dataId == "UMD2") {
			uriCdData = "getUmd2.do?sggCd=" + ((pVal)?pVal:"");
		} else {
			uriCdData = "getGisCd.do?cdNm=" + dataId + ((pVal)?"&queryParam="+pVal:"");
			//uriCdData = "getGisCd.do?cdNm=" + dataId;
		}
		
		jQuery.ajax({
			type: "GET",
			url: contextRoot + "/" + uriCdData,
			async : false,
			dataType: "JSON",
			argTransfer: {
				obj: this,
				cboId: comboId,
				pVal: pVal,
				cboCId: comboCId,
				callback: callback,
				callValue: callValue
				
			},
			success : this.successGetData,
			complete: this.completeGetData,
			error: this.errorGetData
			
		});
	},

	successGetData: function(data) {

		var obj = this.argTransfer;
		var domObj = $("#" + obj.cboId)[0];
		var domCObj = $("#"+ obj.cboCId)[0];
		var firstData = null;
		
		if (obj.cboId == "v1cboPrbtOfc") {
			firstData = [{text:"전체", value:""},{text:"테스트용 피부착자", value:"0"}];
		} else if(obj.cboId == "cboSrch2sido"){
			firstData = [{text:"광역시도", value:""}];
		} else if(obj.cboId == "cboIdx1sido"){
			firstData = [{text:"광역시도", value:""}];
		} else if(obj.cboId == "cboObs1sido"){
			firstData = [{text:"광역시도", value:""}];
		} else if (obj.cboId == "cboObs3sido") {
			firstData = [{text:"광역시도", value:""}];
		} else if (obj.cboId =="cboSrch3bizm") {
			firstData = [{text:"대분류", value:""}];
		}

	
		if(obj.pVal != null){
			if(obj.pVal.length == 2){
				firstData = [{text:"시군구", value:""}];
			}else if(obj.pVal.length == 5){
				firstData = [{text:"동명", value:""}];
			}else if(obj.pVal == 0){
				//$("#" + domObj.id + " option").detach();
				$("#" + domObj.id + " option").remove();
				firstData = [{text:"시군구", value:""}];
			};
		}

		if(obj.cboCId){
			//$("#" + domCObj.id + " option").detach();
			$("#" + domCObj.id + " option").remove();
			umdFirstData = [{text:"읍면동", value:""}];
			obj.obj.addOptions(domCObj, "", (umdFirstData)?umdFirstData:null);
		}
		
		//$("#" + domObj.id + " option").detach();
		$("#" + domObj.id + " option").remove();
		obj.obj.addOptions(domObj, data.list, (firstData)?firstData:null);
		
		
		if (obj.cboId == "v1cboPrbtOfc") {
			obj.obj.addOptions(document.getElementById("cboSrch4PrbtOfc"), data.list, firstData);
			obj.obj.addOptions(document.getElementById("cboSrch5PrbtOfc"), data.list, firstData);
			obj.obj.addOptions(document.getElementById("cboSms1PrbtOfc"), data.list, firstData);
			obj.obj.addOptions(document.getElementById("cboSms2PrbtOfc"), data.list, firstData);
			//obj.obj.addOptions(document.getElementById("cboRealPop2PrbtOfc"), data.list, firstData);
			//obj.obj.addOptions(document.getElementById("cboRealPop4PrbtOfc"), data.list, firstData);
			//obj.obj.addOptions(document.getElementById("cboRealPop5PrbtOfc"), data.list, firstData);
			
			
		} else if(obj.cboId == "cboSrch2sido"){
			obj.obj.addOptions(document.getElementById("cboSrch3sido"), data.list, firstData);
			obj.obj.addOptions(document.getElementById("cboSrch5sido"), data.list, firstData);
			obj.obj.addOptions(document.getElementById("cboLoc3sido"), data.list, firstData);
			//obj.obj.addOptions(document.getElementById("cboIdx1sido"), data.list);
		} else if(obj.cboId == "cboObs1sido"){
			obj.obj.addOptions(document.getElementById("cboObs3sido"), data.list, firstData);
			obj.obj.addOptions(document.getElementById("cboSrch2sido"), data.list, [{text:"광역시도", value:""}]);
			obj.obj.addOptions(document.getElementById("cboSrch3sido"), data.list, [{text:"광역시도", value:""}]);
		} else if (obj.cboId == "cboSrch3bizm") {
			obj.obj.addOptions(document.getElementById("cboObs3bizm"), data.list, [{text:"대분류", value:""}]);
		}
		if (obj.callback) {
			obj.callback(obj.callValue);
		}
	},

	
	
	completeGetData: function(data) {
		
	},
	
	errorGetData: function(xhr, status, error) {
		alert("오류발생");
	},

	addOptions: function(selObject, optObj, firstData) {
		var oOption = null;
		if (selObject) {
			if (firstData && firstData != null) {
				for (var i=0; i<firstData.length; i++) {
					oOption = document.createElement("OPTION");
					oOption.text = firstData[i].text;
					oOption.value = firstData[i].value;
					selObject.add(oOption);
				}
			}

			for (var i=0; i<optObj.length; i++) {
				oOption = document.createElement("OPTION");
				if (selObject.id == "cboIdx1umd" || selObject.id == "cboIdx1sido" || selObject.id == "cboIdx1sgg") {
					oOption.setAttribute("id",optObj[i].x + "," +optObj[i].y);
				}
				oOption.text = optObj[i].commCdNm;
				oOption.value = optObj[i].commCd;
				
				selObject.add(oOption);
			}
		}
	}/*,
	
	deleteOptions: function(selObject) {
		for (var i=selObject.options.length-1; i>=0; i--) {
			selObject.remove(selObject.options[i]);
		}
	}	*/
	
};