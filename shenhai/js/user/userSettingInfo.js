var myApp = angular.module('myApp',['ngDialog','ui.bootstrap','angularFileUpload']); 
var row;
var col;
var user;
var mtype;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,FileUploader){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
	//初始化图片上传功能
	var uploader = $scope.uploader = new FileUploader({
        url: '',
        formData: "",
        queueLimit: 10 //only can add one item
    });
 
	 uploader.filters.push({
	     name: 'customFilter',
	     fn: function(item /*{File|FileLikeObject}*/, options) {
	         return this.queue.length < 10;
	     }
	 });
	 //上传成功后的保存信息
	 uploader.onSuccessItem = function(fileItem, response, status, headers) {
		 alert("保存成功");  
	 };
	 uploader.onErrorItem = function(fileItem, response, status, headers) {
	     alert("保存失败");  
	 };
	 uploader.onCancelItem = function(fileItem, response, status, headers) {
	     alert(response);  
	 };
	 uploader.onCompleteItem = function(fileItem, response, status, headers) {
	 };
	 
	 var controller = $scope.controller = {
	         isImage: function(item) {
	             var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	             return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	         }
	     };
	 
	 
	 $scope.save = function () {
		    var url = 'saveUserNowChange.do';
		    var data = new Array();
		    data = [{
		    	realName:$scope.user.realName,
		    	telephone:$scope.user.telephone,
		    	phone:$scope.user.phone,
		    	birthday:$scope.user.birthday,
		    	email:$scope.user.email
		    }];
		 	//如果没有图标上传
		 	if($scope.uploader.queue.length<1){
		 		$http({
				   	 method:'POST',
					 url:url,
					 params:$scope.user,
					 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
					 })
					 .success(function(response){
						alert(response);  	 
				}); 
		 	}else{
		 		$scope.uploader.formData=data;
    		 	$scope.uploader.queue[0].formData=data;
			 	$scope.uploader.queue[0].url=url;
			 	$scope.uploader;
			 	uploader.uploadAll();
		 	}
		 	
	};
	//初始化人员信息
	var param = "";
	$http({
	   	 method:'POST',
		 url:'getUserNow.do',
		 params:param,
		 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
		 })
		 .success(function(response){
			$scope.user = response;    	 
	}); 
	
});