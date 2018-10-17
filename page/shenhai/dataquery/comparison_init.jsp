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
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/resources/My97DatePicker/WdatePicker.js"></script>
		<script src="${ctx}/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx}/resources/highcharts-ng/highstock.src.js"></script>
		
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> ${currMenu.pMenuName }
			    	<a  class="tip-bottom"><i class="icon-home"></i> 
			    	${currMenu.cMenuName }</a></div>
		    </div>
		    <div class="widget-contents nopadding">
		    	 <div class="container-fluid">
		    		<ul class="seachform">
					<li><label>站点:</label>
					    <div class="vocation">
						    <multi-select-tree data-input-model="u.stationTree" multi-select="true" ng-model="station"  
                                   data-output-model="u.stationids" data-default-label="请选择对比站点."
                                   data-callback="selectOnly1Or2(item, selectedItems)"
								   data-switch-view-callback="switchViewCallback(scopeObj)"
                                   data-select-only-leafs="true"
                                   data-switch-view="true">
							</multi-select-tree>
					    </div>
				    </li>
				    <li><label>参数:</label>
					    <div class="vocation">
						    <multi-select-tree data-input-model="u.indicatorTree" multi-select="false" ng-model="indicator" 
                                   data-output-model="u.indicatorids" data-default-label="请选择对比参数."
                                   data-callback="selectIndicator(item, selectedItems)"
                                   
                                   data-select-only-leafs="true"
                                   data-switch-view="false">
							</multi-select-tree>
					    </div>
				    </li>
				    <li><label>开始时间:</label>
				    <div class="vocation">
				    	<input name="startDate" ng-model="u.beginDate" id="startDate" placeholder="开始时间"  value="${endDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" class="scinput" >
			        </div>
				    </li>
				    <li><label>结束时间:</label>
				    <div class="vocation">
				    	<input name="endDate" ng-model="u.endDate" id="endDate" placeholder="开始时间" value="${endDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="scinput" >
			        </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    </ul>
				  </div>
				    <!-- 以下展示的是数值类型 -->
				    <div class="container-fluid">
						<div id="container" style="height:65vh;"></div>
					</div>
		    </div>
		    
		</div>
</body>

<link rel="stylesheet" href="${ctx }/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script src="${ctx }/shenhai/js/dataquery/comparison_init.js"></script>
</html>
