var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter','ui.grid.pagination',
                                    'ui.grid.resizeColumns','ui.grid.selection'
                                    ,'ngDialog','ui.bootstrap','multi-select-tree']); 
var row;
var col;
var pub;
var mtype;
var station;
var myyChart;
var myyChart2;
var myyChart3;
var stationid;
var isInit=0;
myApp.controller('customersCtrl',function($scope,$http,ngDialog,$modal){
	
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
	    	  $scope.u.stationId = stationid;
	    	  $scope.updateStationStatus();
			 
		 });
	function beforeClick(treeId, treeNode, clickFlag) {
		if(treeNode.id.substring(0,1)!="S"){
			treeNode.click=false;
		}
		return (treeNode.click != false);
	}
	
	function zTreeOnClick(event, treeId, treeNode) {
		if(treeNode.id!=null){
			var stationname = treeNode.id;
	    	stationid = stationname.substring(1,stationname.length);
	    	 $scope.u.stationId = stationid;
			selectNode = treeNode.id;
			$scope.updateStationStatus();
		}
	};

	function showIconForTree(treeId, treeNode) {
		return !treeNode.isParent;
	};
	
	//开始分页信息
	$scope.gridOptions = {
			enableRowSelection:true,
			rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>",
			appScopeProvider: { 
		          onDblClick : function(row) {
		        	  mtype = 2;  //2 代表编辑对话框
		          	  station = row.entity;
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
		    exporterCsvFilename: '平均报表',
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		      gridApi.selection.on.rowSelectionChanged($scope,function(row){
		    	  firstpage = row.entity;
		      });
		    }
		  };
	
	
	$scope.updateStationStatus=function(){
		//根据站点ID,获得站点下属的参数列表
		var mparam = {id:$scope.u.stationId};
		var levelparam = {parentCode:'0017'};
		$http({  responseType:'json',
	   		 method:'POST',
				 url:'getPublicList.do',
				 params:levelparam,
				 headers: { 'Content-Type': 'application/json; charset=UTF-8'}
				 })
				 .success(function(response){
			    	 $scope.typelist = response;
			    	//查询条件初始化
			    	var stationParam = "";
			    	$http({  responseType:'json',
			    		 method:'POST',
			    		 url:'statisreportavg_init.do',
			    		 params:mparam})
			    		 .success(function(response){
			    			 if(isInit==0){
			    				 $scope.u.beginDate = response.beginDate;
				    			 $scope.u.collectType = response.collectType;
				    			 $scope.u.endDate = response.endDate;
				    			 $scope.u.statTypeTree = response.statTypeTree;
				    			 var indicators = response.indicatorTree;
				    			 $scope.u.indicatorTree=response.indicatorTree; 
				    			 isInit=1;
			    			 }else{
			    				 var indicators = response.indicatorTree;
				    			 $scope.u.indicatorTree=response.indicatorTree; 
			    			 }
			    			 if(indicators[0]["children"].length==0){
			    				 $scope.gridOptions.data=[];
									row=[];
									showData("");
			    			 }
			    			 setTimeout(function (){
			    					$scope.query();
			    				}, 1000);
			    	     });
	   	}); 
		
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
	
	$scope.query = function(){
		var endDate = $('#endDate').val();
		 var startDate = $('#startDate').val();
		 if(startDate==null||startDate==""){
				alert("开始时间为空");
				return;
			}else if(endDate==null||endDate==""){
				alert("结束时间为空");
				return;
			}else{
				if(ifBeginLaterEnd(startDate,endDate)){
					alert("开始时间要早于结束时间");
					return;
				}
			}
		if($scope.u.indicatorIds==null||$scope.u.indicatorIds==""){
				alert("请选择参数");
				return;
				
		}
		//获得统计参数
		var indicatorIds = "";
		angular.forEach($scope.u.indicatorIds, function ( item ) {
			indicatorIds = item.id;
	    });
		if(indicatorIds==null||indicatorIds==""){
				alert("请选择监测参数");
				return;
		}
		//获得统计类型
		var statTypes = "0";
		angular.forEach($scope.u.statTypes, function ( item ) {
			statTypes = statTypes +","+item.id;
	    });
		if(statTypes=="0"){
			alert("请选择监测类型");
			return ;
		}
		var queryParam = {
				stationId:$scope.u.stationId,
				indicatorIds:indicatorIds,
				beginDate:startDate,
				endDate:endDate,
				collectType:$scope.u.collectType,
				statTypes:statTypes
		};
		console.log(queryParam);
			$(".scbtn").attr('disabled',"true");
			 $http({  responseType:'json',
				 method:'POST',
				 url:'statisreportavg_show.do',
				 params:queryParam}) 
				 .success(function(response){
					 var pageResult = response.pageResult;
					 $(".scbtn").removeAttr("disabled"); 
					  row = pageResult.rows;
					  col = pageResult.cols;
					  
					  $scope.gridOptions.columnDefs = col;
					  $scope.gridOptions.data = row;
					  showData(response);
			 });
	};
   
	
});

function showData(response){
	
	
	
    	
	var alldata = response.datas;
	var result = new Array();	
	var step = 1;
	
	if(response.length!=0){
	for(var j=0;j<alldata.length;j++){
		var stationdata = alldata[j].datas;
		var size = stationdata.length;
		if(size>10){
			step = Math.ceil(size/10);
		}
		var res = new Array();
		for(var i = 0;i < stationdata.length; i++) {
			var ves = new Array();
			ves.push(stationdata[i].xtime);
			ves.push(stationdata[i].ydata);
			res.push(ves);
		}
		if(response.length!=0){
		var par = {
				name:alldata[j].fieldName,
				data:res
		};
		}else{
			var par = {
					name:"",
					data:""
			};
		}
		result.push(par);
	}
	}
	if(response.length==0){
		$('#container').highcharts({
			plotOptions:{
	            series:{
	                turboThreshold:100000//set it to a larger threshold, it is by default to 1000
	            }
	        },
	        chart: {
	            zoomType: 'x'
	        },
	        title: {
	            text: '走势图'
	        },
	        subtitle: {
	            text: document.ontouchstart === undefined ?
	            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
	        },
	        xAxis: {
	        	type: 'category',
	        	labels: { 
	        		step:step,	
	                formatter: function() { 
	                               return  this.value; 
	                } 
	            } 
	        },
	        credits: {
	        	enabled: false
	    	},
	        tooltip: {
	        	formatter: function () {
					return '' + this.key +
					'的数值  <b>' + this.y + '</b>';
				},
	            borderWidth: 0,
	            backgroundColor: 'none',
	            pointFormat: '{point.y}',
	            headerFormat: '',
	            shadow: false,
	            style: {
	                fontSize: '15px'
	            }
	        },
	        yAxis: {
	            title: {
	                text: ""
	            }
	        },
	        legend: {
	            enabled: true
	        },
	        
	        series: result
	    });	
	}else{
		$('#container').highcharts({
			plotOptions:{
	            series:{
	                turboThreshold:100000//set it to a larger threshold, it is by default to 1000
	            }
	        },
	        chart: {
	            zoomType: 'x'
	        },
	        title: {
	            text: response.indicator.title + '走势图'
	        },
	        subtitle: {
	            text: document.ontouchstart === undefined ?
	            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
	        },
	        xAxis: {
	        	type: 'category',
	        	labels: { 
	        		step:step,	
	                formatter: function() { 
	                               return  this.value; 
	                } 
	            } 
	        },
	        credits: {
	        	enabled: false
	    	},
	        tooltip: {
	        	formatter: function () {
					return '' + this.key +
					'的数值  <b>' + this.y + '</b>';
				},
	            borderWidth: 0,
	            backgroundColor: 'none',
	            pointFormat: '{point.y}',
	            headerFormat: '',
	            shadow: false,
	            style: {
	                fontSize: '15px'
	            }
	        },
	        yAxis: {
	            title: {
	                text: response.indicator.unitName
	            }
	        },
	        legend: {
	            enabled: true
	        },
	        
	        series: result
	    });	
		
	}
	
}
