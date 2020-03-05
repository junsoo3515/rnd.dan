//var prevCellVal = { cellId: '', value: undefined, row:1 };
var insertFlag = false;
var checkedObject = new Object();
var gridPopHeight = 600;
$(document).ready(function(){
	var context_root = "";
	try {
		context_root = $("body").attr("user-context-root");
		if(typeof context_root == "undefined") {
			context_root = $(".btnOpen>img").attr("src").replace(/\/images\/btn_on_off\.png/g, '');
			if(context_root.trim() == "") {
				context_root = "/";
			}
			$("body").attr("user-context-root", context_root);
		}
	} catch(e) {
		//$("body").attr("user-context-root", context_root);
	}

	$("#div_drag_1").draggable(); 
	$("#div_drag_2").draggable(); 
	$("#div_drag_3").draggable(); 
	$("#div_drag_4").draggable(); 
    
    $(".login_pw").bind("keydown", function(e) {
    	if(e.keyCode == 13) {
    		$(".login_img").trigger("click");
    	}
    });
    
    $(".searchEvt").bind("keydown", function(e) {
    	if(e.keyCode == 13) {
    		$(".searchBtn").trigger("click");
    	}
    });
    
    $(".searchEvt2").bind("keydown", function(e) {
    	if(e.keyCode == 13) {
    		$(".searchBtn2").trigger("click");
    	}
    });
    
    $(".searchEvt3").bind("keydown", function(e) {
    	if(e.keyCode == 13) {
    		$(".searchBtn3").trigger("click");
    	}
    });
	
    var layerH = $(".layer").height();
    $(".layer").css({"margin-top": -(layerH/2)+"px"});
    
    //종합상황판 topbar 
   $(".topbar.topNavi .navbar>ul>li>a").bind("click",function(){
       var liH = $(".topbar.topNavi li.on ul");
       var inLiH = liH.height();
        if($(this).parent("li.on").children("ul").is("ul")){
            if($(this).parents(".topbar.topNavi").height() < 110) {
                var topbarH = $(".topbar.topNavi li.on").parents(".topNavi").height()+inLiH;
                $(".topbar.topNavi").css({"height":topbarH+"px"});
            }
        } else {
            $(".topbar.topNavi").css({"height": "65px"}); 
        }
    });
   
    
	$(".user").mouseenter(function(){
        $(".userMenu").toggle();
        $(".userMenu").addClass("on");
    }).mouseleave(function(){
        $(".userMenu").hide();
        $(".userMenu").removeClass("on");
    });
    
    //select
	/*
    if($(".selectType1").selectbox != null)
    	$(".selectType1").selectbox();
    */
	/*
    $(".selectType1").ddslick({
        width: 90,
        height:100,
        background:"#fff"
    });
    $("body").on("click",".selectType1",function(){
        $(this).ddslick({});
    });
    */
    
    $('SELECT').selectBox();
    
    // TOP nav
    $(".navbar li a").bind("click",function(){
        $(this).parent().addClass("on").siblings().removeClass("on");
    });

    // 왼쪽 메뉴 on.off
    $(".btnOpen").bind("click",function(){
        $(".leftMenu").toggle();
        $(".contentWrap").toggleClass("off");
		$(this).parents("#wrapper").toggleClass("wth100");
        var src = ($(this).children().attr("src") === context_root + "images/btn_off.png") ? context_root + "images/btn_on_off.png" : context_root + "images/btn_off.png";
        $(this).children().attr("src", src);
        
        
        //메인 그리드 사이즈 변경
        if($(this).children().attr("src") === context_root + "images/btn_off.png"){
        	$("#grid").setGridWidth(1240,true);
        }else{
        	$("#grid").setGridWidth(990,true);
        }
        
        
        
    });
    
    // 왼쪽 nav
    $('.leftMenu > ul > li:has(ul)').addClass("has-sub");
    $('.leftMenu > ul > li > a').click(function() {
        var checkElement = $(this).next();
    	location.href = $(checkElement).find('a').eq(0).attr("href");
//    	alert($(checkElement).find('a').eq(0).attr("href"));
    	return false;
    	/*
        var checkElement = $(this).next();

    	$('.leftMenu .on>a').css('background-image', 'url("' + $(this).attr("off-image") + '")');
        $('.leftMenu li').removeClass('on');
        $(this).closest('li').addClass('on');	

        if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
        	$(this).css('background-image', 'url("' + $(this).attr("off-image") + '")');
            $(this).closest('li').removeClass('on');
            checkElement.slideUp('normal');
        }

        if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
        	$(this).css('background-image', 'url("' + $(this).attr("on-image") + '")');
            $('.leftMenu ul ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
        }

        if (checkElement.is('ul')) {
            return false;
        } else {
            return true;	
        }
        */
    });
    
    $(".popwin").bind("click", function() {
    	//var url = $(this).attr("href");
    	//var winObj = $.openPopupCenter(url, 'CHANGEPWD', 850, 400);
		
    	var url = $(this).attr("href");
    	var width = $(this).attr("width");
    	var height = $(this).attr("height");
    	var winObj = $.openPopupCenter(url, 'CHANGEPWD', width, height);

    	
    	return false;
    });
    
    //file Element 핸들링
    $(".btnExcelFile").bind("click",function(){
   		$("#excelFile").click();
        return false;
    });
    $("#excelFile").bind("change", function(){
   		$("#excelFileText").val($("#excelFile").val());
        return false;
    });
    //엑셀저장
    $(".btnExcel").bind("click",function(){
   		excelDownAction();
        return false;
    });
    //등록버튼
    $(".btnRgt").bind("click",function(){
    	$("#modetitle").text("추가");
    	$.changeInputMode(true);

    	var area = $(this).attr("area");
    	if(typeof area == "undefined" || area == null || area == "") {
	    	try{
	    		resetAction();
	    	}catch(e) {}
	
	        $(".layerModify").show();
	        
	        var layerH = $(".layerModify").height();
	        $(".layerModify").css({"margin-top": -(layerH/2)+"px"});
    	}
    	else {
	        //console.log($(".layerModify." + area));
	    	try{
	    		if(resetAction(area, function() {
	    		    $(".layerModify").show();
	    		    
	    		    $(".layerModify .tableType1").hide();
	    	        var title = $(".layerModify .tableType1." + area).attr("user-title");
	    	        $(".layerModify .tit>h4").html(title);
	    	        $(".layerModify .tableType1." + area).show();
	    	        $(".layerModify .btnCtr>a").attr("area", area);

	    	        var layerH = $(".layerModify").height();
	    	        $(".layerModify").css({"margin-top": -(layerH/2)+"px"});
	    		    
	    		}) == false)
	    			return false;
	    	}catch(e) {}
	
    	}
        $(".mask").remove();
        $("body").append("<div class='mask'></div>");

        try{
    		//console.log($('#grid_mobl_rcv_time SELECT'))
			$('.layer SELECT').selectBox("destroy");
    		$('.layer SELECT').selectBox();
    	} catch(e) {}
    	
        insertFlag = true;
        return false;
    });
    //수정버튼
    $(".btnMd").bind("click",function(){
        $("#modetitle").text("수정");
    	$.changeInputMode(false);
    	
    	try{
    		preModifyAction();
    	}catch(e) {}
    	
        $(".mask").remove();
        $(".layerDetail").hide(); //상세보기 레이어 숨김추가(사이즈가 틀릴경우 보임 현상 발생)_141203_송준혁 
        $(".layerModify").show();

        var layerH = $(".layerModify").height();
        $(".layerModify").css({"margin-top": -(layerH/2)+"px"});

        $("body").append("<div class='mask'></div>");
        
    	try{
    		//console.log($('#grid_mobl_rcv_time SELECT'))
			$('.layer SELECT').selectBox("destroy");
    		$('.layer SELECT').selectBox();
    	} catch(e) {}
    	
        insertFlag = false;
        return false;
    });
    //저장버튼
    $(".btnSv").bind("click",function(){
    	var area = $(this).attr("area");
    	var objtype = $(this).attr("user-object-type");
    	if(typeof area == "undefined" || area == null || area == "") {
        	try{
            	if(validate() == false)
            		return false;
        	}catch(e) {}

        	try{
            	if(insertFlag == true){
            		//insertAction();
	            	if(insertAction() == false)	return false; 
            	}
            	else{
            		//updateAction();
            		if(updateAction() == false)	return false;
            	}
        	}catch(e) {}
    	}
    	else {
        	try{
            	if(validate(area) == false)
            		return false;
        	}catch(e) {}

        	if(typeof objtype == "undefined" || objtype == null || objtype == "") {
	        	try{
	            	if(insertFlag == true)
	            		insertAction(area);
	            	else
	            		updateAction(area);
	        	}catch(e) {}
        	}
        	else {
        		if(objtype == "grid") {
    	        	try{
   	            		updateAction(area);
    	        	}catch(e) {}
        		}
        	}
    	}
    	
   		$(".mask").remove();
        $(".layer").hide();
        insertFlag = false;
        
        return false;
    });
    
  //저장버튼(에러시 현재창 유지)
    $(".btnSvEc").bind("click",function(){
    	var area = $(this).attr("area");
    	var objtype = $(this).attr("user-object-type");
    	if(typeof area == "undefined" || area == null || area == "") {
        	try{
            	if(validate() == false)
            		return false;
        	}catch(e) {}

        	try{
            	if(insertFlag == true){
            		//insertAction();
	            	if(insertAction() == false)	return false; 
            	}
            	else{
            		//updateAction();
            		if(updateAction() == false)	return false;
            	}
        	}catch(e) {}
    	}
    	else {
        	try{
            	if(validate(area) == false)
            		return false;
        	}catch(e) {}

        	if(typeof objtype == "undefined" || objtype == null || objtype == "") {
	        	try{
	            	if(insertFlag == true)
	            		insertAction(area);
	            	else
	            		updateAction(area);
	        	}catch(e) {}
        	}
        	else {
        		if(objtype == "grid") {
    	        	try{
   	            		updateAction(area);
    	        	}catch(e) {}
        		}
        	}
    	}
    	
    	if(insertFlag == false){
       		$(".mask").remove();
            $(".layer").hide();
            insertFlag = false;
    	}
        return false;
    });
        
    $(".btnMultiDe").bind("click",function(){
    	var area = $(this).attr("area");
    	try{
    		deleteMultiAction(area);
    	}catch(e) {}

        insertFlag = false;
        return false;
    });
    
    $(".btnUpload").bind("click",function(){
    	var gridId = $(this).attr("user-gridId");
    	var url = $(this).attr("user-url");
    	var id = $(this).attr("user-ref-id");
    	var ext = $(this).attr("user-ext");
    	var validate = $(this).attr("user-validate");
    	if (!$("#" + id).hasExtension(ext.split(","))) {
    	    alert("확장자가 " + ext + "인 파일만 등록할 수 있습니다.");
    	    return false;
    	}
    	if (!$("#" + id).hasFileName(validate.split(","))) {
    	    //alert("파일명에 \"" + validate + "\"의 문자열이 있는 파일 등록할 수 있습니다.");
    		alert("표준양식이 아닙니다.");
    	    
    	    return false;
    	}
    	//document.uploadFrm.submit();
    	 
        var data = new FormData();
    	$.each($('#' + id)[0].files, function(i, file) {
            data.append('file-' + i, file);
        });
        $.ajax({
          url: url,
          type: "POST",
          data: data,
          enctype: 'multipart/form-data',
          processData: false,  // tell jQuery not to process the data
          contentType: false   // tell jQuery not to set contentType
        }).done(function( data ) {
            alert(data.msg);
        	$("#" + gridId).trigger("reloadGrid");
        });
    	
        insertFlag = false;
        return false;
    });
    
    //삭제버튼
    $(".btnDe").bind("click",function(){
    	if(confirm("자료를 삭제하시겠습니까?") == false) return false;
    	
    	try{
       		deleteAction();
    	}catch(e) {}

   		$(".mask").remove();
        $(".layer").hide();
        insertFlag = false;
        return false;
    });
    
    //레이어 취소버튼
    $(".layer .btnC").bind("click",function(){
        $(".mask").remove();
        $(".layer").hide();
        return false;
    });
    var layerH = $(".layer").height();
    $(".layer").css({"margin-top": -(layerH/2)+"px"});
    //$(".layer").css({"top": ((screen.height - layerH)/2)+"px"});

    $(".datepicker1, .datepicker2").attr("readonly", "readonly");
    $(".datepicker1, .datepicker2").bind('click', function(event) {
 		   $(this).val("");
    });
    /*
    $(".datepicker1, .datepicker2").keydown(function(event) {
   		  if (event.keyCode == '13') {
   		     event.preventDefault();
   		   }
   		   $(this).val("");
    });
    */
    
    $(".datepicker1, .datepicker2").datepicker({
        dateFormat: 'yy-mm-dd',
        showOn: 'button',
        //buttonImage: context_root + 'images/icon_calendar.png',
        buttonImage: '/images/icon_calendar.png',
        buttonImageOnly: true,
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        dayNames: ['일','월','화','수','목','금','토'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        showMonthAfterYear: true,
        yearSuffix: '년'	
        	
        	
    });


	 $(".datepicker0").datepicker({
	        dateFormat: 'yy-mm-dd',
	        showOn: 'button',
	        buttonImage: context_root + 'images/icon_calendar.png',
	        buttonImageOnly: true,
	        prevText: '이전 달',
	        nextText: '다음 달',
	        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	        dayNames: ['일','월','화','수','목','금','토'],
	        dayNamesShort: ['일','월','화','수','목','금','토'],
	        dayNamesMin: ['일','월','화','수','목','금','토'],
	        showMonthAfterYear: true,
	        yearSuffix: '년',
	        
	        
	        onSelect:function(value){
	        	datepickerAction(value);
	        }
	        	
	    });
    
    
    /*
    $('body').bind("click" ,function (evt) {
    	//console.log($(evt.target).find(".datepicker1"));
        if($("#ui-datepicker-div").css("display") != "none"){
        	//console.log($(evt.target).find(".datepicker1"));
        	$("#ui-datepicker-div").hide();
        }
    });
    */
    
    $(".number").number(true);
    $(".number").css({"ime-mode":"disabled"});

    $(".btnCheckAll").bind("click",function(){
    	var sel = $(this).attr("user-trigger-selector");
		for(var i = 0; i < $(sel).length; i++) {
			$(sel).get(i).checked = true;
		}
		return false;
    });
	$(".btnUnCheckAll").bind("click",function(){
    	var sel = $(this).attr("user-trigger-selector");
		for(var i = 0; i < $(sel).length; i++) {
			$(sel).get(i).checked = false;
		}
		return false;
    });
		
});


$.hideInsertForm = function(){
	$(".mask").remove();
    $(".layer").hide();
    insertFlag = false;
};


$.showDetail = function() {

	$(".layerDetail").show();
    var layerH = $(".layerDetail").height();
    if($(".layerDetail .ui-jqgrid").length > 0) {
        $(".layerDetail").css({'margin-top':''});
        $(".layerDetail").css({"top": (($(document).height() - layerH)/2)+"px"});
    }
    else {
        $(".layerDetail").css({"margin-top": -(layerH/2)+"px"});
    }
    $("body").append("<div class='mask'></div>");


	
};


$.showDetailP = function(table, area) {

	$(".layerDetail").show();
	
	$(".layerDetail ." + table).hide();
	$(".layerDetail ." + table + "." + area).show();
	
    var layerH = $(".layerDetail").height();
    if($(".layerDetail .ui-jqgrid").length > 0) {
        $(".layerDetail").css({'margin-top':''});
        $(".layerDetail").css({"top": (($(document).height() - layerH)/2)+"px"});
    }
    else {
        $(".layerDetail").css({"margin-top": -(layerH/2)+"px"});
    }
    $("body").append("<div class='mask'></div>");

	
};

$.changeInputMode = function(show) {
	if(show === false) {
		$("star[user-required=insert]").hide();
		$("input[user-required=insert]").attr("readonly", "readonly");
		$("input[user-required=insert]").hide();
		$(".justShow").remove();
		for(var i = 0; i < $("input[user-required=insert]").length; i++) {
			var ooo = $("input[user-required=insert]")[i];
			$(ooo).after("<div class='justShow'>" + $(ooo).val() + "</div>");
		}
		$("select[user-required=insert]").selectBox('disable');
	}
	else {
		$("star[user-required=insert]").show();
		$("input[user-required=insert]").removeAttr("readonly");
		$(".justShow").remove();
		$("input[user-required=insert]").show();
		$("select[user-required=insert]").selectBox('enable');
	}
};

/*
$.메소드명 = function (인자명) {}
$.fn.메소드명 = function (인자명) {}
*/
var hxr_push = new Object();
$.jqGrid = function (gridObj, params) {
	try {
		params.url = params.url.replace(/\/\//g, '/');
	} catch(e) {}
	/*
	params.loadBeforeSend = function (xhr) {
    	if(sendBlocking == true) return false;
		try{
			sendBlocking = true;
		} catch(e) {}
	};
	*/
	params.loadError = function (xhr, status, error) {
    	$.loading(false);
    	/*
        if (error == 'abort') {
        }
        else {
            alert("Load Error:" + status + "\n" + error);
        }*/
    };
    //params.ajaxGridOptions = {async:false};
    
	//gridObj.jqGrid("GridUnload");
	params.mtype = 'POST';
    params.loadtext = "";
    //params.multiboxonly = true;
    if(typeof gridObj == "object") {
    	gridObj.jqGrid(params);
        $("th#grid_CHECK").unbind('click');
    }
    else {
    	$(gridObj).jqGrid(params);
        $("th" + gridObj + "_CHECK").unbind('click');
    }
};

$.setUserOption = function(gridId, colName, rows) {
	var param = $(gridId).jqGrid('getGridParam', 'colModel');
	for(var i = 0; i < param.length; i++) {
		if(param[i].name.toUpperCase() == colName.toUpperCase())
			param[i].useroption = rows;
	}
	return true;
};

$.GridTextBox = function (cellvalue, options, rowObject) {
	return "<input type='text' name='text_"+ options.colModel.name +  "' class='txtType' style='width: 70px' value='" + cellvalue + "'>";
};

$.GridCheckBox = function (cellvalue, options, rowObject) {
	return "<input type='checkbox' name='checkbox' onchange='$.GridCheckBoxChange(this);' value='" + options.rowId + "'>";
};


$.GridSelectBox = function (cellvalue, options, rowObject) {
	//console.log(options.colModel.useroption);
	var selected = "";
	var sss = "<select name='select_" + options.colModel.name + "' user-value=" + cellvalue + ">";
	for(var i = 0; i < options.colModel.useroption.length; i++){
		selected = "";
		if(cellvalue == options.colModel.useroption[i].CD_ID)
			selected = "selected";
		sss += "<option value='" + options.colModel.useroption[i].CD_ID + "' " + selected +">" + options.colModel.useroption[i].CD_NM_KO + "</option>";
	}
	sss += "</select>";
	return sss;
};

$.GridSelectBox2 = function (cellvalue, options, rowObject) {
	//console.log(options.colModel.useroption);
	var json = JSON.parse(cellvalue);
	var currnetSel = json["ID"];
	var rows = json["ROWS"];
	var selected = "";
	var sss = "<select name='select_" + options.colModel.name + "' user-value=" + currnetSel + ">";
	for(var i = 0; i < rows.length; i++){
		selected = "";
		if(currnetSel == rows[i].CD_ID)
			selected = "selected";
		sss += "<option value='" + rows[i].CD_ID + "' " + selected +">" + rows[i].CD_NM + "</option>";
	}
	sss += "</select>";
	return sss;
};

$.GridCheckBoxCheck = function (cellvalue, options, rowObject) {
	var checked = "";
	if(cellvalue == "1" || cellvalue.toUpperCase() == "Y" || cellvalue.toUpperCase() == "YES" || cellvalue.toUpperCase() == "TRUE" || cellvalue.toUpperCase() == "T")
		checked = "checked";
	
	return "<input type='checkbox' name='checkbox' onchange='$.GridCheckBoxChange(this);' value='" + options.rowId + "' " + checked + ">";
};

$.GridCheckBoxR = function (cellvalue, options, rowObject) {
	var checked = "";
	if(cellvalue == "1" || cellvalue.toUpperCase() == "Y" || cellvalue.toUpperCase() == "YES" || cellvalue.toUpperCase() == "TRUE" || cellvalue.toUpperCase() == "T")
		checked = "checked";
	
	return "<input type='checkbox' class='checkbox_R' name='checkbox_R' onchange='$.GridCheckBoxChange(this);' value='" + options.rowId + "' user-cmdtype='R' " + checked + ">조회";
};
$.GridCheckBoxC = function (cellvalue, options, rowObject) {
	var checked = "";
	if(cellvalue == "1" || cellvalue.toUpperCase() == "Y" || cellvalue.toUpperCase() == "YES" || cellvalue.toUpperCase() == "TRUE" || cellvalue.toUpperCase() == "T")
		checked = "checked";

	return "<input type='checkbox' class='checkbox_C' name='checkbox_C' onchange='$.GridCheckBoxChange(this);' value='" + options.rowId + "' user-cmdtype='C' " + checked + ">등록";
};
$.GridCheckBoxU = function (cellvalue, options, rowObject) {
	var checked = "";
	if(cellvalue == "1" || cellvalue.toUpperCase() == "Y" || cellvalue.toUpperCase() == "YES" || cellvalue.toUpperCase() == "TRUE" || cellvalue.toUpperCase() == "T")
		checked = "checked";

	return "<input type='checkbox' class='checkbox_U' name='checkbox_U' onchange='$.GridCheckBoxChange(this);' value='" + options.rowId + "' user-cmdtype='U' " + checked + ">수정";
};
$.GridCheckBoxD = function (cellvalue, options, rowObject) {
	var checked = "";
	if(cellvalue == "1" || cellvalue.toUpperCase() == "Y" || cellvalue.toUpperCase() == "YES" || cellvalue.toUpperCase() == "TRUE" || cellvalue.toUpperCase() == "T")
		checked = "checked";

	return "<input type='checkbox' class='checkbox_D' name='checkbox_D' onchange='$.GridCheckBoxChange(this);' value='" + options.rowId + "' user-cmdtype='D' " + checked + ">삭제";
};
$.GridCheckBoxChange = function (ooo) {
};
$.GridHeaderCheckBoxChange = function (gridId, ooo, e) {
	try{
		var cmdtype = $(ooo).Attr("user-cmdtype");
		if(ooo.checked == true) {
			$(gridId).find('input[type=checkbox][name=checkbox_' + cmdtype + ']').each(function (i) {
				this.checked = true;
			});
		}
		else {
			$(gridId).find('input[type=checkbox][name=checkbox_' + cmdtype + ']').each(function (i) {
				this.checked = false;
			});
		}
	} catch(e) {
		if(ooo.checked == true) {
			//console.log($(gridId).find('input[type=checkbox]'));
			//console.log("00000000");
			$(gridId).find('input[type=checkbox][name=checkbox]').each(function (i) {
				this.checked = true;
			});
		}
		else {
			//console.log("111111111111");
			$(gridId).find('input[type=checkbox][name=checkbox]').each(function (i) {
				this.checked = false;
			});
		}
	}
};
$.checkedObjectAdd = function(rowId) {
	checkedObject[rowId] = rowId;
};
$.checkedObjectDel = function(rowId) {
	delete checkedObject[rowId];
};
$.onSelectRow = function (gridId, rowid, status, e) {
	if($(e.target).is('input[type=checkbox]') == true) {
		if($(e.target).get(0).checked == true)
			$.checkedObjectAdd(rowid);
		else
			$.checkedObjectDel(rowid);
		return false;
	}

	//console.log(rowid, status, e);
	//console.log($(e.target).parents('tr').find('td>input[type=checkbox]'));
	if(typeof checkedObject[rowid] != "undefined") {
		//$(e.target).parents('tr').find('td>input[type=checkbox]').attr("checked", false);
		$(e.target).parents('tr').find('td>input[type=checkbox]').attr("checked", true);
	}
	else
		$(e.target).parents('tr').find('td>input[type=checkbox]').attr("checked", !status);

	//	$(gridId).jqGrid('setSelection', rowid);
	//$(this).prop('checked',true);
	return true;
};

$.getSelRow = function(gridId) {
	var sel = "";
	for(var i = 0; i < $(gridId).find('tr>td>input[type=checkbox]').length; i++) {
		if($(gridId).find('tr>td>input[type=checkbox]').get(i).checked == true) {
			if(sel != "") sel += ",";
			sel += $($(gridId).find('tr>td>input[type=checkbox]').get(i)).val();
		}
	}
	if(sel == "") return [];
	return sel.split(",");
};

$.getSelRowRadio = function(gridId) {
	var sel = "";
	for(var i = 0; i < $(gridId).find('tr>td>input[type=radio]').length; i++) {
		if($(gridId).find('tr>td>input[type=radio]').get(i).checked == true) {
			if(sel != "") sel += ",";
			sel += $($(gridId).find('tr>td>input[type=radio]').get(i)).val();
		}
	}
	if(sel == "") return [];
	return sel.split(",");
};


$.getCRUDParams = function(gridId) {
	var sel = "";
	var vvv = "0";

	var rows = $(gridId).jqGrid('getGridParam', 'records');
	for(var i = 0; i < rows; i++) {
		sel += "&";
		sel += "pgmMenuId=" + $($(gridId).find('tr>td>input[type=checkbox][name=checkbox_C]').get(i)).val();
		
		sel += "&value=";
		vvv = "N";
		if($(gridId).find('tr>td>input[type=checkbox][name=checkbox_C]').get(i).checked == true) { vvv = "Y"; }
		sel += vvv;
		vvv = "N";
		if($(gridId).find('tr>td>input[type=checkbox][name=checkbox_R]').get(i).checked == true) { vvv = "Y"; }
		sel += vvv;
		vvv = "N";
		if($(gridId).find('tr>td>input[type=checkbox][name=checkbox_U]').get(i).checked == true) { vvv = "Y"; }
		sel += vvv;
		vvv = "N";
		if($(gridId).find('tr>td>input[type=checkbox][name=checkbox_D]').get(i).checked == true) { vvv = "Y"; }
		sel += vvv;
	}

	return sel;
};

$.ajaxEx = function (gridObj, params) {
	$.ajax({
		type : "POST",
	    url : params.url,
	    dataType : params.dataType,
	    data: params.data,
	    //scriptCharset: "utf-8" ,
	    //contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	    //beforeSend : function(xhr) {
        //    xhr.setRequestHeader('Accept', "text/html; charset=utf-8");
        //},
        success:function(data){
        	if(data.session == null || data.session == -1) {
        		alert("세션이 끊어졌으므로 로그아웃하고 첫페이지로 보냄");
        		return;
        	}
        	
        	params.success(data);
        },   
        error:function(e){
        	params.error(e);
        }  
	});
};

$.showCount = function (data) {
	var rowCnt = 0;
	if(data.rows == null) return rowCnt; 
	if(data.rows.length > 0)
		rowCnt = data.rows[0].ROWCNT;
	$('#rowCnt').text($.number(rowCnt)); 
	return rowCnt; 
};

$.showCountTab = function (tabId, data) {
	var rowCnt = 0;
	if(data.rows.length > 0)
		rowCnt = data.rows[0].ROWCNT;
	$('#' + tabId + ' .rowCnt').text($.number(rowCnt)); 
	return rowCnt; 
};

$.manuHandler = function(topMenu, leftMenu) {
	$("#" + topMenu).parent().addClass("on");
	if($(".leftMenu .user-select").length > 0) {
		$(".leftMenu .user-select").parents("li").addClass("on");
		$(".leftMenu .user-select").parent().slideDown('normal');
	}
	else {
		$(".leftMenu li:first-child li:first-child").eq(0).addClass("user-select");
		$(".leftMenu li:first-child").eq(0).addClass("on");
		$(".leftMenu li:first-child").parent().eq(1).slideDown('normal');
	}
};

$.makePagerTab = function (tabId, gridObj, data, pageNo, rowPerPage) {
    var rowCnt = 0;
    
    if(data.rows.length > 0){
      rowCnt = data.rows[0].ROWCNT;
    }


    if(rowCnt == 0 || rowCnt <= rowPerPage) {
      $("#" + tabId + " .paginate").html("");
      return;
    }


    var startPage = "";	// 시작페이지
    var endPage = "";	// 끝페이지
    var totalPage = "";	// 전체페이지
    var page = "";
    var count = "";

    totalPage = String(rowCnt / rowPerPage);
    
    /*소수점여부확인*/
    if(totalPage.indexOf(".") > 0){
    	totalPage = parseInt(rowCnt / rowPerPage) + 1;
    }
    
    var cnt = String(pageNo / 10);
    
    /*현재페이지에 따른 끝페이지번호 설정*/
    if(cnt.indexOf(".") > 0){
    	endPage = (Math.floor((pageNo / 10) + 1)) * 10;
    }else{
    	endPage = Math.floor((pageNo / 10)) * 10;
    }
    
    startPage = endPage - 9;
    
    /*전체페이지가 10이하일경우*/
    if(totalPage < 10){
    	endPage = totalPage;
    	startPage = 1;
    }

    page += '<a href="javascript:;" class="pageNav first" data-pageno="1">맨처음</a>\r\n';
    page += '<a href="javascript:;" class="pageNav prev" data-pageno="' + parseInt(startPage - 1) + '">이전</a>\r\n';
    
    count = startPage;
    
    for(var i=0; i<10; i++){
    	if(count == pageNo){ 
			page += '<strong>' + count + '</strong>\r\n';
    	}else{
    		/*전체페이지보다 현재페이지 번호가 높을경우 중단*/
    		if(totalPage < count){ break;}
    		
	    	page += '<a href="#" class="pageNav" data-pageno="' +  count + '" >' + count + '</a>\r\n';
    	}
    	count += 1;
    }
    
    if(totalPage <= 10){
    	page += '<a href="javascript:;" class="pageNav next" data-pageno="' + endPage + '">다음</a>\r\n';
    }else{
    	page += '<a href="javascript:;" class="pageNav next" data-pageno="' + parseInt(endPage + 1) + '">다음</a>\r\n';
    }

    page += '<a href="javascript:;" class="pageNav last" data-pageno="' + totalPage + '">맨끝</a>\r\n';
    page += '<input type="hidden" id="cur-page" value="' + pageNo + '"/>';
    
    $("#" + tabId + " .paginate").html(page);
	
    $("#" + tabId + " .pageNav").bind("click",function(){
    	var tabId = getTabId();
    	$("#" + tabId + " .grid").trigger("reloadGrid",[{page:$(this).attr("data-pageno")}]);
    });
};

$.makePager = function (gridObj, data, pageNo, rowPerPage) {
	/*
	<a href="#" class="first">맨처음</a>
    <a href="#" class="prev">이전</a>
    <a href="#">1</a>
    <a href="#">2</a>
    <a href="#">3</a>
    <a href="#">4</a>
    <strong>5</strong>
    <a href="#">6</a>
    <a href="#">7</a>
    <a href="#">8</a>
    <a href="#">9</a>
    <a href="#" class="next">다음</a>
    <a href="#" class="last">맨끝</a>

	var rowCnt = 0;
	if(data.rows.length > 0)
		rowCnt = data.rows[0].ROWCNT;

	if(rowCnt == 0 || rowCnt <= rowPerPage) {
		$(".paginate").html("");
		return;
	}
	
	var page = "";
	page += '<a href="javascript:;" class="pageNav first" data-pageno="1">맨처음</a>\r\n';
	if(pageNo > 10) {
		var s = pageNo - 10;
		if((parseInt(rowCnt / rowPerPage) + 1) - 10 <= pageNo )
			s = (parseInt(rowCnt / rowPerPage) + 1) - 10 - 10;

		page += '<a href="javascript:;" class="pageNav prev" data-pageno="' + s + '">이전</a>\r\n';
	}
	
	var cnt = 1;
	var i = 1;
	
	i = pageNo;
	
	if(parseInt(rowCnt / rowPerPage) <= 10)
		i = 1;
	else {
		if((parseInt(rowCnt / rowPerPage) + 1) - 10 <= pageNo )
			i = (parseInt(rowCnt / rowPerPage) + 1) - 10;
	}
	
	//console.log((parseInt(rowCnt / rowPerPage) + 1));
	
	for(; i <= (parseInt(rowCnt / rowPerPage) + 1) && cnt <= 10; i++, cnt++) {
		if(i == pageNo) 
			page += '<strong>' + i + '</strong>\r\n';
		else
			page += '<a href="#" class="pageNav" data-pageno="' + i + '" >' + i + '</a>\r\n';
	}
	if(i <= parseInt(rowCnt / rowPerPage))
		page += '<a href="javascript:;" class="pageNav next" data-pageno="' + i + '">다음</a>\r\n';
	
	if(((parseInt(rowCnt / rowPerPage) + 1) - 10) < 1)
		page += '<a href="javascript:;" class="pageNav last" data-pageno="' + parseInt(rowCnt / rowPerPage) + '">맨끝</a>\r\n';
	else
		page += '<a href="javascript:;" class="pageNav last" data-pageno="' + ((parseInt(rowCnt / rowPerPage) + 1)) + '">맨끝</a>\r\n';

	$(".paginate").html(page);
	
    $(".pageNav").bind("click",function(){
    	$("#grid").trigger("reloadGrid",[{page:$(this).attr("data-pageno")}]);
    });
    */
    var rowCnt = 0;
    
    if(data.rows.length > 0){
      rowCnt = data.rows[0].ROWCNT;
    }


    if(rowCnt == 0 || rowCnt <= rowPerPage) {
      $(".paginate").html("");
      return;
    }


    var startPage = "";	// 시작페이지
    var endPage = "";	// 끝페이지
    var totalPage = "";	// 전체페이지
    var page = "";
    var count = "";

    totalPage = String(rowCnt / rowPerPage);
    
    /*소수점여부확인*/
    if(totalPage.indexOf(".") > 0){
    	totalPage = parseInt(rowCnt / rowPerPage) + 1;
    }
    
    var cnt = String(pageNo / 10);
    
    /*현재페이지에 따른 끝페이지번호 설정*/
    if(cnt.indexOf(".") > 0){
    	endPage = (Math.floor((pageNo / 10) + 1)) * 10;
    }else{
    	endPage = Math.floor((pageNo / 10)) * 10;
    }
    
    startPage = endPage - 9;
    
    /*전체페이지가 10이하일경우*/
    if(totalPage < 10){
    	endPage = totalPage;
    	startPage = 1;
    }

    page += '<a href="javascript:;" class="pageNav first" data-pageno="1">맨처음</a>\r\n';
    page += '<a href="javascript:;" class="pageNav prev" data-pageno="' + parseInt(startPage - 1) + '">이전</a>\r\n';
    
    count = startPage;
    
    for(var i=0; i<10; i++){
    	if(count == pageNo){ 
			page += '<strong>' + count + '</strong>\r\n';
    	}else{
    		/*전체페이지보다 현재페이지 번호가 높을경우 중단*/
    		if(totalPage < count){ break;}
    		
	    	page += '<a href="#" class="pageNav" data-pageno="' +  count + '" >' + count + '</a>\r\n';
    	}
    	count += 1;
    }
    
    if(totalPage <= 10){
    	page += '<a href="javascript:;" class="pageNav next" data-pageno="' + endPage + '">다음</a>\r\n';
    }else{
    	page += '<a href="javascript:;" class="pageNav next" data-pageno="' + parseInt(endPage + 1) + '">다음</a>\r\n';
    }

    page += '<a href="javascript:;" class="pageNav last" data-pageno="' + totalPage + '">맨끝</a>\r\n';
    page += '<input type="hidden" id="cur-page" value="' + pageNo + '"/>';
    
    $(".paginate").html(page);
	
    $(".pageNav").bind("click",function(){
    	$("#grid").trigger("reloadGrid",[{page:$(this).attr("data-pageno")}]);
    });
};

$.makePager2 = function (gridObj, data, pageNo, rowPerPage) {
	
    var rowCnt = 0;
    
    if(data.rows.length > 0){
      rowCnt = data.rows[0].ROWCNT;
    }


    if(rowCnt == 0 || rowCnt <= rowPerPage) {
      $(".paginate.popup").html("");
      return;
    }


    var startPage = "";	// 시작페이지
    var endPage = "";	// 끝페이지
    var totalPage = "";	// 전체페이지
    var page = "";
    var count = "";

    totalPage = String(rowCnt / rowPerPage);
    
    /*소수점여부확인*/
    if(totalPage.indexOf(".") > 0){
    	totalPage = parseInt(rowCnt / rowPerPage) + 1;
    }
    
    var cnt = String(pageNo / 10);
    
    /*현재페이지에 따른 끝페이지번호 설정*/
    if(cnt.indexOf(".") > 0){
    	endPage = (Math.floor((pageNo / 10) + 1)) * 10;
    }else{
    	endPage = Math.floor((pageNo / 10)) * 10;
    }
    
    startPage = endPage - 9;
    
    /*전체페이지가 10이하일경우*/
    if(totalPage < 10){
    	endPage = totalPage;
    	startPage = 1;
    }

    page += '<a href="javascript:;" class="pageNav first" data-pageno="1">맨처음</a>\r\n';
    page += '<a href="javascript:;" class="pageNav prev" data-pageno="' + parseInt(startPage - 1) + '">이전</a>\r\n';
    
    count = startPage;
    
    for(var i=0; i<10; i++){
    	if(count == pageNo){ 
			page += '<strong>' + count + '</strong>\r\n';
    	}else{
    		/*전체페이지보다 현재페이지 번호가 높을경우 중단*/
    		if(totalPage < count){ break;}
    		
	    	page += '<a href="#" class="pageNav" data-pageno="' +  count + '" >' + count + '</a>\r\n';
    	}
    	count += 1;
    }
    
    if(totalPage <= 10){
    	page += '<a href="javascript:;" class="pageNav next" data-pageno="' + endPage + '">다음</a>\r\n';
    }else{
    	page += '<a href="javascript:;" class="pageNav next" data-pageno="' + parseInt(endPage + 1) + '">다음</a>\r\n';
    }

    page += '<a href="javascript:;" class="pageNav last" data-pageno="' + totalPage + '">맨끝</a>\r\n';
    page += '<input type="hidden" id="cur-page" value="' + pageNo + '"/>';
    
    
    $(".paginate.popup").html(page);
	
    $(".pageNav").bind("click",function(){
    	$("#grid_err_list").trigger("reloadGrid",[{page:$(this).attr("data-pageno")}]);
    });
};

$.selectBarun = function(selector, value) {
	$(selector).selectBox('value', value);
	//$(selector).val(value);
	//$(selector).setValue(value);
	//alert(value);
	/*
	$(selector).selectbox('detach');
	if(value != "")
		$(selector).val(value);
	else
		$(selector).get(0).selectedIndex = 0;
	$(selector).selectbox('attach');
	*/
	//$(selector).val(value); //selectbox("change", value);
	//$(selector).trigger('refresh');
};

$.fn.hasExtension = function(exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test($(this).val().toLowerCase());
};

$.fn.hasFileName = function(titles) {
	for(var i = 0; i < titles.length; i++){
		if($(this).val().toLowerCase().split(".")[0].indexOf(titles[i]) >= 0)
			return true;
	}
	//console.log($(this).val().toLowerCase())
	return false;
    //return (new RegExp('(' + titles.join('|') + ')$')).test($(this).val().toLowerCase());
};

$.openPopupCenter = function(pageURL, title, w, h) {
    var left = (screen.width - w) / 2;
    var top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
    //var targetWin = window.open(pageURL, "_blank", 'toolbar=yes, location=yes, directories=yes, status=yes, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    var targetWin = window.open(pageURL, "_blank", 'toolbar=yes, scrollbars=yes, resizable=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    
    return targetWin;
};

$.openMenuCenter = function(pageURL, title, w, h) {
    var left = (screen.width - w) / 2;
    var top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
    //var targetWin = window.open(pageURL, "_blank", 'toolbar=yes, location=yes, directories=yes, status=yes, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    window.open(pageURL, "_blank", 'toolbar=yes, scrollbars=yes, resizable=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    
};


$.loadChart = function(url, div, rows, frm) {
	//$("#" + div).attr("src", url);
	frm.method = "post";
	frm.action = url;
	if(rows != null) {
		frm.rows.value = JSON.stringify(rows);
	}
	frm.submit();
	/*
	$.ajax({
		type : "POST",
	    url : url,
	    dataType : "html",
	    data: JSON.stringify({'rows' : rows}),
	    contentType: 'application/json; charset=utf-8',
	    cache: false,   
	    success:function(data){
	    	$("#" + div).html(data);
        },   
        error:function(e){
	        alert(e.responseText);
        }  
	});
	*/
};

$.getSelectValue = function(id) {
	if($("#" + id).val() == null)
		return "";
	return $("#" + id).val();
	//return $("#" + id + " .dd-selected-value").val();
};

$.selectAdd = function(selectId, allOptionYn, cdColName, nmColName, rows) {
	var sss = "";
	
	if(allOptionYn.toUpperCase() == "Y")
		sss += "<option value=''>전체</option>";
	
	try {
		for(var i = 0; i < rows.length; i++) {
			sss += "<option value='" + rows[i][cdColName]+ "'>" + rows[i][nmColName] + "</option>";
		}
	} catch(e) {}
	$(selectId).html(sss);
    $(selectId).selectBox('refresh');
};

$.getCurrentRowValue = function(gridId, colName) {
	var rowid = $(gridId).jqGrid ('getGridParam', 'selrow');
	if(rowid == null) return "";
	var list = $(gridId).getRowData(rowid);
	var value = "";
	try{
		value = list[colName];
	} catch(e) {}
	return value;
};

$.getCustomObjectValue = function(gridId, type, colName, rowid) {
	var value = "";
	try{
		value = $(gridId + " tr:eq(" + rowid + ") " + type + "[name=" + type + "_" + colName + "]").val();
		
	} catch(e) { alert(e); }
	return value;
};

$.getCustomObjectValueText = function(gridId, type, colName, rowid) {
	var value = "";
	try{
		value = $(gridId + " tr:eq(" + rowid + ") [name=" + type + "_" + colName + "]").val();
		
	} catch(e) { alert(e); }
	return value;
};


$.getCustomObjectValueForUpdate = function(gridId, type, colName, rowid) {
	var value = "";
	try{
		var userValue = $(gridId + " tr:eq(" + rowid + ") " + type + "[name=" + type + "_" + colName + "]").attr("user-value");
		//console.log($(gridId + " tr:eq(" + rowid + ") " + type + "[name=" + type + "_" + colName + "]"));
		value = $(gridId + " tr:eq(" + rowid + ") " + type + "[name=" + type + "_" + colName + "]").val();
		if(userValue == value)
			return {"ret":null, "value" : value};
	} catch(e) { alert(e); }
	return {"ret":"1", "value" : value};
};



$.resetInputObject = function(selector) {
	var objList = $(selector + " input[type=text]");
	for(var i = 0; i < objList.length; i++) {
		//console.log(typeof objList[i])
		$(objList[i]).val("");
	}
	
	var objList = $(selector + " select");
	for(var i = 0; i < objList.length; i++) {
		$.selectBarun("#" + $(objList[i]).attr("id"), "");
	}
	
	var objList = $(selector + " input[type=checkbox]");
	for(var i = 0; i < objList.length; i++) {
		//console.log(typeof objList[i])
		$(objList[i]).get(0).checked = false;
	}
	
	var objList = $(selector + " input[type=password]");
	for(var i=0; i<objList.length; i++){
		$(objList[i]).val("");
	}
	
	var objList = $(selector + " textArea");
	for(var i=0; i<objList.length; i++){
		$(objList[i]).val("");
	}
};

$.validate = function(selector) {
	var objList = null;
	if(typeof selector == "string") {
		objList = $(selector + " input[required=required]");
	}
	else 
		objList = selector;
	
	for(var i = 0; i < objList.length; i++) {
		//console.log(objList[i])
		var value       = $(objList[i]).val().trim();
		var title 		= $(objList[i]).attr("user-title");
		var datatype 	= $(objList[i]).attr("user-data-type");
		var datamin 	= $(objList[i]).attr("user-data-min");
		//console.log(datatype);

		if(value == "") {
			alert(title + "을(를) 입력하세요.");
			return false;
		}
		try{
			switch(datatype) {
				
				case "password": {
					try{
						datamax  	 	= $(objList[i]).attr("user-data-max");
					} catch(e) { alert("user-data-max가 정의되어 있지 않습니다."); return false; }
					if(value.length < datamin || datamax > datamax) {
						alert(title + "의 입력 길이는 " + datamin + " ~ " + datamax + "입니다.");
						return false;
					}
					if($.isPwdCheck(value) == false) {
						return false;
					}
					break;
				}
				case "key": {
					try{
						keyLen  	 	= $(objList[i]).attr("user-key-len");
					} catch(e) { alert("user-key-len가 정의되어 있지 않습니다."); return false; }
					if(value.length != keyLen) {
						alert(title + "의(Key) 길이는 " + keyLen + "입니다.");
						return false;
					}
					break;
				}
				case "ip": {
					try{
						refId  	 	= $(objList[i]).attr("user-ref-ids");
					} catch(e) { alert("user-ref-ids가 정의되어 있지 않습니다."); return false; }
					if(refId.split(",").length != 2) {
						alert("user-ref-ids의 값은 IP주소체계구분ID와 IP주소입력구분 두가지가 입력되어야 합니다.");
						return false;
					}
					if(checkIp(refId, value) == false) return false;
					break;
				}
				case "car": {
					if(checkCar(value) == false) return false;
					break;
				}
				case "number": {
					if(!isNumeric(value)){
						alert(title + "에는 숫자만 입력가능합니다.");
						return false;
					} 
					break;
				}
				case "date": {
					break;
				}
				case "year": {
					if(value.length != 4) {
						alert(title + "을(를) 입력하세요.");
						return false;
					}
					break;
				}
				case "betweendate": {
					var refId  	 	= "";
					var toDate      = "";
					try{
						refId  	 	= $(objList[i]).attr("user-ref-id");
					} catch(e) { alert("user-ref-id가 정의되어 있지 않습니다."); return false; }
					try{
						toDate 	 	= $("#" + refId).val();
					} catch(e) { alert(refId + "를 찾을 수 없습니다."); return false;}
					if(value > toDate) {
						alert("종료일은 시작일보다 같거나 커야합니다.");
						return false;
					}
					break;
				}
				case "comparevalue": {
					if(value < datamin) {							
						alert(title + "의 입력값은 " + datamin + "보다 커야합니다.");
						return false;
					}
					break;
				}				
				default:
					if(value < datamin) {		
						alert(title + "의 입력값은 " + datamin + "보다 커야합니다.");
						return false;
					}
					break;
			}
		} catch(e) {}

		/*
		try{
			if(value < datamin) {		
				alert(title + "의 입력값은 " + datamin + "보다 커야합니다.");
				return false;
			}
		} catch(e) {}
		*/
		
	}
	objList = $(selector + " select[required=required]");
	for(var i = 0; i < objList.length; i++) {
		if($.getSelectValue($(objList[i]).attr("id")) == "") {
			alert($(objList[i]).attr("user-title") + "을(를) 선택하세요.");
			return false;
		}
	}
	
	/*textarea*/
	
	if(typeof selector == "string") {
		objList = $(selector + " textarea[required=required]");
	}
	else 
		objList = selector;
	
	for(var i = 0; i < objList.length; i++) {
		//console.log(objList[i])
		value       = $(objList[i]).val().trim();
		title 		= $(objList[i]).attr("user-title");
		
		if(value == "") {
			alert(title + "을(를) 입력하세요.");
			return false;
		}
		
	}
	/*textarea*/
	
	
	return true;
};

/*숫자체크함수*/
function isNumeric(val){
	str = "0123456789";
	
	for (var i=0;i<val.length;i++){
		// i 번째 문자가 숫자가 아니면 거짓.
		if (str.indexOf(val.charAt(i)) == -1){
			return false;
		}
	}
	return true;
}

$.loading = function(show) {
	if(show == true) {
		$(".layerLoding").remove();
		var html = "";
        html += '<div class="layerLoding" style="z-index:100">';
        html += '	<div class="layerCt">';
        html += '		<img class="loadImage" />';
        html += '	</div>';
        html += '   <br/><div>';
        html += '		처리중입니다.';
        html += '	</div>';
        html += '   <div>';
        html += '		잠시만 기다려 주십시오.';
        html += '	</div>';
        html += '</div>';
        $("body").append(html);
        //$("body").append("<div class='mask'></div>");
        $(".layerLoding").show();
        $("body").append("<div class='maskWhite' id='maskPrgm'></div>");
	}
	else {
        $(".layerLoding").remove();
        $("#maskPrgm").remove();
        //$(".mask").remove();
	}
};

$.bindTreeExpand = function(gridId, grid_param) {
	var rowId = $(gridId).jqGrid ('getGridParam', 'selrow');
	$(gridId + " .treeclick").bind('click', function() {
		grid_param.onSelectRow(rowId);
	});
};

function autoResize(i)
{
    var iframeHeight=
    (i).contentWindow.document.body.scrollHeight;
    (i).height=iframeHeight+20;
}

function checkCar(value) {
	/*
	var eng_check = /^[A-za-z]/g;
	if (eng_check.test(value))
	{
		alert("잘못된 차량번호입니다.(영문)");
		return false;
	}
	*/
	try {
		var eng_check = /^[A-za-z]/g;
		for(var i = 0; i < value.length; i++) {
			if (value[i].match(eng_check))
			{
				alert("잘못된 차량번호입니다.(영문)");
				return false;
			}
		}
		if(wordch(value) == false) {
			alert("잘못된 차량번호입니다.(특수문자)");
			return false;
		}
		if(value.split("-").length > 2) {
			alert("잘못된 차량번호입니다.(-)");
			return false;
		}
		var han_check = 0;
		var num_check = 0;
	    if(value.match(/[ㄱ-힣]/g)) {
	    	han_check = 1;
	    }
	
		var cnt = 0;
		var num_validate=/^[0-9]*$/;
		if(value.indexOf("-") >= 0) {
			for(var j = 0; j < value.split("-").length; j++) {
				var num = value.split("-")[j];
				cnt = 0;
				for(var i = 0; i < num.length; i++) {
					var vvv = num.substring(i, i + 1);
					if(num_validate.test(vvv)) {
						num_check = 1;
						cnt++;
					}
					else {
						if(!vvv.match(/[ㄱ-힣]/g))
							cnt = 0;
					}
				}
				//'-'로 나눠진 두군데 중 cnt==3이면 OK로 판단함.
				//만약 아니라면 cnt != 3으로 체크해서 판단해야함.
				if(cnt != 3) {
					alert("잘못된 차량번호입니다.(-)");
					return false;
				}
			}
		}
		else {
			for(var i = 0; i < value.length; i++) {
				var vvv = value.substring(i, i + 1);
				if(num_validate.test(vvv)) {
					num_check = 1;
					cnt++;
				}
				else {
					if(!vvv.match(/[ㄱ-힣]/g))
						cnt = 0;
				}
			}
			//if(cnt != 4) {
			if(cnt != 6) {
				alert("잘못된 차량번호입니다.(숫자)");
				return false;
			}
		}
		if(han_check != 1 || num_check != 1) {
			alert("차량번호는 한글, 숫자가 필수로 입력되어야 합니다.");
			return false;
		}
	}
	catch(e) {
		alert(e);
		return false;
	}
}

function wordch(thisword){
  var flag = true;
  var specialChars="~`!@#$%^&*=+\|[](){};:'<.,>/?_";
    wordadded = thisword;
    for (var i = 0; i < wordadded.length; i++) {
          for (var j = 0; j < specialChars.length; j++) {         
           if (wordadded.charAt(i) == specialChars.charAt(j)){         
           flag=false;
          break;
         }
     }
  }
  return flag;
}

function checkIp(refIds, value) {
	try{
		var ipMsg = "IP 형태를 확인하세요.";
		var gubun = $("#" + refIds.split(",")[0].trim()).val();
		var inGubun = $("#" + refIds.split(",")[1].trim()).val();
		if(gubun == "" || inGubun == "") {
			alert("IP주소체계구분, IP주소입력구분 입력값 오류입니다.");
			return false;
		}
		switch(gubun)
		{
			case "IPv4":
				switch(inGubun) {
					case "IP":
						try{
							if(value.split(".").length == 4 
								&& parseInt(value.split(".")[0], 10) <= 255
								&& parseInt(value.split(".")[1], 10) <= 255
								&& parseInt(value.split(".")[2], 10) <= 255
								&& parseInt(value.split(".")[3], 10) <= 255
								)
								;
							else {
								alert(ipMsg);
								return false;
							}
						} catch(e) {
							alert(ipMsg);
							return false;
						}
						break;
					case "DC":
						try{
							if(value.split(".").length == 4 
								&& parseInt(value.split(".")[0], 10) <= 255
								&& parseInt(value.split(".")[1], 10) <= 255
								&& parseInt(value.split(".")[2], 10) <= 255
								&& parseInt(value.split(".")[3], 10) > 0
								)
								;
							else {
								alert(ipMsg);
								return false;
							}
						} catch(e) {
							alert(ipMsg);
							return false;
						}
						break;
					case "CC":
						try{
							if(value.split(".").length == 4 
								&& parseInt(value.split(".")[0], 10) <= 255
								&& parseInt(value.split(".")[1], 10) <= 255
								&& parseInt(value.split(".")[2], 10) <= 255
								&& parseInt(value.split(".")[3], 10) == 0
								)
								;
							else {
								alert(ipMsg);
								return false;
							}
						} catch(e) {
							alert(ipMsg);
							return false;
						}
						break;
					case "BC":
						try{
							if(value.split(".").length == 4 
								&& parseInt(value.split(".")[0], 10) <= 255
								&& parseInt(value.split(".")[1], 10) <= 255
								&& parseInt(value.split(".")[2], 10) == 0
								&& parseInt(value.split(".")[3], 10) == 0
								)
								;
							else {
								alert(ipMsg);
								return false;
							}
						} catch(e) {
							alert(ipMsg);
							return false;
						}
						break;
					case "AC":
						try{
							if(value.split(".").length == 4 
								&& parseInt(value.split(".")[0], 10) <= 255
								&& parseInt(value.split(".")[1], 10) == 0
								&& parseInt(value.split(".")[2], 10) == 0
								&& parseInt(value.split(".")[3], 10) == 0
								)
								;
							else {
								alert(ipMsg);
								return false;
							}
						} catch(e) {
							alert(ipMsg);
							return false;
						}
						break;
					default: //AL
						break;
						
				}
				break;
			default : //IPv6
				var cnt = 0;
				switch(inGubun) {
					case "8B":
						cnt = 8;
						break;
					case "7B":
						cnt = 7;
						break;
					case "5B":
						cnt = 6;
						break;
					case "4B":
						cnt = 5;
						break;
					case "3B":
						cnt = 4;
						break;
					case "2B":
						cnt = 3;
						break;
					case "1B":
						cnt = 2;
						break;
					default: //AL
						break;
						
				}
				try{
					if(value.split(":").length == cnt 
						&& checkHex(value) == true
						)
						;
					else {
						alert(ipMsg);
						return false;
					}
				} catch(e) {
					alert(ipMsg);
					return false;
				}
				break;
		}
	} catch(e) { alert(e); return false; }	
	return true;
}

function checkHex(value) {
	var vvv = value.split(":");
	for(var j = 0; j < vvv.length; j++) {
		var ttt = vvv[j];
		for(var i = 0; i < ttt.length; i++) {
			//console.log(value.substring(i, i + 1));
			if((ttt.substring(i, 1) >= 0 && ttt.substring(i, 1) <= 9) || (ttt.substring(i, 1) >= 'a' && ttt.substring(i, 1) <= 'f') ) {
				;
			}
			else
				return false;
		}
	}
	return true;
}

$.changeElementAttr = function(selector) {
	var value = $(selector).val();
	var triggerId = $(selector).attr("user-trigger-id");
	var required = $(selector).attr("user-trigger-req-ex");
	if(required == value) {
		$("#" + triggerId).val("");
		$("#" + triggerId).removeAttr("required");
		$("#" + triggerId).attr("readonly", "readonly");
		$("star[user-trigger-req-ex=AL]").hide();
	}
	else {
		$("#" + triggerId).attr("required", "required");
		$("#" + triggerId).removeAttr("readonly");
		$("star[user-trigger-req-ex=AL]").show();
	}
};

$.checkChangeFileObject = function(ooo) {
	var id = $(ooo).attr("user-ref-id");
	var ext = $(ooo).attr("user-ext");
	if (!$(ooo).hasExtension(ext.split(","))) {
	    alert("확장자가 " + ext + "인 파일만 등록할 수 있습니다.");
	    $(ooo).val("");
	    $("#" + id).val("");
	    return false;
	}
    $("#" + id).val($(ooo).val());
};

$.checkChangeFileObject2 = function(ooo) {
	var id = $(ooo).attr("user-ref-id");
	var ext = $(ooo).attr("user-ext");
	$("#" + id).val($(ooo).val());
};

$.multiFileUpload = function(selector, url, params, callback){
	
    var data = new FormData();
    var files = $(selector + ' input[type=file]');
    //data.append('params', params);
    for(var i = 0; i < files.length; i++) {
    	var colId = $(files[i]).attr("user-col-name");
        data.append('file-' + colId, files[i].files[0]);
    	//console.log($(selector + ' input[type=file]')[i].files);
    }
    //console.log(data);
    
    $.ajax({
      url: url + "?" + params,
      type: "POST",
      data: data,
      enctype: 'multipart/form-data',
      processData: false,  // tell jQuery not to process the data
      contentType: false   // tell jQuery not to set contentType
    }).done(function( data ) {
    	callback();
        alert(data.msg);
    });
	
    insertFlag = false;
    return false;
};

$.multiFileUpload2 = function(selector, url, params, callback){
	
	for(var i = 0; i < $(selector +" .upload").length; i++) {
		var obj = $(selector + " .upload")[i];
		var data_bak = $(obj).attr("user-data-bak");
		var title = $(obj).attr("user-title");
		var id = $(obj).attr("user-ref-id");
		var ref_data = $("#" + id).val();
		var ext = $(obj).attr("user-ext");
		
		if(ref_data != ""){		
			if(data_bak != ref_data) {
				if (!$(obj).hasExtension(ext.split(","))) {
					alert(title + "은 확장자가 " + ext + "인 파일만 등록할 수 있습니다.");
					return false;
				}
			}
		}
		//$("#" + id).val($(ooo).val());
	}
	
	var data = new FormData();
	var files = $(selector + ' input[type=file]');
	//data.append('params', params);
	for(var i = 0; i < files.length; i++) {
		var colId = $(files[i]).attr("user-col-name");
		data.append('file-' + colId, files[i].files[0]);
		//console.log($(selector + ' input[type=file]')[i].files);
	}
	//console.log(data);
	
	$.ajax({
		url: url + "?" + params,
		type: "POST",
		data: data,
		enctype: 'multipart/form-data',
		processData: false,  // tell jQuery not to process the data
		contentType: false   // tell jQuery not to set contentType
	}).done(function( data ) {
		callback();
		alert(data.msg);
	});
	
	insertFlag = false;
	return false;
};

$.rowSpan = function (rowId, val, rawObject, cm, rdata) {
	var result;
	var cellId = this.id + '_row_' + rowId;
	
	try{
		if (this.prevCellVal.cellId == cellId) {
			result = ' style="display: none"';
			this.prevCellVal.row += 1;
		}
		else {
			result = " user-grid-data=" + cellId;
			//console.log($("#" + this.id + " [user-grid-data=" + prevCellVal.cellId + "]"));
			$("#" + this.id + " [user-grid-data=" + this.prevCellVal.cellId + "]").attr("rowspan", this.prevCellVal.row);
			this.prevCellVal = { cellId: cellId, value: '', row:1 };
		}
	} catch(e) {
		//첫번째 로우 로딩시
        this.prevCellVal = { cellId: cellId, value: undefined, row:1 };
		result = " user-grid-data=" + cellId;
	}
	return result;
};

$.ellipsis = function(cellValue,options,rowObject, width) {
	return '<div class="ellipsis">&nbsp;' + cellValue + '</div>';
};

$.isPwdCheck = function(value) {
	//if(!/^[a-zA-Z0-9]{8,20}$/.test(value))
	
  
    var chk_num = value.search(/[0-9]/g); 
    var chk_eng = value.search(/[a-z]/g);
    var chk_upper = value.search(/[A-Z]/g);

    var specialChars="~`!@#$%^&*=+\|[](){};:'<.,>/?_";
    chk_special = -1;
    for (var i = 0; i < value.length; i++) {
    	for (var j = 0; j < specialChars.length; j++) {         
    		if (value.charAt(i) == specialChars.charAt(j)){         
    			chk_special = i;
    			break;
    		}
    	}
    }
    //var chk_special = value.search(/~`!@#$%^&*=+\|[](){};:'<.,>\/?_/g);
    //console.log(chk_num);
    //console.log(chk_eng);
    //console.log(chk_upper);
    //console.log(chk_special);
    if(chk_num < 0 || chk_eng < 0 || chk_upper < 0 || chk_special < 0)
    { 
        alert("비밀번호는 숫자와 영문자,대문자 그리고 특수문자를 혼용하여야 합니다."); 
        return false;
    }
    
    if(/(\w)\1\1\1/.test(value))
    {
        alert("비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다."); 
        return false;
    }
    
    /*
	var chk1 = /^[a-zA-Z0-9]{8.20}$/;
	chk2 = /[a-z]/;
	chk3 = /[A-Z]/;
	chk4 = /\d/;
	
	console.log(chk1.test(this.remove(value)));
	console.log(chk2.test(this.remove(value)));
	console.log(chk3.test(this.remove(value)));
	console.log(chk4.test(this.remove(value)));
	
	var ret = chk1.test(this.remove(value))
		&& chk2.test(this.remove(value))
		&& chk3.test(this.remove(value))
		&& chk4.test(this.remove(value))
		? true : false;
	if(ret == false) {
		alert("비밀번호는 영어 대문자/영어 소문자/숫자 포함하여 8-20자리로 입력하세요.");
		return false;
	}
	*/
	return true;
};

$.center = function(selector) {
    var layerH = $(selector).height();
    $(selector).css({"margin-top": -(layerH/2)+"px"});
    var layerW = $(selector).width();
    $(selector).css({"margin-left": -(layerW/2)+"px"});
};

$.getAllRowToKeyValue = function(gridId, keyName, colName) {
	var ret = "";
	var rows = $(gridId).jqGrid('getGridParam', 'records');
	for(var i = 1; i <= rows; i++) {
		var list = $(gridId).getRowData(i);
		ret += "&" + keyName + "=" + list[colName];
	}
	return ret;
};

$.resizeJQGridWidth = function(grid_id, div_id, callback){
    $(window).bind('resize', function() {
    	callback();
     }).trigger('resize');
};

/*기준날짜 이전의 날짜 구하기*/
function getDate(standardDate, yCnt, mCnt, dCnt){
	var selectDate = standardDate.split("-");
  	
  	var changeDate = new Date();
  	changeDate.setFullYear(selectDate[0] - yCnt, selectDate[1] - mCnt, selectDate[2] - dCnt);
  	
  	var y = changeDate.getFullYear();
  	var m = changeDate.getMonth();
  	var d = changeDate.getDate();
  	
  	if(m < 10){
  		m = "0"+ m;
  	}
  	
  	if(d<10){
  		d = "0"+ d;
  	}
  	
  	var resultDate = y +"-"+ m +"-"+ d;
  	
  	return resultDate;
};

/* 그리드 데이터 없음 */
function setGridNodata(selector, text) {
	if (typeof text == 'undefined') {
		text = '데이터가 없습니다.';
	}
	var td = $('<td/>', {
		role : 'gridcell',
		style : 'text-align:center;',
		class : 'jqgrid_cursor_pointer',
		text : text
	})
	var tr = $('<tr/>', {
		role : 'row',
		id : 'jqgrow-nodata',
		tabindex : '-1',
		class : 'ui-widget-content jqgrow ui-row-ltr'
	});
	var tbody = $('<tbody/>');
	tr.append(td);
	tbody.append(tr);

	$('#grid' + selector).html(tbody);
};

function checkGridNodata(selector, data) {
	if (data.totalRows == 0 || data.rows.length == 0) {
		setGridNodata(selector);
		return false;
	}
	else {
		if ($('#grid' + selector + ' #jqgrow-nodata').length > 0) {
			$('#grid' + selector + ' #jqgrow-nodata').detach();
		}
		else {
			var size = $('#grid' + selector + ' tr[id=1]').length;
			if ($('#grid' + selector + ' tr[id=1]').length > 1) {
				var tr = $('#grid' + selector + ' tr[id=1]');
				$(tr[0]).detach();
			}
		}
		return true;
	}
};
