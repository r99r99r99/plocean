var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap']); 
var row;
var col;
var type;
var mtype;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	//生成状态列表
	$scope.activelist = [{
        name: '全部',
        value: 2
    }, {
        name: '启用',
        value: 1
    }, {
        name: '禁用',
        value: 0
    }];
	
	//初始化查询条件
	$scope.u = {isactive:2};
	
	//开始分页信息
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
		        	    mtype = 2;  //2 代表编辑对话框
		          		type = row.entity;
		          		$scope.showEdit();
		          }
		    },
		    multiSelect:false,
		    modifierKeysToMultiSelect :false,
		    noUnselect:true,
		    enableRowSelection: true,
		    enableRowHeaderSelection:false,
		    headerRowHeight: 50,
			paginationPageSizes: [20, 50, 100],
			paginationPageSize: 20,
			enableColumnResizing:true,
		    enableGridMenu: true,
		    enableSelectAll: true,
		    exporterCsvFilename: '阈值列表.csv',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  type = row.entity;
		      });
		    }
		  };
	$scope.delUser = function(){
    	var ids = "0";
    	if(type!=null){
    		ids = type.id;
    	}
		if(ids=="0"){
			alert("请选择要删除的阈值信息");
			return;
		}
		if(confirm("确定要删除选中的记录吗?")){
			$(".scbtn").attr('disabled',"true");
			var dData ={id:ids}; 
			$http({  responseType:'json',
		   		 method:'POST',
					 url:'deleYuzhi.do',
					 params:dData,
					 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
					 })
					 .success(function(response){
						 $(".scbtn").removeAttr("disabled");
				    	 alert(response);
				    	 $scope.query();
				    	 type=null;
		   	});
		}
    };
	//分页信息结束
    $scope.query=function(){
    	$(".scbtn").attr('disabled',"true");
    	var pData = $scope.u; 
    	$http({  responseType:'json',
    		 method:'POST',
			 url:'showYuZhi.do',
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
    
    //弹出页面打开后的操作
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
    	//生成状态列表
    	var pData={};
    	//获得站点列表
    	$http({  responseType:'json',
   		 method:'POST',
			 url:'getAllStation.do',
			 params:pData})
			 .success(function(response){
				  $scope.stationlist = response;
   	     });
    	
    	$scope.isactivelist = [{
            name: '启用',
            value: 1
        }, {
            name: '禁用',
            value: 0
        }];
    	
    	$scope.type = {isactive:1};
    	if(mtype == 2){
	    	$scope.type = type;
	    	console.log(type.stationid);
	    	$scope.isactive = type.isactive;
    	}
    	
    	$scope.changeOption = function(){
    		console.log($scope.isactive);
    	};

    	$scope.save = function(){
    		var param = $scope.type;
    		//如果执行修改操作时
    		if(mtype==2){
    			 $http({  responseType:'json',
        	   		 method:'POST',
        				 url:'saveYuzhi.do',
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
       				 url:'saveNewYuzhi.do',
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