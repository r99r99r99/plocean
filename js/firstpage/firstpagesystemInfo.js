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
var firstpage;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	//初始化查询条件
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
			$scope.query();
				
	});
	
	$scope.query=function(){
		$(".scbtn").attr('disabled',"true");
    	var pData = $scope.u; 
    	$http({
    		 method:'POST',
			 url:'showSystemModelList.do',
			 params:pData})
			 .success(function(response){
				 $(".scbtn").removeAttr("disabled"); 
				  row = response.rows;
				  col = response.cols;
				  $scope.gridOptions.columnDefs = col;
				  $scope.gridOptions.data = row;
    	     });
	};
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
		    exporterCsvFilename: '首页运行状态设置列表',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  firstpage = row.entity;
		      });
		    }
		  };
    
    //点击新增按钮,弹出新增对话框
    $scope.addUser = function(){
    	mtype = 1;  //1 代表新增对话框
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
    
    //执行删除操作
    $scope.dele = function(){
    	var id = "0";
    	if(firstpage!=null){
    		id = firstpage.id;
    	}
		if(id=="0"){
			alert("请选择要删除的首页实时数据显示配置");
			return;
		}
		if(confirm("确定要删除选中的配置吗?")){
			$(".scbtn").attr('disabled',"true");
			var dData ={id:id}; 
			$http({
		   		 method:'POST',
					 url:'deleSystemModel.do',
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
    
    //弹出页面打开后的操作
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,ngDialog) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	//$http.defaults.headers.post['Acc ept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	
    	//得到权限下的参数列表
    	var mData = "";
    	$http({
    		 method:'POST',
    		 url:'getStationByUser.do',
    		 params:mData})
    		 .success(function(response){
    			$scope.stationList = response;
    			if(mtype==1){
    				$scope.wpId = $scope.stationList[0].id;
    			}else if(mtype==2){
    				$scope.wpId = station.stationId;
    			}
    	});
    	
    	$scope.typeList = [{
            name: '数值类型',
            value: 1
        }, {
            name: '布尔类型',
            value: 2
        }];
    	
    	if(mtype==2){
    		$scope.id = station.id;
    		$scope.orderCode = station.orderCode;
    		$scope.type = station.type;
    	}else{
    		$scope.type = $scope.typeList[0].value;
    	}
    	
    	//得到系统状态下的参数列表
    	var dDate={
				id:3
		};
		$http({
   		 method:'POST',
   		 url:'getSystemModelList.do',
   		 params:dDate})
   		 .success(function(response){
       			$scope.indicatorList = response;
       			if(mtype==1){
       				$scope.indicatorCode = $scope.indicatorList[0].code;
       			}else if(mtype==2){
       				$scope.indicatorCode = station.indicatorCode;
       			}
   		 });
		
    	$scope.changeOption = function(){
    		console.log($scope.isactive);
    	};
    	
    	$scope.save = function(){
    		if(mtype==1){
    			var saveparam = {
    					stationId:$scope.wpId,
    					indicatorCode:$scope.indicatorCode,
    					type:$scope.type,				
    					orderCode:$scope.orderCode				
    			};
        		console.log(saveparam);
        		$http({
        	   		 method:'POST',
        				 url:'addSystemModel.do',
        				 params:saveparam,
        				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        				 })
        				 .success(function(response){
    				    	 $modalInstance.close(response);
        	   	}); 	
        		return;
    		}
    		if(mtype==2){
    			var saveparam = {
    					id:$scope.id,
    					stationId:$scope.wpId,
    					indicatorCode:$scope.indicatorCode,
    					type:$scope.type,				
    					orderCode:$scope.orderCode	    					
    			};
        	  $http({
        	   		 method:'POST',
        				 url:'updateSystemModel.do',
        				 params:saveparam,
        				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        				 })
        				 .success(function(response){
    				    	 $modalInstance.close(response);
        	   	}); 	
        		return;
    		}
    		
    		
    	};
    };  
});

