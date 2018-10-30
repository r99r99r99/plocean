jQuery(function($) {
				$('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
					$(this).prev().focus();
				});
			});

var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap']); 
var row;
var col;
var group;
var mtype;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	var apar="";
	
	//开始分页信息
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
		        	  mtype = 2;  //2 代表编辑对话框
		          	group = row.entity;
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
		    exporterCsvFilename: '水质等级列表',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  group = row.entity;
		      });
		    }
		  };
	//分页信息结束
    $scope.query=function(){
    	$(".scbtn").attr('disabled',"true");
    	var pData = $scope.u; 
    	$http({  responseType:'json',
    		 method:'POST',
			 url:'getStandardList.do',
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
    
    //删除选中的水质等级
    $scope.dele = function(){
    	var ids = "0";
    	if(group!=null){
    		ids = ids + group.id;
    	}
		if(ids=="0"){
			alert("请选择要删除的水质等级");
			return;
		}
		if(confirm("确定要删除选中的记录吗?")){
			$(".scbtn").attr('disabled',"true");
			var pData ={ids:ids}; 
			$http({  responseType:'json',
		   		 method:'POST',
					 url:'deleWaterQulity.do',
					 params:pData,
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
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	
    	//获得参数列表,并初始化
    	var indiparam = {isactive:1};
    	$http({  responseType:'json',
	   		 method:'POST',
				 url:'getIndicatorList.do',
				 params:indiparam,
				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
				 })
				 .success(function(response){
			    	 $scope.indicatorlist = response;
			    	 if(mtype ==2){
			    		 $scope.group.item = group.item;
			    	 }
	   	}); 
    	
    	//获得水质等级名称列表,并初始化
    	var levelparam = {parentCode:'0007'};
    	$http({  responseType:'json',
	   		 method:'POST',
				 url:'getPublicList.do',
				 params:levelparam,
				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
				 })
				 .success(function(response){
			    	 $scope.levelList = response;
			    	 if(mtype ==2){
			    		 $scope.group.standardId = group.standardId;
			    	 }
	   	}); 
    	
    	//获得水质类型列表,并初始化
    	var typeParam = {parentCode:'0005'};
    	$http({  responseType:'json',
	   		 method:'POST',
				 url:'getPublicList.do',
				 params:typeParam,
				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
				 })
				 .success(function(response){
			    	 $scope.typelist = response;
			    	 if(mtype ==2){
			    		 $scope.group.waterType = group.waterType;
			    	 }
	   	}); 
    	
    	
    	if(mtype == 2){
	    	$scope.group = group;
    	}
    	$scope.changeOption = function(){
    		console.log($scope.isactive);
    	};

    	$scope.save = function(){
    		var param = $scope.group;
    		//如果执行修改操作时
    		if(mtype==2){
    			 $http({  responseType:'json',
        	   		 method:'POST',
        				 url:'saveQualityChange.do',
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
       				 url:'saveNewQuality.do',
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