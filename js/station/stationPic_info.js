var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap']); 
myApp.controller('customersCtrl',function($scope,$sce,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    //初始化参数
	$scope.u={};
	$scope.getTypeList = function(){
		var typeparam ={parentCode:'0021'};
    	$http({  responseType:'json',
	   		 method:'POST',
				 url:'getPublicList.do',
				 params:typeparam,
				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
				 })
				 .success(function(response){
					 /*response.unshift({
						 classId:0,
						 value:'所有类型'
					 });*/
					 $scope.typelist = response;
					 $scope.u.type = $scope.typelist[0].classId;
					 $scope.query();
	   	 }); 
	};
	
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
	    	  $scope.u.stationId = first_id.substring(1,first_id.length);
	    	  $scope.getTypeList();
	
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					$scope.u.stationId = selectNode.substring(1,selectNode.length);
					$scope.queryDaily();
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
		
		
		$scope.query=function(){
			var airContent = new Array();
			var param = $scope.u;
			$http({  responseType:'json',
		   		 method:'POST',
					 url:'getStationPicListByStationType.do',
					 params:param,
					 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
					 })
					 .success(function(response){
						 $scope.picList = response;
					 }); 
		
		};	
});

