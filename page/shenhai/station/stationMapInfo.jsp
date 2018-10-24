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
</style>
 <style>
        #map {
            clear: both;
            position: relative;
            width: 100%;
            height: 603px;
            border: 1px solid black;
        }
        #popup {
            clear: both;
            position: relative;
            width: 200px;
        }
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
		
		<link rel="stylesheet" href="${ctx }/shenhai/resources/openlayersv3.20.1/css/ol.css" type="text/css">
		<script src="${ctx }/shenhai/resources/openlayersv3.20.1/build/ol.js" type="text/javascript"></script>
		
		
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
								<a href="#">首页</a>
							</li>
							<li>
								<a href="#">${station.title }</a>
							</li>
						</ul>
					</div>
					<div class="page-content">
						<div class="row" style="margin-top:5px">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->

								
									<div class="col-xs-12 col-sm-12 " >
											     <div id="map" class="map"><div id="popup"></div></div>
									</div>
	
							</div><!-- /.col -->
						</div>
					</div>
				</div><!-- /#ace-settings-container -->
				
				
			</div><!-- /.main-container-inner -->

		</div><!-- /.main-container -->
<script type="text/javascript" charset="UTF-8">
var t = $("#mtree");
var queryParam = new Object();
	queryParam.id = 1;
	queryParam.url = "changeWp.do?wpid=";
	//读取组织树下的站点列表
	$.ajax({
      url: '${ctx}/getStation4ComanyZtreeByUser.do', //url  action是方法的名称
      data: queryParam,
      type: 'POST',
      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
      ContentType: "application/json; charset=utf-8",
      success: function(data) {
    	  console.log(data);
          //zNodes = data;
      	t = $.fn.zTree.init(t, setting, data);
      	var zTree = $.fn.zTree.getZTreeObj("mtree");
		zTree.selectNode(zTree.getNodeByParam("id", ${station.id}));
      },
      error: function(msg) {
         
      }
	}); 
	var setting = { 
			check: {
				enable: false
			},
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			data: {
				simpleData: {
					enable:true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: ""
				}
			}
	    };
	
</script>
<script src="${ctx }/shenhai/js/station/stationMapInfo.js"></script>
</body>
</html>
