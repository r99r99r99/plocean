jQuery(function($) {
				$('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
					$(this).prev().focus();
				});
			});

var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 

var row;
var col;
var station;
var mtype;
var stationid;
var stationname;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	//初始化查询集合
	$scope.u = {};
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
	    	console.log(data);
	    	var stationname = data[0].children[0].children[0].id;
	    	$scope.u.stationId = stationname.substring(1,stationname.length);
	    	$scope.u.stationName = data[0].children[0].children[0].name;
	      	t = $.fn.zTree.init(t, setting, data);
	      	var zTree = $.fn.zTree.getZTreeObj("mtree");
	      	zTree.selectNode(zTree.getNodeByParam("id", stationname));
			//zTree.selectNode(zTree.getNodeByParam("id", "${selected}"));
	      	$scope.updateStationStatus();
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
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					$scope.u.stationId = selectNode.substring(1,selectNode.length);
					$scope.u.stationName = treeNode.name;
					$scope.updateStationStatus();
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
					beforeClick: beforeClick,
					onClick: zTreeOnClick
				}
		    };
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		//点击的时候判断是否是站点层级,
		function beforeClick(treeId, treeNode, clickFlag) {
			var tid = treeNode.id;
			if(tid.substring(0,1)!='S'){
				treeNode.click=false;
			}
			return (treeNode.click != false);
		}
	
	
	$scope.updateStationStatus=function(){
		//根据选中的站点,获得该站点的设备的列表
		$scope.changeStation();
		
	}
	
	
	//初始化查询时间
	var sData = "";
	$http({  responseType:'json',
		 method:'POST',
		 url:'initMainEditInfo.do',
		 params:sData})
		 .success(function(response){
			 $scope.u.beginTime = response.beginTime;
			 $scope.u.endTime = response.endTime;
	});
	//根据站点列表查询出设备列表
	$scope.changeStation=function(){
		var sData = {
			id:$scope.u.stationId	
		};
		$http({  responseType:'json',
			 method:'POST',
			 url:'getDevices4Station.do',
			 params:sData})
			 .success(function(response){
				 $scope.deviceList = response;
				 $scope.deviceList.unshift({id:0,name:'全部设备'});
				 $scope.u.deviceId = $scope.deviceList[0].id;
				 $scope.changeDevice();
		});
	};
	//根据站点和设备查询出有效的例行维护列表
	$scope.changeDevice=function(){
		
		var aData = {
				stationId:$scope.u.stationId,
				deviceId:$scope.u.deviceId
		};
		$http({  responseType:'json',
			 method:'POST',
			 url:'getAiotMainConfigListByStationDevice.do',
			 params:aData})
			 .success(function(response){
				 $scope.configList = response;
				 $scope.configList.unshift({id:0,name:'全部配置'});
				 $scope.u.configId = $scope.configList[0].id;
				 $scope.query();
		});
	};
	
	//开始分页信息
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
		        	 mtype = 2;
		          	 station = row.entity;
		          	 $scope.showEdit();
		          	 
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
		    exporterCsvFilename: '站点配置',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  station = row.entity;
		      });
		    }
		  };
	//分页信息结束
	
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
	
    $scope.query=function(){
//    	$(".scbtn").attr('disabled',"true");
    	var beginTime = document.getElementById("beginTime").value;
    	var endTime = document.getElementById("endTime").value;
    	
    	if(beginTime==null||beginTime==""){
			alert("开始时间为空");
			return;
		}else if(endTime==null||endTime==""){
			alert("结束时间为空");
			return;
		}else{
			if(ifBeginLaterEnd(beginTime,endTime)){
				alert("开始时间要早于结束时间");
				return;
			}
		}
    	
    	$scope.u.beginTime= beginTime;
    	$scope.u.endTime = endTime;
    	var pData = $scope.u; 
    	$http({  responseType:'json',
    		 method:'POST',
			 url:'showMainEditList.do',
			 params:pData})
			 .success(function(response){
				 $(".scbtn").removeAttr("disabled"); 
				  row = response.rows;
				  col = response.cols;
				  $scope.gridOptions.columnDefs = col;
				  $scope.gridOptions.data = row;
    	     });
    };
	    
   $scope.addMain=function(){
	   mtype = 1;
	   stationid = $scope.u.stationId;
	   stationname = $scope.u.stationName;
	   $scope.showEdit();
   };
    
    //弹出编辑框
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
             console.log(result);  
        }, function (reason) {  
            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
        });
      
    };
    
    //弹出页面打开后的操作
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,ngDialog) {
    	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	$scope.m={};
    	if(mtype==2){
    		$scope.m=station;
    	}else{
    		$scope.m.stationId=stationid;
    		$scope.m.stationName=stationname;
    	}
    	$scope.m.mtype=mtype;
    	
    	if(mtype==2){ //如果是修改时,将站点,设备,维护类型改为不可修改
    		//disabled="true"
    		$scope.m.dis=true;
    		//根据ID更新该维护信息的图片信息
    		var sData = {
    				id:station.id
    		};
    		$http({  responseType:'json',
       		 method:'POST',
       		 url:'getMainFilesByMainId.do',
       		 params:sData})
       		 .success(function(response){
       			 console.log(response);
       			 //开始展现图片信息
       			var picContent = new Array();
       			var pics = response;
       			$scope.pics = pics;
       		 });
    	}else{
    		$scope.m.dis=false;
    	}
    	
    	//初始化弹出页面的站点列表
    	var sData = "";
    	$http({  responseType:'json',
    		 method:'POST',
    		 url:'getStationByUser.do',
    		 params:sData})
    		 .success(function(response){
    			 $scope.mstationList = response;
    			 if(mtype==1){
    				 if($scope.mstationList.length>0){
    					 $scope.m.stationId = $scope.mstationList[0].id;
    				 }else{
    					 $scope.m.stationId = 0;
    				 }
    			 }
    			 $scope.mchangeStation();
    	});
    	$scope.mchangeStation=function(){
    		var sData = {
    				id:$scope.m.stationId	
    			};
    			$http({  responseType:'json',
    				 method:'POST',
    				 url:'getDevices4Station.do',
    				 params:sData})
    				 .success(function(response){
    					 $scope.mdeviceList = response;
    					 if(mtype==1){
    						 if($scope.mdeviceList.length>0){
    							 $scope.m.deviceId = $scope.mdeviceList[0].id;
    						 }else{
    							 $scope.m.deviceId = 0;
    						 }
    					 }
    					 $scope.mchangeDevice();
    			});
    	};
    	$scope.mchangeDevice=function(){
    		var aData = {
    				stationId:$scope.m.stationId,
    				deviceId:$scope.m.deviceId
    		};
    		$http({  responseType:'json',
    			 method:'POST',
    			 url:'getAiotMainConfigListByStationDevice.do',
    			 params:aData})
    			 .success(function(response){
    				 $scope.mconfigList = response;
    				 if(mtype==1){
    					 if($scope.mconfigList.length>0){
    						 $scope.m.configId = $scope.mconfigList[0].id;
    					 }else{
    						 $scope.m.configId = 0;
    					 }
    				 }
    		});
    	};
    	
    	//得到维护状态列表
    	var pdata = {
    			parentCode:'0014'
    	};
    	$http({  responseType:'json',
			 method:'POST',
			 url:'getPublicList.do',
			 params:pdata})
			 .success(function(response){
				 $scope.stateList = response;
				 if(mtype==1){
					 if($scope.stateList.length>0){
						 $scope.m.state = $scope.stateList[0].classId;
					 }else{
						 $scope.m.state = 0;
					 }
				 }
		});
    	
    	//执行保存操作
    	$scope.save=function(){
    		var beginTime = document.getElementById("mbeginTime").value;
    		if(beginTime==null||beginTime.length<1){
    			alert("请选择开始时间");
    			return ;
    		}
    		var endTime = document.getElementById("mendTime").value;
    		if(endTime==null||endTime.length<1){
    			alert("请选择结束时间(预计)");
    			return;
    		}
    		$scope.m.beginTime = beginTime;
    		$scope.m.endTime = endTime;
    		 //获取file的全部id  
            var uplist = $("input[name^=uploads]");  
            var arrId = [];  
            for (var i=0; i< uplist.length; i++){  
	            if(uplist[i].value){  
	                arrId[i] = uplist[i].id;  
	            }  
            }  
    		var data = $scope.m;
    		console.log(data);
    		return;
    		$.ajaxFileUpload({
    		    url : 'saveMainEditInfo.do',
    		    secureuri : false,
    		    data : data,//需要传递的数据 json格式
    		    fileElementId :arrId,
    		    dataType : 'text',
    		    success : function(response) {
    		           //上传成功后的回调。
    		    	 $modalInstance.close("新增成功");
    		    },
    		    error : function(response) {
    		    	$modalInstance.close("新增失败");
    		    }
    		});
    	};
    };  
});

