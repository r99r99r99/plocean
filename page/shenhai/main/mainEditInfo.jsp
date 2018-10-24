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
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<title>${system.systemName }</title>
		<meta name="keywords" content="入海污染源" />
		
		
		<link rel="stylesheet" href="${ctx }/shenhai/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx }/shenhai/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		<!-- basic styles -->
<style>
#treecontrol{  
              background-color: rgb(255,255,255);  
              border:1px solid #888888;  
              position:absolute;  
              z-index:555;  
              left:20px;  
              top:50px;  
              width:245px;
          }  
</style>		
		
		
	</head>

<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		<link href="<%=path %>/shenhai/css/map/openmap.css" rel="stylesheet"> 
		<%@ include file="../common/textAngular.jsp" %>
		
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		
		<script src="${ctx }/shenhai/resources/assets/js/ajaxfileupload.js"></script>
		
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		
		
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> ${currMenu.pMenuName }
			    	<a title="${currMenu.cMenuName }" class="tip-bottom"><i class="icon-home"></i> 
			    	${currMenu.cMenuName }</a></div>
		    </div>
		    <div class="widget-contents nopadding">
		    	<div class="chat-users panel-right2">
		    		<div class="panel-title">
		    			<h5>站点列表</h5>
		    		</div>
		    		<div class="panel-content nopadding">
			    		<ul id="mtree" class="ztree"></ul>
		    		</div>
		    	</div>
		    	
		    	<div class="chat-content panel-left2">
		    		<div class="container-fluid">
		    		<ul class="seachform">
					<!-- <li><label>站点</label>
					    <div class="vocation">
						    <select  ng-model="u.stationId" class="select3"
                              ng-change="changeStation()" 
							  ng-options="option.id as option.title for option in stationList">
							 </select>
					    </div>
				    </li> -->
				    <li><label>设备</label>
					    <div class="vocation">
						    <select  ng-model="u.deviceId" class="select3"
                              ng-change="changeDevice()" 
							  ng-options="option.id as option.name for option in deviceList">
							 </select>
					    </div>
				    </li>
				    <li><label>维护类型</label>
					    <div class="vocation">
						    <select  ng-model="u.configId" class="select3"
                              ng-change="query()" 
							  ng-options="option.id as option.name for option in configList">
							 </select>
					    </div>
				    </li>
				    <li><label>开始时间</label>
					    <div class="vocation">
						    <input name="beginTime" ng-model="u.beginTime" id="beginTime" placeholder="开始时间" 
						      type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" ng-change="" class="scinput">
					    </div>
				    </li>
				     <li><label>结束时间</label>
					    <div class="vocation">
						    <input name="endTime" ng-model="u.endTime" id="endTime" placeholder="结束时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" ng-change="" class="scinput">
					    </div>
				    </li>
				    <li><label></label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    <li><label></label><input name="" type="button" class="scbtn" ng-click="addMain()" value="新增"/></li>
				    </ul>	
				    </div>
					 <div  ui-grid="gridOptions" ui-grid-selection ui-grid-pagination ui-grid-exporter class="gridStyle" style="height:50vh;"></div>
		    	</div>
		    </div>
		    
		</div>
<script type="text/ng-template" id="popupTmpl.html">  
<div class="widget-box">
	<div class="widget-title">
		<span class="icon">
			<i class="icon-align-justify"></i>
		</span>
		<h5>{{m.stationName }}</h5>
	</div>
	<div class="widget-content nopadding">
		<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="m.id" />
			<input type="hidden" id="form-field-1" ng-model="m.dis" />
			<input type="hidden" id="form-field-1" ng-model="m.mtype" />
			
			<div class="control-group">
				<label class="control-label">设备 :</label>
				<div class="controls">
					<select  ng-model="m.deviceId" class="select3"
                              ng-change="mchangeDevice()" id="device" ng-disabled="m.dis"
							  ng-options="option.id as option.name for option in mdeviceList">
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">维护类型 :</label>
				<div class="controls">
					<select id="selectError" ng-model="m.configId" class="col-xs-10 col-sm-12"
							  ng-change="mchangeType()"  id="config" ng-disabled="m.dis"
							  ng-options="option.id as option.name for option in mconfigList">
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">维护状态 :</label>
				<div class="controls">
					<select id="selectError" ng-model="m.state" class="col-xs-10 col-sm-12"
							  ng-options="option.classId as option.value for option in stateList">
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">开始时间 :</label>
				<div class="controls">
					<input type="text"  name="beginTime" ng-model="m.beginTime" id="mbeginTime" placeholder="开始时间"
  					 class="span20" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" required />
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">结束时间 :</label>
				<div class="controls">
					<input type="text"  name="endTime" ng-model="m.endTime" id="mendTime" placeholder="结束时间"
  					 class="span20" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" required />
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">维护原因 :</label>
				<div class="controls">
					<textarea   ng-model="m.reason" id="form-field-8" 
								maxlength="200"  placeholder="" rows=4 cols=60></textarea>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">所需材料 :</label>
				<div class="controls">
					<textarea  ng-model="m.material" id="form-field-8" 
								maxlength="200"  placeholder="" rows=4 cols=60></textarea>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">维护结果 :</label>
				<div class="controls">
					<textarea  ng-model="m.result" id="form-field-8" 
								maxlength="200"  placeholder="" rows=6 cols=60></textarea>
				</div>
			</div>

			
			<div class="form-actions">
					<button class="scbtn" type="button" ng-click="save()" 
						ng-disabled="myForm.code.$invalid||
                                     myForm.name.$invalid">
						<i class="icon-ok bigger-110"></i>
							保存
					</button>
			 </div>

		</form>
	</div>
</div>
</script> 
</body>
<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/js/main/mainEditInfo.js"></script>
</html>
