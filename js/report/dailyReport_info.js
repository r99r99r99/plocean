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
	$scope.u={type:1};
	
	$scope.k={};
	
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
	$http({
		 method:'POST',
		 url:'dailyReport_init.do',
		 params:stationParam})
		 .success(function(response){
			 $scope.u.reportDate=response.reportDate;
	     });
	
	
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
	    	  setTimeout(function (){
					$scope.queryDaily();
			  }, 1000);
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
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
	   //执行查询语句 查询日报
		$scope.queryDaily=function(){
			$scope.u.stationId = stationid;
			var reportDate = document.getElementById("reportDate").value;
			if(reportDate==null||reportDate==""){
				alert("请选择日报时间");
				return;
			}
			$scope.u.reportDate = reportDate;
			var param = $scope.u;
			$http({
				 method:'POST',
				 url:'getReport.do',
				 params:param})
				 .success(function(response){
					 $scope.k = response;
			     });
		};
		
		//系统生成日报
		$scope.autoReport=function(){
			$scope.u.stationId = stationid;
			var reportDate = document.getElementById("reportDate").value;
			if(reportDate==null||reportDate==""){
				alert("请选择日报时间");
				return;
			}
			$scope.u.reportDate = reportDate;
			var param = $scope.u;
			$http({
				 method:'POST',
				 url:'getAutoDailyReport.do',
				 params:param})
				 .success(function(response){
					 $scope.k = response;
			     });
		};
		
		//执行保存操作
		$scope.saveReport=function(){
			$scope.u.stationId = stationid;
			var reportDate = document.getElementById("reportDate").value;
			if(reportDate==null||reportDate==""){
				alert("请选择日报时间");
				return;
			}
			$scope.u.reportDate = reportDate;
			$scope.u.reportTitle=$scope.k.reportTitle;
			$scope.u.reportText = $scope.k.reportText;
			var param = $scope.u;
			$http({
				 method:'POST',
				 url:'saveReport.do',
				 params:param})
				 .success(function(response){
					 alert(response);
			     });
		}
});
