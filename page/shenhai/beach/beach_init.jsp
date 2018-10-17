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
		<title>${system.systemName }</title>
		<meta name="keywords" content="入海污染源" />
		<!-- basic styles -->
		<link href="<%=path %>/shenhai/css/map/openmap.css" rel="stylesheet"> 
		
		<style>
				#up_zzjs{border:1px solid #ccc;width:100%;height:50vh;line-height:20px;overflow:hidden;}
				#up_zzjs p{color: black;position: static;font-weight:blod;}      
				
				#up_zzjs #up_li{list-style-type:none;margin:0;padding:0;margin-left:6px;}
				#up_zzjs #up_li a{font-size:12px; line-height:16px;}
		</style>

	</head>

	<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		<link rel="stylesheet" href="${ctx}/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		<script src="${ctx}/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx}/resources/highcharts-ng/highstock.src.js"></script>
		<%@ include file="../common/textAngular.jsp" %>
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> <a href="${currMenu.curl }" title="${currMenu.cMenuName }" class="tip-bottom"><i class="icon-home"></i> 综合面板</a></div>
		    </div>
		    <div class="row-fluid ">
			    <div class="span6 " >
				    <div id="map" class="littlemap">
				    	<div id="popup"></div>
				    </div>
				</div>
				<div class="span3" >
				    <div class="widget-box nobackground-corlor nopadding" style="height:40vh">
				    	<div class="widget-title">
				    		<h5>海水浴场评价&nbsp;&nbsp;{{station.title}}</h5>
				    	</div>
				    	<div class="widget-content noborder nopadding" style="height:auto">
				    		<div id="shantainer"  style="width:100%;height:33vh">
				    			<div class="span6 " >
					    			<img ng-src="{{r.src}}" style="width:100%;"/>
				    			</div>
				    			<div class="span6 " style="padding:12px">
				    				<h5>{{r.badReasons}} </h5>
				    			</div>
				    			<div class="span12 " >
					    			<h5>&nbsp;&nbsp;&nbsp;&nbsp;{{r.qualityRemark}} </h5>
				    			</div>
				    			<div class="span12 " >
					    			<!-- <h5>&nbsp;&nbsp;&nbsp;&nbsp;{{r.healthyPoint}} </h5> -->
					    			<h5>&nbsp;&nbsp;&nbsp;&nbsp;健康指数为:{{r.healthyPoint.point}}分,评分最低的是:{{r.healthyPoint.name}} </h5>
				    			</div>
				    		</div>
				    	</div>
				    </div>
				</div>
				<div class="span3" >
				    <div class="widget-box nobackground-corlor  nopadding" style="height:40vh">
				    	<div class="widget-title">
				    		<h5>游泳指数统计{{begin}}到{{end}}</h5>
				    	</div>
				    	<div class="widget-content noborder nopadding" style="height:auto">
				    		<div id="piecontainer" style="height: 20px; "></div>
				    	</div>
				    </div>
				</div>
			</div>
			
			<div class="row-fluid ">
				<div class="span5" >
				    <div id='lastbox' ></div>
				</div>
				<div class="span7" >
					<div id="linecontainer" ></div>
				</div>
			</div>
		</div>
<script src="${ctx }/shenhai/js/beach/beach_init.js"></script>
</body>
</html>
