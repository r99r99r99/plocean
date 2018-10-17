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
		<%-- <link href="${ctx }/resources/mstp/css/bootstrap-responsive.min.css" rel="stylesheet" /> --%>
		<link href="${ctx }/resources/mstp/css/fullcalendar.css" rel="stylesheet" />
		<link rel="stylesheet" href="${ctx }/resources/mstp/css/maruti-style.css" />
		<link rel="stylesheet" href="${ctx }/resources/mstp/css/maruti-media.css" class="skin-color" />
		
		
		<script src="${ctx }/shenhai/js/jquery-2.1.3.min.js"></script>
		<!--ztree的js样式-->
		<!--[if lt IE 9]>
					<script src="js/html5shiv.js"></script>
				    <script src="js/respond.min.js"></script>
				<![endif]-->
				
		
		
		<!-- angularjs -->
		<script src="${ctx }/shenhai/js/angular-1.5.0/angular.js"></script>
		<script src="${ctx }/shenhai/js/angular-1.5.0/angular-animate.js"></script>
		<script src="${ctx }/shenhai/js/angular-1.5.0/angular-touch.js"></script>
		
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
		
		
		<script src="${ctx }/shenhai/resources/assets/js/jquery-2.0.3.js"></script>
		
<title>海洋立体环境在线监测系统</title>
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
</script>

</head>

<body style="background-image: url('${ctx }/images/top/banner1.png');background-repeat:no-repeat;">
	<div id="header">
	  
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
    <li class="" ><a title="" href="${ctx}/info_warnvalue.do?currmenuId=108020"><i class="icon icon-user"></i> 
		<span class="text">预警</span> <span class="label label-important">${warnNum}</span>
	</a></li>
    <li class=" dropdown" id="menu-messages">
    	<a href="#" data-toggle="dropdown" data-target="#menu-messages" class="dropdown-toggle">
    		<i class="icon icon-envelope"></i> 
    		<span class="text">欢迎,${user.realName }</span> 
    		<b class="caret"></b>
    	</a>
      <ul class="dropdown-menu">
        <li><a class="sAdd" title="" href="${ctx}/userSettingInfo.do">个人设置</a></li>
        <li><a class="sInbox" title="" href="${ctx}/passSettingInfo.do">密码修改</a></li>
        <li><a class="sOutbox" title="" href="${ctx}/passSettingInfo.do">短信设置</a></li>
      </ul>
    </li>
    <li class=""><a title="" href="${ctx}/logout.do"><i class="icon icon-share-alt"></i> <span class="text">退出登录</span></a></li>
  </ul>
</div>

<!--close-top-Header-menu-->

<div id="sidebar">
  <ul>
  	 <c:forEach var="menu" items="${menuList}">
  	 	<li>
  	 		<c:if test="${menu.url !=null}">
  	 			<a href="${menu.url }?currmenuId=${menu.code }">
  	 			<i class="${menu.picture }"></i> <span>${menu.name }</span></a>
  	 		</c:if>
  	 		<c:if test="${menu.url ==null}">
  	 			<a href="#"><i class="${menu.picture }"></i><span>${menu.name }</span></a>
  	 			<ul>
  	 				<c:forEach var="cmenu" items="${menu.childMenu}">
  	 					<li><a href="${cmenu.url }?currmenuId=${cmenu.code }">${cmenu.name }</a></li>
  	 				</c:forEach>
  	 			</ul>
  	 		</c:if>
  	 	</li>
  	 </c:forEach>
  </ul>
</div>
		
	
<!--头部结束-->

<script src="${ctx }/resources/mstp/js/excanvas.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.ui.custom.js"></script> 
<script src="${ctx }/resources/mstp/js/bootstrap.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.flot.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.flot.resize.min.js"></script> 
<script src="${ctx }/resources/mstp/js/jquery.peity.min.js"></script> 
<script src="${ctx }/resources/mstp/js/fullcalendar.min.js"></script> 
<script src="${ctx }/resources/mstp/js/maruti.js"></script> 
<script src="${ctx }/resources/mstp/js/maruti.dashboard.js"></script> 
<script src="${ctx }/resources/mstp/js/maruti.chat.js"></script> 
<script type="text/javascript">
  // This function is called from the pop-up menus to transfer to
  // a different page. Ignore if the value returned is a null string:
  function goPage (newURL) {

      // if url is empty, skip the menu dividers and reset the menu selection to default
      if (newURL != "") {
      
          // if url is "-", it is this page -- reset the menu:
          if (newURL == "-" ) {
              resetMenu();            
          } 
          // else, send page to designated URL            
          else {  
            document.location.href = newURL;
          }
      }
  }

// resets the menu selection upon entry to this page:
function resetMenu() {
   document.gomenu.selector.selectedIndex = 2;
}	
  
</script>
</body>
</html>