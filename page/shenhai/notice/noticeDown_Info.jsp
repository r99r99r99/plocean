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
		
		
		<link rel="stylesheet" href="${ctx}/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx}/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
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
		
		<link rel="stylesheet" href="${ctx }/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/resources/My97DatePicker/WdatePicker.js"></script>
		
		
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> ${currMenu.pMenuName }
			    	<a  class="tip-bottom"><i class="icon-home"></i> 
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
				    <li><label>开始时间:</label>
				    <div class="vocation">
				    	<input name="startDate" ng-model="u.beginDate" id="startDate" 
				    	placeholder="开始时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" 
				    	onchange="timeChange()" class="scinput" >
			        </div>
				    </li>
				    <li><label>结束时间:</label>
				    <div class="vocation">
				    	<input name="endDate" ng-model="u.endDate" id="endDate" placeholder="结束时间" value="${endDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" class="scinput" >
			        </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				     <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="addUser()" value="新增"/></li>
				     <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="deleRow()" value="删除"/></li>
				    </ul>
				  </div>
				    <!-- 以下展示的是数值类型 -->
				    <div  >
						<div  ui-grid="gridOptions" ui-grid-selection ui-grid-pagination ui-grid-exporter  class="gridStyle"></div>
					</div>
		    	</div>
		    </div>
		    
		</div>
<script type="text/ng-template" id="popupTmpl.html">  
<div class="widget-box">
	<div class="widget-title">
            <h4>
	    ${currMenu.cMenuName }
	    </h4> 
    </div> 
   <div class="widget-content nopadding">
		<form class="form-horizontal" id="myForm" role="form" name="myForm" enctype="multipart/form-data" method="post"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="m.stationId" />
			<div class="control-group">
				<label class="control-label"> 下发站点 </label>
				<div class="controls">
					<multi-select-tree data-input-model="m.stationTree" multi-select="true" ng-model="station"  
                                   data-output-model="m.stationids" data-default-label="请选择对比站点."
                                   data-callback="selectOnly1Or2(item, selectedItems)"
								   data-switch-view-callback="switchViewCallback(scopeObj)"
                                   data-select-only-leafs="true"
                                   data-switch-view="true">
							</multi-select-tree>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label"> 标题 </label>

				<div class="controls">
							<input type="text" ng-model="m.title" name="title"  class="form-control" maxlength="20" required />
							<span style="color:red" ng-show="myForm.title.$invalid">
								<span ng-show="myForm.title.$error.required">请输入标题。</span>
							</span>
				</div>
			</div>

			<div class="control-group">
				<label class="control-label"> 内容 </label>

				<div class="controls">
							<textarea class="form-control" ng-model="m.text"  name="text" id="form-field-8" placeholder="" maxlength="200" rows=10 cols=20 required></textarea>
							<span style="color:red" ng-show="myForm.text.$invalid">
								<span ng-show="myForm.text.$error.required">请输入通知内容。</span>
							</span>
				</div>
			</div>


			<div class="form-actions" ng-show="isshow">
                <button class="scbtn" id="saveBt"  type="button" ng-click="save()" 
						ng-disabled="myForm.title.$invalid||
                                     myForm.text.$invalid
									">
							保存
				</button>
            </div>
		</form>	
    </div>
</div>
</script> 

</body>

<link rel="stylesheet" href="${ctx }/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/notice/noticeDown_Info.js"></script>
</html>
