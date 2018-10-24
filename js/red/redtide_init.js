var myApp = angular.module('myApp',['ngDialog','ui.bootstrap']); 
var station;  //当前展示的站点
var map;
var lay;
var coor;
var vectorLayer;
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
	
	//获得当前站点的水质等级配置
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
		 });
	//地图纠偏方法
	$scope.updateXY = function(X,Y,EPSGDATA,EXPGMAP){
		var before = ol.proj.transform([X,Y],EPSGDATA,EXPGMAP);
		var after = [before[0]+offsetX,before[1]+offsetY];
		return after;
	};
	
	//初始化查询参数中的开始时间,以及结束时间
	var nowDate = new Date();  //获取当前的时间
	//初始化开始时间和结束时间
	var oneMonth = nowDate.getTime() - 1000*60*60*24*30;  //初始化结束时间为当前时间的一个月前
	var koneMonth = new Date(oneMonth);   //初始化的结束实际那
	var yeare = koneMonth.getYear()+1900;
	var yearb = nowDate.getYear()+1900;
	var monthe = koneMonth.getMonth() + 1;
	var monthb = nowDate.getMonth() + 1;
	var daye = koneMonth.getDate();
	var dayb = nowDate.getDate();
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
	$scope.begin = yeare+'-'+monthe+'-'+daye;  //一个月以前,查询开始时间
	$scope.end = yearb+'-'+monthb+'-'+dayb;   //当前时间
	var collectType = 3;
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
	        layers: [tiled],
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
	    lay = document.getElementById("stationLayers");   //地图下方展示的实时数据,水质等级等
	};
	$scope.getMapConfig();
	$scope.updateStationStatus=function(){
		   //更新地图上站点的图标以及状态
		   var mData = {id:1};
		   $http({
				 method:'POST',
				 url:'getStationStatusList4Demain.do',
				 params:mData})
				 .success(function(stations){
					 if(stations==null||stations.length==0){
						 alert("权限内没有可展示的站点");
						 return;
					 }
					 station = stations[0];
					 $scope.stations = stations;
					 coor = $scope.updateXY(stations[0].longitude,stations[0].latitude,'EPSG:4326', code);
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
								 $http({
						 			 method:'POST',
						 			 url:'getStationStatusById.do',
						 			 params:spam})
						 			 .success(function(response){
						 				station=response;
						 				coor = $scope.updateXY(response.longitude,response.latitude,'EPSG:4326', code);
							 		    view.setCenter(coor);
						 				$scope.upd(response,$scope.begin,$scope.end);
						 			 })
						 			 
							} else {  //当点击地图的空白区域时,关闭所有弹出框
								$scope.closeStationLayers();
							}
						});
						map.addLayer(vectorLayer);  
						$scope.upd(station,$scope.begin,$scope.end);
				 });
		     
	   }
	 //关闭站点详情列表
    $scope.closeStationLayers=function(){
   	 
    	//关闭地图上展示的站点详细信息
     	$(element).popover('destroy');
    }
	//展示该站点的详细信息
	$scope.upd=function(station,beginDate,endDate){
		$scope.stations = station;
		var sparams={
		   stationId:station.id,
		   statType:collectType,
			beginDate:beginDate,
		   endDate:endDate
		};
		//查询该站点的实时数据
		$scope.showLastData(station);
		//查询该站点的海水浴场等级
		$scope.getBeachLevel(station);
		//查询该站点的水质统计
		$http({
			 method:'POST',
			 url:'showRedStat.do',
			 params:sparams})
			 .success(function(res){
				 loadPieChart(res);
			 });
		
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
						+'<td colspan="2" style="text-align:center;">站点状态</td>'
						+'</tr>'
						+'<tr>'
						+'<td class="firstTableTd">东经:'+(station.latitude).toFixed(5)+'°</td>'    
						+'<td class="firstTableTd">北纬:'+(station.longitude).toFixed(5)+'°</td>'
						+'</tr>'
						+'<tr >'
						+'<td class="firstTableTd">偏移</td>'
						+'<td class="firstTableTd">'+(station.distance).toFixed(2)+'米</td>'
						+'</tr>'
						+'</table>'
			});
			$(element).popover('show');
			map.addOverlay(popup);
	};
	//得到该浴场的海水浴场等级
	$scope.getBeachLevel=function(station){
		 var sparams = {
	   			 id:station.id
	   	 }
		 $http({
   			 method:'POST',
   			 url:'getRedDetailByStation.do',
   			 params:sparams})
   			 .success(function(res){
   				loadShanChart(res);
   			 });
	}
	//得到该站点的实时数据
	//得到站点的实时数据
    $scope.showLastData=function(station){
   	 var sparams = {
   			 stationId:station.id
   	 }
   		$http({
   			 method:'POST',
   			 url:'getDatas4Firstpage.do',
   			 params:sparams})
   			 .success(function(res){
   				 var lastData = res.Datas;
   				 //添加右侧实时数据展示页面
   				 var lastContent = new Array();
   				 lastContent.push('<div class="lastdata_in">');
   				 for(var p in lastData){
   					 lastContent.push('<div class="lastdata_in_con">');
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
   						 if(rdata[m].unitName==null||rdata[m].unitName.length<1){
   							 lastContent.push((rdata[m].mdata).toFixed(pointNum));
 							 }else{
 								lastContent.push('<span>'+(rdata[m].mdata).toFixed(pointNum)+'</span>('+rdata[m].unitName+')');
 							 }
   						 lastContent.push('</td>');
   						 lastContent.push('</tr>');
   					 }
   					 lastContent.push('</table>');
   					 lastContent.push('</div>');
   				 }
   				 lastContent.push('</div>');
   				 
   				 $("#lastbox").html("");
 			     $("#lastbox").html(lastContent.join(""));
   			 }); 
   	
    };
});

//展示扇形图
function loadShanChart(res){
	var chart = Highcharts.chart('shantainer', {
	    title: {
	        text: station.title+'当前赤潮监控区等级<br>'+res.title,
	        align: 'center',
	        verticalAlign: 'middle',
	        y: 70
	    },
	    //去掉版权
		credits:{
			enabled:false
		},
	    tooltip: {
	        headerFormat: '{series.name}<br>',
	        //pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
	        pointFormat: '{point.name}' 
	    },
	    plotOptions: {
	        pie: {
	            dataLabels: {
	                enabled: true,
	                distance: -50,
	                style: {
	                    fontWeight: 'bold',
	                    color: 'white',
	                    textShadow: '0px 1px 2px black'
	                }
	            },
	            startAngle: -90, // 圆环的开始角度
	            endAngle: 90,    // 圆环的结束角度
	            center: ['50%', '75%']
	        }
	    },
	    series: [{
	        type: 'pie',
	        name: '海水浴场等级',
	        innerSize: '50%',
	        data: res.datas
	    }]
	});
}

//生成水质统计饼形图
function loadPieChart(data){
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
		 		if(this.value==config.code){
		 			result = config.name;
		 		}
		 	}
			return '' + this.x +
			'为<b>' + this.key + '</b><br/>';
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
	$("#container").html("");
	$('<div class="chart"  class="span10" style="height: 35vh; margin: 0 auto">>')
    .appendTo('#container')
    .highcharts({
	    	 chart: {
	             type: 'spline',
	             animation: Highcharts.svg, // don't animate in old IE
	             marginRight: 10,
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