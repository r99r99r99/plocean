var myApp = angular.module('myApp',['ngDialog','ui.bootstrap']); 

var stationId;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	
	//展示出左侧的站点列表
	var t = $("#mtree");
		//读取组织树下的站点列表
		$.ajax({
	      url: 'getPlatformStationTree.do', //url  action是方法的名称
	      data: '',
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	selectNode = data[0].children[0].children[0].id;
	          //zNodes = data;
	      	t = $.fn.zTree.init(t, setting, data);
	      	var zTree = $.fn.zTree.getZTreeObj("mtree");
			//zTree.selectNode(zTree.getNodeByParam("id", "${selected}"));
	      	var first_id=data[0]["children"][0]["children"][0]["id"];
	      	zTree.selectNode(zTree.getNodeByParam("id", first_id));
	      	$scope.updateStationStatus();
	      },
	      error: function(msg) {
	         
	      }
		}); 
	function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				$scope.updateStationStatus();
			}
		};
		var setting = { 
				view: {
					showIcon:showIconForTree
				},
				check: {
					enable: false
				},
				callback: {
					onClick: zTreeOnClick
				}
		    };
	
		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
	
	$scope.updateStationStatus=function(){
		var mparam = {
				stationIds:selectNode
		};
		$http({
   		 method:'POST',
   		 url:'getStationDeviceStatus.do',
   		 params:mparam})
   		 .success(function(response){
   			  console.log(response);
   			  var airContent = new Array();
			 angular.forEach(response,function(stationStatus){
				 console.log(stationStatus);
				 airContent.push(' <div class="row-fluid">');
				 airContent.push(' <div class="span12">');
				 airContent.push(' <div class="widget-box">');
				 airContent.push(' <div class="widget-title">');
				 airContent.push(' <span class="icon">');
				 airContent.push(' <i class="icon-th-list"></i>');
				 airContent.push(' </span>');
				 airContent.push(' <h5>');
				 airContent.push(stationStatus.station.title);
				 airContent.push(' </h5></div>');
				 airContent.push(' <div class="widget-content nopadding" style="max-height:250px;">');
				 airContent.push(' <div class="row-fluid nopadding">');
				 airContent.push(' <div class="span7" style="border-right:1px solid #cdcdcd;max-height:250px;overflow:auto;">');
				 airContent.push(' <img alt="" src="');
				 airContent.push(stationStatus.station.pic);
				 airContent.push('" width="100%">');
				 airContent.push(' </div>');
				 airContent.push(' <div class="span5" style="max-height:250px;overflow:auto;">');
				 
				 airContent.push(' <table class="table table-bordered data-table">');
				 airContent.push(' <thead>');
				 airContent.push(' <tr>');
				 airContent.push(' <th>设备名称</th>');
				 airContent.push(' <th>状态</th>');
				 airContent.push(' </tr>');
				 airContent.push(' </thead>');
				 airContent.push(' <tbody>');
				 var deviceStatus = stationStatus.deviceStatus;
				 angular.forEach(deviceStatus,function(device){
					 airContent.push(' <tr class="gradeX">');
					 airContent.push(' <td>');
					 airContent.push(device.deviceName);
					 airContent.push('</td>');
					 airContent.push(' <td>');
					 airContent.push(device.statusName);
					 airContent.push('</td>');
					 airContent.push(' </tr>');
				 });
				 airContent.push(' </tbody>');
				 airContent.push(' </table>');
				 
				 airContent.push(' </div>');
				 airContent.push(' </div>');
				 airContent.push(' </div>');
				 airContent.push(' </div>');
				 airContent.push(' </div>');
				 airContent.push(' </div>');
			 });
   			  
			 $("#showdata").html(airContent.join("")); 
   	     });
	};
	
});



