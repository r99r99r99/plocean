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

</head>
<body >
		<div id="sidebar" class="sidebar responsive ace-save-state">
			<script type="text/javascript">
				try{ace.settings.loadState('sidebar')}catch(e){}
			</script>
			<div class="sidebar-shortcuts" id="sidebar-shortcuts">
					<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
						<button class="btn btn-success">
							<i class="ace-icon fa fa-signal"></i>
						</button>

						<button class="btn btn-info">
							<i class="ace-icon fa fa-pencil"></i>
						</button>

						<button class="btn btn-warning">
							<i class="ace-icon fa fa-users"></i>
						</button>

						<button class="btn btn-danger">
							<i class="ace-icon fa fa-cogs"></i>
						</button>
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
						<c:if test="${menu.isopen ==1}">
							<li class="">
								<c:choose> 
								<c:when test="${menu.url !=null&&menu.url!=''}">  
									<a href="${menu.url }">
										<i class="menu-icon ${menu.picture }"></i>
										<span class="menu-text"> ${menu.name } </span>
									</a>
			
									<b class="arrow"></b>
								</c:when>
								<c:otherwise>
									<a href="${menu.url }" class="dropdown-toggle">
										<i class="menu-icon ${menu.picture }"></i>
										<span class="menu-text"> ${menu.name } </span>
			
										<b class="arrow fa fa-angle-down"></b>
									</a>
									<b class="arrow"></b>
									<ul class="submenu">
										<c:forEach var="childMenu" items="${menu.childMenu }">
											<li class="">
												<a href="${childMenu.url }?currmenuId=${childMenu.code }">
													<i class="menu-icon fa fa-caret-right"></i>
													${childMenu.name }
												</a>
				
												<b class="arrow"></b>
											</li>
										</c:forEach>
									</ul>
								</c:otherwise>
								</c:choose>
							</li>
						</c:if>
						<c:if test="${menu.isopen !=1}">
							<li class="">
								<c:choose> 
								<c:when test="${menu.url !=null&&menu.url!=''}">  
									<a href="${menu.url }">
										<i class="menu-icon ${menu.picture }"></i>
										<span class="menu-text"> ${menu.name } </span>
									</a>
			
									<b class="arrow"></b>
								</c:when>
								<c:otherwise>
									<a href="${menu.url }" class="dropdown-toggle">
										<i class="menu-icon ${menu.picture }"></i>
										<span class="menu-text"> ${menu.name } </span>
			
										<b class="arrow fa fa-angle-down"></b>
									</a>
									<b class="arrow"></b>
									<ul class="submenu">
										<c:forEach var="childMenu" items="${menu.childMenu }">
											<li class="">
												<a href="${childMenu.url }?currmenuId=${childMenu.code }">
													<i class="menu-icon fa fa-caret-right"></i>
													${childMenu.name }
												</a>
				
												<b class="arrow"></b>
											</li>
										</c:forEach>
									</ul>
								</c:otherwise>
								</c:choose> 
							</li>
						</c:if>
					</c:forEach>
				</ul><!-- /.nav-list -->

				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i id="sidebar-toggle-icon" class="ace-icon fa fa-angle-double-left ace-save-state" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>
			</div>
</body>
</html>
