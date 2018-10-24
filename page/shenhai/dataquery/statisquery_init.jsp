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
		
	</head>

	<body class="no-skin" ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<%@ include file="../common/textAngular.jsp" %>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highstock.src.js"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/exporting.js"></script>
		
		<div class="main-container ace-save-state" id="main-container">
			<%@ include file="../common/left.jsp" %>
			
			
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
						<%@ include file="../common/setting.jsp" %>
						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
									<div class="row">
										<div class="col-xs-2">
											<div class="widget-box  ui-sortable-handle">
												<div class="widget-header">
										    		<h5 class="widget-title">站点列表</h5>
										    	</div>
										    	<div class="widget-body noborder nopadding" style="height:75vh;text-align: center;">
										    		<ul id="mtree" class="ztree"></ul>
										    	</div>
											</div>
										</div>
										<div class="col-xs-10">
											<ul class="seachform">
												<li><label>统计口径</label>
												  <select  ng-model="collectType" class="select3"
							                              ng-change="queryData()" 
														  ng-options="option.value as option.name for option in activelist">
													</select>
											    </li>
											    <li><label>时间</label>
											    <div class="vocation">
											    <input name="startDate" id="startDate" placeholder="开始时间" value="${beginDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" class="scinput" >
											    ~
											    <input name="endDate" id="endDate" placeholder="结束时间" type="text" value="${endDate}" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()"  class="scinput" />
												 </div>
											    </li>
											    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="queryData()" value="查询"/></li>
											    <!-- <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="exportData()" value="生成日报"/></li> -->
											 </ul>
										     <div>
												<div class="row">
													<div class="col-xs-6">
														<div id="piecontainer"></div>
													</div>
													<div class="col-xs-6">
														<div id="queryContainer" class="queryContainer"></div>		
													</div>
												</div>
												<div class="row">
													<div class="col-xs-12">
														<div id="linecontainer"></div>
													</div>
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
			
			<%@ include file="../common/footer.jsp" %>
		</div>
<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/dataquery/statisquery_init.js"></script>
</body>
</html>
