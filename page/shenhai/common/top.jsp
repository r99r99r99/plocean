<%@ page language="java"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>


<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<link href="${ctx }/shenhai/css/common/select.css" rel="stylesheet" type="text/css" />
		<%-- <link href="${ctx }/shenhai/resources/mstp/css/bootstrap.min.css" rel="stylesheet" />
		<link href="${ctx }/shenhai/resources/mstp/css/fullcalendar.css" rel="stylesheet" />
		<link rel="stylesheet" href="${ctx }/shenhai/resources/mstp/css/maruti-style.css" />
		<link rel="stylesheet" href="${ctx }/shenhai/resources/mstp/css/jquery.gritter.css" />
		<link rel="stylesheet" href="${ctx }/shenhai/resources/mstp/css/maruti-media.css" class="skin-color" /> --%>
		
		<!-- 引入ACE框架部分 -->
		<!-- bootstrap & fontawesome -->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/bootstrap.min.css" />
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/font-awesome/4.5.0/css/font-awesome.min.css" />

		<!-- page specific plugin styles -->

		<!-- text fonts -->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/fonts.googleapis.com.css" />

		<!-- ace styles -->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/ace.min.css" class="ace-main-stylesheet" id="main-ace-style" />

		<!--[if lte IE 9]>
			<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/ace-part2.min.css" class="ace-main-stylesheet" />
		<![endif]-->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/ace-skins.min.css" />
		<link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/ace-rtl.min.css" />

		<!--[if lte IE 9]>
		  <link rel="stylesheet" href="${ctx }/shenhai/resources/assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->
		<script src="${ctx }/shenhai/resources/assets/js/ace-extra.min.js"></script>

		<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

		<!--[if lte IE 8]>
		<script src="${ctx }/shenhai/resources/assets/js/html5shiv.min.js"></script>
		<script src="${ctx }/shenhai/resources/assets/js/respond.min.js"></script>
		<![endif]-->
		
		<!-- 引入ACE框架部分结束 -->
		
		<!--[if !IE]> -->
		<script src="${ctx }/shenhai/resources/jquery-2.1.3.min.js"></script>
		<!-- <![endif]-->
		<!--[if IE]>
		<script src="${ctx }/shenhai/resources/assets/js/jquery-1.11.3.min.js"></script>
		<![endif]-->


		
		
		
		<!-- angularjs -->
		<script src="${ctx }/shenhai/resources/angular-1.5.0/angular.js"></script>
		<script src="${ctx }/shenhai/resources/angular-1.5.0/angular-animate.js"></script>
		<script src="${ctx }/shenhai/resources/angular-1.5.0/angular-touch.js"></script>
		
		<!-- ngdialog -->
		<script src="${ctx }/shenhai/resources/ngdialog/ngDialog.js"></script>
		<link href="${ctx }/shenhai/resources/ngdialog/ngDialog.css" rel="stylesheet" type="text/css" />
		<link href="${ctx }/shenhai/resources/ngdialog/ngDialog-theme-default.css" rel="stylesheet" type="text/css" />
		
		<script src="${ctx }/shenhai/resources/ui-bootstrap-tpls/ui-bootstrap-tpls.js"></script>
		<%-- <script src="${ctx }/shenhai/resources/ng-grid/ng-grid.debug.js"></script>
		<script src="${ctx }/shenhai/resources/ng-grid/ng-grid-layout.js"></script> --%>
		<script src="${ctx }/shenhai/resources/ui-grid/ui-grid.js"></script>
		<script src="${ctx }/shenhai/resources/ui-grid/csv.js"></script>
		<script src="${ctx }/shenhai/resources/ui-grid/pdfmake.js"></script>
		<script src="${ctx }/shenhai/resources/ui-grid/vfs_fonts.js"></script>
		<link href="${ctx }/shenhai/resources/ui-grid/ui-grid.css" rel="stylesheet">
		<%-- <script src="${ctx }/shenhai/resources/ng-grid/ng-grid.min.js"></script>
		<link href="${ctx }/shenhai/resources/ng-grid/ng-grid.min.css" rel="stylesheet"> 
		<script src="${ctx }/shenhai/resources/ng-grid/ng-grid-csv-export.js"></script>	--%>
		
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
	<div id="navbar" class="navbar navbar-default          ace-save-state">
		<div class="navbar-container ace-save-state" id="navbar-container">
			<button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar">
					<span class="sr-only">Toggle sidebar</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
			</button>
			<div class="navbar-header pull-left">
				   <a href="index.html" class="navbar-brand">
						<small>
							<!-- <i class="fa fa-leaf"></i> -->
							${system.systemName }
						</small>
					</a>
			</div>
			
			<div class="navbar-buttons navbar-header pull-right" role="navigation">
				<ul class="nav ace-nav">
						<li class="purple dropdown-modal">
							<a  href="info_warnvalue.do?currmenuId=108020">
								<i class="ace-icon fa fa-bell icon-animated-bell"></i>
								<span class="badge badge-important">${warnNum }</span>
							</a>
						</li>
						<li class="green dropdown-modal">
							<a  href="info_noticeList.do?currmenuId=170030">
								<i class="ace-icon fa fa-envelope icon-animated-vertical"></i>
								<span class="badge badge-success" id="noReadNoticeId"></span>
							</a>
						</li>
						<li class="light-blue dropdown-modal">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
								<img class="nav-user-photo" src="${ctx }/shenhai/resources/assets/images/avatars/user.jpg" alt="Jason's Photo" />
								<span class="user-info">
									<small>欢迎,</small>
									${user.realName }
								</span>

								<i class="ace-icon fa fa-caret-down"></i>
							</a>

							<ul class="user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li>
									<a href="${ctx}/userSettingInfo.do">
										<i class="ace-icon fa fa-cog"></i>
										个人设置
									</a>
								</li>

								<li>
									<a href="${ctx}/passSettingInfo.do">
										<i class="ace-icon fa fa-user"></i>
										密码修改
									</a>
								</li>
								
								<%-- <li>
									<a href="${ctx}/choseSystem.do">
										<i class="ace-icon fa fa-user"></i>
										返回系统
									</a>
								</li> --%>

								<li class="divider"></li>

								<li>
									<a href="${ctx}/logout.do">
										<i class="ace-icon fa fa-power-off"></i>
										退出登录
									</a>
								</li>
							</ul>
						</li>
					</ul>
			</div>
		</div>
	</div>	
<!--头部结束-->

<%-- <script src="${ctx }/shenhai/resources/mstp/js/excanvas.min.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/jquery.ui.custom.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/bootstrap.min.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/jquery.peity.min.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/jquery.gritter.min.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/fullcalendar.min.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/maruti.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/maruti.dashboard.js"></script> 
<script src="${ctx }/shenhai/resources/mstp/js/maruti.chat.js"></script>  --%>


<!-- basic scripts -->
		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='${ctx }/shenhai/resources/assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="${ctx }/shenhai/resources/assets/js/bootstrap.min.js"></script>
	
		

		<!-- ace scripts -->
		<script src="${ctx }/shenhai/resources/assets/js/ace-elements.min.js"></script>
		<script src="${ctx }/shenhai/resources/assets/js/ace.min.js"></script>

		<!-- inline scripts related to this page -->
		
		
<script type="text/javascript">

  function getNoticeList(){
	  var mparam = {};	  
	 /*  $.ajax({
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
  	});*/
  	
  	 $.ajax({
		  url: 'getNoReadNoticeListByUser.do', //url  action是方法的名称
		  data: mparam,
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	  $("#noReadNoticeId").html(data.length)
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