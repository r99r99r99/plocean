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
		<script type="text/javascript" src="${ctx }/shenhai/js/sms/smsStationInfo.js"></script>
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
								<a href="#">${currMenu.cMenuName }</a>
							</li>
						</ul><!-- .breadcrumb -->
					</div>
					<form  role="form" name="myForm2" novalidate>
					<ul class="seachform">
					<li><label>权限类型</label>
					    <div class="vocation">
						    <select  ng-model="type" class="select3"
                              ng-change="query()" 
							  ng-options="option.classId as option.value for option in publicList">
							 </select>
					    </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    <li><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				                     </label><input name="" type="button" class="scbtn" onclick="saveRoleMenuUser()" value="保存"/></li>
				    </ul>
				    </form>
					<div class="container-fluid">
					<div class="row">
						<div class="col-xs-12 col-sm-3">
							<div ui-grid="gridOptions" class="gridStyle" ui-grid-selection style="width:100%"></div>
						</div>
						<div class="col-xs-12 col-sm-3" style="margin-left:15px">
							<div class="widget-box" style="margin-top:0px">
								<div class="widget-header">
										<h4>人员列表</h4>
								</div>
								<div class="widget-body" style="height:660px">
									<div class="widget-main">
										<ul id="tree" class="ztree" style="height:100%; overflow-x :auto; overflow-y :no"></ul>
									</div>
								</div>
							</div>
							
						</div>
						<!-- <div class="span2">
							<div  ng-grid="gridOptions" class="gridStyle" style="width:20%" ></div>
						</div> -->
					</div>
				</div>	
				</div>
				 
				</div>
			</div>
<script type="text/ng-template" id="popupTmpl.html">  
<div class="page-content" style="margin-top:-13px;margin-bottom:-13px;margin-left:-13px;margin-right:-13px">
	<div class="page-header">
			<strong>
				{{role.name}}
				<i class="icon-double-angle-right"></i>
			</strong>
	</div><!-- /.page-header -->
	
	<div class="row">
	<div class="col-xs-12">
		<form class="form-horizontal" role="form" name="myForm"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="role.id" />
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 权限名称 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="role.name" name="userName"  placeholder="权限名称" class="col-xs-10 col-sm-5" required />
						<span style="color:red" ng-show=" myForm.userName.$invalid">
						<span ng-show="myForm.userName.$error.required">权限名称是必须的。</span>
						</span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 备注 </label>

				<div class="col-sm-9">
						<input type="text" id="form-field-1" ng-model="role.remark" name="realName" class="col-xs-10 col-sm-5"/>
						</span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 状态 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <select id="selectError" ng-model="role.isactive" class="col-xs-10 col-sm-12"
                              ng-change="changeOption()" 
							  ng-options="option.value as option.name for option in isactivelist">
							 </select>
						</div>
				</div>
			</div>
			<div class="space-4"></div>
		
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 权限类型 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <select id="selectError" ng-model="role.type" class="col-xs-10 col-sm-12" readonly
                              ng-change="changeOption()" 
							  ng-options="option.classId as option.value for option in cpublicList">
							 </select>
						</div>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button class="btn btn-info" type="button" ng-click="save()" 
						ng-disabled="myForm.userName.$invalid">
						<i class="icon-ok bigger-110"></i>
							保存
					</button>

				</div>
			</div>
		</form>	
	</div>
	<div>
</div>
</script>
</body>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree/css/zTreeStyle/zTreeStyle.css" type="text/css">
		<script type="text/javascript" src="${ctx }/shenhai/resources/zTree/js/jquery.ztree.core-3.5.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/zTree/js/jquery.ztree.excheck-3.5.js"></script>
</html>
