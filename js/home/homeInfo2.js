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
	//地图纠偏方法
	$scope.updateXY = function(X,Y,EPSGDATA,EXPGMAP){
		var before = ol.proj.transform([X,Y],EPSGDATA,EXPGMAP);
		var after = [before[0]+offsetX,before[1]+offsetY];
		return after;
	};
	//读取地图的配置信息,并根据配置信息加载地图
	$scope.getMapConfig=function(){
		var mapData = "";
		$http({  responseType:'json',
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
	    	projection:"EPSG:4326",
	        className: 'custom-mouse-position',
	        target: document.getElementById('location'),
	        coordinateFormat: ol.coordinate.toStringHDMS,
	        undefinedHTML: '&nbsp;'
	    	/*projection:"EPSG:4326",
		    className: 'custom-mouse-position',
		    target: document.getElementById('location'),
		    coordinateFormat: ol.coordinate.createStringXY(5),
		    undefinedHTML: '&nbsp;'*/
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
	  //点击站点后的弹出框
	    element= document.getElementById('popup');
	    //lay = document.getElementById("stationLayers");   //地图下方展示的实时数据,水质等级等
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
   
  //展开站点详情列表
    $scope.showStationDetail=function(station){
    	//当选中该站点时,得到该站点的水质类型配置
    	var dp = {id:station.stationId};
    	$http({  responseType:'json',
   		 method:'POST',
   		 url:'getWaterStandardConfigListByStationId.do',
   		 params:dp})
   		 .success(function(res){
   			 	maxLevel = res.length;
   			 	sclist = res;
   		 });
    	
    	if(stat!=null){ //将原来的选中的div恢复到初始状态
    		stat.style.backgroundColor = "#f5f5f5";
    	}
    	stat = document.getElementById(station.id);
    	if(stat!=null){ //将原来的选中的div恢复到初始状态
    		stat.style.backgroundColor = "#EAE7E7";
    	}
    	 coor = $scope.updateXY(station.longitude,station.latitude,'EPSG:4326', code);
    	 var view = map.getView();
 		 view.setCenter(coor);
    	
    	//stat.style.backgroundColor = "#e5f5ff";
    	 	$scope.showLastData(station);
    	 	//var lay = document.getElementById("stationLayers");
       		 //lay.style.display="block";
       		$(elementclick).popover('destroy');
     };
     
     //关闭站点详情列表
     $scope.closeStationLayers=function(){
    	 //关闭底部状态框
     	//closeLayer("stationLayers");
     	//关闭右侧实时数据框
     	closeLayer("databox");
     }
     
     
     //得到站点的实时数据
     $scope.showLastData=function(station){
    	 var sparams = {
    			 stationId:station.stationId
    	 }
    	 //$scope.showStatLine(station);
    		$http({  responseType:'json',
    			 method:'POST',
    			 url:'getDatas4Firstpage.do',
    			 params:sparams})
    			 .success(function(res){
    				 var lastData = res.Datas;
    				 //添加右侧实时数据展示页面
    				 var lastContent =  new Array();
    				 lastContent.push('<div class="hlx_sy_con_r">');
    				 lastContent.push('<div class="widget-title">');
    				 lastContent.push('<h5>');
    				 lastContent.push(station.title);
    				 lastContent.push('</h5>');
    				 lastContent.push('</div>');
    				 lastContent.push('<div class="hlx_sy_con_r_con">');
    				/* lastContent.push('<div class="hlx_sy_con_r_con_1"> ');
    				 lastContent.push('<div class="hlx_sy_con_r_con_1_img" >');
    				 lastContent.push('<img src="');
    				 lastContent.push(station.pic);
    				 lastContent.push('" class="">');
    				 lastContent.push('</div>');
    				 lastContent.push('<p>运行状态：正常</p>');
    				 lastContent.push('</div>');*/
    				 
    				 //处理水质等级部分
    				//开始处理水质等级部分
  					var waterStandard = res.waterStandard;
  					var srcpath = "page-images/watertype"+maxLevel+"/"+waterStandard.standard_grade+"grade.png";
  					$("#gradeImg").attr('src',srcpath);
 					$scope.stand = waterStandard;
 					 lastContent.push('<div align="center" style="margin-top: 15px;">');
 					 lastContent.push('<img alt="" width="80%" id="gradeImg" style="margin-top:10px;max-height:80px;text-align:center;" src="');
   				  	 lastContent.push(srcpath);
    				 lastContent.push('"/>');
    				 lastContent.push('<h4><span style="color: inherit;">首要污染因子(</span>');
    				 lastContent.push('<b style="color: inherit;"><i>');
    				 lastContent.push(waterStandard.indicatorName);
    				 lastContent.push('</i></b>');
    				 lastContent.push('<span style="color: inherit;">：</span><b style="color: inherit;">');
    				 lastContent.push('<i>');
    				 lastContent.push(waterStandard.sdata);
    				 lastContent.push(waterStandard.unit);
    				 lastContent.push('</i>');
    				 lastContent.push('</b>)');
    				 lastContent.push('</h4>');
    				 lastContent.push(' </div>');
    				 
    				 
    				 lastContent.push('<div class="hlx_sy_con_r_con_2">');
    				 for(var p in lastData){
    					 lastContent.push('<div class="hlx_sy_con_r_con_2_con">');
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
    						 lastContent.push('<span>'+(rdata[m].dataValue)+'</span>');
    						 lastContent.push('</td>');
    						 lastContent.push('</tr>');
    					 }
    					 lastContent.push('</table>');
    					 lastContent.push('</div>');
    				 }
    				 lastContent.push('</div>');
    				 lastContent.push('</div>');
    				 lastContent.push('</div>');
    				 
    				 $("#databox").html("");
  					 $("#databox").html(lastContent.join(""));
  					openLayer("databox");
    				 //开始处理实时滚动数据部分
    				 
 					
 					
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
	   $http({  responseType:'json',
			 method:'POST',
			 url:'getStationStatusList.do',
			 params:mData})
			 .success(function(stations){
				 if(stations!=null&&stations.length>0){
					 console.log(stations.length);
				 }
				 $scope.stations = stations;
				 coor = $scope.updateXY(stations[0].longitude,stations[0].latitude,'EPSG:4326', code);
				 var view = map.getView();
	 		     view.setCenter(coor);
				 map.removeLayer(vectorLayer);
				 var startMarkers = new Array();
				   angular.forEach(stations, function(station){
				    	 var startMarker = new ol.Feature({
				    		stationId:station.stationId,
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
							            anchor: [0.5, 46],
							           anchorXUnits: 'fraction',
							           anchorYUnits: 'pixels',
							            src: 'images/station/icon/'+feature.get('type')
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
							 $http({  responseType:'json',
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
	   var send = nowDate.getTime() - 1000*60*60*24*30;  //初始化结束时间为当前时间的一个月前
	   var sbegin = send - 1000*60*60*24*7; //初始化开始时间为结束时间的一周前
	   var kend = new Date(send);   //初始化的结束实际那
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
	   clearInterval(intervalId);
	   intervalId = setInterval(function() {
			var ybeginDate = new Date(begin);
			var yendDate = new Date(end);
			var ybegin = ybeginDate.getTime()+1000*60*60*24*7;
			var yend = yendDate.getTime()+1000*60*60*24*7;
			var ybeg = new Date(ybegin);
			var yen = new Date(yend);
			var ybyear = ybeg.getYear()+1900;
			var yeyear = yen.getYear()+1900;
			var ybmonth = ybeg.getMonth() + 1;
			var yemonth = yen.getMonth() + 1;
			var ybday = ybeg.getDate();
			var yeday = yen.getDate();
			if(ybmonth<10){
				ybmonth = '0'+ybmonth;
			}
			if(ybday<10){
				ybday = '0'+ybday;
			}
			if(yemonth<10){
				yemonth = '0'+yemonth;
			}
			if(yeday<10){
				yeday = '0'+yeday;
			}
			begin = ybyear+'-'+ybmonth+'-'+ybday;
			end = yeyear+'-'+yemonth+'-'+yeday;
			$scope.upd(station,begin,end);
			if(yen>nowDate){
				begin = yearb+'-'+monthb+'-'+dayb;
				end = yeare+'-'+monthe+'-'+daye;
			}
		}, "6000"); //每隔6s刷新数据  
   };
   
   
   //从后台读取折线图数据
   $scope.upd=function(station,beginDate,endDate){
	   var collectType = 3;
	   var sparams={
			   stationId:station.stationId,
				statType:3,
				beginDate:beginDate,
				endDate:endDate
		};
	   $http({  responseType:'json',
			 method:'POST',
			 url:'showStat4First.do',
			 params:sparams})
			 .success(function(res){
				 loadChart(res);
			 });
   };
});

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
	$("#container").html("");
	$('<div class="chart"  class="span10" style="height: 200px; margin: 0 auto">>')
    .appendTo('#container')
    .highcharts({
	    	 chart: {
	             type: 'spline',
	             animation: Highcharts.svg, // don't animate in old IE
	             marginRight: 10,
	             backgroundColor: '#F5F6F6',
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
				var result = "";
				for(var k=0;k<sclist.length;k++){
			 		var config = sclist[k];
			 		if(this.value==config.classId){
			 			result = config.className;
			 		}
			 	}
				return '' + this.x +
				'为<b>' + result + '</b><br/>首要污染物为因子<b>'+this.key+'</b>';
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

