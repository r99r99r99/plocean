var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 
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
	//初始化要删除的记录
	$scope.d={};
	
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
	
	//初始化查询条件的开始时间以及结束时间
	var stationParam = "";
	$http({  responseType:'json',
		 method:'POST',
		 url:'init_notice.do',
		 params:stationParam})
		 .success(function(response){
			 document.getElementById("startDate").value = response.beginTime;
			 document.getElementById("endDate").value = response.endTime;
			 $scope.showStationTree();
	     });
	
	$scope.showStationTree=function(){
		
		//展示出左侧的站点列表
		var t = $("#mtree");
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
				$scope.u.stationId = stationid;
				$scope.query();
			});
	};
	
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.u.stationId = stationid;
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
		
		//初始化定义表格
		$scope.gridOptions = {
				enableRowSelection:true,
				rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
				appScopeProvider: { 
			          onDblClick : function(row) {
			        	  station = row.entity;
			        	  $scope.d=row.entity;
			        	  mtype = 2;
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
			    	  $scope.d=row.entity;
			      });
			    }
			  };
		
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
		//执行删除操作
		$scope.deleRow=function(){
			console.log($scope.d);
			if($scope.d==null||$scope.d.id==null){
				alert("请选择要删除的记录");
				return ;
			}
			if(confirm("是否确定删除标题为\""+$scope.d.title+"\"的通知？")){
				var dparam = $scope.d;
				console.log(dparam);
				$http({  responseType:'json',
		    		 method:'POST',
					 url:'deleNotice.do',
					 params:dparam})
					 .success(function(response){
						 alert(response);
						 $scope.query();
		    	     });
			}
		}
	   //执行查询语句
		$scope.query=function(){
			//执行查询后，清空要删除的记录
			$scope.d={};
			$(".scbtn").attr('disabled',"true");
			//获得开始结束时间
			var beginTime = document.getElementById("startDate").value;
			var endTime = document.getElementById("endDate").value;
			if(beginTime==null||beginTime==""){
				alert("开始时间为空");
				return;
			}else if(endTime==null||endTime==""){
				alert("结束时间为空");
				return;
			}else{
				if(ifBeginLaterEnd(beginTime,endTime)){
					alert("开始时间要早于结束时间");
					return;
				}
			}
			$scope.u.beginTime = beginTime;
			$scope.u.endTime = endTime;
			
	    	var pData = $scope.u;
	    	$http({  responseType:'json',
	    		 method:'POST',
				 url:'showNoticeList.do',
				 params:pData})
				 .success(function(response){
					  $(".scbtn").removeAttr("disabled"); 
					  row = response.rows;
					  col = response.cols;
					  $scope.gridOptions.columnDefs = col;
					  $scope.gridOptions.data = row;
					  
					  
	    	     });
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
	    var ModalInstanceCtrl = function ($scope, $modalInstance,$http,ngDialog) {
	    	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
	    	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
	    	$scope.m={};
	    	
	    	$scope.m.stationId = stationid;
	    	if(mtype==2){
	    		$scope.m = station;
	    		$scope.isshow = false;
	    	}
	    	if(mtype==1){
	    		$scope.isshow = true;
	    	}
	    	
	    	$scope.save = function(){
	    		var param = $scope.m;
	    		if(mtype==1){
	    			$http({  responseType:'json',
	       	   		 method:'POST',
	       				 url:'saveNoticeUp.do',
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
