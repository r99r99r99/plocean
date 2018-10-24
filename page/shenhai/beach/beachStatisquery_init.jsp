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
 .modal-width{
           width:400px;}
        .header{
        	 padding-left: 0px;
			 padding-right: 0px;
        }
        .chartsLine {
			width: 100%;
			display:inline;
			float:left; 
		}
		.oneCharts {
			width: 100%;
			height:80%;
			display:inline;
			float:left; 
		}
		.twoCharts {
			width: 50%;
			height:80%;
			display:inline;
			float:left; 
		}
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
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highstock.src.js"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/exporting.js"></script>
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		
		
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
		    	 <div class="main-content" >
					<div style="word-wrap:break-word; overflow:hidden;">
					<ul class="seachform">
					<li><label>统计口径</label>
					  <select  ng-model="collectType" class="select3"
                              ng-change="queryData()" 
							  ng-options="option.value as option.name for option in activelist">
						</select>
				    </li>
				    <li><label>时间</label>
				    <div class="vocation">
				    <input name="startDate" id="startDate" placeholder="开始时间" value="${beginDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" class="scinput" >
				    ~
				    <input name="endDate" id="endDate" placeholder="结束时间" type="text" value="${endDate}" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()"  class="scinput" />
					 </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="queryData()" value="查询"/></li>
				    <!-- <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="exportData()" value="生成日报"/></li> -->
				    </ul>
				    </div>
					<div class="container-fluid">
							<div class="row-fluid">
								<div class="span6 chartsLine">
								
									<div id="piecontainer"></div>
									
								</div>
								<div class="span4 chartsLine">
									<div id="queryContainer" class="queryContainer"></div>		
								</div>
							</div>
						<div class="row-fluid">
								<div class="span12 chartsLine">
									<div id="linecontainer"></div>
								</div>
						</div>
	               </div>	
				</div>
		    	</div>
		    </div>
		    
		</div>
</body>

<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/beach/beachStatisquery_init.js"></script>
</html>