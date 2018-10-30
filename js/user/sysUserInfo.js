jQuery(function($) {
				$('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
					$(this).prev().focus();
				});
			});


var myApp = angular.module('myApp',['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection',
                                    'ui.grid.edit','ngDialog','ui.bootstrap','multi-select-tree']); 
var row;
var col;
var user;
var mtype;
var csvdata;
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
	
    $scope.query=function(){
    	$(".scbtn").attr('disabled',"true");
    	var pData = $scope.u; 
    	$http({  responseType:'json',
    		 method:'POST',
			 url:'showUserList.do',
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
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
			          	mtype = 2;  //2 代表编辑对话框
			          	user = row.entity;
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
		    exporterCsvFilename: '人员管理',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "人员管理", style: 'headerStyle' },
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'portrait',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 500,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
		  };
	
    //双击表格的方法,弹出编辑框
    $scope.onGridDoubleClick=function(row){
    	mtype = 2;  //2 代表编辑对话框
    	user = row.entity;
    	$scope.showEdit();
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
    
    //弹出页面打开后的操作
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
    	
    	var sparam="";
    	$scope.showComList4Users=function(){
    		$http({  responseType:'json',
    	   		 method:'POST',
    				 url:'showComList4Users.do',
    				 params:sparam})
    				 .success(function(response){
    					  $scope.pcodelist = response;
    	   	     });
    	};
    	
    	
    	//生成状态列表
    	$scope.isactivelist = [{
            name: '启用',
            value: 1
        }, {
            name: '禁用',
            value: 0
        }];
    	
    	var pData = {}; 
    	
    	//获得职位的列表
    	$http({  responseType:'json',
   		 method:'POST',
			 url:'getPositionList.do',
			 params:pData})
			 .success(function(response){
				  $scope.positionList = response;
   	     });
    	
    	$scope.user = {isactive:1};
    	if(mtype == 2){
	    	$scope.user = user;
	    	sparam = $scope.user;
	    	$scope.isactive = user.isactive;
	    	$scope.showComList4Users();
    	}else{
    		sparam={
    				companyId:'0001'
    		};
    		$scope.showComList4Users();
    	}
    	
    	$scope.changeOption = function(){
    		console.log($scope.isactive);
    	};

    	$scope.save = function(){
    		var dataItem = "";
    		angular.forEach($scope.device, function ( item ) {
    			dataItem =item.id;
    	    });
    		$scope.user.companyId = dataItem;
    		
    		var param = $scope.user;
    		//如果执行修改操作时
    		if(mtype==2){
    			 $http({  responseType:'json',
        	   		 method:'POST',
        				 url:'saveUserChange.do',
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
       				 url:'saveNewUser.do',
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