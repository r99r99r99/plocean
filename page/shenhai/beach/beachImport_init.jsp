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
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-xeditable/js/xeditable.js"></script>
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-xeditable/css/xeditable.css" />
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		<div id="content">
			<div id="content-header">
			    <div id="breadcrumb"> ${currMenu.pMenuName }
			    	<a  class="tip-bottom"><i class="icon-home"></i> 
			    	${currMenu.cMenuName }</a></div>
		    </div>
		    <div class="widget-contents">
		    	<div class="chat-users panel-right2">
		    		<div class="panel-title">
		    			<h5>站点列表</h5>
		    		</div>
		    		<div class="panel-content nopadding">
			    		<ul id="mtree" class="ztree"></ul>
		    		</div>
		    	</div>
		    	
		    	<div class="chat-content panel-left2 chat-content-middle">
		    		<div class="container-fluid">
			    		<ul class="seachform">
					    <li><label>上报时间:</label>
					    <div class="vocation">
					    	<input name="startDate" ng-model="s.collectTime" id="collectTime" 
					    	placeholder="上报时间"  type="text" onChange=""  value="${collectTime }"
					    	 onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH'})" ng-change="showBeachData()"
					    	class="scinput" >
					    	<!-- http://www.cnblogs.com/liuning8023/p/5395779.html -->
				        </div>
					    </li>
					    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="save()" value="保存"/></li>
					    </ul>
					  </div>
					  <table class="table table-bordered table-striped">
					  	 <thead>
			                <tr>
			                  <th colspan="2" width="25%">项 目</th>
			                  <th width="20%">单位</th>
			                  <th width="55%">数值</th>
			                </tr>
			              </thead>
			              <tbody>
			              	   <c:forEach var="group" items="${groupList}">
				              	   <c:set var="iffirst"  value="1"/>
				              	   <c:forEach var="code" items="${group.codes}">
				              	   		<tr class="odd gradeX">
					              	   		<c:if test="${iffirst == 1}">
					              	   			<td class="text-center"  rowspan="${group.codes.size()}">${group.name }</td>
					              	   			<c:set var="iffirst"  value="0"/>
					              	   		</c:if>
						              	    <td class="text-center">${code.name }</td>
						                    <td class="text-center">${code.unit }</td>
						                    <td class="text-center">
						                    	<c:if test="${code.type==1}">
								                  	  <a href="#" editable-number="beach.${code.code }.data" >{{ beach.${code.code }.data || '-1' }}</a>
						                    	</c:if>
						                    	<c:if test="${code.type==2}">
								                  	  <a href="#" editable-select="beach.${code.code }.data" 
								                  	  e-ng-options="s.data as s.value for s in m.${code.code }List">
													    {{ showStatus(m.${code.code }List,beach.${code.code }.data) }}
													 </a>
						                    	</c:if>
						                    </td>
					              	   	 </tr>
				              	   </c:forEach>
			              	   </c:forEach>
			              </tbody>
					  </table>
		    	</div>
		    </div>
		    
		</div>
</body>

<link rel="stylesheet" href="${ctx }/shenhai/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/shenhai/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script src="${ctx }/shenhai/js/beach/beachImport_init.js"></script>
</html>