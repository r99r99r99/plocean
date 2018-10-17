<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html >


<c:set var="ctx" value="${pageContext.request.contextPath}"/>
	<head>
		<meta charset="utf-8" />
		<title>${system.systemName }</title>
		<meta name="keywords" content="入海污染源" />
	</head>

	<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		
		<script src="${ctx }/resources/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/js/user/passSettingInfo.js"></script>
		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>
			<div class="main-container-inner">
			<%@ include file="../common/leftMenu.jsp" %>

				<div class="main-content" >
					<div class="breadcrumbs" id="breadcrumbs">
						<script type="text/javascript">
							try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
						</script>
						
						<ul class="breadcrumb">
							<li>
								<i class="icon-home home-icon"></i>
								<a href="#">${currMenu.pMenuName }</a>
							</li>

							<li>
								<a href="#">密码修改</a>
							</li>
						</ul><!-- .breadcrumb -->
					</div>
					<div class="container-fluid">
					<div class="page-content" style="margin-top:-13px;margin-bottom:-13px;margin-left:-13px;margin-right:-13px">
						<div class="page-header">
								<strong>
									{{user.realName}}
									<i class="icon-double-angle-right"></i>
								</strong>
						</div><!-- /.page-header -->
						
						<div class="row">
						<div class="col-xs-10">
							<form class="form-horizontal" role="form" name="myForm"  novalidate>
								<input type="hidden" id="form-field-1" ng-model="user.id" />
					
								<div class="form-group">
									<label class="col-sm-3 control-label no-padding-right" for="form-field-1">   </label>
					
									<div class="col-sm-9">
											<input type="password" id="form-field-1" ng-model="user.password" name="oldPass" class="col-xs-10 col-sm-5" required/>
											<span style="color:red" ng-show="myForm.oldPass.$invalid">
											<span ng-show="myForm.oldPass.$error.required">请输入原密码</span>
											</span>
									</div>
								</div>
								<div class="space-4"></div>
					
								<div class="form-group">
									<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 新密码 </label>
					
									<div class="col-sm-9">
											<input type="password" id="form-field-1" ng-model="user.newPass" name="newPass" class="col-xs-10 col-sm-5" required/>
											<span style="color:red" ng-show="myForm.newPass.$invalid">
											<span ng-show="myForm.newPass.$error.required">请输入新密码</span>
											</span>
									</div>
								</div>
								<div class="space-4"></div>
								
								<div class="form-group">
									<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 新密码确认 </label>
					
									<div class="col-sm-9">
											<input type="password" id="form-field-1" ng-model="user.confimPass" name="confimPass" class="col-xs-10 col-sm-5" required/>
											<span style="color:red" ng-show="myForm.confimPass.$invalid">
											<span ng-show="myForm.confimPass.$error.required">请确认新密码</span>
											</span>
									</div>
								</div>
								<div class="space-4"></div>
					
					
								<div class="clearfix form-actions">
									<div class="col-md-offset-3 col-md-9">
										<button class="btn btn-info" type="button" ng-click="save()" 
											ng-disabled="myForm.oldPass.$invalid||
					                                     myForm.newPass.$invalid||
					                                     myForm.confimPass.$invalid">
											<i class="icon-ok bigger-110"></i>
												保存
										</button>
									</div>
								</div>
							</form>	
						</div>
						<div>
					</div>
				</div>	
				</div>
				 
				</div>
			</div>
			
<script type="text/ng-template" id="popupTmpl.html">  
	
</script> 
</body>
</html>
