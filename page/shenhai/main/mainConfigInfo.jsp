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
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		<script src="${ctx }/shenhai/resources/assets/js/ajaxfileupload.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/js/main/mainConfigInfo.js"></script>
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
						    <input type="text" ng-model="u.code" />  
					    </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="addMain()" value="新增"/></li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="deleMain()" value="删除"/></li>
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
				${currMenu.cMenuName }
				<i class="icon-double-angle-right"></i>
			</strong>
	</div><!-- /.page-header -->
	
	<div class="row">
	<div class="col-xs-12"  id ="ppdiv">
		<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="m.id" />

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 编码 </label>

				<div class="col-sm-9">
						<div class="input-group">
							<input type="text" id="form-field-1" ng-model="m.code" name="code" class="col-xs-10 col-sm-10" maxlength="20" required/>
						<span style="color:red" ng-show="myForm.code.$invalid">
						<span ng-show="myForm.code.$error.required">站点名称是必须的。</span>
						</span>
						</div>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 名称 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <input type="text" id="form-field-1" ng-model="m.name" name="name" class="col-xs-10 col-sm-10" maxlength="20" required/>
						<span style="color:red" ng-show="myForm.name.$invalid">
						<span ng-show="myForm.name.$error.required">站点名称是必须的。</span>
						</span>
						</div>
				</div>
			</div>
			<div class="space-4"></div>
			
			<div class="form-group" id="reasonid">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 操作步骤 </label>

				<div class="col-sm-9">
						<div class="input-group">
							 <textarea class="form-control" ng-model="m.how" id="form-field-8" 
								maxlength="200"  placeholder="" rows=4 cols=60></textarea>
						</div>
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group" >
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 排序编码 </label>

				<div class="col-sm-9">
						<div class="input-group">
							<input type="text" id="form-field-1" ng-model="m.orderCode" name="orderCode" class="col-xs-10 col-sm-5" maxlength="10" required/>
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
