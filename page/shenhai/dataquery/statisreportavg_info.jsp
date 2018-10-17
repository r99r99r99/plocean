<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html >
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<title>${system.systemName }</title>
		<meta name="keywords" content="入海污染源" />
		
		
		<link rel="stylesheet" href="${ctx}/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		<!-- basic styles -->
<style>
	 .chartsLine {
					width: 100%;
					display:inline;
					float:left; 
				}
				.oneCharts {
					width: 100%;
					height:80%;
					display:inline;
					float:left; 
				}
				.twoCharts {
					width: 50%;
					height:80%;
					display:inline;
					float:left; 
				}
				.threeCharts {
					width: 50%;
					height:80%;
					display:inline;
					float:left; 
				}
#treecontrol{  
              background-color: rgb(255,255,255);  
              border:1px solid #888888;  
              position:absolute;  
              z-index:555;  
              left:20px;  
              top:50px;  
              width:245px;
          }  
</style>		
		
		
	</head>

<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		<link href="<%=path %>/shenhai/css/map/openmap.css" rel="stylesheet"> 
		<%@ include file="../common/textAngular.jsp" %>
		
		<link rel="stylesheet" href="${ctx }/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script src="${ctx}/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx}/resources/highcharts-ng/highstock.src.js"></script>
		<script src="${ctx}/resources/highcharts-ng/exporting.js"></script>
		
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/resources/My97DatePicker/WdatePicker.js"></script>
		
		
		<div id="content2">
			<div id="content-header">
			    <div id="breadcrumb"> ${currMenu.pMenuName }
			    	<a title="${currMenu.cMenuName }" class="tip-bottom"><i class="icon-home"></i> 
			    	${currMenu.cMenuName }</a></div>
		    </div>
		    <div class="widget-content nopadding">
		    	<div class="chat-users panel-right2">
		    		<div class="panel-title">
		    			<h5>站点列表</h5>
		    		</div>
		    		<div class="panel-content nopadding">
			    		<ul id="mtree" class="ztree"></ul>
		    		</div>
		    	</div>
		    	
		    	<div class="chat-content panel-left2">
		    		<div class="container-fluid">
		    		<ul class="seachform">
					<input type="hidden" ng-model="u.stationId" />
					<li><label>参数:</label>
					    <div class="vocation">
						    <multi-select-tree data-input-model="u.indicatorTree" multi-select="false" ng-model="indicator"
                                   data-output-model="u.indicatorIds" data-default-label="请选择监测参数."
                                   data-callback="selectOnly1Or2(item, selectedItems)"
								   data-switch-view-callback="switchViewCallback(scopeObj)"
                                   data-select-only-leafs="true"
                                   data-switch-view="false"> 
							</multi-select-tree>
					    </div>
				    </li>
				    <li><label>统计类型:</label>
					    <div class="vocation">
						    <multi-select-tree data-input-model="u.statTypeTree" multi-select="true" ng-model="indicator"
                                   data-output-model="u.statTypes" data-default-label="请选择统计类型."
								   data-switch-view-callback="switchViewCallback(scopeObj)"
                                   data-select-only-leafs="true"
                                   data-switch-view="false">
							</multi-select-tree>
					    </div>
				    </li>
				    <li><label>统计口径:</label>
					    <div class="vocation">
						    <select id="selectError" ng-model="u.collectType" class="col-xs-10 col-sm-12" name="collectType"
                              ng-change="query()" 
							  ng-options="option.classId as option.value for option in typelist" required>
							 </select>
					    </div>
				    </li>
				    <li><label>开始时间:</label>
				    <div class="vocation">
				    	<input name="startDate" ng-model="u.beginDate" id="startDate" 
				    	placeholder="开始时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" 
				    	onchange="timeChange()" class="scinput" >
			        </div>
				    </li>
				    <li><label>结束时间:</label>
				    <div class="vocation">
				    	<input name="endDate" ng-model="u.endDate" id="endDate" placeholder="结束时间" value="${endDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" class="scinput" >
			        </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    </ul>
				    </div>
				    <div class="container-fluid11">
						<div class="row-fluid">
							    <div  ui-grid="gridOptions" ui-grid-selection ui-grid-pagination ui-grid-exporter class="gridStyle2" style="height:40vh;"></div>
 								<div id="container" style="height:40vh;"></div>
						</div>
					</div>	
		    	</div>
		    </div>
		    
		</div>
<link rel="stylesheet" href="${ctx }/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/dataquery/statisreportavg_info.js"></script>
</body>
</html>
