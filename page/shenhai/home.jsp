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
				#up_zzjs{border:1px solid #ccc;width:100%;height:220px;line-height:20px;overflow:hidden;}
				#up_zzjs p{color: black;position: static;font-weight:blod;}      
				
				#up_zzjs #up_li{list-style-type:none;margin:0;padding:0;margin-left:6px;}
				#up_zzjs #up_li a{font-size:12px; line-height:16px;}
		</style>

	</head>

	<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="common/top.jsp" %>
		<link rel="stylesheet" href="${ctx}/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx}/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		<script src="${ctx}/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx}/resources/highcharts-ng/highstock.src.js"></script>
		<%@ include file="common/textAngular.jsp" %>
		<div id="content" style="height:98vh">
			<div id="content-header">
			    <div id="breadcrumb"> <a href="${currMenu.curl }" title="${currMenu.cMenuName }" class="tip-bottom"><i class="icon-home"></i> 综合面板</a></div>
		    </div>
		    <div class="row-fluid">
		    <div class="span2" >
		    	<div class="widget-box">
					<div class="widget-title">
			            	 <h5>监测点列表</h5>
					</div>
					<div class="widget-content nopadding">
						<ul class="recent-posts" style="overflow:auto;">
							 <li ng-repeat="x in stations" id="{{x.stationId}}" name="station" 
							       class="well " style="cursor:pointer;padding:0px 0px 5px 10px"  
							       ng-click="showStationDetail(this.x)">
							       <div class="form-group">
								          <div class="user-thumb"> 
								             	<img alt="User" style="height:100%;width:100%" ng-src="{{x.pic}}"> 
								          </div>
							              <div class="article-post"> 
							                    <h5>{{x.title}}</h5>
										          <a>运行正常</a> 
							              </div>
								  </div>
							 </li>
						</ul>
					</div>
				</div>
		    </div>
		    <div class="span10 span10 nopadding">
			    <div class="row-fluid nopadding">
			    	<div class="span9 " >
			    		<div class="widget-box nobackground-corlor nopadding" style="height:40vh">
				    		    <div class="widget-title">
						    		<h5>{{station.title}}站点水质趋势{{param.beginDate}}至{{param.endDate}}</h5>
						    	</div>
						    	<div class="widget-content noborder nopadding" style="height:auto;text-align: center;">
									<div id="linecontainer" ></div>
						    	</div>
				    	</div>
			    	</div>
			    	
			    	<div class="span3 ui-sortable" >
			    		<div class="widget-box nobackground-corlor nopadding" style="height:40vh">
			    			<div class="widget-title">
					    		<h5>{{station.title}}站点实时数据</h5>
					    	</div>
					    	<div class="widget-content noborder nopadding" style="text-align: center;">
								<div id="firstBox" class="firstBox">
								</div>
					    	</div>
			    		</div>
			    	</div>
			    	
			    </div>
			     <div class="row-fluid ">
			    	<div class="span3" >
			    		<div class="widget-box nobackground-corlor nopadding" style="height:40vh">
			    			<div class="widget-title">
					    		<h5>{{station.title}}站点当前水质</h5>
					    	</div>
					    	<div class="widget-content noborder nopadding" style="height:auto;text-align: center;">
					    		<img id="gradeImg" alt="" src="" style="margin-top:20px;width:70%;height:80px;">
					    		</br>
					    		<h4>当前水质等级:{{stand.standardName}}</h4>
					    		</br>
					    		<h4>{{stand.standValue}}</h4>
					    	</div>
			    		</div>
			    	</div>
			    	<div class="span3">
				    	<div class=" widget-box nobackground-corlor nopadding" style="height:40vh">
				    			<div class="widget-title">
						    		<h5>{{station.title}}站点水质统计{{param.beginDate}}至{{param.endDate}}</h5>
						    	</div>
						    	<div class="widget-content noborder nopadding" style="height:auto;text-align: center;">
									<div id="piecontainer" ></div>
						    	</div>
				    	</div>
			    	</div>
			    	<div class="span6">
				    	<div class=" widget-box nobackground-corlor nopadding" style="height:40vh">
				    			<div class="widget-title">
						    		<h5>预警告警信息</h5>
						    	</div>
						    	<div class="widget-content noborder nopadding" style="height:auto;text-align: center;">
									<div id="warnBox" class="firstBox">
									</div>
						    	</div>
				    	</div>
			    	</div>
			    </div>
		    </div>
		    </div>
		</div>
<script src="${ctx }/shenhai/js/home/homeInfo.js"></script>
</body>
</html>
