var myApp = angular.module('myApp',['ngDialog','ui.bootstrap']); 
var selectNode = "";
var map;
var popup;
var popupclick;
var element;
var elementclick;
var intervalId ;
var stationintervalId ;
var vectorLayer=null;
var stat;
var lay;
var num=0; //foreach循环记录次数
var click=0;
var mzoom = 11;
var newIcon;

var minz = 11;
var maxz = 15;

var LIONvector;
var url_i,format,version,tiled_i,styles_i,transparent,layers,code;

var nowDate = new Date();
//得到三个月前的时间
var ubeginDate = new Date(nowDate.getTime()-1000*60*60*24*30);
var uendDate = new Date(nowDate.getTime()+1000*60*60*24*1);
var ueyear = uendDate.getYear() + 1900;
var uemonth = uendDate.getMonth() +1 ;
var ueday = uendDate.getDate();
if(uemonth<10){
	uemonth = "0"+uemonth;
}
if(ueday<10){
	ueday = "0"+ueday;
}
var uendTime = ueyear +"-"+uemonth+"-"+ueday;

var ubyear = ubeginDate.getYear() + 1900;
var ubmonth = ubeginDate.getMonth() +1 ;
var ubday = ubeginDate.getDate();
if(ubmonth<10){
	ubmonth = "0"+ubmonth;
}
if(ubday<10){
	ubday = "0"+ubday;
}
var ubeginTime = ubyear +"-"+ubmonth+"-"+ubday;

myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	getConfigure();
	//展示出左侧的站点列表
	var t = $("#mtree");
		//读取组织树下的站点列表
		
		$.ajax({
	      url: 'getPlatformStationTree.do', //url  action是方法的名称
	      data: '',
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	          //zNodes = data;
	      	t = $.fn.zTree.init(t, setting, data);
	      	var zTree = $.fn.zTree.getZTreeObj("mtree");
	      	console.log(data);
			//zTree.selectNode(zTree.getNodeByParam("id", "${selected}"));
//	      	$scope.date();
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			$scope.n={};
			if(treeNode.id!=null){
			$scope.n.name=treeNode.name;
			var databox=document.getElementById("databox");
			selectNode = treeNode.id;
			if(selectNode==""){
	    		//获取所有站点的状态数据
	    	}else if(selectNode.substring(0, 1)=="P"){
	    		if(databox.style.display=="block"){
	    			databox.style.display="none";
	    		}
	    		 map.removeLayer(LIONvector);
	    		$scope.updateStationStatus();
	    	}else if(selectNode.substring(0, 1)=="S"){  //当点击的是站点层级时
	    		databox.style.display="block";
	    		var stationid = selectNode.substring(1,selectNode.length);
	    		$scope.showStationDetail(stationid);
	    		$scope.updateStationStatus();
	    		//当点击的是站点层级时,展示当前站点的运行轨迹
	    		map.removeLayer(LIONvector);
	    		$scope.showStationTrajectory(stationid);
	    	}
				
			}
		};
		var setting = { 
				view: {
					showIcon:showIconForTree
				},
				check: {
					enable: false
				},
				callback: {
					onClick: zTreeOnClick
				}
		    };
	
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		
		function getConfigure(){
			var mapData={};
		$http({
			 method:'POST',
			 url:'getMapConfigure.do',
			 params:mapData})
			 .success(function(response){
				 
				 console.log(response);
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
				 console.log(url_i);
				 console.log(layers);
				 showConfigure();
		     });
		};
		
		function showConfigure(){
			var coor = ol.proj.transform([109.348495, 18.070803], 'EPSG:4326', 'EPSG:3857');  
			var projection = new ol.proj.Projection({
				code: code,
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
			var baidu_source = new ol.source.TileImage({
			    projection: projection,
			    tileGrid: tilegrid,
			    tileUrlFunction: function(tileCoord, pixelRatio, proj){
			        if(!tileCoord){
			            return "";
			        }
			        var z = tileCoord[0];
			        var x = tileCoord[1];
			        var y = tileCoord[2];

			        if(x<0){
			            x = "M"+(-x);
			        }
			        if(y<0){
			            y = "M"+(-y);
			        }

			        return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20151021&scaler=1&p=1";
			    }
			});
			var baidu_layer = new ol.layer.Tile({
			    source: baidu_source
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
			    coordinateFormat: ol.coordinate.createStringXY(5),
			    undefinedHTML: '&nbsp;'
			  });
			map = new ol.Map({
				controls: ol.control.defaults({
			           attribution: false
			         }).extend([mousePositionControl]),
			    target: 'map',
			    layers: [baidu_layer],
			    view: new ol.View({
			        center:  coor,
			        zoom: mzoom,  
		            minZoom: minz,  
		            maxZoom: maxz  
			    })
			});
		}
		
	
	//展示出站点的列表
	$scope.showlayersControl=function(){
   	 var lay = document.getElementById("layersControl");
   	 var lo=document.getElementById("location");
   	 if(lay.style.display=="block"){
   		 lay.style.display="none";
   		 lo.className="location1";
   	 }else{
   		 lay.style.display="block";
   		 lo.className="location2";
   	 }
    };
    //读取相应层级下的站点的数据
    //当 selectNode 为空时,显示所有站点的状态
    //当 selectNode 选中的是平台是,显示平台下所有站点的状态
    //当 selectNode 选中的是站点时,显示该站点的状态
    $scope.updateStationStatus=function(){
    	
    	var sparam = "";
    	if(selectNode==""){
    		//获取所有站点的状态数据
    	}else if(selectNode.substring(0, 1)=="P"){  //当点击的是站点层级时
    		sparam={platformId:selectNode.substring(1, selectNode.length)};
    	}else if(selectNode.substring(0, 1)=="S"){  //当点击的是站点层级时
    		sparam={id:selectNode.substring(1, selectNode.length)};
    	}
    	$http({
   		 method:'POST',
   		 url:'getStationStatus.do',
   		 params:sparam})
   		 .success(function(stations){
   			 map.removeLayer(vectorLayer);
   			var startMarkers = new Array();
   			angular.forEach(stations, function(station){
		    	 var startMarker = new ol.Feature({
		    		stationId:station.id,
		 	        type: station.icon,
		 	       population: 4000,
			        rainfall: 500,
		 	        geometry: new ol.geom.Point(ol.proj.transform([station.longitude,station.latitude], 'EPSG:4326', 'EPSG:3857'))
		      		//geometry: new ol.geom.Point([res.latitude,res.longitude])
		    	 });
		    	 if(selectNode.substring(0, 1)=="P"&&num<1){
		    		 map.setView(new ol.View({
							center:ol.proj.transform([stations[0]["longitude"], stations[0]["latitude"]], 'EPSG:4326', 'EPSG:3857'),
							zoom: mzoom,
							 minZoom: minz,  
					            maxZoom: maxz  
						}));
		    		 num++;
		    	 }else{
		    		 map.setView(new ol.View({
							center:ol.proj.transform([station.longitude, station.latitude], 'EPSG:4326', 'EPSG:3857'),
							zoom: mzoom,
							/////////////////
							 minZoom: minz,  
					            maxZoom: maxz  
						}));
		    	 }
		    	 startMarkers.push(startMarker);
		     });
   			
   			vectorLayer = new ol.layer.Vector({
		        source: new ol.source.Vector({
		          features: startMarkers
		        }),
		        style: function(feature) {
			        var icon = 	 new ol.style.Style({
				          		image: new ol.style.Icon({
				          		anchor: [0.5, 0.8],
					            src: 'images/station/icon/'+feature.get('type')
//					            	src: feature.get('type')
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
					var databox = document.getElementById("databox");
					databox.style.display="block";
					//获得点击的站点的id
						$scope.showStationDetail(feature.H.stationId,1);
				} else {  //当点击地图的空白区域时,关闭所有弹出框
					$scope.closeAllLayer();
				}
			});
			map.addLayer(vectorLayer); 
   		 });
    	
    }
    $scope.updateStationStatus();
    
    
    //关闭所有的展示图层
    $scope.closeAllLayer=function(){
    	var ai = document.getElementById("databox");
    	$('#databox').fadeOut(1000);

    };
    //展示当前站点的运行轨迹
    $scope.showStationTrajectory=function(stationId){
    	var queryParam = {
				startTime:ubeginTime,
				endTime:uendTime,
				stationid:stationId
		};
    	$http({
			 method:'POST',
			 url:'getTrajectory.do',
			 params:queryParam}) 
			 .success(function(response){
				 var ismove = false;
				 if(response.length>1){
					 ismove = true;
				 }
				 var coords = new Array();
				 var features = new Array();
				 //遍历轨迹坐标集合
				 for(var i=0;i<response.length;i++){
					 var point=response[i];
					 var coord = ol.proj.transform([point.longitude, point.latitude], 'EPSG:4326', 'EPSG:3857'); 
					 coords.push(coord);
					 if(ismove){
						 var poi = ol.proj.transform([point.longitude, point.latitude], 'EPSG:4326', 'EPSG:3857'); 
						 var pathFeature = new ol.Feature({//终点
						        geometry: new ol.geom.Point(poi),
						        population: 4000,
						        rainfall: 500
						  });
						 pathFeature.setStyle(pathStyle);
						 
						 features.push(pathFeature);
					 }
				 }
				 var lionfeature = new ol.Feature({    
		                geometry:new ol.geom.LineString(coords)  
		            });  
				 lionfeature.setStyle(new ol.style.Style({  
		   		        stroke: new ol.style.Stroke({
		   		               color:'#FFFFFF',
		   		               width:2
		   		              })
		   		        })); 
				 features.push(lionfeature);
				 LIONvector = new ol.layer.Vector({  
			            source:  new ol.source.Vector({
					          features: features
				        }),
			        });  
				 map.addLayer(LIONvector);
			 });
    };
    var pathStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
           // src: 'https://openlayers.org/en/v4.5.0/examples/data/icon.png',
            src: 'images/station/pathicon.png',
            anchor: [0.5, 0.8],
        }))
    });
    
    $scope.showStationDetail=function(stationId,clicks){
    	//通过站点ID,获得站点通讯的详细信息
    	var param = {stationId:stationId};
    	 $http({
 			 method:'POST',
 			 url:'showStationStatusByStationId.do',
 			 params:param})
 			 .success(function(response){
 				 var station = response.stationStatus;
 				 console.log(response);
 				//显示 站点详情信息
 		    	var stationDetail = document.getElementById("databox");
 		    	
 		    	var airContent = new Array();
 		    	var acon = new Array();
 		    	acon.push(' <div id="right_div1" class="right_div1">');
 		    	acon.push(' <div class="right_indiv1"><span>');
 		    	acon.push(station.collectTime);//
 		    	acon.push(' </span></div>');
 		    	acon.push(' <div style="float:left;color:#fff;font-size:14px;height:30px;width:70px;padding-top:12px;padding-left:50px"><span>');
 		    	acon.push(station.station.title);
 		    	acon.push(' </span></div>');
 		    	acon.push(' <div>');
 		    	acon.push(' <div style="padding-top:15px;width:100px;">');
 		    	acon.push(' <div style="padding-left:50px;padding-top:36px;"><span style="font-size:16px;color:#fff">');
 		    	acon.push(station.stationStatus);//
 		    	acon.push(' </span></div>');
 		    	acon.push(' <div style="padding-top:5px;padding-left:40px;"><span style="font-size:12px;color:#fff">系统状态</span></div>');
 		    	acon.push(' </div>');
 		    	acon.push(' <div class="right_indiv3"></div>');
 		    	acon.push(' <div style="padding-top:16px;width:50px;height:50px;left:245px;position:absolute;top:35px;">');
 		    	acon.push(' <div style="padding-left:15px"><span style="font-size:18px;font-weight:bold;color:#fff">');
 		    	acon.push(station.rcxj);//
 		    	acon.push(' </span></div>');
 		    	acon.push(' <div style="padding-top:5px;"><span style="font-size:12px;color:#fff;">日常巡检</span></div>');
 		    	acon.push(' </div>');
 		    	acon.push(' </div>');
 		    	acon.push(' </div>');
 		    	
 		    	acon.push(' <div id="right_div2" class="right_div2">');
 		    	acon.push(' <div style="padding-top:20px;padding-left:30px;position:absolute;">');
 		    	acon.push(' <div style="padding-left:5px;"><span style="color:#fff;">运转率</span></div>');
 		    	acon.push(' <div style="padding-top:5px;"><span style="font-size:26px;color:#fff;">');
 		    	acon.push(station.yzl);//
 		    	acon.push(' </span></div>');
 		    	acon.push(' </div>');
 		    	acon.push(' <div style="position:relative;width:100px;height:70px;left:235px;top:10px;">');
 		    	acon.push(' <img src="yantai/images/tubiao1.png" />');
 		    	acon.push(' </div>');
 		    	acon.push(' </div>');
 		    	/*
 		    	
 		    	airContent.push(' <div id="right_div3" class="right_div3">');
 		    	airContent.push(' <div style="padding-top:20px;padding-left:30px;">');
 		    	airContent.push(' <div style="padding-left:5px;"><span style="color:#fff;">传输率</span></div>');
 		    	airContent.push(' <div style="padding-top:5px;"><span style="font-size:26px;color:#fff;">');
 		    	airContent.push(station.csl);//
 		    	airContent.push(' </span></div>');
 		    	airContent.push(' </div>');
 		    	airContent.push(' <div style="position:relative;width:100px;height:70px;left:163px;top:-60px;">');
 		    	airContent.push(' <img src="yantai/images/tubiao2.png" />');
 		    	airContent.push(' </div>');
 		    	airContent.push(' </div>');*/
 		    	/*airContent.push(' <div id="right_div4" class="right_div4">');
 		    	airContent.push(' <div style="width:240px;height:22px;background:#cf0b23;">');
 		    	airContent.push(' <div style="padding-left:10px;padding-top:2px;"><span style="color:#fff;">待办事项</span></div>');
 		    	airContent.push(' </div>');
 		    	airContent.push(' <div style="height:69px;width:120px;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;float:left;">');
 		    	airContent.push(' <div style="padding-left:33px;padding-top:15px;color:#8c8c8c;"><span>设备报警</span></div>');
 		    	airContent.push(' <div style="padding-left:57px;padding-top:5px;color:#8c8c8c;"><span>');
 		    	airContent.push(station.sbbj);//设备报警
 		    	airContent.push(' </span></div>');
 		    	airContent.push(' </div>');
 		    	airContent.push(' <div style="height:69px;width:120px;border-right:1px solid #dddddd;float:left;">');
 		    	airContent.push(' <div style="padding-left:33px;padding-top:15px;color:#8c8c8c;"><span>报备处理</span></div>');
 		    	airContent.push(' <div style="padding-left:57px;padding-top:5px;color:#8c8c8c;"><span>');
 		    	airContent.push(station.bbcl);
 		    	airContent.push(' </div>');
 		    	airContent.push(' </div>');
 		    	airContent.push(' <div style="height:69px;width:120px;border-bottom:1px solid #dddddd;position:relative;left:120px;">');
 		    	airContent.push(' <div style="padding-left:33px;padding-top:15px;color:#8c8c8c;position:relative;top:-124px;"><span>运维任务</span></div>');
 		    	airContent.push(' <div style="padding-left:57px;padding-top:5px;color:#8c8c8c;position:relative;top:-124px;"><span>');
 		    	airContent.push(station.ywrw);//运维任务
 		    	airContent.push(' </span></div>');
 		    	airContent.push(' </div>');
 		    	airContent.push(' <div style="height:69px;width:120px;postion:relative;left:120px;">');
 		    	airContent.push(' </div>');
 		    	airContent.push(' </div>');*/
 		    	
 		    	
 		    	var lastData = response.Datas;
 		    	/*airContent.push(' <div id="right_div4" class="right_div4">');
				airContent.push('<div id="up_zzjs">');
				airContent.push('<div id="marqueebox">');*/
				airContent.push('<table class="table table-striped table-bordered table-hover">');
				for(var p in lastData){
					var rdata = lastData[p].MetaDatas;
					var pointNum = lastData[p].pointNum;
					for(var m in rdata){
						airContent.push('<tr>');
						/*airContent.push('<td style="width:25%">');
						airContent.push(lastData[p].deviceName);
						airContent.push('</td>');*/
						airContent.push('<td style="width:35%">');
						airContent.push(rdata[m].indicatorTitle);
						airContent.push('</td>');
						airContent.push('<td style="width:40%">');
						airContent.push(lastData[p].lastTime);
						airContent.push('</td>');
						airContent.push('<td style="width:25%">');
						if(rdata[m].unitName.length<1){
							if(rdata[m].mdata<=0){
								airContent.push('-');
							}else{
								airContent.push((rdata[m].mdata).toFixed(pointNum));
							}
						}else{
							if(rdata[m].mdata<=0){
								airContent.push('-');
							}else{
								airContent.push('<span>'+(rdata[m].mdata).toFixed(pointNum)+'</span>('+rdata[m].unitName+')');
							}
						}
						airContent.push('</td>');
						airContent.push('</td>');
						
					}
				}
				airContent.push('</table>');
				/*airContent.push('</div>');
				airContent.push('</div>');
				airContent.push('</div>');*/
				$("#a1").html("");
 				$("#a1").html(acon.join(""));
 				
 		    	$("#marqueebox").html("");
 				$("#marqueebox").html(airContent.join(""));
 					$('#marqueebox').fadeOut(500);
 					setTimeout(function (){
 						$("#marqueebox").fadeIn(500);
 					}, 600);
 			 })
    }
    
});


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
startmarquee(20,20,1500);
