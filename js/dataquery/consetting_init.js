
var myApp = angular.module('myApp',['textAngular','multi-select-tree']); 
var row;
var col;
var pub;
var mtype;
var station;
myApp.controller('customersCtrl',function($scope,$http){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    
	//初始化站点列表
	var dparam ="";
	$http({
		 method:'POST',
		 url:'getStationByUser.do',
		 params:dparam})
		 .success(function(response){
			 $scope.stationList = response;
			 $scope.u={
					 stationId:$scope.stationList[0].id
			 }
			 $scope.query();
		 });
   //根据站点查询出当前站点的水质模板
	$scope.query=function(){
		$(".scbtn").attr('disabled',"true");
		var qparam = $scope.u;
		$http({
			 method:'POST',
			 url:'getMouldByStationId.do',
			 params:qparam})
			 .success(function(response){
				 $(".scbtn").removeAttr("disabled");
				 $scope.u=response;
			 });
	};
	//保存当前站点的水质评价模板
	$scope.save=function(){
		var sparam = $scope.u;
		$http({
			 method:'POST',
			 url:'saveMouldSetting.do',
			 params:sparam})
			 .success(function(response){
				 alert(response);
			 });
	};
});