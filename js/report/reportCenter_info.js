var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree','textAngular']); 
var first_id;
var sid;
myApp.controller('customersCtrl',function($scope,$sce,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	$("#rivertree").hide();
	
	//初始化站点统计类型
	$scope.stationTypeList=[{
		id:1,
		name:"按流域"
	},{
		id:2,
		name:"按区域"
	}];
	
	$scope.stationType = $scope.stationTypeList[1];
	$scope.changeStationType=function(){
		var id = $scope.stationType.id;
		if(id==1){
			$scope.stationType=$scope.stationTypeList[1];
			$("#rivertree").hide();
			$("#regiontree").show();
		}else{
			$scope.stationType=$scope.stationTypeList[0];
			$("#regiontree").hide();
			$("#rivertree").show();
			
		}
	}
	
	//初始化参数
	$scope.u={};
	//展示左侧的站点树
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
	
	function zTreeOnClick(event, treeId, treeNode) {
		if(treeNode.id!=null){
			 sid = treeNode.id;
			
			 var tzTree = $.fn.zTree.getZTreeObj("rivertree");
	    	 tzTree.selectNode(treeNode);
	    	 
	    	 var rzTree = $.fn.zTree.getZTreeObj("regiontree");
	    	 rzTree.selectNode(treeNode);
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
	
	//以流域统计站点列表
	$scope.getStationList4ZTreeByRiver=function(){
		var t = $("#rivertree");
		$.ajax({
		      url: 'getStationList4ZTreeByRiver.do', //url  action是方法的名称
		      data: '',
		      type: 'POST',
		      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
		      ContentType: "application/json; charset=utf-8",
		      success: function(data) {
		    	  t = $.fn.zTree.init(t, setting, data);
		    	  var zTree = $.fn.zTree.getZTreeObj("rivertree");
		    	  zTree.selectNode(zTree.getNodeByParam("id", first_id));
		    	  sid = first_id;
		    	  //$scope.updateStationStatus();
		      },
		      error: function(msg) {
		         
		      }
	  }); 
	}
	
	//以区域统计站点列表
	$scope.getStationList4ZTree=function(){
		var t = $("#regiontree");
		$.ajax({
		      url: 'getStationList4ZTree.do', //url  action是方法的名称
		      data: '',
		      type: 'POST',
		      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
		      ContentType: "application/json; charset=utf-8",
		      success: function(data) {
		    	 
		    	  for(var i in data){
		    		  var treeNode = data[i];
		    		  var id = treeNode.id;
		    		  if(treeNode.id.substring(0,1)!="R"){
		    			  first_id = treeNode.id;
		    			  break;
		    		  }
		    	  }
		    	  t = $.fn.zTree.init(t, setting, data);
		    	  var zTree = $.fn.zTree.getZTreeObj("regiontree");
		    	  zTree.selectNode(zTree.getNodeByParam("id", first_id));
		    	  sid = first_id;
		    	  //$scope.updateStationStatus();
		    	  $scope.getStationList4ZTreeByRiver();
		      },
		      error: function(msg) {
		         
		      }
	  }); 
	}
	
	//查询条件初始化
	$scope.reportCenter_init=function(){
		$http({
			 method:'POST',
			 url:'reportCenter_init.do',
			 params:''})
			 .success(function(res){
				 console.log(res);
				 $scope.u = res;
			 });
	};
	
	//获得统计口径的列表
	$scope.getCollectTypeList=function(){
		
		$scope.typelist = [{
	        name: '按月统计',
	        value: 1
	    }, {
	        name: '按周统计',
	        value: 2
	    }, {
	        name: '按日统计',
	        value: 3
	    }];
		$scope.reportCenter_init();
	}
	
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
	
	$scope.getStationList4ZTree();
	$scope.getCollectTypeList();
	
	
	$scope.query=function(){
		
	}
});
