<%@ page contentType="text/html; charset=UTF-8"%>
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
		<div >
			<div >
				<a class="menu-toggler" id="menu-toggler" href="#">
					<span class="menu-text"></span>
				</a>

					<div class="sidebar" id="sidebar" style="height:660px">
					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'fixed')}catch(e){}
					</script>

				<div class="sidebar-shortcuts" id="sidebar-shortcuts">
						<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
							<span class="btn btn-success"></span>

							<span class="btn btn-info"></span>

							<span class="btn btn-warning"></span>

							<span class="btn btn-danger"></span>
						</div>
				</div><!-- #sidebar-shortcuts -->
				<div class="tabbable ">
						<ul class="nav nav-tabs" id="myTab">
							<li class="active" style="width:50%">
								<a data-toggle="tab" href="#home">
										<i class="green icon-home bigger-110"></i>
											组织
								</a>
							</li>
							<li  style="width:50%">
								<a data-toggle="tab" href="#profile">
										    地区
								</a>
							</li>

						</ul>
						<div class="tab-content">
							<div id="home" class="tab-pane in active">
									<ul id="mtree" class="ztree" style="height:800px; overflow-x :auto; overflow-y :no"></ul>
							</div>

							<div id="profile" class="tab-pane">
								<ul id="ktree" class="ztree" style="height:800px; overflow-x :auto; overflow-y :no"></ul>
							</div>
					   </div>
				  </div>
		</div>
		</div>
		</div>
</body>
<link rel="stylesheet" href="${ctx }/resources/zTree_s/css/metroStyle/metroStyle.css" type="text/css">
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${ctx }/resources/zTree_s/js/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript" charset="UTF-8">
var t = $("#mtree");
var k = $("#ktree");
var queryParam = new Object();
	queryParam.id = 1;
	queryParam.url = "changeWp2guiji.do?wpid=";
	//读取组织树下的站点列表
	$.ajax({
      url: '${ctx}/getStation4ComanyZtreeByUser.do', //url  action是方法的名称
      data: queryParam,
      type: 'POST',
      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
      ContentType: "application/json; charset=utf-8",
      success: function(data) {
          //zNodes = data;
      	t = $.fn.zTree.init(t, setting, data);
      	var zTree = $.fn.zTree.getZTreeObj("mtree");
		zTree.selectNode(zTree.getNodeByParam("id", ${station.id}));
      },
      error: function(msg) {
         
      }
	}); 
	//读取地区属下的站点列表
	
	$.ajax({
      url: '${ctx}/getStation4RegionZtreeByUser.do', //url  action是方法的名称
      data: queryParam,
      type: 'POST',
      dataType: "json", //可以是text，如果用text，返回的结果为字符串；如果需要json格式的，可是设置为json
      ContentType: "application/json; charset=utf-8",
      success: function(data) {
          //zNodes = data;
      	k = $.fn.zTree.init(k, setting, data);
      	var zTree = $.fn.zTree.getZTreeObj("ktree");
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
</html>
