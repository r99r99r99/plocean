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
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	//初始化查询集合
	$scope.u = {};
	
	//初始化站点列表以及查询时间
	var sData = "";
	$http({
		 method:'POST',
		 url:'initMainEditInfo.do',
		 params:sData})
		 .success(function(response){
			 $scope.stationList = response.stations;
			 $scope.stationList.unshift({id:0,title:'全部站点'});
			 $scope.u.stationId = $scope.stationList[0].id;
			 $scope.u.beginTime = response.beginTime;
			 $scope.u.endTime = response.endTime;
			 $scope.changeStation();
	});
	//根据站点列表查询出设备列表
	$scope.changeStation=function(){
		var sData = {
			id:$scope.u.stationId	
		};
		$http({
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
		$http({
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
    $scope.query=function(){
    	$(".scbtn").attr('disabled',"true");
    	var beginTime = document.getElementById("beginTime").value;
    	var endTime = document.getElementById("endTime").value;
    	$scope.u.beginTime= beginTime;
    	$scope.u.endTime = endTime;
    	console.log($scope.u);
    	var pData = $scope.u; 
    	$http({
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
	$scope.query();
	    
   $scope.addMain=function(){
	   station = $scope.u;
	   mtype = 1;
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
    	$scope.m=station;
    	$scope.m.mtype=mtype;
    	
    	if(mtype==2){ //如果是修改时,将站点,设备,维护类型改为不可修改
    		//disabled="true"
    		$scope.m.dis=true;
    		//根据ID更新该维护信息的图片信息
    		var sData = {
    				id:station.id
    		};
    		$http({
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
    	$http({
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
    			$http({
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
    		$http({
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
    	$http({
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
    	
    };  
});

