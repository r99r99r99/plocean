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
		<title>${system.systemName }</title>
		<meta name="keywords" content="入海污染源" />
		<!-- basic styles -->
<style>
		#allmap {
			width: 100%;
			height: 100%;
			overflow: hidden;
			margin:0;
			font-family:"微软雅黑";
		}
		.anchorBL{display:none;}
        .header{
        	 padding-left: 0px;
			 padding-right: 0px;
        }
		.oneCharts {
			width: 60%;
			height:60%;
			display:inline;
			float:left; 
		}
		.twoCharts {
			width: 50%;
			height:80%;
			display:inline;
			float:left; 
		}
		#up_zzjs{border:1px solid #ccc;width:100%;height:280px;line-height:20px;overflow:hidden;}
		#up_zzjs #up_li{list-style-type:none;margin:0;padding:0;margin-left:6px;}
		#up_zzjs #up_li a{font-size:12px; line-height:16px;}
</style>

	</head>

	<body ng-app="myApp" ng-controller="customersCtrl">
		<%@ include file="../common/top.jsp" %>
		<%@ include file="../common/textAngular.jsp" %>
		<!-- 如果展示百度地图需要 -->
		<link href="${ctx }/shenhai/resources/bootstrap/css/bootstrap-combined.min.css" rel="stylesheet" type="text/css"/>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highcharts-ng.js" type="text/javascript"></script>
		<script src="${ctx }/shenhai/resources/highcharts-ng/highstock.src.js"></script>
		
		<script src="${ctx }/shenhai/resources/highcharts-ng/exporting.js"></script>
		<script src="${ctx }/shenhai/resources/assets/js/jquery.PrintArea.js"></script>
		<script src="${ctx}/shenhai/js/common.js" type="text/javascript"></script>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=5FYnGVhps4K2WlMd17k4E8ifxAPYvmSo"></script>
		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>
			<div class="main-container-inner">
			<%@ include file="../common/left.jsp" %>
				<input type="hidden" id="station" value="${station.id }">
				<div class="main-content">
					<div class="breadcrumbs" id="breadcrumbs">
						<script type="text/javascript">
							try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
						</script>
						<ul class="breadcrumb">
							<li>
								<i class="icon-home home-icon"></i>
								<a href="#">雷达</a>
							</li>
							<li>
								<a href="#">${station.title }</a>
							</li>
						</ul>
					</div>
					<div class="page-content">
						<div class="row" style="margin-top:5px">
							<div class="col-xs-12 col-sm-8 " style="padding-left:100px">
											<!-- <div id="datashow"></div> -->
											<div class="widget-box">
												<div class="widget-header header-color-yle">
													<h5 class="bigger lighter">
														雷达
													</h5>
												</div>
											</div>
											<div class="widget-body" style=" height: 100%; margin: 0 auto">
												<div class="widget-main no-padding">
														<img alt="" src="${ctx }/images/station/leida.png" ng-click="showState()" style="width: 100%">
												</div>
											</div>
											
						</div>

							</div><!-- /.col -->
						</div>
					</div>
				</div><!-- /#ace-settings-container -->
				
				
			</div><!-- /.main-container-inner -->

		</div><!-- /.main-container -->
<script type="text/javascript">
	// 百度地图API功能
	var map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
</script>
<script src="${ctx }/shenhai/js/station/leidaInfo.js"></script>
</body>
</html>
