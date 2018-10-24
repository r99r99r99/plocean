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
var offsetX = 0;
var offsetY = 0; 
var maxLevel ;
var sclist;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	//地图纠偏方法
	$scope.updateXY = function(X,Y,EPSGDATA,EXPGMAP){
		var before = ol.proj.transform([X,Y],EPSGDATA,EXPGMAP);
		var after = [before[0]+offsetX,before[1]+offsetY];
		return after;
	};
	//读取地图的配置信息,并根据配置信息加载地图
	$scope.getMapConfig=function(){
		var mapData = "";
		$http({
			method:'POST',
			url:'getMapConfigure.do',
			params:mapData})
			.success(function(response){
				url_i=response.url;
				format=response.format;
				version=response.version;
				tiled_i=response.tiled;
				styles_i=response.styles;
				transparent=response.transparent;
				layers=response.layers;
				code=response.code;
				mzoom=response.initZoom;
				maxz=response.maxZoom;
				minz=response.minZoom;
				$scope.showMap();
				$scope.updateStationStatus();
				
			});
	};
	//展示地图
	$scope.showMap=function(){
		
		var projection = new ol.proj.Projection({
			code: 'EPSG:4326',
			units: 'm',
			axisOrientation: 'neu',
			global: false
		});
		var resolutions = [];
	    for(var i=0; i<19; i++){
	        resolutions[i] = Math.pow(2, 18-i);
	    }
	    var tilegrid  = new ol.tilegrid.TileGrid({
	        origin: [0,0],
	        resolutions: resolutions
	    });
	    
	     ////自定义地图
	    ///自定义地图
	    var format = 'image/png';
	    
	    var googleMapLayer = new ol.layer.Tile({  
            source: new ol.source.XYZ({  
                url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'  
            })  
        }); 
	    
	    var tiled = new ol.layer.Tile({
	         visible: true,
	         source: new ol.source.TileWMS({
	           url: url_i,
	           
	           params: {'FORMAT': format, 
	                    'VERSION': version,
	                    tiled: tiled_i,
	                 STYLES: styles_i,
	                 transparent:transparent,
	                 LAYERS: layers
	           }
	         })
	       });
	    
	    //显示鼠标的位置
	    var mousePositionControl = new ol.control.MousePosition({
	    	/*projection:"EPSG:4326",
	        className: 'custom-mouse-position',
	        target: document.getElementById('location'),
	        coordinateFormat: ol.coordinate.toStringHDMS,
	        undefinedHTML: '&nbsp;'*/
	    	projection:"EPSG:4326",
		    className: 'custom-mouse-position',
		    target: document.getElementById('location'),
		    coordinateFormat: ol.coordinate.createStringXY(5),
		    undefinedHTML: '&nbsp;'
	      });
	    map = new ol.Map({
	    	controls: ol.control.defaults({
		           attribution: false
		         }).extend([mousePositionControl]),
	        target: 'map',
	        layers: [googleMapLayer],
	        view: new ol.View({
	           // center:  coor,
	            zoom:  mzoom,
	            minZoom: minz,  
	            maxZoom: maxz  
	        })
	    });
	    var view = map.getView();
		view.setCenter(coor);
	};
	
	$scope.getMapConfig();
	
	//展示出站点的列表
	$scope.showlayersControl=function(){
   	 var lay = document.getElementById("layersControl");
   	 if(lay.style.display=="block"){
   		 lay.style.display="none"
   	 }else{
   		 lay.style.display="block";
   	 }
    };
    $scope.showlayersControl();
    
    //在地图上展示站点的状态
    $scope.showStationStatus=function(station){
    	
    	
		//跳转到该站点为中心点
		 coor = $scope.updateXY(station.longitude,station.latitude,'EPSG:4326', code);
    	 var view = map.getView();
 		 view.setCenter(coor);
 		 
      		
      	//展示该站点的复选框
   		element = document.getElementById('popup');
   		$(element).popover('destroy');
   		var coordinates = ol.proj.transform([station.longitude,station.latitude], 'EPSG:4326', code);
   		popup = null;
   		popup = new ol.Overlay({
				element: element,
				positioning: 'bottom-center',
				stopEvent: false,
				offset: [110, -80]
			});
   		
   		popup.setPosition(coordinates);
   		
			
		$(element).popover({
				'placement': 'right',
				'title':station.title,
				'html': true,
				'content':'<table class="table table-hover table-bordered table-responsive" style="font-size: 12px">'
						+'<tr>'
						+'<td colspan="2" style="text-align:center;">站点位置</td>'
						+'</tr>'
						+'<tr>'
						+'<td class="firstTableTd">东经:'+(station.latitude).toFixed(3)+'°</td>'    
						+'<td class="firstTableTd">北纬:'+(station.longitude).toFixed(3)+'°</td>'
						+'</tr>'
						/*+'<tr >'
						+'<td class="firstTableTd">偏移</td>'
						+'<td class="firstTableTd">'+(station.distance).toFixed(2)+'米</td>'
						+'</tr>'*/
						+'<tr>'
						+'<td colspan="1" style="text-align:center;">站点状态</td>'
						+'<td colspan="1" style="text-align:center;">无异常</td>'
						+'</tr>'
						+'</table>'
		});
		$(element).popover('show');
		map.addOverlay(popup);
 		 
    }
    
  //展开站点详情列表
    $scope.showStationDetail=function(station){
    	$scope.station = station;
    	$scope.showLastData(station);
    	$scope.showStationStatus(station);
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
       				var statuss = res.deviceStatusList;
       				
       				 //展示该站点的实时水质
       				var waterStandard = res.waterStandard;
       				if(waterStandard==null){
       					waterStandard={
       							standard_grade:0,
       							indicatorName:'未知',
       							standardName:'未知'
       					}
       				}
       				
  					var srcpath = "shenhai/images/watertype"+station.waterType+"/"+waterStandard.standard_grade+"grade.png";
  					$("#gradeImg").attr('src',srcpath);
  					$scope.stand = waterStandard;
       				//展示设备状态列表 
  					var statusContent = new Array();
  					statusContent.push('<table class="table table-hover table-bordered table-responsive">');
  					statusContent.push('<thead>');
  					statusContent.push('<tr>');
  					statusContent.push('<th >');
  					statusContent.push('设备');
  					statusContent.push('</td>');
  					statusContent.push('<td >');
  					statusContent.push('状态');
  					statusContent.push('</td>');
  					statusContent.push('</tr>');
  					statusContent.push('</thead>');
  					statusContent.push('<tbody>');
  					for(var p in statuss){
  						var status = statuss[p];
  						statusContent.push('<tr>');
  						statusContent.push('<td class="table_blue_zi">');
  						statusContent.push(status.deviceName);
  						statusContent.push('</td>');
  						statusContent.push('<td>');
  						statusContent.push(status.dataValue);
  						statusContent.push('</td>');
  						statusContent.push('</tr>');
  					}
  					statusContent.push('</tbody>');
  					statusContent.push('</table>');
  					
       				 //添加右侧实时数据展示页面
       				 var lastData = res.Datas;
       				 var lastContent = new Array();
       				 lastContent.push('<div class="firstBoxIn">');
       				 for(var p in lastData){
       					 lastContent.push('<div class="">');
       					 lastContent.push('<div class="widget-header">');
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
     			     $("#statusBox").html(statusContent.join(""));
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
				 $scope.showStationStatus(station);
				 coor = $scope.updateXY(station.longitude,station.latitude,'EPSG:4326', code);
				 var view = map.getView();
	 		     view.setCenter(coor);
				 map.removeLayer(vectorLayer);
				 var startMarkers = new Array();
				   angular.forEach(stations, function(station){
				    	 var startMarker = new ol.Feature({
				    		stationId:station.id,
				 	        type: station.ifConnIcon,
				 	        rainfall: 500,
				 	        //geometry: new ol.geom.Point(ol.proj.transform([station.longitude,station.latitude], 'EPSG:4326', code))
				    	 	geometry: new ol.geom.Point($scope.updateXY(station.longitude,station.latitude,'EPSG:4326', code))
				    	 });
				    	 startMarkers.push(startMarker);
				     });
				   
				   vectorLayer = new ol.layer.Vector({
				        source: new ol.source.Vector({
				          features: startMarkers
				        }),
				        style: function(feature) {
					        var icon = 	 new ol.style.Style({
						          		image: new ol.style.Icon({
							            anchor: [0, 15],
							           anchorXUnits: 'pixels',
							           anchorYUnits: 'pixels',
							           /*anchorXUnits: 'fraction',
							           anchorYUnits: 'pixels',*/
							            src: 'shenhai/images/station/icon/'+feature.get('type')
							          })
					        })
					        return icon;
				        }
				 }); 
				   
					map.on('click', function(evt) {
						var feature = map.forEachFeatureAtPixel(evt.pixel,
								function(feature) {
							return feature;
						});
						if (feature) {
							//获得点击的站点的id
							var spam={
									id:feature.H.stationId
							};
							 $http({
					 			 method:'POST',
					 			 url:'getStationStatusById.do',
					 			 params:spam})
					 			 .success(function(response){
					 				$scope.showStationDetail(response);
					 			 })
					 			 
						} else {  //当点击地图的空白区域时,关闭所有弹出框
							$scope.closeStationLayers();
						}
					});
					map.addLayer(vectorLayer);  
			 });
	     
   }
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

