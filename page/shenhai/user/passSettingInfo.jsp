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
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/js/user/passSettingInfo.js"></script>
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
									<div class="page-header">
										<h1>
											密码修改
										</h1>
									</div>
									<div class="row">
										<div class="col-xs-12">
												<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
													<input type="hidden" id="form-field-1" ng-model="user.id" />
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">原密码:</label>
														<div class="col-sm-9">
															<input type="password" id="form-field-1" ng-model="user.password" name="oldPass" class="col-xs-10 col-sm-5" required/>
															<span style="color:red" ng-show="myForm.oldPass.$invalid">
															<span ng-show="myForm.oldPass.$error.required">请输入原密码</span>
															</span>
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">新密码 :</label>
														<div class="col-sm-9">
															<input type="password" id="form-field-3" ng-model="user.newPass" onKeyUp="check();" name="newPass" class="col-xs-10 col-sm-5" required/>
															<span style="color:red" ng-show="myForm.newPass.$invalid">
															<span  ng-show="myForm.newPass.$error.required">请输入新密码</span>
															</span>
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">新密码确认:</label>
														<div class="col-sm-9">
															<input type="password" id="form-field-2" ng-model="user.confimPass" onKeyUp="check();" name="confimPass" class="col-xs-10 col-sm-5" required/>
															<span style="color:red" ng-show="myForm.confimPass.$invalid">
															<span ng-show="myForm.confimPass.$error.required">请确认新密码</span>
															
															</span>
															<span id="message1" style="color:red"></span>
														</div>
													</div>
										
													
													<div class="form-actions">
															<button class="scbtn" type="button" ng-click="save()"  style="margin-left: 49%"
																ng-disabled="myForm.newPass.$invalid||
							                                     myForm.confimPass.$invalid">
																<i class="icon-ok bigger-110"></i>
																	保存
															</button>
													 </div>
										
												</form>
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
</body>
</html>
