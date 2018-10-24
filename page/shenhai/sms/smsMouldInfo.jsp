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
		<script type="text/javascript" src="${ctx }/shenhai/js/sms/smsMouldInfo.js"></script>
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
				    <li><label>站点</label>
					    <div class="vocation">
						    <select  ng-model="stationId" class="select3"
                              ng-change="showUser()" 
							  ng-options="option.id as option.title for option in stationList">
							 </select>
					    </div>
				    </li>
				    <li><label>模板类型</label>
					    <div class="vocation">
						    <select  ng-model="type" class="select3"
                              ng-change="showUser()" 
							  ng-options="option.classId as option.value for option in typeList">
							 </select>
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
			<input type="hidden" id="form-field-1" ng-model="id" />
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 站点 </label>

				<div class="col-sm-9">
						<select  ng-model="stationId" class="select3" name="stationId" id="stationId"
							  ng-options="option.id as option.title for option in stationList">
						</select>
	
						<span style="color:red" ng-show=" myForm.stationId.$invalid">
						<span ng-show="myForm.stationId.$error.required">code是必须的。</span>
						</span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 模板类型 </label>

				<div class="col-sm-9">
						<select  ng-model="type" class="select3" name="type" id="type"
							  ng-options="option.classId as option.value for option in typeList">
						</select>
	
						<span style="color:red" ng-show=" myForm.stationId.$invalid">
						<span ng-show="myForm.stationId.$error.required">code是必须的。</span>
						</span>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 模板 </label>

				<div class="col-sm-9">
						<textarea class="form-control" ng-model="mould" id="form-field-8" placeholder="" rows=3 cols=20></textarea>
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

					&nbsp; &nbsp; &nbsp;
					<button class="btn" type="reset">
						<i class="icon-undo bigger-110"></i>
							重置
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
