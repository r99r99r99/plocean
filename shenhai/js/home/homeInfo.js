var myApp = angular.module('myApp',['ngDialog','ui.bootstrap']); 
var map;
var popup;
var popupclick;
var element;
var elementclick;
var intervalId ;
var stationintervalId ;
var vectorLayer;
var stat;
var lay;
var coor;
var url_i,format,version,tiled_i,styles_i,transparent,layers,code;
//加入地图纠偏数据
var offsetX = 600;
var offsetY = 0; 
var maxLevel ;
var sclist;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    //在地图上展示站点的状态
    
  //展开站点详情列表
    $scope.showStationDetail=function(station){
    	$scope.station = station;
    	$scope.showLastData(station);
    	//$scope.showStationStatus(station);
     };
     
     //关闭站点详情列表
     $scope.closeStationLayers=function(){
     	//关闭地图上展示的站点详细信息
      	$(element).popover('destroy');
     }
     
     //得到站点的实时数据
     $scope.showLastData=function(station){
    	//当选中该站点时,得到该站点的水质类型配置
     	var dp = {id:station.id};
     	$http({
    		 method:'POST',
    		 url:'getWaterStandardConfigListByStationId.do',
    		 params:dp})
    		 .success(function(res){
    			 	maxLevel = res.length;
    			 	sclist = res;
    		 });
     	
     	$scope.showStatLine(station);
       	 var sparams = {
       			 stationId:station.id
       	 }
       		$http({
       			 method:'POST',
       			 url:'getDatas4Firstpage.do',
       			 params:sparams})
       			 .success(function(res){
       				 //展示该站点的实时水质
       				var waterStandard = res.waterStandard;
       				if(waterStandard==null){
       					waterStandard={
       							standard_grade:0,
       							indicatorName:'未知',
       							standardName:'未知'
       					}
       				}
       				
  					var srcpath = "page-images/watertype"+station.waterType+"/"+waterStandard.standard_grade+"grade.png";
  					$("#gradeImg").attr('src',srcpath);
  					$scope.stand = waterStandard;
       				 
       				 //添加右侧实时数据展示页面
       				 var lastData = res.Datas;
       				 var lastContent = new Array();
       				 lastContent.push('<div class="firstBoxIn">');
       				 for(var p in lastData){
       					 lastContent.push('<div class="">');
       					 lastContent.push('<div class="widget-title">');
       					 lastContent.push('<p class="label">');
       					 lastContent.push(lastData[p].lastTime);
       					 lastContent.push('</p><h5>');
       					 lastContent.push(lastData[p].deviceName);
       					 lastContent.push('</h5></div>');
       					 lastContent.push('<table class="table table-hover table-bordered table-responsive">');
       					 var rdata = lastData[p].MetaDatas;
       					 var pointNum = lastData[p].pointNum;
       					 for(var m in rdata){
       						 lastContent.push('<tr>');
       						 lastContent.push('<td class="table_blue_zi">');
       						 lastContent.push(rdata[m].indicatorTitle);
       						 lastContent.push('</td>');
       						 lastContent.push('<td>');
       						 lastContent.push(rdata[m].dataValue);
       						 lastContent.push('</td>');
       						 lastContent.push('</tr>');
       					 }
       					 lastContent.push('</table>');
       					 lastContent.push('</div>');
       				 }
       				 lastContent.push('</div>');
       				 
       				 $("#firstBox").html("");
     			     $("#firstBox").html(lastContent.join(""));
       			 }); 
       	
        };
     
        
   //定时更新站点的状态信息
   $scope.updateStationStatusintervalId=function(){
	   stationintervalId = setInterval(function() {
		   $scope.updateStationStatus();
		}, "600000"); //每隔6s刷新数据  
   }
   $scope.updateStationStatus=function(){
	   //更新地图上站点的图标以及状态
	   var mData = "";
	   $http({
			 method:'POST',
			 url:'getStationStatusList.do',
			 params:mData})
			 .success(function(stations){
				 $scope.stations = stations;
				 //加载第一个站点的信息
				 var station = $scope.stations[0];
				 $scope.station = station;
				 $scope.showLastData(station);
				 //$scope.showStationStatus(station);
				 }); 
	     
   }
   $scope.updateStationStatus();
   $scope.updateStationStatusintervalId();
   
   //获得站点的水质等级趋势  
   $scope.showStatLine=function(station){
	   var nowDate = new Date();  //获取当前的时间
	   //初始化开始时间和结束时间
	   var send = nowDate.getTime();  
	   var sbegin = send - 1000*60*60*24*30; 
/*	   var send = nowDate.getTime() - 1000*60*60*24*30;  //初始化结束时间为当前时间的一个月前
	   var sbegin = send - 1000*60*60*24*7; //初始化开始时间为结束时间的一周前
*/	   var kend = new Date(send);   //初始化的结束实际那
	   var kbegin = new Date(sbegin);  //初始化的开始时间
	   var yeare = kend.getYear()+1900;
	   var yearb = kbegin.getYear()+1900;
	   var monthe = kend.getMonth() + 1;
	   var monthb = kbegin.getMonth() + 1;
	   var daye = kend.getDate();
	   var dayb = kbegin.getDate();
	   if(monthb<10){
		   monthb = '0'+monthb;
		}
		if(dayb<10){
			dayb = '0'+dayb;
		}
		if(monthe<10){
			monthe = '0'+monthe;
		}
		if(daye<10){
			daye = '0'+daye;
		}
	   var begin = yearb+'-'+monthb+'-'+dayb;
	   var end = yeare+'-'+monthe+'-'+daye;
	   $scope.upd(station,begin,end);
	   $scope.getWarn(station,begin,end);
};
   
   //查询该站点，一段时间内的预警告警信息
	$scope.getWarn=function(station,beginDate,endDate){
		 var sparams = {
				 wpId:station.id,
				 beginDate:beginDate,
				 endDate:endDate 
		 };
		 $http({
			 method:'POST',
			 url:'getWarnValueRows.do',
			 params:sparams})
			 .success(function(res){
				 var warnConcent = new Array();
				 warnConcent.push('<table class="table table-hover table-bordered table-responsive">');
				 //生成表头部分
				 warnConcent.push('<thead>');
				 warnConcent.push('<tr>');
				 warnConcent.push('<th class="table_blue_zi">类型</th>');
				 warnConcent.push('<th class="table_blue_zi">设备</th>');
				 warnConcent.push('<th class="table_blue_zi">参数</th>');
				 warnConcent.push('<th class="table_blue_zi">测定值</th>');
				 warnConcent.push('</tr>');
				 warnConcent.push('</thead>');
				 warnConcent.push('<tbody>');
				 for(var m in res){
					 warnConcent.push('<tr>');
					 warnConcent.push('<td class="table_blue_zi">');
					 warnConcent.push(res[m].typeName);
					 warnConcent.push('</td>');
					 warnConcent.push('<td class="table_blue_zi">');
					 warnConcent.push(res[m].deviceName);
					 warnConcent.push('</td>');
					 warnConcent.push('<td class="table_blue_zi">');
					 warnConcent.push(res[m].indicatorName);
					 warnConcent.push('</td>');
					 warnConcent.push('<td class="table_blue_zi">');
					 warnConcent.push(res[m].value);
					 if(res[m].unitName!=null){
						 warnConcent.push(res[m].unitName);
					 }
					 warnConcent.push('</td>');
					 warnConcent.push('</tr>');
				 }
				 warnConcent.push('</tbody>');
				 warnConcent.push('</table>');
				 
				 $("#warnBox").html("");
 			     $("#warnBox").html(warnConcent.join(""));
				 
			 });
	};
   //从后台读取折线图数据
   $scope.upd=function(station,beginDate,endDate){
	   $scope.param={
			   stationId:station.id,
			   statType:3,
			   beginDate:beginDate,
			   endDate:endDate 
	   }
	   var sparams=$scope.param;
	   $http({
			 method:'POST',
			 url:'showStat4First.do',
			 params:sparams})
			 .success(function(res){
				 loadChart(res);
			 });
	   $http({
			 method:'POST',
			 url:'showStat.do',
			 params:sparams})
			 .success(function(res){
				 loadPie(res);
			 });
   };
});
//生成水质统计饼形图
function loadPie(data){
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
            height: 200
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
	
}
function loadChart(data){
	var dat = [];
    for(var p in data.xtimes){
    	dat.push({
            name:data.xtimes[p],
            //x: data.xtimes[p],
            y: data.ydatas[p].y
        });
    }
	var step = 1;
	var size = data.xtimes.length;
	if(size>7){
		step = Math.ceil(size/7);
	}
	$("#linecontainer").html("");
	$('<div class="chart"  style="height:36vh; margin: 0 auto">>')
    .appendTo('#linecontainer')
    .highcharts({
	    	 chart: {
	             type: 'spline',
	             animation: Highcharts.svg, // don't animate in old IE
	             marginRight: 10,
	             backgroundColor: '#FFFFFF',
	             events: {
	                 load: function () {
	                     // set up the updating of the chart each second
	                     var series = this.series[0];
	                     setInterval(function () {
	                         var sdata=[{
	                        	 	name: '2016-09-01',
	                        		//color: '#FF00FF',
	                        		y: 5
	                         }];
	                        // series.addPoint([x, y], true, true);
	                         //series.addPoint(sdata, true, true);
	                     }, 5000);
	                 }
	             }
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
		options: {
			chart: {
				type: 'line',
				zoomType: 'x'
			}
		},
		//当鼠标滑过时显示的文字,没有实现
		tooltip: {
			animation:true,
			formatter: function () {
				var res = "水质良好";
				var result = "";
				for(var k=0;k<sclist.length;k++){
			 		var config = sclist[k];
			 		if(this.y==config.classId){
			 			result = config.className;
			 		}
			 	}
				
				if(this.y>2){
					res = '' + this.x +
					'为<b>' + result + '</b><br/>污染因子为<b>'+this.key+'</b>'
				}
				return res;
			}
		},
		series: [{
			data: data.ydatas,
			//隐藏底部的series1
			showInLegend: false
		}],
		xAxis: {
			//type: 'datetime',
            //tickPixelInterval: 150,
			categories:data.xtimes,
			labels: {
	           	 step:step
	        }
		},
		yAxis:{
			max:maxLevel,
			//设置纵坐标标题
			title:{
				enabled:false
			},
			reversed: true,  //将Y轴倒叙,
			labels:{
				formatter: function () {
					var result = "";
					for(var k=0;k<sclist.length;k++){
				 		var config = sclist[k];
				 		if(this.value==config.classId){
				 			result = config.className;
				 		}
				 	}
                    return result;
                }
			}
		}
    });
};
function startmarquee(lh,speed,delay) {
	var p=false;
	var t;
	var o=document.getElementById("marqueebox");
	o.innerHTML+=o.innerHTML;
	o.style.marginTop=0;
	o.onmouseover=function(){p=true;}
	o.onmouseout=function(){p=false;}
	//欢迎来到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
	function start(){
	t=setInterval(scrolling,speed);
	if(!p) o.style.marginTop=parseInt(o.style.marginTop)-1+"px";
	}
	//欢迎来到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
	function scrolling(){
	if(parseInt(o.style.marginTop)%lh!=0){
	o.style.marginTop=parseInt(o.style.marginTop)-1+"px";
	if(Math.abs(parseInt(o.style.marginTop))>=o.scrollHeight/2) o.style.marginTop=0;
	}else{
	clearInterval(t);
	setTimeout(start,delay);
	}
	}//欢迎来到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
setTimeout(start,delay);
}//欢迎来到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。

