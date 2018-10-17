jQuery(function($) {
				$('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
					$(this).prev().focus();
				});
			});

var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 

var row;
var col;
var station;
var mtype;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal,$timeout){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	//初始化站点列表以及查询时间
	var sData = "";
	$http({
		 method:'POST',
		 url:'initMainEditInfo.do',
		 params:sData})
		 .success(function(response){
			 $scope.stationList = response.stations;
			 $scope.stationList.unshift({id:0,title:'全部站点'});
			 $scope.u.stationId = $scope.stationList[0].id;
	});
	
	$scope.showState = function(){
		$scope.showEdit();
	};
	//生成状态列表
	$scope.activelist = [{
        name: '全部',
        value: 2
    }, {
        name: '正常',
        value: 1
    }, {
        name: '维护',
        value: 0
    }];
	
	//初始化查询条件
	$scope.u = {isactive:2};
	
    $scope.query=function(){
    };
	$scope.query();
    //点击新增按钮,弹出新增对话框
    $scope.showMubiao=function(){
    	$scope.showEdit();
    }
    $scope.showMubiao2=function(){
    	$scope.showEdit2();
    }
    //弹出编辑框
    $scope.showEdit = function(){
    	var modalInstance = $modal.open({  
            templateUrl: 'popupTmpl.html',  
            controller: ModalInstanceCtrl
        });  
    	modalInstance.opened.then(function(){//模态窗口打开之后执行的函数  
            
        });  
        modalInstance.result.then(function (result) { 
        	 alert(result);
        	 $scope.query();
             console.log(result);  
        }, function (reason) {  
            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel  
        });
      
    };
    $scope.showEdit2 = function(){
    	var modalInstance = $modal.open({  
            templateUrl: 'popupTmpl2.html',  
            controller: ModalInstanceCtrl
        });  
    	modalInstance.opened.then(function(){//模态窗口打开之后执行的函数  
            
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
    	//$http.defaults.headers.post['Acc ept'] = 'application/json, text/javascript, */*; q=0.01';  
    	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; 
    	
    	$scope.station={
    			jingdu:100,
    			weidu:100
    	};
    	$scope.save = function(){
    		$modalInstance.close("保存成功");
    	}
    };  
});

