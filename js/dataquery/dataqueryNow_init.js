var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 
var row;
var col;
var selectNode="";
var stationid;
var type = 1;
var station;
myApp.controller('customersCtrl',function($scope,$sce,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	//初始化展示方式
	$scope.type={
			id:2,
			name:"切换到表格形式"
	};
	
	$("#datashowTable").hide();
	
	$scope.changeType=function(){
		var id = $scope.type.id;
		if(id==1){
			$scope.type={
					id:2,
					name:"切换到表格形式"
			};
			$("#datashowTable").hide();
			$("#datashow").show();
		}else{
			$scope.type={
					id:1,
					name:"切换到表盘形式"
			};
			$("#datashow").hide();
			$("#datashowTable").show();
		}
	};
    //初始化参数
	$scope.u={};
	//展示左侧的站点树
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
		$.ajax({
	      url: 'getStationList4ZTree.do', //url  action是方法的名称
	      data: '',
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
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
	    	  $scope.updateStationStatus();
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.updateStationStatus();
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
		/////////////////展示左侧站点树完毕
		
		//根据站点读取参数的表盘信息
		$scope.updateStationStatus=function(){
			var zparams = {
					id:stationid
			};
			$http({
				 method:'POST',
				 url:'getDevicesIndicators4Now.do',
				 params:zparams})
				 .success(function(res){
					 var airContent = new Array();
					 airContent.push('<div class="row">');	
					 for(var p in res){
						 var device = res[p];
						 airContent.push('<div class="col-xs-12">');	
						 airContent.push('<div class="widget-box" style="height:300px;background-color:#f9f9f9">');
							 airContent.push('<div class="widget-header">');
							 	airContent.push('<h5 class="widget-title">');
								airContent.push(device.name);
								airContent.push('&nbsp;&nbsp;&nbsp;');
								airContent.push('<i class="ace-icon glyphicon glyphicon-time"></i>');
								airContent.push('<span id="collectTime_');
								airContent.push(device.id);
								airContent.push('"></span>');
								airContent.push('</h5>');
							 airContent.push('</div>');	
							 airContent.push('<div class="widget-body noborder nopadding" style="height:auto;text-align: center;">');
							 	for(var m in device.indicators){
							 		 var indicator = device.indicators[m];
							 		 airContent.push('<div class="col-xs-2" style="min-width: 110px; max-width: 400px; height: 250px; margin: 0 auto" id="');
							 		 airContent.push(device.id);
							 		 airContent.push('_');
							 		 airContent.push(indicator.code);
							 		 airContent.push('" >');
							 		 airContent.push(indicator.title);
							 		airContent.push('</div>');	
							 	}
							 airContent.push('</div>');	
						 airContent.push('</div>');	
						 airContent.push('</div>');	
					 }
					 airContent.push('</div>');	
					 $("#datashow").html(airContent.join(""));
					 
					 //根据参数画出仪器图
					 for(var p in res){
						 var device = res[p];
						 for(var m in device.indicators){
							 var indicator = device.indicators[m];
							 loadCharts(device,indicator);
						 }
					 }
					 $scope.getLastData();
				 });
		};
		
		
		$scope.getLastData=function(){
			var zparams = {
					id:stationid
			};
			$http({
				 method:'POST',
				 url:'getlastdataNow.do',
				 params:zparams})
				 .success(function(res){
					 for(var m in res.Datas){
						 var device = res.Datas[m];
						 eval("$('#collectTime_"+device.deviceId+"').html('  更新时间：'+device.lastTime)");
						 var indicators = device.MetaDatas;
						 for(var n in indicators){
							 var indicator = indicators[n];
							 var hcharts = Highcharts.charts;
							 var diid = device.deviceId+"_"+indicator.indicatorCode;
							 for(var s in hcharts){
								 var hchart = hcharts[s];
								 if(hchart.renderTo.id==diid){
									 var datas = new Array();
									 datas.push(indicator.mdata);
									 hchart.addSeries({
										 name: indicator.indicatorTitle,
										 data:datas,
										 tooltip: {
												valueSuffix: indicator.unitName+indicator.remark
									     }
									 });
									 
									 //var point = hchart.series[0].points[0];
									 //hchart.series[0].setData(datas);
								 }
							 }
						 }
					 }
					 
					 
					 //开始编写表格形式的内容
					 var airContent = new Array();

						airContent.push('<div class="row">');	
						//开始编写实时数据部分
						var lastData = res.Datas;
						for(var p in lastData){
								/* airContent.push('<div class="widget-header " >'); */
							var lastTime = lastData[p].lastTime;
							var pointNum = lastData[p].pointNum;
							if(lastTime == null){
								lastTime = ' ';
							}
							airContent.push('<div class="col-xs-6">');	
							airContent.push('<div class="widget-box">');
							airContent.push('<div class="widget-header">');
							airContent.push('<h5 class="widget-title">');
							airContent.push('<i class="icon-table"></i>');
							airContent.push(lastData[p].deviceName+'  更新时间：'+lastTime);
							airContent.push('</h5>');
							airContent.push('</div>');
							airContent.push('<div class="widget-body noborder nopadding">');
							airContent.push('<table class="table table-striped table-bordered table-hover">');
							airContent.push('<tbody>');
							var rdata = lastData[p].MetaDatas;
							var n = 0;
							for(var m in rdata){
								if(m%2==0){
									airContent.push('<tr>');
									airContent.push('<td style="width: 50%">'+rdata[m].indicatorTitle+':<span >'
								               +rdata[m].dataValue+'</span></td>');
									
								}else{
									airContent.push('<td  >'+rdata[m].indicatorTitle+':<span >'
								               +rdata[m].dataValue+'</span></td>');
									airContent.push('</tr>');
								}
								n = m;
						     }
							if(n>0&&n%2==0){
								airContent.push('<td  ><span style="font-size:15px;"></span></td>');
								airContent.push('</tr>');
							}
							airContent.push('</tbody>');
							airContent.push('</table>');
							airContent.push('</div>');
							airContent.push('</div>');
							airContent.push('</div>');
						}
				airContent.push('</div>');
				$("#datashowTable").html(airContent.join(""));
					 
				 });
		};
		
		 $scope.getLastDataintervalId=function(){
			   stationintervalId = setInterval(function() {
				   $scope.getLastData();
				}, "10000"); //每隔10S刷新数据  
		   };
		 $scope.getLastDataintervalId();
});

function loadCharts(device,indicator){
	var plotBands = new Array();
	for(var i in indicator.qualityList){
		var stand = indicator.qualityList[i];
		var plot = {
				from: stand.min_value,
				to: stand.max_value,
				color: stand.color // green
		};
		plotBands.push(plot);
	}
	var code = indicator.code;
	var deviceid = device.id;
	var chart = Highcharts.chart(deviceid+"_"+code,{
		chart: {
			type: 'gauge',
			plotBackgroundColor: null,
			plotBackgroundImage: null,
			plotBorderWidth: 0,
			plotShadow: false,
			backgroundColor: '#F9F9F9'  //表盘的背景填充色
		},
		title: {
			text: indicator.title
		},
		//去掉版权
        credits: {
            enabled: false
        },
        exporting: {
                    enabled:false
        },
		pane: {
			startAngle: -150,
			endAngle: 150,
			background: [{
				backgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0, '#FFF'],
						[1, '#333']
					]
				},
				borderWidth: 0,
				outerRadius: '109%'
			}, {
				backgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0, '#333'],
						[1, '#FFF']
					]
				},
				borderWidth: 1,
				outerRadius: '107%'
			}, {
				// default background
			}, {
				backgroundColor: '#DDD',
				borderWidth: 0,
				outerRadius: '105%',
				innerRadius: '103%'
			}]
		},
		// the value axis
		yAxis: {
			min: indicator.minData,
			max: indicator.maxData,
			minorTickInterval: 'auto',
			minorTickWidth: 1,
			minorTickLength: 10,
			minorTickPosition: 'inside',
			minorTickColor: '#666',
			tickPixelInterval: 30,
			tickWidth: 2,
			tickPosition: 'inside',
			tickLength: 10,
			tickColor: '#666',
			labels: {
				step: 2,
				rotation: 'auto'
			},
			title: {
				text: indicator.unitName
			},
			plotBands: plotBands
		}/*,
		series: [{
			name: 'Speed',
			//data: [7],
			tooltip: {
				valueSuffix: '2fsfsf '
			}
		}]*/
	});
	
}
