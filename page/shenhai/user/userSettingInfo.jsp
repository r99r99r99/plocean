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
		<script type="text/javascript" src="${ctx }/shenhai/js/user/userSettingInfo.js"></script>
		<script src="${ctx }/shenhai/resources/angular-file-upload-master/dist/angular-file-upload.js"></script>
		<script src="${ctx }/shenhai/resources/angular-file-upload-master/dist/directives.js"></script>
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
											人员信息设置
											<small>
												<i class="ace-icon fa fa-angle-double-right"></i>
												{{user.realName}}
											</small>
										</h1>
									</div>
									<div class="row">
										<div class="col-xs-12">
												<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
													<input type="hidden" id="form-field-1" ng-model="user.id" />
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">用户名:</label>
														<div class="col-sm-9">
															<input type="text" ng-model="user.userName" name="userName"  placeholder="用户名" class="col-xs-10 col-sm-5" readonly/>
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">姓名 :</label>
														<div class="col-sm-9">
															<input type="text" id="form-field-1" ng-model="user.realName" name="realName" class="col-xs-10 col-sm-5" required/>
																					<span style="color:red" ng-show="myForm.realName.$invalid">
																					<span ng-show="myForm.realName.$error.required">用户姓名是必须的。</span>
															</span>
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">手机:</label>
														<div class="col-sm-9">
															<input type="text" id="form-field-1" ng-model="user.telephone" class="col-xs-10 col-sm-5" />
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">电话 :</label>
														<div class="col-sm-9">
															<input type="text" id="form-field-1" ng-model="user.phone" class="col-xs-10 col-sm-5" />
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">生日 :</label>
														<div class="col-sm-9">
															<input  ng-model="user.birthday"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd'})" onchange="timeChange()" class="scinput" >
														</div>
													</div>
													<div class="form-group">
														<label class="col-sm-3 control-label no-padding-right">e-mail :</label>
														<div class="col-sm-9">
															<input type="email" id="form-field-1" ng-model="user.email" name="email" class="col-xs-10 col-sm-5" />
																					<span ng-hide='myForm.email.$pristine || myForm.email.$valid' ng-show='myForm.email.$invalid'><span style="color:red">Email不正确.</span></span>
														</div>
													</div>
										
													
													<div class="form-actions">
															<button class="scbtn" type="button" ng-click="save()"  style="margin-left: 49%"
																ng-disabled="myForm.code.$invalid||
										                                     myForm.name.$invalid">
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
