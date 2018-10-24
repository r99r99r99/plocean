var myApp = angular.module('myApp',['ngDialog','ui.bootstrap','multi-select-tree']); 
var row;
var col;
var pub;
var mtype;
var station;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	var stationids = "0";
	$scope.u = {};
	//$scope.title = "";
	//查询条件初始化
	var stationParam = "";
	$http({
		 method:'POST',
		 url:'comparison_init.do',
		 params:stationParam})
		 .success(function(response){
			 $scope.u=response;
	     });
	
	$scope.selectOnly1Or2 = function(item, selectedItems){
		//判断当前的选中的参数与之前的是否一致
		var ids = "0";
		angular.forEach(selectedItems, function ( st ) {
			ids = ids + "," + st.id;
	    });
		if(ids != stationids){
			stationids = ids;
			if(stationids!="0"){
				$scope.getIndicatorTreeByStations(stationids);
			}
		}
		
	};
	
	$scope.selectIndicator=function(item, selectedItems){
		if(item.name=="参数列表"){
			return false;
		}
	};
	
	//通过站点列表,查询站点共同的参数列表
	
	$scope.getIndicatorTreeByStations=function(stationIds){
		var param = {
				stationIds:stationIds
		};
		$http({
			 method:'POST',
			 url:'getIndicatorTreeByStations.do',
			 params:param})
			 .success(function(response){
				 $scope.u.indicatorTree = response;
		     });
	}
	
	$scope.query = function(){
		var endDate = $('#endDate').val();
		 var startDate = $('#startDate').val();
		 if(ifBeginLaterEnd(startDate,endDate)){
				$(".btn-primary").removeAttr("disabled");
				return;
		};
		$scope.u.beginDate = startDate;
		$scope.u.endDate = endDate;
		var stationIds = "0";
		
		angular.forEach($scope.u.stationids, function ( item ) {
			stationIds = stationIds +","+item.id;
	    });
		
		var indicatorCode = "0";
		var i = 0;
		angular.forEach($scope.u.indicatorids, function ( item ) {
			indicatorCode = item.id;
	    });
		if(indicatorCode==null||indicatorCode=="0"){
			return;
		}
		//$(".btn-primary").attr('disabled',"true");
		var queryParam = {
				stationIds:stationIds,
				indicatorCode:indicatorCode,
				beginDate:$scope.u.beginDate,
				endDate:$scope.u.endDate
		};
		 $http({
			 method:'POST',
			 url:'getComparisonResult.do',
			 params:queryParam}) 
			 .success(function(response){
				 console.log(response);
				 $(".btn-primary").removeAttr("disabled");
				 showData(response);
		 });
		
	};
   
	setTimeout(function (){
		$scope.query();
	}, 1000);
});
function showData(response){
	var plots = response.plotLines;
    
    var plotArray=eval(plots);
    var plotLines = new Array();
    $.each(plotArray,function(n,plot){
    	var plotLine={
    			color:plot.color,           //线的颜色，定义为红色
		        dashStyle:plot.dashStyle,     //默认值，这里定义为实线
		        value:plot.value,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
		        width:plot.width,              //标示线的宽度，2px
		        label:{
		            text:plot.text,     //标签的内容
		            align:plot.align,                //标签的水平位置，水平居左,默认是水平居中center
		            x:plot.x                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
		        }
    	};
    	plotLines.push(plotLine);
    });
    	
	var alldata = response.data;
	var result = new Array();
	for(var j=0;j<alldata.length;j++){
		var stationdata = alldata[j].datas;
		
		var res = new Array();
		for(var i = 0;i < stationdata.length; i++) {
			var ves = new Array();
			ves.push(new Date(stationdata[i].xtime).getTime() + 1000*60*60*8);
			ves.push(stationdata[i].ydata);
			res.push(ves);
		}
		var par = {
				name:alldata[j].station.title,
				data:res
		};
		result.push(par);
	}
	
	$('#container').highcharts({
		plotOptions:{
            series:{
                turboThreshold:100000//set it to a larger threshold, it is by default to 1000
            }
        },
        chart: {
            zoomType: 'x',
        },
        title: {
            text: response.indicator.title + '走势图'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            labels: { 
                formatter: function() { 
                        
                               return  Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value); 
                } 
            } 
        },
        credits: {
        	enabled: false
    	},
        tooltip: {
        	formatter: function () {
				return dateFtt("yyyy-MM-dd hh:mm:ss",new Date(this.x-1000*60*60*8))+
				'的数值  <b>' + this.y + '</b>';
			},
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            style: {
                fontSize: '15px'
            },
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        yAxis: {
            title: {
                text: response.indicator.unitName
            },
            plotLines:plotLines
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: result
    });	
        
}

