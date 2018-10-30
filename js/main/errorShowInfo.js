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
	
	//得到维护状态列表
	var pdata = {
			parentCode:'0016'
	};
	$http({  responseType:'json',
		 method:'POST',
		 url:'getPublicList.do',
		 params:pdata})
		 .success(function(response){
			 $scope.stateList = response;
			 $scope.stateList.unshift({classId:0,value:'全部'});
			 $scope.u.state = $scope.stateList[0].classId;
	});
	
	//初始化站点列表以及查询时间
	var sData = "";
	$http({  responseType:'json',
		 method:'POST',
		 url:'init_errorEdit.do',
		 params:sData})
		 .success(function(response){
			 $scope.stationList = response.stations;
			 $scope.stationList.unshift({id:0,title:'全部站点'});
			 $scope.u.stationId = $scope.stationList[0].id;
			 $scope.u.beginTime = response.beginTime;
			 $scope.u.endTime = response.endTime;
			 $scope.query();
	});
	
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
    	var pData = $scope.u; 
    	$http({  responseType:'json',
    		 method:'POST',
			 url:'showErrorEditList.do',
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
    	if(mtype==2){
    		$scope.m=station;
    	}else{
    		$scope.m={};
    	}
    	$scope.m.mtype=mtype;
    	
    	if(mtype==2){ //如果是修改时,将站点,改为不可修改
    		$scope.m.dis=true;
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
    			 $scope.getDeviceList();
    	});
    	//得到维护状态列表
    	var pdata = {
    			parentCode:'0016'
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
    	$scope.getDeviceList=function(){
    		var statpam ;
    		if(mtype==1){
    			statpam = {
    					stationId:$scope.m.stationId,
    					id:0
    			};
    		}else{
    			statpam = {
    					stationId:$scope.m.stationId,
    					id:$scope.m.id
    			};
    		}
    		$http({  responseType:'json',
    			method:'POST',
    			url:'getDeviceList4Error.do',
    			params:statpam,
    			headers: { 'Content-Type': 'application/json; charset=UTF-8'}
    		})
    		.success(function(response){
    			$scope.deviceList = response;
    		}); 
    	};
    	
    	//执行保存操作
    	$scope.save = function(){
    		var beginTime = document.getElementById("mbeginTime").value;
    		if(beginTime==null||beginTime.length<1){
    			alert("请选择维护开始时间");
    			return;
    		}
    		var endTime = document.getElementById("mendTime").value;
    		if(endTime==null||endTime.length<1){
    			alert("请选择维护结束时间(预计)");
    			return;
    		}
    		$scope.m.beginTime=beginTime;
    		$scope.m.endTime=endTime;
    		//添加设备列表
    		var deviceIds = "0";
    		angular.forEach($scope.device, function ( item ) {
    			deviceIds = deviceIds +","+item.id;
    	      });
    		$scope.m.deviceIds = deviceIds;
    		var param = $scope.m;
    		//如果执行修改操作时
    		if(mtype==2){
    			 $http({  responseType:'json',
        	   		 method:'POST',
        				 url:'saveChangeErrorTenance.do',
        				 params:param,
        				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        				 })
        				 .success(function(response){
    				    	 $modalInstance.close(response);
        	   	     }); 	
    		}
    		if(mtype==1){
    			$http({  responseType:'json',
       	   		 method:'POST',
       				 url:'saveNewErrorTenance.do',
       				 params:param,
       				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
       				 })
       				 .success(function(response){
   				    	 $modalInstance.close(response);
       	   	     }); 		
    		}
    		return;
    	};
    };  
});

