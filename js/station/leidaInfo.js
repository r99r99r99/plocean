var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter',
                                    'ngTouch','ui.grid.resizeColumns','ui.grid.selection',
                                    'textAngular','ui.bootstrap','highcharts-ng','ngDialog','ui.grid.cellNav', 'ui.grid.pinning']); 
var deviceId;
var stationId;
myApp.controller('customersCtrl',function($scope,$http,$timeout,$modal){
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	
	var mm = "";
	$http({  responseType:'json',
		 method:'POST',
		 url:'getCurrStation.do',
		 params:mm})
		 .success(function(res){
			 var x = res.id;
			 if(x%2==0){
				 res.icon = res.icon.replace('.','_green.');
			 }
			 var map =new BMap.Map('allmap', {mapType:BMAP_HYBRID_MAP,minZoom:6,maxZoom:11}); 
			 map.centerAndZoom(new BMap.Point(res.latitude, res.longitude), 6);
			 var icon = new BMap.Icon('images/station/icon/'+res.icon, new BMap.Size(20, 32), {  
				 anchor: new BMap.Size(10, 30)  
			 });
			 var mkr =new BMap.Marker(new BMap.Point(res.latitude, res.longitude), {  
					icon: icon  
			 }); 
			 var infomation = res.pic
             + "<br><h4>"+ res.title + '</h4>位于坐标:北纬'+res.latitude+"  东经"+res.longitude
             +"<br>"+res.brief;

			var liaoheview = new BMap.InfoWindow(infomation);
			// var liaoheview = new BMap.InfoWindow(res.brief);
			 mkr.addEventListener("click", function(){        //给标注添加点击事件
				    this.openInfoWindow(liaoheview);
				});
			map.addOverlay(mkr); 
				
			map.setCurrentCity("烟台");          // 设置地图显示的城市 此项是必须设置的
			map.enableScrollWheelZoom(true); 
			 
		 });
});

