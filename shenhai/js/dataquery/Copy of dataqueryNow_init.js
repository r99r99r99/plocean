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
	
	//展示出左侧的站点列表
	var t = $("#mtree");
		//读取组织树下的站点列表
		$.ajax({
	      url: 'getStationList4ZTree.do', //url  action是方法的名称
	      data: '',
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
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
	    	  $scope.updateStationStatus();
	      },
	      error: function(msg) {
	         
	      }
		}); 
		function zTreeOnClick(event, treeId, treeNode) {
			if(treeNode.id!=null){
				selectNode = treeNode.id;
				if(selectNode.substring(0, 1)=="S"){
					stationid = selectNode.substring(1,selectNode.length);
					$scope.updateStationStatus();
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
		
		 $scope.updateStationStatusintervalId=function(){
			   stationintervalId = setInterval(function() {
				   $scope.updateStationStatus();
				}, "10000"); //每隔10S刷新数据  
		   }
		 
		$scope.updateStationStatus=function(){
			var airContent = new Array();
			var zparams = {
					id:stationid
			};
			console.log(stationid);
			$http({
				 method:'POST',
				 url:'getlastdataNow.do',
				 params:zparams})
				 .success(function(res){
						airContent.push('<div class="row-fluid">');	
						//开始编写实时数据部分
						var lastData = res.Datas;
						for(var p in lastData){
								/* airContent.push('<div class="widget-header " >'); */
							var lastTime = lastData[p].lastTime;
							var pointNum = lastData[p].pointNum;
							if(lastTime == null){
								lastTime = ' ';
							}
							airContent.push('<div class="span6">');	
							airContent.push('<div class="widget-box">');
							airContent.push('<div class="widget-title">');
							airContent.push('<h5 class="bigger lighter">');
							airContent.push('<i class="icon-table"></i>');
							airContent.push(lastData[p].deviceName+'  更新时间：'+lastTime);
							airContent.push('</h5>');
							airContent.push('</div>');
							airContent.push('<div class="widget-content nopadding">');
							airContent.push('<table class="table table-striped table-bordered table-hover">');
							airContent.push('<tbody>');
							var rdata = lastData[p].MetaDatas;
							var n = 0;
							for(var m in rdata){
								if(m%2==0){
									airContent.push('<tr>');
									airContent.push('<td style="width: 50%">'+rdata[m].indicatorTitle+':<span >'
								               +rdata[m].dataValue+'</span></td>');
									
								}else{
									airContent.push('<td  >'+rdata[m].indicatorTitle+':<span >'
								               +rdata[m].dataValue+'</span></td>');
									airContent.push('</tr>');
								}
								n = m;
						     }
							if(n>0&&n%2==0){
								airContent.push('<td  ><span style="font-size:15px;"></span></td>');
								airContent.push('</tr>');
							}
							airContent.push('</tbody>');
							airContent.push('</table>');
							airContent.push('</div>');
							airContent.push('</div>');
							airContent.push('</div>');
						}
				airContent.push('</div>');
				$("#datashow").html(airContent.join(""));
				 });
		};
		$scope.updateStationStatusintervalId();
});
