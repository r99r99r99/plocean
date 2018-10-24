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
		<script language="javascript">
		function check(){
			if(document.getElementById("form-field-3").value!=document.getElementById("form-field-2").value){
				document.getElementById("message1").innerHTML="两次输入的密码不一致";
				$(".scbtn").attr('disabled',"true");
			}else{
				document.getElementById("message1").innerHTML="";
				$(".scbtn").removeAttr("disabled");
			}
	}
		</script>
	</head>

	<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		
		
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> 
			    	<a  class="tip-bottom"><i class="icon-home"></i> 
			    	密码设置</a>
			    </div>
		    </div>
		    <div class="widget-box">
				<div class="widget-title">
					<span class="icon">
						<i class="icon-align-justify"></i>
					</span>
					<h5></h5>
				</div>
				<div class="widget-content nopadding">
					<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
						<input type="hidden" id="form-field-1" ng-model="user.id" />
						<div class="control-group">
							<label class="control-label">原密码:</label>
							<div class="controls">
								<input type="password" id="form-field-1" ng-model="user.password" name="oldPass" class="col-xs-10 col-sm-5" required/>
											<span style="color:red" ng-show="myForm.oldPass.$invalid">
											<span ng-show="myForm.oldPass.$error.required">请输入原密码</span>
											</span>
							</div>
						</div>
						
						<div class="control-group">
							<label class="control-label">新密码:</label>
							<div class="controls">
								<input type="password" id="form-field-3" ng-model="user.newPass" onKeyUp="check();" name="newPass" class="col-xs-10 col-sm-5" required/>
											<span style="color:red" ng-show="myForm.newPass.$invalid">
											<span  ng-show="myForm.newPass.$error.required">请输入新密码</span>
											</span>
							</div>
						</div>
						
						<div class="control-group">
							<label class="control-label">新密码确认:</label>
							<div class="controls">
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
		</div>
			
</body>
<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/js/user/passSettingInfo.js"></script>
</html>
