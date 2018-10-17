var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree','textAngular']); 
var row;
var col;
var selectNode="";
var stationid;
var type = 1;
var station;
myApp.controller('customersCtrl',function($scope,$sce,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	$scope.checkB = false;
    //初始化参数
	$scope.u={};
	
	$scope.k={};
	
	
	//生成状态列表
	$scope.typelist = [{
        name: '日报',
        value: 1
    }, {
        name: '月报',
        value: 2
    }];
	
	
	var setting = { 
			check: {
				enable: false
			},
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false,
				showIcon:showIconForTree
			},
			data: {
				simpleData: {
					enable:true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: ""
				}
			},
			callback: {
				beforeClick: beforeClick,
				onClick: zTreeOnClick
			}
	    };
	//初始化定义表格
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
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
		    exporterCsvFilename: '数据列表',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		      });
		    }
		  };
	
	
	
	
	//展示出左侧的站点列表
	var t = $("#mtree");
		//读取组织树下的站点列表
		$.ajax({
	      url: 'getStationList4ZTree.do', //url  action是方法的名称
	      data: '',
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	  var first_id;
	    	  for(var i in data){
	    		  var treeNode = data[i];
	    		  var id = treeNode.id;
	    		  if(treeNode.id.substring(0,1)!="R"){
	    			  first_id = treeNode.id;
	    			  break;
	    		  }
	    	  }
	    	  t = $.fn.zTree.init(t, setting, data);
	    	  var zTree = $.fn.zTree.getZTreeObj("mtree");
	    	  zTree.selectNode(zTree.getNodeByParam("id", first_id));
	    	  stationid = first_id.substring(1,first_id.length);
	    	//初始化查询条件的开始时间以及结束时间
	    		var stationParam = "";
	    		$http({
	    			 method:'POST',
	    			 url:'reportQuery_init.do',
	    			 params:stationParam})
	    			 .success(function(response){
	    				 $scope.u = response;
	    		    	  setTimeout(function (){
	    		    		  $scope.query();
	    				  }, 1000);

	    		     });
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.query();
				}
			}
		};
		function beforeClick(treeId, treeNode, clickFlag) {
			if(treeNode.id.substring(0,1)!="S"){
				treeNode.click=false;
			}
			return (treeNode.click != false);
		}
		
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
	   //执行查询语句 查询日报
		$scope.query=function(){
			$(".scbtn").attr('disabled',"true");
			//获得开始结束时间
			var beginTime = document.getElementById("beginDate").value;
			var endTime = document.getElementById("endDate").value;
			if(beginTime==null||beginTime==""){
				alert("开始时间为空");
				$(".scbtn").removeAttr("disabled"); 
				return;
			}else if(endTime==null||endTime==""){
				alert("结束时间为空");
				$(".scbtn").removeAttr("disabled"); 
				return;
			}else{
				if(ifBeginLaterEnd(beginTime,endTime)){
					alert("开始时间要早于结束时间");
					$(".scbtn").removeAttr("disabled"); 
					return;
				}
			}
	    	var pData = {
	    			stationId:stationid,
	    			beginDate:beginTime,
	    			type:$scope.u.type,
	    			endDate:endTime};
	    	$http({
	    		 method:'POST',
				 url:'showReportQueryList.do',
				 params:pData})
				 .success(function(response){
					  $(".scbtn").removeAttr("disabled"); 
					  row = response.rows;
					  col = response.cols;
					  $scope.gridOptions.columnDefs = col;
					  $scope.gridOptions.data = row;
	    	     });
	    	
		};
		
		
		//导入文件编辑框
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
	        }, function (reason) {  
	            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
	        });
	    };
	    
	    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,ngDialog,$modal) {
	    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
	    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	    	$scope.m = {};
	    	var id = station.id;
	    	console.log(id);
	    	var sparam = {
	    			id:id
	    	};
	    	$http({
	    		 method:'POST',
				 url:'getReportById.do',
				 params:sparam})
				 .success(function(response){
					 $scope.m=response;
	    	     });
	    };	
});
