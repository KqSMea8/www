function openSearchDialog(){
	$("#home").hide();
	$("#search_dialog").show();
	$("#search_home").show();
	$("#search_list").hide();
	$("#search_input").val("");
	$("#search_input").focus();
}
function closeSearchDialog(){
	$("#home").show();
	$("#search_dialog").hide();
	$("#search_home").show();
	$("#search_list").hide();
	$("#search_input").val("");
}
var searchTimeOut;
function clearSearchStr(){
	$("#search_input").val("");
	$("#empty-text").hide();
	$("#search_input").focus();
	searchGame();
}
function goSearch(){
	//不输入0.5秒后开始搜索
	var searchStr = $("#search_input").val();
	if(searchStr.length==0){
		$("#empty-text").hide();
	}else{
		$("#empty-text").show();
	}
	
	clearTimeout(searchTimeOut);
	searchTimeOut = setTimeout(function (){searchGame();}, 500);
}
function searchGame(){
	var searchStr = $("#search_input").val();
	
	//var re=/[^0-9a-zA-Z\u4e00-\u9fa5]/g;
	var re=/[^0-9a-zA-Z\u4e00-\u9fa5:\(\):\/：-]/g;
	searchStr = searchStr.replace(re,'');
	if ($.trim(searchStr)==''){
		hideSearch();
	}else{
		$("#search_list_ul").html("");
		$("#searchNoResult").hide();
		$("#more").hide();
		showSearch();
		serachGameByStr(searchStr);
	}
}
function showSearch(){
	$("#search_home").hide();
	$("#search_list").show();
}
function hideSearch(){
	$("#search_home").show();
	$("#search_list").hide();
}

function serachGameByStr(searchStr){
	var url="/api/searchAll";
	$.ajax({
		data:{searchStr:searchStr, f:'ajax', t:'xhtml'},
		type : "POST",
		dataType : "json",
		url : url,
		success : function(data){
			var gameList = data.gameList;
			var hasMore = data.hasMore;
			var gameGoodsRelationMap = data.gameGoodsRelationMap;
			var searchHistorys = data.searchHistorys;
			html="";
			if(gameList.length>0 ){
				$("#searchNoResult").hide();
				if(hasMore==true){
					$("#more").show();
				}else{
					$("#more").hide();
				}

				for(var i=0;i<gameList.length;i++){
					game = gameList[i];
					html += '<li>';
					html += '<a href="https://www.ebbuys.com/product/goods/'+game.id+'">'+game.name+'</a>';
					buttonType = [];
					if(game.pid==10000){
						html += '<a href="https://www.ebbuys.com/product/goods/'+game.id+'" class="sbtn">點卡購買</a>';
					}
					if(game.pid==10001){
						html += '<a href="https://www.ebbuys.com/product/goods/'+game.id+'" class="sbtn">手遊代充</a>';
					}
					if(game.pid==9999){
						html += '<a href="https://www.ebbuys.com/product/goods/'+game.id+'" class="sbtn">直播代充</a>';
					}
					if(game.pid==8888){
						html += '<a href="https://www.ebbuys.com/product/goods/'+game.id+'" class="sbtn">中國代購</a>';
					}
					
					html += '</li>';
				}
				$("#search_list_ul").html(html);
			}else{
				$("#search_list_ul").html("");
				$("#searchNoResult").show();
				$("#searchNoResultSearchStr").html(searchStr);
				$("#more").hide();
			}
			
			html = '';
			for(var i=0;i<searchHistorys.length;i++){
				searchStr = searchHistorys[i];
				html += '<li><a href="javascript:historyGameSearch(\''+searchStr+'\')" title="'+searchStr+'">'+searchStr+'</a></li>';
			}
			$("#searchHistory_ul").html(html);
			$("#searchHistory_div").show();
			$("#searchHistory_title").show();
			
		}
	});
}

function clearSearch(){
	$("#searchHistory_div").hide();
	$("#searchHistory_title").hide();
	url = "/nm/clearsearch.html";
	doAjax(url, function(){return false;});
}
function historyGameSearch(searchStr){
	$("#search_input").val(searchStr);
	$("#empty-text").show();
	searchGame();
}
function goSearchReault(goodsTypeId){
	var searchStr = $("#search_input").val();
	if($.trim(searchStr).length==0){
		return;
	}
	url = "/product/search?q="+searchStr;
	window.location=url;
}

function doAjax(url, succ) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: succ
    });
}
