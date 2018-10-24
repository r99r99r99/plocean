var myApp = angular.module('myApp',['highcharts-ng','ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection',
                                    'ngDialog','ui.bootstrap','multi-select-tree']); 

var stationId;
var maxLevel ;
var sclist;

myApp.controller('customersCtrl',function($scope,$http,ngDialog,$timeout,$modal){
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	var dparam = {
			domainId:1
	};
	$http({
		 method:'POST',
		 url:'getDomainLevelListByDomain.do',
		 params:dparam})
		 .success(function(res){
			 	maxLevel = res.length;
			 	sclist = res;
			 	console.log(sclist);
		 });
	
	 //初始化参数
	$scope.u={};
	var setting = { 
			check: {
				enable: false
			},
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false,
				showIcon:showIconForTree
			},
			data: {
				simpleData: {
					enable:true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: ""
				}
			},
			callback: {
				beforeClick: beforeClick,
				onClick: zTreeOnClick
			}
	    };
	//展示出左侧的站点列表
	var t = $("#mtree");
		//读取组织树下的站点列表
	   var mparam = {
			id:"12"
	    };
	
		$.ajax({
		  url: 'getStationTreesByUserDomain.do', //url  action是方法的名称
		  data: mparam,
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	  if(data==null||data.length==0){
	    		  alert("站点列表为空");
	    		  return;
	    	  }
	    	  var first_id;
	    	  for(var i in data){
	    		  var treeNode = data[i];
	    		  var id = treeNode.id;
	    		  if(treeNode.id.substring(0,1)!="R"){
	    			  first_id = treeNode.id;
	    			  break;
	    		  }
	    	  }
	    	  t = $.fn.zTree.init(t, setting, data);
	    	  var zTree = $.fn.zTree.getZTreeObj("mtree");
	    	  zTree.selectNode(zTree.getNodeByParam("id", first_id));
	    	  stationid = first_id.substring(1,first_id.length);
	    	  $scope.updateStationStatus(stationid);
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.updateStationStatus(stationid);
				}
			}
		};
		function beforeClick(treeId, treeNode, clickFlag) {
			if(treeNode.id.substring(0,1)!="S"){
				treeNode.click=false;
			}
			return (treeNode.click != false);
		}
		
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		
		$scope.updateStationStatus=function(stationid){
			stationId=stationid;
			$scope.queryData();
		};
	//初始化统计口径列表
	$scope.activelist = [{
        name: '按月统计',
        value: 1
    }, {
        name: '按周统计',
        value: 2
    }, {
        name: '按日统计',
        value: 3
    }];
	
	$scope.collectType = 3;
	
	$scope.queryData = function(){
		$(".scbtn").attr('disabled',"true");
		var endDate = $('#endDate').val();
		var startDate = $('#startDate').val();
		if(ifBeginLaterEnd(startDate,endDate)){
			$(".scbtn").removeAttr("disabled");
			return;
		};
		var collectType = $scope.collectType;
		var zparams={
				endDate:endDate,
				beginDate:startDate,
				statType:collectType,
				stationId:stationId
		};
		$http({
			 method:'POST',
			 url:'showRedStat.do',
			 params:zparams})
			 .success(function(res){
				 	$(".scbtn").removeAttr("disabled");
				 	var headerHeight=$("#header").outerHeight();
					var windowHeight=$(window).outerHeight(); 
				 	$("#oneCharts").css({ height: (windowHeight-headerHeight*2)/2});
					$("#lineCharts").css({ height: (windowHeight-headerHeight*2)/2});
					loadCharts(res);
					$scope.createTable(res,'queryContainer','','');
			 });
	};
	
	
	//编辑表格信息
	$scope.createTable = function(result,id,title,flag){
		resultData = result;
		var dtime = "天数";
		//console.debug(resultData.tableContents);
		if(result.statType=='1'){
			dtime = "月份数";
		}else if(result.statType=='2'){
			
		}
		var htmlStr = new Array();
		htmlStr.push('<h4 style="text-align: center;"><strong>水质等级统计</strong></h4>');
		htmlStr.push('<table class="table table-striped" style="width: 100%">');
		htmlStr.push("<thead>");
		htmlStr.push("<tr class='info'>");
		htmlStr.push("<th>水质等级</th>");
		htmlStr.push("<th>天数</th>");
		htmlStr.push("<th>首要因子</th>");
		htmlStr.push("<th>占比</th>");
		htmlStr.push("</tr>");
		htmlStr.push("</thead>");
		
		for(var i in result.datas){
			
			htmlStr.push("<tr>");
				htmlStr.push("<td>"+result.datas[i].name+"</td>");
				htmlStr.push("<td>"+result.datas[i].y+"</td>");
				htmlStr.push("<td>"+result.datas[i].firstThing+"</td>");
				htmlStr.push("<td>"+Math.round(100*result.datas[i].y/result.datas[i].statcount)+"%"+"</td>");
			htmlStr.push("</tr>");
		}
		htmlStr.push("</table>");
		
		$("#"+id).html(htmlStr.join(""));
	};
	
	$scope.exportData=function(){
		var modalInstance = $modal.open({  
            templateUrl: 'popupTmpl.html',  
            controller: ModalInstanceCtrl
        });  
    	modalInstance.opened.then(function(){//模态窗口打开之后执行的函数  
            console.log('modal is opened');  
        });  
        modalInstance.result.then(function (result) { 
        	
        }, function (reason) {  
            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
        });
	};
	
	//弹出页面打开后的操作
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	
    	$scope.print = function(){
    		$("div#printArea").printArea(); 
    	};
    	
    };
	
});

function excelData(){
    //通过开始时间结束时间导出EXCEL
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var url='${ctx}/exportDataStand.do'+'?startDate='+startDate+'&endDate='+endDate;
	window.open(url, "下载Excel", "height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
};
function loadCharts(data){
	var piedata = data.datas;
	var step = 1;
		var size = data.xtimes.length;
		if(size>10){
			step = Math.ceil(size/10);
		}
	$("#piecontainer").html("");
	//生成饼状图
	$('<div class="chart">')
    .appendTo('#piecontainer')
    .highcharts({
    	chart: {
            height: 250
        },
		//设置标题
		title: {
			text: '',
            align: 'right',
            x: -80,
            verticalAlign: 'bottom',
            y: -80
        },
		//去掉版权
		credits:{
			enabled:false
		},
		//当鼠标滑过时显示的文字,没有实现
		tooltip: {
			animation:true,
			formatter: function () {
				return this.key +'的次数为'+
				'<b>' + this.y + '</b>';
				/*return '该水质等级的天数为'+this.y;*/
			}
		},
		series: [{
			data: piedata,
			type:'pie',
			//隐藏底部的series1
			showInLegend: false
		}]
    });
	
	//生成折线图
	$("#linecontainer").html("");
	$('<div class="chart" >')
    .appendTo('#linecontainer')
    .highcharts({
		chart: {
			height:250,
			//这里设置缩放
			zoomType: 'x'
        },
		//设置标题
        title: {
            text: '',
            align: 'left',
            margin: 0,
            x: 30
        },
		//去掉版权
        credits: {
            enabled: false
        },
        options: {
			chart: {
				type: 'line',
				zoomType: 'x'
			}
		},
        xAxis: {
			categories:data.xtimes,
			labels: {
           	 step:step,	
           	 staggerLines: 1,
                format: '{value}'
           }
		},
		yAxis:{
			max:maxLevel,
			//设置纵坐标标题
			title:{
				enabled:false
			},
		    labels:{
				formatter: function () {
					var result = "";
					for(var k=0;k<sclist.length;k++){
				 		var config = sclist[k];
				 		if(this.value==config.code){
				 			result = config.name;
				 		}
				 	}
                    return result;
                }
			}
		},
		//当鼠标滑过时显示的文字,没有实现
		tooltip: {
			formatter: function () {
				var result = "";
				for(var k=0;k<sclist.length;k++){
			 		var config = sclist[k];
			 		if(this.y==config.code){
			 			result = config.name;
			 		}
			 	}
				return '' + this.x +
				'为<b>' + result + '</b><br/>首要因子为<b>'+this.key+'</b>';
			},
            /*positioner: function () {
                return {
                    x: this.chart.chartWidth - this.label.width, // right aligned
                    y: -1 // align to title
                };
            },*/
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '15px'
            },
		},
		series: [{
			data: data.ydatas,
			type:'line',
			//隐藏底部的series1
			showInLegend: false,
			fillOpacity: 0.3,
            tooltip: {
                valueSuffix: ' ' 
            }
		}],
		
		exporting: {
            filename: '水质等级走势'
        }
    });
};