var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 
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
	
	//初始化查询条件的开始时间以及结束时间
	var stationParam = "";
	$http({  responseType:'json',
		 method:'POST',
		 url:'synthquery_init.do',
		 params:stationParam})
		 .success(function(response){
			 $scope.u.beginDate=response.beginDate;
			 $scope.u.endDate=response.endDate;
	     });
	
	
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
	    	  stationid = first_id.substring(1,first_id.length);
			  $scope.updateStationStatus(stationid);
			 
		 });
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.updateStationStatus(stationid);
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
		
		$scope.updateStationStatus=function(stationid){
			 	$(".scbtn").attr('disabled',"true");
				//根据站点得到下属的参数的列表
				var dparam = {id:stationid};
				$http({  responseType:'json',
					 method:'POST',
					 url:'getIndicators4StationDevice4Show.do',
					 params:dparam}) 
					 .success(function(response){
						 $scope.u.indicatorTree= response;
						 setTimeout(function (){
								$scope.query();
						 }, 1000);
				 });
		};
		//初始化定义表格
		$scope.gridOptions = {
				enableRowSelection:true,
				rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
				appScopeProvider: { 
			          onDblClick : function(row) {
			        	  station = row.entity;
			          	  $scope.showEdit();
			          }
			    },
			    multiSelect:false,
			    modifierKeysToMultiSelect :false,
			    noUnselect:true,
			    enableRowSelection: true,
			    enableRowHeaderSelection:false,
			    headerRowHeight: 50,
			    paginationPageSizes: [25, 50, 100],
				paginationPageSize: 25,
				enableColumnResizing:true,
			    enableGridMenu: true,
			    enableSelectAll: true,
			    exporterCsvFilename: '数据列表',
			    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			    onRegisterApi: function(gridApi){
			      $scope.gridApi = gridApi;
			      gridApi.selection.on.rowSelectionChanged($scope,function(row){
			      });
			    }
			  };
		
		function ifBeginLaterEnd(startDate,endDate){
			endDate = endDate.replace(/-/g,"/");
			startDate = startDate.replace(/-/g,"/");
			var end = new Date(endDate);
			var start = new Date(startDate);
			if(start>=end){
				return true;
			}
			return false;
		}
	   //执行查询语句
		$scope.query=function(){
			 $(".scbtn").attr('disabled',"true");
			 var endDate = $('#endDate').val();
			 var startDate = $('#startDate').val();
			 if(ifBeginLaterEnd(startDate,endDate)){
					$(".btn-primary").removeAttr("disabled");
					return;
			};
			if($scope.u.indicatorIds==null||$scope.u.indicatorIds==""){
				alert("请选择参数");
				return ;
			}
			var indicatorIds = "0#0";
			
			angular.forEach($scope.u.indicatorIds, function ( item ) {
				indicatorIds = indicatorIds +","+item.id;
		    });
			var queryParam = {
					stationId:stationid,
					indicatorIds:indicatorIds,
					beginDate:startDate,
					endDate:endDate
			};
			$(".btn-primary").attr('disabled',"true");
			 $http({  responseType:'json',
				 method:'POST',
				 url:'graphShow4echarts.do',
				 params:queryParam}) 
				 .success(function(response){
					 console.log(response);
					 $(".scbtn").removeAttr("disabled");
					 showData(response);
			 });
		};
});

function showData(res){
	var yaxs = [];
	var yax = 0;
	var series = new Array();
	$.each(res, function (i, dataset) {
		var result = dataset.result;
		var dataList = dataset.data;
		var list = dataList;
		var servie = {
				name: result.title,
	            type: 'spline',
	            yAxis: yax,
	            tooltip: {
	                valueSuffix: ' '+result.unitName
	            },
	            unit:result.unitName,
	            cropThreshold:100000,//设置能够缩放的 
		        // Define the data points. All series have a dummy year
		        // of 1970/71 in order to be compared on the same x axis. Note
		        // that in JavaScript, months start at 0 for January, 1 for February etc.
		        data:list
		    };
		var yaxi = { // Primary yAxis
		        labels: {
		            format: '{value}'+result.unitName,
		            style: {
		                color: Highcharts.getOptions().colors[yax]
		            }
		        },
		        title: {
		            text: result.title,
		            style: {
		                color: Highcharts.getOptions().colors[yax]
		            }
		        }
		    };
		if(yax>0){
			yaxi.opposite = true;//设置纵坐标的位置在右边
		}
		
		yax = yax + 1;
		yaxs.push(yaxi);
		
		series.push(servie);
	});
	var chart = Highcharts.chart('container', {
		 plotOptions:{
	            series:{
	                turboThreshold:1000000//set it to a larger threshold, it is by default to 1000
	            },
	            spline: {
		            marker: {
		                enabled: true
		            }
		        }
		 },
	    chart: {
	    	/*type: 'area',
	        zoomType: 'x',
	        panKey: 'shift'*/
	        	
	        type: 'spline',
	        zoomType: 'xy',   //鼠标缩放方式 
	        panning: true,
	        /*marginLeft: 40, // Keep all charts left aligned*/
	        spacingTop: 20,
	        spacingBottom: 20,
	        backgroundColor: '#ffffff'
	    },
	    title: {
	    	 text: '综合趋势参数对比',
	         align: 'center',
	         margin: 0,
	         x: 30
	    },
	    credits: {   //版权信息
	           enabled: false
	    },
	    legend: {  //图例说明
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
	    xAxis: {
	        type: 'datetime',
	        dateTimeLabelFormats:{
	        	second: '%m-%d %H:%M:%S',
	        	minute: '%m-%d %H:%M',
	        	hour: '%m-%d %H',
	        	day: '20%y-%m-%d',
	        	week: '%e. %m',
	        	month: '20%y-%m',
	        	year: '20%Y'
	        },
	        crosshair: true,
	        title: {
	            text: null
	        }
	    },
	    yAxis:yaxs,
	    tooltip: {
	    	shared: true,
	        headerFormat: '<b>{point.x:20%y-%m-%d %H:%M}</b><br>',
	        pointFormatter:function(){
	        	 return '<span style="color: '+ this.series.color + '">\u25CF</span> '+
	             this.series.name+': <b>'+ this.y +'</b>'+this.series.userOptions.unit+'<br/>'
	        }
	    },
	    series: series
	});
}
