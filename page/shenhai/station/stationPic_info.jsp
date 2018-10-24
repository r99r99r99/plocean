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
		<%@ include file="../common/textAngular.jsp" %>
		
		<!-- page specific plugin styles -->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/colorbox.min.css" />
		<script src="${ctx }/shenhai/resources/assets/js/jquery.colorbox.min.js"></script>
		
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
											    <li><label>图片类型:</label>
											    <div class="vocation">
											    	 <select id="selectError" ng-model="u.type" class="scinput"
								                              ng-change="query()" 
															  ng-options="option.classId as option.value for option in typelist">
															 </select>
										        </div>
											    </li>
											    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
											 </ul>
										     <div>
												<div class="widget-box">
									    		<div class="widget-header"><span class="icon"><i class="icon-signal"></i></span>
										            <h5 class="widget-title">图片列表</h5>
										         </div>
										         <div class="widget-body nopadding">
										         	<ul class="ace-thumbnails clearfix">
														<li class="col-xs-2" ng-repeat="pic in picList" style="border: 0px">
															<a href="{{pic.src }}" title="{{pic.origName }}" data-rel="colorbox" class="cboxElement">
																<img width="150" height="150" alt="150x150" src="{{pic.src }}">
															</a>
														</li>
													</ul>
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
<script src="${ctx }/shenhai/js/station/stationPic_info.js"></script>
</body>
</html>
