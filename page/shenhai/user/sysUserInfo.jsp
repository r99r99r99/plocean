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
		
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/js/user/sysUserInfo.js"></script>
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
					<div style="word-wrap:break-word; overflow:hidden;">
					<ul class="seachform">
					<li><label>模糊查询</label>
					    <div class="vocation">
						    <input type="text" ng-model="u.userName" >
					    </div>
					 </li>
				    <!-- <li><label>参数类型</label>   -->
				    <li><label>状态</label>
					    <div class="vocation">
						    <select  ng-model="u.isactive" class="select3"
                              ng-change="query()" 
							  ng-options="option.value as option.name for option in activelist">
							 </select>
					    </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="addUser()" value="新增"/></li>
				    </ul>
				    </div>
					<div class="container-fluid">
					<div class="row-fluid">
						<div class="span5">
							<div  ui-grid="gridOptions" ui-grid-selection ui-grid-pagination ui-grid-exporter class="gridStyle" ></div>
						</div>
					</div>
				</div>	
				</div>
				 
				</div>
			</div>
			
<script type="text/ng-template" id="popupTmpl.html">  
<div class="page-content" style="margin-top:-13px;margin-bottom:-13px;margin-left:-13px;margin-right:-13px">
	<div class="page-header">
			<strong>
				{{user.realName}}
				<i class="icon-double-angle-right"></i>
			</strong>
	</div><!-- /.page-header -->
	
	<div class="row">
	<div class="col-xs-12">
		<form class="form-horizontal" role="form" name="myForm"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="user.id" />
			<input type="hidden" id="form-field-1" ng-model="user.companyId" />
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 用户名 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="user.userName" name="userName"  placeholder="用户名" class="col-xs-10 col-sm-5" required />
						<span style="color:red" ng-show=" myForm.userName.$invalid">
						<span ng-show="myForm.userName.$error.required">用户名是必须的。</span>
						</span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 姓名 </label>

				<div class="col-sm-9">
						<input type="text" id="form-field-1" ng-model="user.realName" name="realName" class="col-xs-10 col-sm-5" required/>
						<span style="color:red" ng-show="myForm.realName.$invalid">
						<span ng-show="myForm.realName.$error.required">用户姓名是必须的。</span>
						</span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 手机 </label>

				<div class="col-sm-9">
						<input type="text" id="form-field-1" ng-model="user.telephone" name="telephone"  class="col-xs-10 col-sm-5" 
                          ng-pattern="/^[1][3-8]\d{9}$/" />
						<span ng-hide='myForm.telephone.$pristine || myForm.telephone.$valid' ng-show='myForm.telephone.$invalid'><span style="color:red">手机号码不正确.</span></span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 电话 </label>

				<div class="col-sm-9">
						<input type="text" id="form-field-1" ng-model="user.phone" name="phone"  ng-pattern="/^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/" class="col-xs-10 col-sm-5" />
						<span ng-hide='myForm.phone.$pristine || myForm.phone.$valid' ng-show='myForm.phone.$invalid'><span style="color:red">电话号码不正确.</span></span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 生日 </label>

				<div class="col-sm-9">
						<input  ng-model="user.birthday"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd'})" onchange="timeChange()" class="scinput" >
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> e-mail </label>

				<div class="col-sm-9">
						<input type="email" id="form-field-1" ng-model="user.email" name="email" class="col-xs-10 col-sm-5" />
						<span ng-hide='myForm.email.$pristine || myForm.email.$valid' ng-show='myForm.email.$invalid'><span style="color:red">Email不正确.</span></span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 状态 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <select id="selectError" ng-model="user.isactive" class="col-xs-10 col-sm-12"
                              ng-change="changeOption()" 
							  ng-options="option.value as option.name for option in isactivelist">
							 </select>
						</div>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 职业 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <select id="selectError" ng-model="user.positionId" class="col-xs-10 col-sm-12"
                              ng-change="changeOption()" 
							  ng-options="option.id as option.name for option in positionList">
							 </select>
						</div>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 公司 </label>

				<div class="col-sm-9">
						<multi-select-tree data-input-model="pcodelist" multi-select="false" ng-model="device"
                                   data-output-model="device" data-default-label="请选择所在单位."
                                   data-callback="selectOnly1Or2(item, selectedItems)"
								   data-switch-view-callback="switchViewCallback(scopeObj)"
                                   data-select-only-leafs="true"
                                   data-switch-view="false">
						</multi-select-tree>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button class="btn btn-info" type="button" ng-click="save()" 
						ng-disabled="myForm.userName.$invalid||
                                     myForm.realName.$invalid">
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
</html>
