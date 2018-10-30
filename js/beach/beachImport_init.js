var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree','xeditable']); 
var row;
var col;
var selectNode="";
var type = 1;
var station;
myApp.run(['editableOptions', function(editableOptions) {
	  editableOptions.theme = 'bs2'; // bootstrap3 theme. Can be also 'bs2', 'default'
	}]);
myApp.controller('customersCtrl',function($scope,$sce,$http,ngDialog,$modal,$timeout,$filter){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	$scope.beach={};
	$scope.s={};
	$scope.timeInit=function(){
		$http({  responseType:'json',
			method:'POST',
			url:'beachImport_info.do',
			params:''})
			.success(function(response){
				$scope.s.collectTime = response.collectTime;
				$scope.showBeachData();
			});
	}
	//获得海水浴场所有的配置表
	$http({  responseType:'json',
			method:'POST',
			url:'getAllBeachConfig.do',
			params:''})
			.success(function(response){
				$scope.m=response;
			});
	
    //初始化参数
	$scope.u={};
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
	
	var param = {
			id:"11"
	};
		$.ajax({
	      url: 'getStationTreesByUserDomain.do', //url  action是方法的名称
	      data: param,
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	  if(data==null||data.length==0){
	    		  alert("站点列表为空");
	    		  return;
	    	  }
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
	    	  $scope.s.stationId = first_id.substring(1,first_id.length);
	    	  $scope.timeInit();
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					$scope.s.stationId = selectNode.substring(1,selectNode.length);
					$scope.showBeachData();
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
		$scope.showBeachData=function(){
			var param = $scope.s;
			 $http({  responseType:'json',
		  			method:'POST',
		  			url:'getBeachData4Station.do',
		  			params:param})
		  			.success(function(response){
		  				$scope.beach=response;
		  			});
		};
		
		$scope.save=function(){
			$(".scbtn").attr('disabled',"true");
			var param = {};
			param['collectTime']=$scope.s.collectTime;
			param['stationId']=$scope.s.stationId;
			for(var key of Object.keys($scope.beach)){
				param[key]=$scope.beach[key].data;
			}
			console.log(param);
			$http({  responseType:'json',
	  			method:'POST',
	  			url:'saveBeachImportData.do',
	  			params:param})
	  			.success(function(response){
	  				$(".scbtn").removeAttr("disabled");
	  				alert(response);
	  			});
			
		}
		
		$scope.showStatus=function(list,data){
			var selected = $filter('filter')(list, {data: data});
		    return (data &&selected!=null&&selected.length) ? selected[0].value : '无上报';
		}
});
