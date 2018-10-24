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
		<link rel="stylesheet" href="${ctx }/shenhai/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<%@ include file="../common/textAngular.jsp" %>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		
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
									<div class="row">
										<div class="col-xs-2">
											<div class="widget-box  ui-sortable-handle">
												<div class="widget-header">
										    		<h5 class="widget-title">站点列表</h5>
										    	</div>
										    	<div class="widget-body noborder nopadding" style="height:75vh;text-align: center;">
										    		<ul id="mtree" class="ztree"></ul>
										    	</div>
											</div>
										</div>
										<div class="col-xs-10">
											<ul class="seachform">
												<input type="hidden" ng-model="u.stationId" />
											    <li><label>类型</label>
												    <div class="vocation">
													    <select  ng-model="u.type" class="select3"
							                              ng-change="query()" 
														  ng-options="option.classId as option.value for option in typeList">
														 </select>
												    </div>
											    </li>
											     <li><label>操作状态</label>
												    <div class="vocation">
													    <select  ng-model="u.operate" class="select3"
							                              ng-change="query()" 
														  ng-options="option.id as option.value for option in operateList">
														 </select>
												    </div>
											    </li>
											     <li><label>开始时间:</label>
											    <div class="vocation">
											    	<input name="startDate" ng-model="u.beginDate" id="startDate" placeholder="开始时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="query()" class="scinput" >
										        </div>
											    </li>
											    <li><label>结束时间:</label>
											    <div class="vocation">
											    	<input name="endDate" ng-model="u.endDate" id="endDate" placeholder="结束时间" value="${endDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="query()" class="scinput" >
										        </div>
											    </li>
											    <li><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
											    <li><input name="" type="button" class="scbtn" ng-click="update()" value="处理"/></li>
											 </ul>
										     <div>
												<div  ui-grid="gridOptions" ui-grid-selection ui-grid-pagination ui-grid-exporter class="gridStyle" style="height:50vh;"></div>
											</div>
											
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
<script type="text/ng-template" id="popupTmpl.html">  
<div class="widget-box col-xs-12">
	<div class="widget-header">
		<span class="icon">
			<i class="icon-align-justify"></i>
		</span>
		<h5>{{m.stationName }}</h5>
	</div>
	<div class="widget-body" style="padding-top:10px">
		<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="m.id" />
			<input type="hidden" id="form-field-1" ng-model="m.dis" />
			<input type="hidden" id="form-field-1" ng-model="m.mtype" />
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">操作状态 :</label>
				<div class="col-sm-9">
					<select  ng-model="warn.operate" class="select3"
                              ng-change="changeStation()" id="device" ng-disabled="m.dis"
							  ng-options="option.id as option.title for option in operaList">
					</select>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">备注 :</label>
				<div class="col-sm-9">
					<textarea   ng-model="warn.flag" id="form-field-8" 
								maxlength="200"  placeholder="" rows=4 cols=40></textarea>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">说明 :</label>
				<div class="col-sm-9">
					<textarea  ng-model="warn.remark" id="form-field-8" 
								maxlength="200"  placeholder="" rows=4 cols=40></textarea>
				</div>
			</div>
			
			<div class="clearfix form-actions nomarginbottom">
					<div class="col-md-offset-3 col-md-9">
                		<button class="scbtn" id="saveBt"  type="button" ng-click="save()" 
						ng-disabled="myForm.title.$invalid||
                                     myForm.text.$invalid
									">
							保存
						</button>
					</div>
			 </div>

		</form>
	</div>
</div>		
</script> 

<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/warn/warnValueInfo.js"></script>
</body>
</html>
