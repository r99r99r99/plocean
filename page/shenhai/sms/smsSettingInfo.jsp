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
		<!-- angularjs select tree -->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/js/sms/smsSettingInfo.js"></script>
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
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="showUser()" value="查询"/></li>
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
<div id="editdiv" class="page-content" style="margin-top:-13px;margin-bottom:-13px;margin-left:-13px;margin-right:-13px">
	<div class="page-header">
			<strong>
				{{type.name}}
				<i class="icon-double-angle-right"></i>
			</strong>
	</div><!-- /.page-header -->
	
	<div class="row">
	<div class="col-xs-12"  id ="ppdiv">
		<form class="form-horizontal" role="form" name="myForm"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="sms.id" />

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 人员 </label>

				<div class="col-sm-9">
						<select  ng-model="sms.userId" class="select3" name="userId" id="userId"
                              ng-change="infoUserSetting()" 
							  ng-options="option.id as option.realName for option in userList">
						</select>
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 工作日 </label>

				<div class="col-sm-9">
						周一<input type="checkbox" ng-model="sms.mon" ng-true-value="1" ng-false-value="0" />
						周二<input type="checkbox" ng-model="sms.tues" ng-true-value="1" ng-false-value="0" />
						周三<input type="checkbox" ng-model="sms.wed" ng-true-value="1" ng-false-value="0" />
						周四<input type="checkbox" ng-model="sms.thur" ng-true-value="1" ng-false-value="0" />
						周五<input type="checkbox" ng-model="sms.fri" ng-true-value="1" ng-false-value="0" />
						周六<input type="checkbox" ng-model="sms.satur" ng-true-value="1" ng-false-value="0" />
						周天<input type="checkbox" ng-model="sms.sun" ng-true-value="1" ng-false-value="0" />
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 间隔发送时间(小时) </label>

				<div class="col-sm-9">
						<input type="number" id="form-field-1" ng-model="sms.betweenTime" name="betweenTime" class="col-xs-10 col-sm-5" />
				</div>
			</div>
			<div class="space-4"></div>

			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 是否接收短信 </label>

				<div class="col-sm-9">
						<select  ng-model="sms.isactive" class="select3"
                              ng-change="query()" 
							  ng-options="option.value as option.name for option in activelist">
						</select>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 上午发送时间 </label>

				<div class="col-sm-9">
					<div class="input-group">
						<input type="text" id="form-field-1" ng-model="sms.ambegin" name="ambegin" class="col-xs-6 col-sm-3" />
						<input type="text" id="form-field-1" ng-model="sms.amend" name="amend" class="col-xs-6 col-sm-3" />
					</div>
		`		</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 下午发送时间 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <input type="text" id="form-field-1" ng-model="sms.pmbegin" name="pmbegin" class="col-xs-6 col-sm-3" />
							 <input type="text" id="form-field-1" ng-model="sms.pmend" name="pmend" class="col-xs-6 col-sm-3" />
						</div>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button class="btn btn-info" type="button" ng-click="save()" 
						ng-disabled="myForm.code.$invalid||
                                     myForm.name.$invalid">
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
