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
										<div class="col-xs-12">
											<ul class="seachform">
												 <li><label>站点</label>
													    <div class="vocation">
														    <select  ng-model="u.stationId" class="form-control"
								                              ng-change="changeStation()" 
															  ng-options="option.id as option.title for option in stationList">
															 </select>
													    </div>
												 </li>
											    <li><label>开始时间</label>
												    <div class="vocation">
													    <input name="beginTime" ng-model="u.beginTime" id="beginTime" placeholder="开始时间" 
													      type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  ng-change="" class="scinput">
												    </div>
											    </li>
											     <li><label>结束时间</label>
												    <div class="vocation">
													    <input name="endTime" ng-model="u.endTime" id="endTime" placeholder="结束时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="scinput">
												    </div>
											    </li>
											    <li><label>&nbsp;</label><input name="" type="button" class="btn btn-primary" ng-click="changeStation()()" value="查询"/></li>
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
<script type="text/javascript">
var count = 1;  
/** 
* 生成多附件上传框 
*/  
function createInput(parentId){  
    count++;  
    var str = '<div name="div" ><input type="file" style="float:left" contentEditable="false" id="uploads' + count + '' +  
    '" name="uploads'+ count +'" value="" style="width: 220px"/>';  
    document.getElementById(parentId).insertAdjacentHTML("beforeEnd",str);  
}  

/** 
* 删除多附件删除框 
*/  
function removeInput(evt, parentId){  
   var el = evt.target == null ? evt.srcElement : evt.target;  
   var div = el.parentNode;  
   var cont = document.getElementById(parentId);         
   if(cont.removeChild(div) == null){  
    return false;  
   }  
   return true;  
} 
function addOldFile(data){  
    var str = '<div name="div' + data.name + '" ><a href="#" style="text-decoration:none;font-size:12px;color:red;" onclick="removeOldFile(event,' + data.id + ')">删除</a>'+  
    '   ' + data.name +   
    '</div>';  
    document.getElementById('oldImg').innerHTML += str;  
}  
  
function removeOldFile(evt, id){  
    //前端隐藏域，用来确定哪些file被删除，这里需要前端有个隐藏域  
    $("#imgIds").val($("#imgIds").val()=="" ? id :($("#imgIds").val() + "," + id));  
    var el = evt.target == null ? evt.srcElement : evt.target;  
    var div = el.parentNode;  
    var cont = document.getElementById('oldImg');      
    if(cont.removeChild(div) == null){  
        return false;  
    }  
    return true;  
} 
</script>

<script type="text/ng-template" id="popupTmpl.html">  
<div class="widget-box col-xs-12">
	<div class="widget-header">
		<span class="icon">
			<i class="icon-align-justify"></i>
		</span>
		<h5>{{m.stationName }}</h5>
	</div>
	<div class="widget-body" style="padding-top:10px;padding-bottom: 10px;">
		<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="m.id" />
			<input type="hidden" id="form-field-1" ng-model="m.dis" />
			<input type="hidden" id="form-field-1" ng-model="m.mtype" />

			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right"> 站点 :</label>
				<div class="col-sm-9">
					<select  ng-model="m.stationId" class="form-control"
                              ng-change="mchangeStation()" id="station" ng-disabled="m.dis"
							  ng-options="option.id as option.title for option in mstationList">
							 </select>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">开始时间:</label>
				<div class="col-sm-9">
					<input name="beginTime" ng-model="m.beginTime" id="mbeginTime" placeholder="开始时间"  ype="text" 
                                onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="scinput" required>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">结束时间:</label>
				<div class="col-sm-9">
					<input name="endTime" ng-model="m.endTime" id="mendTime" placeholder="结束时间"  ype="text" 
                                onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="scinput" required>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">维护参数:</label>
				<input type="hidden" ng-model="station.deviceIds" />
				<div class="col-sm-9">
					<multi-select-tree data-input-model="indicatorTree" multi-select="true" ng-model="indicator" id="ids"
                                   data-output-model="indicatorIds" data-default-label="请选择维护参数."
                                   data-callback="selectOnly1Or2(item, selectedItems)"
								   data-switch-view-callback="switchViewCallback(scopeObj)"
                                   data-select-only-leafs="true"
                                   data-switch-view="false">
							</multi-select-tree>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right">维修报告:</label>
				<div class="col-sm-9">
					<div id="newUpload2">  
								<ul>
									<li ng-repeat="pic in pics">
										<a href="${ctx }/exportMainFile.do?fileName={{pic.realName}}&filePath={{pic.pathName}}" >{{pic.realName}}</a>
									</li>
								</ul>
        				</div> 
				</div>
			</div>

		</form>
	</div>
</div>		
</script> 

<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/js/main/mainShowInfo.js"></script>
</body>
</html>
