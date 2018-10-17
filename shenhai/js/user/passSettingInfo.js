var myApp = angular.module('myApp',['ngDialog','ui.bootstrap']); 
var row;
var col;
var user;
var mtype;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	
	$scope.save = function(){
		var sparams = $scope.user;
		$http({
		   	 method:'POST',
			 url:'saveUserPassword.do',
			 params:sparams,
			 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
			 })
			 .success(function(response){
				alert(response);  	 
		}); 
	};    
});