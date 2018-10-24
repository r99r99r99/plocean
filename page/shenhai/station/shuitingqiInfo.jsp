<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html >


<c:set var="ctx" value="${pageContext.request.contextPath}"/>
	<head>
		<meta charset="utf-8" />
		<title>${system.systemName }</title>
		<meta name="keywords" content="入海污染源" />
	</head>
	<body ng-app="myApp" ng-controller="customersCtrl"> 
		<%@ include file="../common/top.jsp" %>
		<!-- angularjs select tree -->
		<link rel="stylesheet" href="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.css" />
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/resources/angular-select-tree/angular-multi-select-tree-0.1.0.tpl.js"></script>
		<script type="text/javascript" src="${ctx }/shenhai/js/station/shuitingqiInfo.js"></script>
		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>
			<div class="main-container-inner">
			<%@ include file="../common/leftMenu4tuxing.jsp" %>

				<div class="main-content" >
					<div class="breadcrumbs" id="breadcrumbs">
						<script type="text/javascript">
							try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
						</script>
						
						<ul class="breadcrumb">
							<li>
								<i class="icon-home home-icon"></i>
								<a href="#">${currMenu.pMenuName }</a>
							</li>

							<li>
								<a href="#">${currMenu.cMenuName }</a>
							</li>
						</ul><!-- .breadcrumb -->
					</div>
					<div style="word-wrap:break-word; overflow:hidden;">
					<ul class="seachform">
					<li><label>水听器列表</label>
					    <div class="vocation">
						    <select  ng-model="u.stationId" class="select3"
							  ng-options="option.value as option.name for option in stationList">
							 </select>
					    </div>
					 </li>
				    <!-- <li><label>参数类型</label>   -->
				    <li><label>状态</label>
					    <div class="vocation">
						    <select  ng-model="u.isactive" class="select3"
                              ng-change="query()" 
							  ng-options="option.value as option.name for option in activelist">
							 </select>
					    </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    </ul>
				    </div>
					<div class="container-fluid">
					<div class="row-fluid">
						<div class="col-xs-12 col-sm-8 " style="padding-left:100px">
											<!-- <div id="datashow"></div> -->
											<div class="widget-box">
												<div class="widget-header header-color-yle">
													<h5 class="bigger lighter">
														水听器
													</h5>
												</div>
											</div>
											<div class="widget-body" style=" height: 100%; margin: 0 auto">
												<div class="widget-main no-padding">
														<img alt="" src="${ctx }/images/station/shuitingqi.png" ng-click="showState()" style="width: 100%">
												</div>
											</div>
											
						</div>
					</div>
				</div>	
				</div>
				</div>
			</div>
			
<script type="text/ng-template" id="popupTmpl.html">  
<div id="editdiv" class="page-content" style="margin-top:-13px;margin-bottom:-13px;margin-left:-13px;margin-right:-13px">
	<div class="page-header">
			<strong>
				{{station.title}}
				<i class="icon-double-angle-right"></i>
			</strong>
	</div><!-- /.page-header -->
	
	<div class="row">
	<div class="col-xs-12"  id ="ppdiv">
		<form class="form-horizontal" role="form" name="myForm"  novalidate>
			<input type="hidden" id="form-field-1" ng-model="station.id" />
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 设备状态 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.shebei" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="正常运行" />
				</div>
			</div>
			<div class="space-4"></div>
	
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 经度 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.jingdu" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="100" />
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 维度 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.weidu" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="100" />
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 包含设备 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.baohan" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="摄像头  传感器" />
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 目标经度 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.mubiaoj" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="200" />
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 目标维度 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.mubiaow" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="200" />
				</div>
			</div>
			<div class="space-4"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 网络状况 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="station.wangluo" name="code"  readonly class="col-xs-10 col-sm-5" maxlength="10" 
						 value="连接" />
				</div>
			</div>
			<div class="space-4"></div>
			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button class="btn btn-info" type="button" ng-click="save()" >
						<i class="icon-ok bigger-110"></i>
							保存
					</button>

					&nbsp; &nbsp; &nbsp;

				</div>
			</div>
		</form>	
	</div>
	<div>
</div>			
</script> 
</body>
</html>
