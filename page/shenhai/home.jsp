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

	<body class="no-skin" ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="common/top.jsp" %>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highstock.src.js"></script>
		<%@ include file="common/textAngular.jsp" %>
		<div class="main-container ace-save-state" id="main-container">
			<%@ include file="common/left.jsp" %>
			<div class="main-content">
				<div class="main-content-inner">
					<div class="breadcrumbs ace-save-state" id="breadcrumbs">
						<ul class="breadcrumb">
							<li>
								<i class="ace-icon fa fa-home home-icon"></i>
								<a href="#">${currMenu.pMenuName }</a>
							</li>

							<li class="active">${currMenu.cMenuName }</li>
						</ul><!-- /.breadcrumb -->
					</div>

					<div class="page-content">
						<%@ include file="common/setting.jsp" %>
						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
									<div class="row">
										<div class="col-xs-2" >
								    		<div class="widget-box widget-color-blue2 ui-sortable-handle" style="height:40vh">
								    			<div class="widget-header">
										    		<h5 class="widget-title">{{station.title}}站点设备状态</h5>
										    	</div>
										    	<div class="widget-body noborder nopadding" style="text-align: center;">
													<div id="statusBox" class="firstBox">
													</div>
										    	</div>
								    		</div>
								    	</div>
								    	
										<div class="col-xs-8">
											<div id="map" class="littlemap">
												<div id="popup"></div>
												<div id="location" class="location1"></div>
												<div id="layerbox" class="layerbox usel" style="position:absolute;z-index:444;right: 0px; top: 8px; left: 8px">
													 <div class="ui3-control-shadow" ng-click="showlayersControl();">
													 	<img class="ui3-control-icon" src="shenhai/images/icon/location2.png" />
													 	<div class="uicontrols">&nbsp;&nbsp;站点列表</div>
													 </div>
												</div>
												<div id='layersControl'> 
												    <div class="widget-box">
												        <div class="widget-body nopadding">
												        		<div id="profile-feed-1" class="profile-feed nopadding">
												        			<div class="profile-activity "
												        			  ng-repeat="x in stations" id="{{x.stationId}}" name="station" ng-click="showStationDetail(this.x)">
												        				<div >
																			<img class="pull-left" alt="Alex Doe's avatar" ng-src="{{x.pic}}" />
																			<a class="user" href="#"> {{x.title}} </a>
																			<div class="time">
																				<i class="ace-icon fa fa-clock-o bigger-110"></i>
																				运行正常
																			</div>
																		</div>
												        			</div>
												        		</div>
												        	<!-- <ul class="recent-posts" style="height:200px;overflow:auto;">
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
												        	</ul> -->
												    	</div>
												    </div>
												</div>
											</div>
										</div>
										
										<div class="col-xs-2" >
								    		<div class="widget-box widget-color-blue2 ui-sortable-handle" style="height:40vh">
								    			<div class="widget-header">
										    		<h5 class="widget-title">{{station.title}}站点实时数据</h5>
										    	</div>
										    	<div class="widget-body noborder nopadding" style="text-align: center;">
													<div id="firstBox" class="firstBox">
													</div>
										    	</div>
								    		</div>
								    	</div>
									</div>
									
									<div class="row ">
										<div class="col-xs-3">
											<div class="widget-box widget-color-blue2 ui-sortable-handle" style="height:40vh">
								    			<div class="widget-header">
										    		<h5 class="widget-title">当前水质</h5>
										    	</div>
										    	<div class="widget-body noborder nopadding" style="height:auto;text-align: center;">
										    		<img id="gradeImg" alt="" src="" style="margin-top:20px;width:70%;">
										    		</br>
										    		<h4>当前水质等级:{{stand.standardName}}</h4>
										    		</br>
										    		<h4>{{stand.standValue}}</h4>
										    	</div>
								    		</div>
										</div>
										<div class="col-xs-3">
												<div class="widget-box widget-color-blue2 ui-sortable-handle" style="height:40vh">
										    			<div class="widget-header">
												    		<h5 >水质统计{{param.beginDate}}至{{param.endDate}}</h5>
												    	</div>
												    	<div class="widget-body noborder nopadding" style="height:auto;text-align: center;">
															<div id="piecontainer" ></div>
												    	</div>
										    	</div>
										</div>
										<div class="col-xs-6">
												<div class="widget-box widget-color-blue2 ui-sortable-handle" style="height:40vh">
										    		    <div class="widget-header">
												    		<h5 class="widget-title">水质趋势{{param.beginDate}}至{{param.endDate}}</h5>
												    	</div>
												    	<div class="widget-body noborder nopadding" style="height:auto;text-align: center;">
															<div id="linecontainer" ></div>
												    	</div>
										    	</div>
										</div>
									</div>
								<!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
					</div><!-- /.page-content -->
				</div>
			</div><!-- /.main-content -->
			
			<%@ include file="common/footer.jsp" %>
		</div>
<script src="${ctx }/shenhai/js/home/homeInfo.js"></script>
</body>
</html>
