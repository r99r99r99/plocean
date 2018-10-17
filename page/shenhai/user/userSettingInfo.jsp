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
		<script type="text/javascript" src="${ctx }/shenhai/js/user/userSettingInfo.js"></script>
		<script src="${ctx }/resources/angular-file-upload-master/dist/angular-file-upload.js"></script>
		<script src="${ctx }/resources/angular-file-upload-master/dist/directives.js"></script>
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> 
			    	<a  class="tip-bottom"><i class="icon-home"></i> 
			    	个人信息设置</a>
			    </div>
		    </div>
		    <div class="widget-box">
				<div class="widget-title">
					<span class="icon">
						<i class="icon-align-justify"></i>
					</span>
					<h5>{{user.realName}}</h5>
				</div>
				<div class="widget-content nopadding">
					<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="user.id" />
			<div class="control-group">
				<label class="control-label">用户名:</label>
				<div class="controls">
					<input type="text" ng-model="user.userName" name="userName"  placeholder="用户名" class="col-xs-10 col-sm-5" readonly/>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">姓名 :</label>
				<div class="controls">
					<input type="text" id="form-field-1" ng-model="user.realName" name="realName" class="col-xs-10 col-sm-5" required/>
											<span style="color:red" ng-show="myForm.realName.$invalid">
											<span ng-show="myForm.realName.$error.required">用户姓名是必须的。</span>
					</span>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">手机:</label>
				<div class="controls">
					<input type="text" id="form-field-1" ng-model="user.telephone" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">电话 :</label>
				<div class="controls">
					<input type="text" id="form-field-1" ng-model="user.phone" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">生日 :</label>
				<div class="controls">
					<input  ng-model="user.birthday"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd'})" onchange="timeChange()" class="scinput" >
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">e-mail :</label>
				<div class="controls">
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
	    </div>
</body>
</html>
