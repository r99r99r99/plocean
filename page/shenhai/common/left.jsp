<%@ page language="java"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
 <head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script type="text/javascript">
function changeTop(){
	$.ajax({
		  url: 'changeTopMenuPageStyle.do', //url  action是方法的名称
		  data: '',
	      type: 'POST',
	      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
	      ContentType: "application/json; charset=utf-8",
	      success: function(data) {
	    	  if(data!=null&&data.menuStyle==1){
	    		  menu2top();
	    	  }else{
	    		  menu2left();
	    	  }
	      },
	      error: function(msg) {
	         
	      } 
	});
}
//菜单调整到左侧
function menu2left(){
	$("#sidebar").removeClass("h-sidebar navbar-collapse collapse");
	$("#sidebar").addClass("responsive");
	
	
	$(".firstMenu").removeClass("hover");
	$(".secondMenu").removeClass("hover");
	
}
//菜单调整到上方
function menu2top(){
	$("#sidebar").removeClass("responsive");
	$("#sidebar").addClass("h-sidebar navbar-collapse collapse");
	
	$(".firstMenu").addClass("hover");
	$(".secondMenu").addClass("hover");
}

</script>
</head>
<body >
		<div id="sidebar" 
			<c:choose>
				 <c:when test="${pageStyle.menuStyle==1 }">
				 	class="sidebar h-sidebar navbar-collapse collapse ace-save-state"
				 </c:when>
				 <c:otherwise> 
				 	class="sidebar responsive ace-save-state"
				 </c:otherwise>
			</c:choose>
		>
			<script type="text/javascript">
				try{ace.settings.loadState('sidebar')}catch(e){}
			</script>
			<div class="sidebar-shortcuts" id="sidebar-shortcuts">
					<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
						<button class="btn btn-success sidebar-collapse">
							<i class="ace-icon glyphicon glyphicon-step-backward" ></i>
						</button>

						<button class="btn btn-info" onclick="changeTop()">
							<i class="ace-icon glyphicon glyphicon-upload"></i>
						</button>

						<!-- <button class="btn btn-warning" >
							<i class="ace-icon fa fa-users"></i>
						</button>

						<button class="btn btn-danger">
							<i class="ace-icon fa fa-cogs"></i>
						</button> -->
					</div>

					<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
						<span class="btn btn-success"></span>

						<span class="btn btn-info"></span>

						<span class="btn btn-warning"></span>

						<span class="btn btn-danger"></span>
					</div>
				</div><!-- /.sidebar-shortcuts -->

				<ul class="nav nav-list">
					<c:forEach var="menu" items="${menuList}">
							<li class="firstMenu  
								<c:choose>
									<c:when test="${pageStyle.menuStyle==1 }">
									 	hover <c:if test='${menu.isopen ==1}'>active open</c:if>
									</c:when>
									<c:otherwise> 
									 	<c:if test='${menu.isopen ==1}'>open</c:if>
									</c:otherwise>
								</c:choose>
								"
							>
									<a href="${menu.url }" 
										<c:if test="${menu.url ==null||menu.url==''}">
											class="dropdown-toggle"
										</c:if>
									>
										<i class="menu-icon ${menu.picture }"></i>
										<span class="menu-text"> ${menu.name } </span>
			
										<b class="arrow fa fa-angle-down"></b>
									</a>
									<b class="arrow"></b>
									<ul class="submenu">
										<c:forEach var="childMenu" items="${menu.childMenu }">
											<li class="secondMenu 
												<c:choose>
													<c:when test="${pageStyle.menuStyle==1 }">
													 	hover <c:if test='${childMenu.iscurr ==1}'>active</c:if>
													</c:when>
													<c:otherwise> 
													 	<c:if test='${childMenu.iscurr ==1}'>active</c:if>
													</c:otherwise>
												</c:choose>
												"
											>
												<a href="${childMenu.url }?currmenuId=${childMenu.code }">
													<i class="menu-icon fa fa-caret-right"></i>
													${childMenu.name }
												</a>
												<b class="arrow"></b>
											</li>
										</c:forEach>
									</ul>
							</li>
					</c:forEach>
				</ul><!-- /.nav-list -->

				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i id="sidebar-toggle-icon" class="ace-icon fa fa-angle-double-left ace-save-state" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>
			</div>
</body>
</html>
