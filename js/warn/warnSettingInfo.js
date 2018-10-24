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
	
	//生成站点列表
	var sData = "";
	$http({
		 method:'POST',
		 url:'getStationByUser.do',
		 params:sData})
		 .success(function(response){
			 $scope.stationList = response;
			 $scope.stationList.unshift({id:0,title:'全部站点'});
			 $scope.u={
					 wpId:$scope.stationList[0].id
			 };
			 
			 $scope.query=function(){
				 $(".scbtn").attr('disabled',"true");
			    	var pData = $scope.u; 
			    	$http({
			    		 method:'POST',
						 url:'showWarnSetting.do',
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
				
	});
	
	//开始分页信息
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
		        	  mtype = 2;  //2 代表编辑对话框
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
		    exporterCsvFilename: '预警告警配置列表',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  station = row.entity;
		      });
		    }
		  };
    
	    
    //点击新增按钮,弹出新增对话框
    $scope.addUser = function(){
    	mtype = 1;  //1 代表新增对话框
    	$scope.showEdit();
    };
    
    //删除代码
    
  //删除选中的水质等级
    $scope.dele = function(){
    	var ids = "0";
    	if(station!=null){
    		ids = ids +","+station.id;
    	}
		if(ids=="0"){
			alert("请选择要删除的预警告警配置");
			return;
		}
		if(confirm("确定要删除选中的记录吗?")){
			$(".scbtn").attr('disabled',"true");
			var dData ={ids:ids}; 
			$http({
		   		 method:'POST',
					 url:'deleWarnSetting.do',
					 params:dData,
					 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
					 })
					 .success(function(response){
						 $(".scbtn").removeAttr("disabled");
				    	 alert(response);
				    	 $scope.query();
		   	});
		}
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
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	//$http.defaults.headers.post['Acc ept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	
    	//获得有效的站点列表
    	var mData = "";
    	$http({
    		 method:'POST',
    		 url:'getStationByUser.do',
    		 params:mData})
    		 .success(function(response){
    			 $scope.stationList = response;
    			 //如果为新增,对站点列表初始化
    			 if(mtype==1){
    				 $scope.warn ={
    						 wpId:$scope.stationList[0].id
    				 };
    			 }
    			 $scope.showIndicators();
    	});
    	
    	$scope.showIndicators = function(){
    		var iData = {
    				id:$scope.warn.wpId
    		};
    		$http({
       		 method:'POST',
       		 url:'getIndicatorsByStation.do',
       		 params:iData})
       		 .success(function(response){
       			 $scope.indicatorList = response;
       			 if(mtype==1){
       				$scope.warn ={
       						wpId:$scope.warn.wpId,
       						indicatorCode:$scope.indicatorList[0].code
       				};
       			 }
       	});
    		
    	};
    	$scope.changeStation = function(){
    		$scope.showIndicators();
    	};
    	
    	if(mtype == 2){
	    	$scope.warn = station;
    	}
    	
    	$scope.changeOption = function(){
    		console.log($scope.isactive);
    	};

    	$scope.save = function(){
    		var saveparam = $scope.warn;
    		console.log(saveparam);
    		//如果执行修改操作时
    		if(mtype==2){
    			 $http({
        	   		 method:'POST',
        				 url:'saveWarnChange.do',
        				 params:saveparam,
        				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        				 })
        				 .success(function(response){
    				    	 $modalInstance.close(response);
        	   	     }); 	
    		}
    		if(mtype==1){
    			$http({
       	   		 method:'POST',
       				 url:'saveNewWarn.do',
       				 params:saveparam,
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

