var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','ui.grid.edit','multi-select-tree','ui.grid.importer']); 
var selectNode = "";
var map;
var vectorLayer=null;
var vectorLayer1=null;
var vectorLayer2=null;
var vectorLayer3=null;
var vectorLayer4=null;
var num=0; //foreach循环记录次数
var isQuery;
var isOn=0;
var startDate;
var endDate;
var zTree;
var mzoom = 11;
var minz = 7;
var maxz = 15;
var url_i,format,version,tiled_i,styles_i,transparent,layers,code;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	getConfigure();
	$scope.n={};
	//展示出左侧的站点列表
	var t = $("#mtree");
		//读取组织树下的站点列表
		$.ajax({
	      url: 'getMovedStationTree.do', //url  action是方法的名称
	      data: "",
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	          //zNodes = data;
	      	t = $.fn.zTree.init(t, setting, data);
	      	zTree = $.fn.zTree.getZTreeObj("mtree");
	      	var first_id=data[0]["children"][0]["children"][0]["id"];
	      	zTree.selectNode(zTree.getNodeByParam("id", first_id));
	      	$scope.n.name=data[0]["children"][0]["children"][0]["name"];
			//zTree.selectNode(zTree.getNodeByParam("id", "${selected}"));
	      },
	      error: function(msg) {
	         
	      }
		});
		
		function beforeClick(treeId, treeNode, clickFlag) {
			if(treeNode.id.substring(0,1)!="S"){
				treeNode.click=false;
			}
			return (treeNode.click != false);
		}
		
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
					$scope.n.name=treeNode.name;
					selectNode = treeNode.id;
					$scope.query();
;					if(isQuery==1){
						map.removeLayer(vectorLayer1);
						map.removeLayer(vectorLayer2);
						map.removeLayer(vectorLayer3);
						map.removeLayer(vectorLayer4);
						isQuery=0;
					}
					
//					$scope.updateStationStatus();
			}
		};
		function getConfigure(){
			var mapData={};
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
				 showConfigure();
				 $scope.initDevice();
		     });
		};
		
		function showConfigure(){
			var baidu_layer = new ol.layer.Tile({
			    source: baidu_source
			});
			
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
		    })
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
			    target: 'map1',
			    layers: [tiled],
			    view: new ol.View({
			        center:  coor,
			        zoom:  mzoom ,
			        minZoom: minz,  
		            maxZoom: maxz  
			    })
			});
		}
		
		$scope.initDevice=function(){
		var stationParam = "";
		//初始化查询条件
		$http({  responseType:'json',	
			 method:'POST',
			 url:'trajectory_init.do',
			 params:stationParam})
			 .success(function(response){
				 $scope.u=response;
				 setTimeout(function (){
					 $scope.query(0);
					}, 100);
				 
//				 $scope.n.name=treeNode.name;
		     });
		};
		
		function ifBeginLaterEnd(startDate,endDate){
			endDate = endDate.replace(/-/g,"/");
			startDate = startDate.replace(/-/g,"/");
			var end = new Date(endDate);
			var start = new Date(startDate);
			if(start>=end){
				return true;
			}
			return false;
		}
		$scope.query = function(stationid){
			endDate = $('#endDate').val();
			startDate = $('#startDate').val();
			if(startDate==null||startDate==""){
				alert("开始时间为空");
				return;
			}else if(endDate==null||endDate==""){
				alert("结束时间为空");
				return;
			}else{
				if(ifBeginLaterEnd(startDate,endDate)){
					alert("开始时间要早于结束时间");
					return;
				}
			}
			if(selectNode==""){
				selectNode=stationid;
	    	}else if(selectNode.substring(0, 1)=="P"){  //当点击的是站点层级时
	    		return;
	    	}else if(selectNode.substring(0, 1)=="S"){  //当点击的是站点层级时
	    		selectNode=selectNode.substring(1,selectNode.length);
	    	}
			var queryParam = {
					startTime:$scope.u.beginDate,
					endTime:$scope.u.endDate,
					stationid:selectNode
			};
			map.removeLayer(vectorLayer1);
			map.removeLayer(vectorLayer2);
			map.removeLayer(vectorLayer3);
			map.removeLayer(vectorLayer4);
			$http({  responseType:'json',
				 method:'POST',
				 url:'getTrajectory.do',
				 params:queryParam}) 
				 .success(function(response){
					 map.removeLayer(vectorLayer);
					 if(response.length==1){
						 if(response[0]["isTra"]==1){
							 isOn=1;
							 $scope.updateStationStatus(isOn);
						 }else{
							 showEnd(response[0]["latitude"],response[0]["longitude"],response[0],1);
						 }
					 }else{
					 var points1 = [];
					 var points2 = [];
					 var features = new Array();
						 for(var i1=0,j=response.length;i1<j-1;i1++){
							 	points1=[[response[i1]["latitude"],response[i1]["longitude"]],[response[i1+1]["latitude"],response[i1+1]["longitude"]]];
							 	if(i1==response.length-2){//显示整个数据集最后一个坐标点
									showEnd(response[i1+1]["latitude"],response[i1+1]["longitude"],response[i1+1],1);
									map.setView(new ol.View({
										center:ol.proj.transform([response[i1+1]["latitude"],response[i1+1]["longitude"]], 'EPSG:4326', 'EPSG:3857'),
										zoom: 11,
										minZoom:minz,
										maxZoom:maxz
									}));
								}
							 for(var i=0,n=points1.length;i<n;i++){//坐标数据转换
									points2[i] = ol.proj.transform(points1[i], 'EPSG:4326', 'EPSG:3857');
								 };
						   			var feature1 = new ol.Feature({  
						   		     geometry: new ol.geom.LineString(points2,'XY'),});
						   			feature1.setStyle(new ol.style.Style({  
						   		        stroke: new ol.style.Stroke({
						   		               color:'#000000',
						   		               width:1
						   		              })
						   		        })); 
						   			features.push(feature1);
					 }
						 vectorLayer1 = new ol.layer.Vector({
						        source: new ol.source.Vector({
						          features: features
						        }),
				   			});
						 map.addLayer(vectorLayer1);
						 isQuery=1;
					 }
				 });
			
			$http({  responseType:'json',
				 method:'POST',
				 url:'getTrajectory_t.do',
				 params:queryParam}) 
				 .success(function(response){
					 map.removeLayer(vectorLayer);
					 if(response.length==1){
						 if(response[0]["isTra"]==1){
							 isOn=1;
							 $scope.updateStationStatus(isOn);
						 }else{
							 showEnd(response[0]["latitude"],response[0]["longitude"],response[0],2);
						 }
					 }else{
					 var points1 = [];
					 var points2 = [];
					 var features = new Array();
						 for(var i1=0,j=response.length;i1<j-1;i1++){
							 		points1=[[response[i1]["latitude"],response[i1]["longitude"]],[response[i1+1]["latitude"],response[i1+1]["longitude"]]];
							 	if(i1==response.length-2){//显示整个数据集最后一个坐标点
									showEnd(response[i1+1]["latitude"],response[i1+1]["longitude"],response[i1+1],2);
								}
							 for(var i=0,n=points1.length;i<n;i++){//坐标数据转换
									points2[i] = ol.proj.transform(points1[i], 'EPSG:4326', 'EPSG:3857');
								 };
						   			var feature1 = new ol.Feature({  
						   		     geometry: new ol.geom.LineString(points2,'XY'),});
						   			feature1.setStyle(new ol.style.Style({  
						   		        stroke: new ol.style.Stroke({
						   		        	lineDash:[1,2,3,4,5,6],
						   		               color:'#000000',
						   		               width:1
						   		              })
						   		        })); 
						   			features.push(feature1);
					 }
						 vectorLayer2 = new ol.layer.Vector({
						        source: new ol.source.Vector({
						          features: features
						        }),
				   			});
							map.addLayer(vectorLayer2);
						 isQuery=1;
					 }
				 });
					
		};
		//显示轨迹最后一个点的坐标
		function showEnd(lati,longi,tra,time){
			var startMarker1 = new ol.Feature({
	    		stationId:tra.stationid,
	 	        type: tra.icon,
	 	        rainfall: 500,
	 	        geometry: new ol.geom.Point(ol.proj.transform([lati,longi], 'EPSG:4326', 'EPSG:3857'))
	    	 });
			//判断是不是实际轨迹
			if(time==1){
			vectorLayer3 = new ol.layer.Vector({
		        source: new ol.source.Vector({
		          features: [startMarker1]
		        }),
		        style: function(feature) {
			        var icon1 = new ol.style.Style({
				          		image: new ol.style.Icon({
					            anchor: [0.5, 20],
					           anchorXUnits: 'fraction',
					           anchorYUnits: 'pixels',
					            src: 'images/station/icon/'+feature.get('type')
					          })
			        });
			        return icon1;
		        }
   			}); 
			map.addLayer(vectorLayer3);
			}else{
				vectorLayer4 = new ol.layer.Vector({
			        source: new ol.source.Vector({
			          features: [startMarker1]
			        }),
			        style: function(feature) {
				        var icon1 = new ol.style.Style({
					          		image: new ol.style.Icon({
						            anchor: [0.5, 20],
						           anchorXUnits: 'fraction',
						           anchorYUnits: 'pixels',
						            src: 'images/station/icon/'+feature.get('type')
						          })
				        });
				        return icon1;
			        }
	   			}); 
				map.addLayer(vectorLayer4);
			}
		};
		
		 //显示站点的实时坐标
	    $scope.updateStationStatus=function(isOnn){
	    	var sparam = "";
	    	sparam={stationid:selectNode,isOn:isOnn};
	    	$http({  responseType:'json',
	   		 method:'POST',
	   		 url:'getTrajectory.do',
	   		 params:sparam})
	   		 .success(function(stations){
	   			 map.removeLayer(vectorLayer);
	   			var startMarkers = new Array();
			    	 var startMarker = new ol.Feature({
			    		stationId:stations[stations.length-1]["stationId"],
			 	        type: stations[stations.length-1]["icon"],
			 	        rainfall: 500,
			 	        geometry: new ol.geom.Point(ol.proj.transform([stations[stations.length-1]["latitude"],stations[stations.length-1]["longitude"]], 'EPSG:4326', 'EPSG:3857'))
			      		//geometry: new ol.geom.Point([res.latitude,res.longitude])
			    	 });
			    		 map.setView(new ol.View({
								center:ol.proj.transform([stations[stations.length-1]["latitude"], stations[stations.length-1]["longitude"]], 'EPSG:4326', 'EPSG:3857'),
								zoom: 13,
								minZoom: minz,  
					            maxZoom: maxz  
							}));
			    	 startMarkers.push(startMarker);
	   		 
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
						            //	src: feature.get('type')
						          })
				        });
				        return icon;
			        }
	   			}); 
				map.addLayer(vectorLayer);
				isOn=0;
	   		 });
	    	
	    };
	    
	    var setting = { 
				view: {
					showIcon:showIconForTree
				},
				check: {
					enable: false
				},
				callback: {
					beforeClick: beforeClick,
					onClick: zTreeOnClick
				}
		    };
	
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		//展示地图数据的底层
		
		$scope.import = function(){
	    	$scope.showEdit();
	    	
	    };
		//导入文件编辑框
		$scope.showEdit = function(){
	    	var modalInstance = $modal.open({  
	            templateUrl: 'popupTmpl.html',  
	            controller: ModalInstanceCtrl
	        });  
	    	modalInstance.opened.then(function(){//模态窗口打开之后执行的函数  
	            console.log('modal is opened');  
	        });  
	        modalInstance.result.then(function (result) { 
	        	 alert(result);
	        	 $scope.query();
	        }, function (reason) {  
	            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
	        });
	    };
	    
	    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,ngDialog,$modal) {
	    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
	    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	    	
	    	$scope.data=[];
	    	
			$scope.gridOptions = {
					enableRowSelection:true,
					rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
					appScopeProvider: { 
				          onDblClick : function(row) {
				        	 
				          }
				    },
				    multiSelect:false,	
				    modifierKeysToMultiSelect :false,
				    noUnselect:true,
				    enableRowSelection: true,
				    enableRowHeaderSelection:false,
				    headerRowHeight: 50,
				    paginationPageSizes: [25, 50, 100],
					paginationPageSize: 25,
					enableColumnResizing:true,
				    enableGridMenu: true,
				    enableSelectAll: true,
				    exporterCsvFilename: '综合查询',
				    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
				    data: 'data',
				    importerDataAddCallback: function ( grid, newObjects ) {
				        $scope.data = $scope.data.concat( newObjects );
				    },
				    onRegisterApi: function(gridApi){
				      $scope.gridApi = gridApi;
				    }
				  };
			
			var needs=[{name:"stationid",type:"number"},
				          {name:"time",type:"string"},
				          {name:"latitude",type:"number"},
				          {name:"deep",type:"number"},
				          {name:"longitude",type:"number"}];
			//保存表单信息
			$scope.save = function(){
				if($scope.data==""||$scope.data==null){
					alert("请导入csv文件");
					return;
				}
				var ifright = 1;
				var columnDefs = $scope.gridOptions.columnDefs;
				if(checkDate($scope.data)){
				angular.forEach(needs,function(need){
					var ifhave = 0;
					angular.forEach(columnDefs,function(col){
						if(col.name==need.name){
							ifhave = 1;
						}
					});
					if(ifhave==0){
						ifright = 0;
						return;
					}
				});
				if(ifright==0){
					alert("文件中缺少元素");
					return;
				}
				
				var param = {
						importString:$scope.data
				};
				$http({  responseType:'json',
					 method:'POST',
					 url:'saveImportCsvData.do',
					 params:param}) 
					 .success(function(response){
						 console.log(response);
						 $modalInstance.close(response);
				 });
				}else{
					return;
				}
			};
	    };
	    
	    function checkDate(date){
	    	var dateStandard=/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/; 
	    	var nowDate=new Date();
	    	var flag = true;
	    	for(var i = 0,j=date.length;i<j;i++){
	    		var csvDate = new Date(date[i]["time"]);
	    		if(!dateStandard.test(date[i]["time"])){
	    			alert("日期数据第"+(i+1)+"行格式错误");
	    			flag = false;
	    			return flag;
	    		}else if(csvDate<nowDate){
	    			alert("日期数据第"+(i+1)+"行数据错误");
	    			flag = false;
	    			return flag;
	    		}else{
	    			
	    		}
	    	}
	    	return flag
	    }
		
//	    $scope.updateStationStatus();
});