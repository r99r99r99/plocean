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
	$http({  responseType:'json',
		 method:'POST',
		 url:'initMainEditInfo.do',
		 params:sData})
		 .success(function(response){
			 $scope.stationList = response.stations;
			 $scope.stationList.unshift({id:0,title:'全部站点'});
			 $scope.u.stationId = $scope.stationList[0].id;
			 $scope.u.beginTime = response.beginTime;
			 $scope.u.endTime = response.endTime;
			 document.getElementById("beginTime").value =  response.beginTime;
			 document.getElementById("endTime").value =  response.endTime;
			 $scope.changeStation();
	});
	
	$scope.getFileName = function( grid, myRow ) {
		
		return myRow.entity.realName;
	};
	$scope.getFilePath = function( grid, myRow ) {
		
		return myRow.entity.pathName;
	};
	//根据站点列表查询出该时间段内的维护记录
	$scope.changeStation=function(){
		$(".scbtn").attr('disabled',"true");
    	var beginTime = document.getElementById("beginTime").value;
    	var endTime = document.getElementById("endTime").value;
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
	$scope.onDblClick=function(row) {
	   	 mtype = 2;
	  	 station = row.entity;
	  	 $scope.showEdit();
	};
	//开始分页信息
	$scope.gridOptions = {
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			/*appScopeProvider: { 
		          onDblClick : function(row) {
		        	 mtype = 2;
		          	 station = row.entity;
		          	 $scope.showEdit();
		          	 
		          }
		    },*/
		   /* columnDefs: [
		        { name: 'name' },
		        { name: 'gender' },
		        { name: 'company' },
		        { name: 'widgets' },
		        { name: 'cumulativeWidgets', field: 'widgets', cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">{{grid.appScope.cumulative(grid, row)}}</div>' }
		      ],*/
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
	$scope.changeStation();
	    
   $scope.addMain=function(){
	   console.log($scope.myText);
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
        	 $scope.changeStation();
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
    	$scope.m={}
    	
    	//得到运维报告
    	
    	 	
    	if(mtype==2){
    		$scope.m=station;
    		var sData = {
    				id:station.id
    		};
    		$http({  responseType:'json',
       		 method:'POST',
       		 url:'getMainFilesByMainId.do',
       		 params:sData})
       		 .success(function(response){
       			 console.log(response);
       			var picContent = new Array();
       			var pics = response;
       			$scope.pics = pics;
       		 });
    		
    	}else{
    		$scope.m={};
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
    			url:'getDeviceIndicatorTree4Main.do',
    			params:statpam,
    			headers: { 'Content-Type': 'application/json; charset=UTF-8'}
    		})
    		.success(function(response){
    			$scope.indicatorTree = response;
    		}); 
    	};
    	$scope.m.mtype = mtype;
    };  
});