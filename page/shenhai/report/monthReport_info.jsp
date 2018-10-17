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
					<input type="hidden" ng-model="u.stationId" />
					<input type="hidden" ng-model="u.type" />
				    <li><label>日报时间:</label>
				    <div class="vocation">
				    	<input name="reportDate" ng-model="u.reportDate" id="reportDate" 
				    	placeholder="开始时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM'})" 
				    	 class="scinput" >
			        </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="queryDaily()" value="月报查询"/></li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="autoReport()" value="系统生成"/></li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="saveReport()" value="保存"/></li>
				    </ul>
				  </div>
				    <!-- 以下展示的是数值类型 -->
				    <div  >
				    	<div class="widget-box">
				    		<div class="widget-title"><span class="icon"><i class="icon-signal"></i></span>
					            <h5>{{k.reportTitle}}</h5>
					            <div class="buttons"><a href="#" class="btn btn-mini"><i class="icon-refresh"></i> {{k.userName}}</a></div>
					         </div>
					         <div class="widget-content">
					         	<div text-angular ta-toolbar="[['h1','h2','h3','h5','h6'],['bold','italics']]" ng-model="k.reportText" name="demo-editor" ta-text-editor-class="border-around" ta-html-editor-class="border-around"></div>
					         </div>
				    	</div>
					</div>
		    	</div>
		    </div>
		    
		</div>
</body>

<link rel="stylesheet" href="${ctx }/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/report/monthReport_info.js"></script>
</html>
