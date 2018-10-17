<%@ page language="java"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>


<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<link href="${ctx }/shenhai/css/common/select.css" rel="stylesheet" type="text/css" />
		
		<link href="${ctx }/resources/mstp/css/bootstrap.min.css" rel="stylesheet" />
		<link href="${ctx }/resources/mstp/css/fullcalendar.css" rel="stylesheet" />
		<link rel="stylesheet" href="${ctx }/resources/mstp/css/maruti-style.css" />
		<link rel="stylesheet" href="${ctx }/resources/mstp/css/jquery.gritter.css" />
		<link rel="stylesheet" href="${ctx }/resources/mstp/css/maruti-media.css" class="skin-color" />
		
		
		<script src="${ctx }/resources/jquery-2.1.3.min.js"></script>
		
		
		<!-- angularjs -->
		<script src="${ctx }/resources/angular-1.5.0/angular.js"></script>
		<script src="${ctx }/resources/angular-1.5.0/angular-animate.js"></script>
		<script src="${ctx }/resources/angular-1.5.0/angular-touch.js"></script>
		
		<!-- ngdialog -->
		<script src="${ctx }/resources/ngdialog/ngDialog.js"></script>
		<link href="${ctx }/resources/ngdialog/ngDialog.css" rel="stylesheet" type="text/css" />
		<link href="${ctx }/resources/ngdialog/ngDialog-theme-default.css" rel="stylesheet" type="text/css" />
		
		<script src="${ctx }/resources/ui-bootstrap-tpls/ui-bootstrap-tpls.js"></script>
		<%-- <script src="${ctx }/resources/ng-grid/ng-grid.debug.js"></script>
		<script src="${ctx }/resources/ng-grid/ng-grid-layout.js"></script> --%>
		<script src="${ctx }/resources/ui-grid/ui-grid.js"></script>
		<script src="${ctx }/resources/ui-grid/csv.js"></script>
		<script src="${ctx }/resources/ui-grid/pdfmake.js"></script>
		<script src="${ctx }/resources/ui-grid/vfs_fonts.js"></script>
		<link href="${ctx }/resources/ui-grid/ui-grid.css" rel="stylesheet">
		<%-- <script src="${ctx }/resources/ng-grid/ng-grid.min.js"></script>
		<link href="${ctx }/resources/ng-grid/ng-grid.min.css" rel="stylesheet"> --%>
		<script src="${ctx }/resources/ng-grid/ng-grid-csv-export.js"></script>	
		
<script type="text/javascript">
<%
String message = (String)request.getAttribute("message");
int hasMessage = (message == null || message == "") ? 1 : 0;
%>
var hasMessage = "<%=hasMessage%>";
if( hasMessage == 0 )
{
    var message = "<%=message%>";
    bootbox.dialog({
		message: message, 
		buttons: {
			"success" : {
				"label" : "OK",
				"className" : "btn-sm btn-primary"
			}
		}
	});
	try{
			//alert("parent.afterSubmit();");
			parent.afterSubmit(message);
		}catch(e){
			//alert("parent.afterSubmit();EEE="+e);
		}	
}

function platformTurn(code){
	window.location.href="turnPlotform.do?menuCode="+code; 
};
function turn(url){
	window.location.href=url;
};

function showDepart(){
	var team = document.getElementById("team-status");
	if(team.style.display=="block"){
		team.style.display="none";
	}else{
		team.style.display="block";
	}
};
</script>

</head>

<body>
	<div id="header">
	  <h1 >${system.systemName } </h1>
	</div>
<!--close-Header-part--> 

<!--top-Header-messaages-->
<div class="btn-group rightzero"> 
	<a class="top_message tip-left" title="Manage Files"><i class="icon-file"></i></a> 
	<a class="top_message tip-bottom" title="Manage Users"><i class="icon-user"></i></a> 
	<a class="top_message tip-bottom" title="Manage Comments"><i class="icon-comment"></i><span class="label label-important">5</span></a> 
	<a class="top_message tip-bottom" title="Manage Orders"><i class="icon-shopping-cart"></i></a> 
</div>
<!--close-top-Header-messaages--> 

<!--top-Header-menu-->
<div id="user-nav" class="navbar navbar-inverse">
  <ul class="nav">
  <%--   <li class="" ><a title="" href="${ctx}/info_warnvalue.do?currmenuId=108020"><i class="icon icon-user"></i> 
		<span class="text">预警</span> <span class="label label-important">${warnNum}</span>
	</a></li> --%>
	 <li class="" onclick="showDepart()"><!-- > -->
	 	<a title=""><i class="icon icon-user"></i> <span class="text">${plat.name }</span></a>
	 </li>
	 
	<!--  <li class=" dropdown"><a href="#" >
	  <i class="icon icon-envelope"></i> 
	  <span class="text">通知信息</span> 
	  <span class="label label-important" id="noticeNum">0</span> 
	  <b class="caret"></b></a>
     </li> -->
    
    <li class=" dropdown" id="menu-messages">
    	<a href="#" data-toggle="dropdown" data-target="#menu-messages" class="dropdown-toggle">
    		<i class="icon icon-cog"></i> 
    		<span class="text">欢迎,${user.realName }</span> 
    		<b class="caret"></b>
    	</a>
      <ul class="dropdown-menu menu-messages_dropdown">
      	<li><a class="sAdd" title="" href="${ctx}/userSettingInfo.do">个人设置</a></li>
        
        <li><a class="sInbox" title="" href="${ctx}/passSettingInfo.do">密码修改</a></li>
        
        <li><a class="sInbox" title="" href="${ctx}/choseSystem.do">返回系统</a></li>
        
         <li><a class="sTrash" title="" href="${ctx}/logout.do">退出登录</a></li>
      </ul>
    </li>
  </ul>
</div>
<!--close-top-Header-menu-->
<!-- TEAM STATUS -->
	<div class="team-status" id="team-status">
		<ul class="team-list">
		<c:forEach var="plat" items="${platList}">
			<li class="" onclick="platformTurn('${plat.code }')">
				  <a href="javascript:void(0);">
				  <span class="image">
					  <img src="images/top/${plat.picture }" alt="" />
				  </span>
				  <span class="title">
					${plat.name }
				  </span>
					<div class="progress">
					  <div class="progress-bar progress-bar-success" style="width: 35%">
						<span class="sr-only">35% Complete (success)</span>
					  </div>
					</div>
					<span class="status">
						<!-- <div class="field">
							<span class="badge badge-red">4</span> 站点
							<span class="pull-right fa fa-list-ul"></span>
						</div> -->
				    </span>
				  </a>
				</li>
		</c:forEach>
		</ul>
	</div>
<!-- TEAM STATUS END-->
<div id="sidebar">
  <ul>
  	 <c:forEach var="menu" items="${menuList}">
  	 	<c:choose> 
  	 		<c:when test="${menu.url !=null&&menu.url!=''}">  
  	 			<li onclick="turn('${menu.url }')">
  	 				<a href="#"><i class="${menu.picture }"></i><span>${menu.name }</span></a>
  	 				<ul>
	  	 				<c:forEach var="cmenu" items="${menu.childMenu}">
	  	 					<li><a href="${cmenu.url }?currmenuId=${cmenu.code }">${cmenu.name }</a></li>
	  	 				</c:forEach>
	  	 			</ul>
  	 			</li>
  	 		</c:when>
  	 		<c:otherwise>
  	 			<li>
  	 				<a href="#"><i class="${menu.picture }"></i><span>${menu.name }</span></a>
  	 				<ul>
	  	 				<c:forEach var="cmenu" items="${menu.childMenu}">
	  	 					<li><a href="${cmenu.url }?currmenuId=${cmenu.code }">${cmenu.name }</a></li>
	  	 				</c:forEach>
	  	 			</ul>
  	 			</li>
  	 		</c:otherwise>
  	 	</c:choose>
  	 </c:forEach>
  </ul>
</div>
		
	
<!--头部结束-->

<script src="${ctx }/resources/mstp/js/excanvas.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.ui.custom.js"></script> 
<script src="${ctx }/resources/mstp/js/bootstrap.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.peity.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.gritter.min.js"></script> 
<script src="${ctx }/resources/mstp/js/fullcalendar.min.js"></script> 
<script src="${ctx }/resources/mstp/js/maruti.js"></script> 
<script src="${ctx }/resources/mstp/js/maruti.dashboard.js"></script> 
<script src="${ctx }/resources/mstp/js/maruti.chat.js"></script> 
<script type="text/javascript">

  function getNoticeList(){
	  var mparam = {};	  
	  $.ajax({
		  url: 'getLastNoReadNoticeListByUser.do', //url  action是方法的名称
		  data: mparam,
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	  if(data!=null&&data.title!=null){
		    	  $.gritter.add({
		    			title:	data.stationName+"--"+data.title,
		    			text:	data.text,
		    			image: 	'resources/mstp/img/demo/envelope.png',
		    			sticky: false
		    		});	
	    	  }
	      },
	      error: function(msg) {
	         
	      }
  	});
  }
  //定时读取未读取的通知
  var  ref = setInterval(function(){
	   getNoticeList();
  },60000);
  getNoticeList();

</script>
</body>
</html>