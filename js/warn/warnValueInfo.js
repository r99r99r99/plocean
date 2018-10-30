var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection','ngTouch'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 
var row;
var col;
var station;
var mtype;
var warn;
var selectNode;
var ztreeData;
var zTree;
var stationid;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout,uiGridConstants){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	 //初始化参数
	$scope.u={};
	//展示出左侧的站点列表
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
	//展示出左侧的站点列表
	var t = $("#mtree");
	$scope.showTree=function(){
		//读取组织树下的站点列表
		
		$http({  responseType:'json',
			 method:'POST',
			 url:'getStationList4ZTree.do',
			 params:''})
			 .success(function(data){
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
		    	  $scope.updateStationStatus(stationid);
				 
			 });
	};
	function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.updateStationStatus(stationid);
				}
			}
	};
	function beforeClick(treeId, treeNode, clickFlag) {
			if(treeNode.id.substring(0,1)!="S"){
				treeNode.click=false;
			}
			return (treeNode.click != false);
	};
		
	function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
	};
	function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
	};
	$scope.updateStationStatus=function(stationid){
				//根据站点得到下属的设备的列表
			var dparam = {id:stationid};
				$http({  responseType:'json',
					 method:'POST',
					 url:'getDevices4Station4Show.do',
					 params:dparam}) 
					 .success(function(response){
						$scope.deviceList = response;
						$scope.u.deviceId = $scope.deviceList[0].id;
						$scope.query();
				 });
	};
		
	//初始化查询条件
	$scope.init=function(){
		var sData = "";
		$http({  responseType:'json',
			 method:'POST',
			 url:'init_warnvalue.do',
			 params:sData})
			 .success(function(response){
				console.log(response);
				$scope.stationList = response.stationList;
				$scope.typeList = response.typeList;
				$scope.operateList=[{id:0,value:'未操作'},{id:1,value:'已操作'},{id:-1,value:'全部'}];
				$scope.u = {
						wpId:$scope.stationList[0].id,
						type:$scope.typeList[0].classId,
						beginDate:response.beginDate,
						endDate:response.endDate,
						operate:$scope.operateList[0].id
				};
				setTimeout(function (){
					 $scope.showTree();
					}, 100);
					
		});
	};
	$scope.init();
	function ifBeginLaterEnd(startDate,endDate){
		endDate = endDate.replace(/-/g,"/");
		startDate = startDate.replace(/-/g,"/");
		var end = new Date(endDate);
		var start = new Date(startDate);
		if(start>=end){
			return true;
		}
		return false;
	}
	
	$scope.query=function(){
		$(".scbtn").attr('disabled',"true");
		 var endDate = $('#endDate').val();
		 var startDate = $('#startDate').val();
		 if(startDate==null||startDate==""){
				alert("开始时间为空");
				return;
			}else if(endDate==null||endDate==""){
				alert("结束时间为空");
				return;
			}else{
				if(ifBeginLaterEnd(startDate,endDate)){
					alert("开始时间要早于结束时间");
					return;
				}
			}
		$scope.u.stationId = stationid;
    	var pData = $scope.u;
    	$http({  responseType:'json',
    		 method:'POST',
			 url:'showWarnValues.do',
			 params:pData})
			 .success(function(response){
				 $(".scbtn").removeAttr("disabled");
				 row = response.rows;
				  col = response.cols;
				  $scope.gridOptions.columnDefs = col;
				  $scope.gridOptions.data = row;
				  $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();
    	     });
	};
	
	
	$scope.selections = [];
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
		    enableSelectAll: true,
		    multiSelect:true,
		    modifierKeysToMultiSelect :false,
		    enableRowHeaderSelection:true,
		    headerRowHeight: 50,
		    paginationPageSizes: [25, 50, 100],
			paginationPageSize: 25,
			enableColumnResizing:true,
		    enableGridMenu: true,
		    exporterCsvFilename: '预警告警信息',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  $scope.SelectedProduct = row.entity; 
		    	  warn = row.entity;
		      });
		      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
		    	  
		      });
		    }
		  };
	$scope.info = {};
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
        	 $scope.zTreeQuery();
             console.log(result);  
        }, function (reason) {  
            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
        });
      
    };
    $scope.getSelectedRows = function() {
        $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();
      };
    $scope.update = function(){
    	//获得目前选中的预警告警信息
    	$scope.getSelectedRows();
    	var ids = "0";
    	angular.forEach($scope.mySelectedRows,function(row){
    		ids = ids + "," + row.id;
    	});
    	if(ids=="0"){
    		alert("请选择要批量处理的预警告警信息");
    		return;
    	}
    	//弹出编辑页面
    	mtype = 3;
    	station = {ids:ids};
    	$scope.showEdit();
    };
    
    //弹出页面打开后的操作
    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,ngDialog) {
    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    	//$http.defaults.headers.post['Acc ept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	
    	//初始化操作状态列表
    	$scope.operaList=[{
    		id:0,title:'未操作'
    	},{
    		id:1,title:'已操作'
    	}];
    	if(mtype == 2){
	    	$scope.warn = station;
    	}else if(mtype ==3){
    		$scope.warn = {
    				ids:station.ids,
    				operate:1
    		};
    	}
    	
    	$scope.changeOption = function(){
    		console.log($scope.isactive);
    	};

    	$scope.save = function(){
    		var saveparam = $scope.warn;
    		if(mtype==2){
        		//如果执行修改操作时
        		 $http({  responseType:'json',
        	   		 method:'POST',
        				 url:'saveOperaValue.do',
        				 params:saveparam,
        				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        				 })
        				 .success(function(response){
    				    	 $modalInstance.close(response);
        	   	}); 	
        		return;
    		}else if(mtype==3){
    			$http({  responseType:'json',
       	   		 method:'POST',
       				 url:'updateAllOperaValue.do',
       				 params:saveparam,
       				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
       				 })
       				 .success(function(response){
   				    	 $modalInstance.close(response);
       			 }); 
    		}
    	};
    };  
});

