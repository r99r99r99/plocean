jQuery(function($) {
				$('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
					$(this).prev().focus();
				});
			});

var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','angularFileUpload']); 
var row;
var col;
var pub;
var mtype;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,FileUploader){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	//获得文件类型列表
	$scope.typeList = [{
        name: '全部',
        value: 0
    }, {
        name: '系统内',
        value: 1
    }, {
        name: '系统外',
        value: 2
    }];
	
	//初始化查询条件
	var sData = "";
	$http({
		 method:'POST',
		 url:'init_file.do',
		 params:sData})
		 .success(function(response){
			  $scope.u = response;
	     });
	
	//开始分页信息
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
		        	  mtype = 2;  //2 代表编辑对话框
		          	  pub = row.entity;
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
		    exporterCsvFilename: '文件列表',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  firstpage = row.entity;
		      });
		    }
		  };
	//分页信息结束
    $scope.query=function(){
    	$(".scbtn").attr('disabled',"true");
    	var pData = $scope.u; 
    	$http({
    		 method:'POST',
			 url:'showFileList.do',
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
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,FileUploader) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	 
    	 var uploader = $scope.uploader = new FileUploader({
	            url: 'saveFileUpload.do',
	            formData: [{
	            	filepath: $scope.filepath
	            }],
	            queueLimit: 1 //only can add one item
	        });
    	 
    	 uploader.filters.push({
             name: 'customFilter',
             fn: function(item /*{File|FileLikeObject}*/, options) {
            	 console.log(options);
            	 console.log(item);
                 return this.queue.length < 10;
             }
         });
    	 //上传成功后的保存信息
    	 uploader.onSuccessItem = function(fileItem, response, status, headers) {
    		 console.info('onSuccessItem', fileItem, response, status, headers);
    		 $modalInstance.close(response);
         };
         uploader.onErrorItem = function(fileItem, response, status, headers) {
             console.info('onErrorItem', fileItem, response, status, headers);
             $modalInstance.close(response);
         };
         uploader.onCancelItem = function(fileItem, response, status, headers) {
             console.info('onCancelItem', fileItem, response, status, headers);
             $modalInstance.close(response);
         };
         uploader.onCompleteItem = function(fileItem, response, status, headers) {
             console.info('onCompleteItem', fileItem, response, status, headers);
             $modalInstance.close(response);
         };
         
         var controller = $scope.controller = {
                 isImage: function(item) {
                     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                     return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                 }
             };
         
         
    	 $scope.upload = function () {
    		 	var data = [{
	            	filepath: $scope.filepath
	            }];
    		 	$scope.uploader.formData=data;
    		 	$scope.uploader.queue[0].formData=data;
    		 	$scope.uploader;
    		 	uploader.uploadAll();
    		}
    	 
    };  
});