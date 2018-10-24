<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.*"%>
<% 
String datetime=new SimpleDateFormat("yyyy-MM-dd").format(Calendar.getInstance().getTime()); //获取系统时间 
%>
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
		
		
		<link rel="stylesheet" href="${ctx }/shenhai/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx }/shenhai/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		<!-- basic styles -->
<style>
.right_div1{
	width:347px;
	height:110px;
	background:#368ff3;
	position:absolute;
	z-index:888;
	margin-top:5px;
}
.right_indiv1{
	font-size:12px;
	color:#fff;
	padding-top:12px;
	padding-left:30px;
	height:30px;
	width:50%;
	float:left;
}
.right_indiv3{
	position:absolute;
	top:40px;
	padding-left:105px;
	border-right:1px solid #dddddd;
	width:20px;
	height:60px;
	left:40px;
}
.right_div2{
	width:347px;
	height:95px;
	background:#50ae1a;
	position:absolute;
	z-index:999;
	margin-top:120px;
}
.right_div3{
	width:240px;
	height:80px;
	background:#c79500;
	position:absolute;
	z-index:999;
	top:270px;
	right:10px;
}
.right_div4{
	width:240px;
	height:160px;
	background:#fff;
	position:absolute;
	z-index:999;
	top:370px;
	right:10px;
}
.location1{
	width:125px;
	height:20px;
	position:absolute;
	bottom:30px;
	left:20px;
	color:#FFF;
	z-index:901;
}
.location2{
width:125px;
	height:20px;
	position:absolute;
	bottom:30px;
	left:300px;
	color:#FFF;
	z-index:901;
}
		#up_zzjs{border:1px solid #ccc;width:100%;height:400px;line-height:20px;overflow:hidden;background-color:white}
		#up_zzjs #up_li{list-style-type:none;margin:0;padding:0;margin-left:6px;}
		#up_zzjs #up_li a{font-size:12px; line-height:16px;}
</style>

	</head>

<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="common/top.jsp" %>
		<link href="<%=path %>/shenhai/css/map/openmap.css" rel="stylesheet"> 
		<%@ include file="common/textAngular.jsp" %>
		
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> <a href="${currMenu.curl }" title="${currMenu.cMenuName }" class="tip-bottom"><i class="icon-home"></i> 综合面板</a></div>
		    </div>
		    <div id="map" class="map">
		    	<div id="layerbox" class="layerbox usel" style="position:absolute;z-index:888;right: 0px; top: 10px; left: 40px">
					<div class="ui3-control-shadow" ng-click="showlayersControl();">
						<img class="ui3-control-icon" src="images/top/location 2.png" />
							<div class="ui3-control-span">&nbsp;&nbsp;站点列表</div>
					</div>
				
				</div>
				<div id='databox' class="layerbox usel" style="position:absolute;z-index:888;right: 40px; top: 10px;display:none" > 
				        <div id="up_zzjs">
							<div id="marqueebox">
							</div>
				 		</div> 
				 		
				 		<div id="a1">
				 		</div>
				</div>
				
				
				<div id='layersControl' class="widget-box"> 
				         <div class="widget-title">
				            	<h5>站点列表</h5> 
				             <div class="buttons">
				             		<a ng-click="showlayersControl();"><i class="icon-refresh"></i>关闭</a>
				             </div>
				         </div>
				         <div class="widget-contents">
				             <ul id="mtree" class="ztree"></ul>
				         </div>
				</div>
				  <div id="location" class="location1"></div>
		    </div>
</body>
<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/home/allhomeInfo.js"></script>
</html>
