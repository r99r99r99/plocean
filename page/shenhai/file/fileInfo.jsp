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
		
		<script src="${ctx }/shenhai/js/file/fileInfo.js"></script>
		<script src="${ctx }/shenhai/resources/angular-file-upload-master/dist/angular-file-upload.js"></script>
		<script src="${ctx }/shenhai/resources/angular-file-upload-master/dist/directives.js"></script>
		<script src="${ctx }/shenhai/resources/My97DatePicker/WdatePicker.js"></script>
		
		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>
			<div class="main-container-inner">
			<%@ include file="../common/leftMenu.jsp" %>

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
					<li><label>模糊查询</label>
					    <div class="vocation">
						    <input type="text" ng-model="u.realName" placeholder="按照code或者名称查询" >
					    </div>
					 </li>
					 <li><label>类型列表:</label>
					    <div class="vocation">
						    <select  ng-model="u.type" class="select3" 
                              ng-change="query()" 
							  ng-options="option.value as option.name for option in typeList">
							 </select>
					    </div>
				    </li>
				    <li><label>开始时间:</label>
				    <div class="vocation">
				    	<input name="startDate" ng-model="u.beginTime" id="beginTime" placeholder="开始时间"  type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" class="scinput" >
			        </div>
				    </li>
				    <li><label>结束时间:</label>
				    <div class="vocation">
				    	<input name="endDate" ng-model="u.endTime" id="endTime" placeholder="开始时间" value="${endDate }" type="text" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" onchange="timeChange()" class="scinput" >
			        </div>
				    </li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="query()" value="查询"/></li>
				    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" ng-click="addUser()" value="新增"/></li>
				    </ul>
				    </div>
					<div class="container-fluid">
					<div class="row-fluid">
						<div class="span5">
							<div  ui-grid="gridOptions" ui-grid-selection ui-grid-pagination ui-grid-exporter class="gridStyle" ></div>
						</div>
					</div>
				</div>	
				</div>
				 
				</div>
			</div>
<script type="text/ng-template" id="popupTmpl.html">  
<div class="page-content" style="margin-top:-13px;margin-bottom:-13px;margin-left:-13px;margin-right:-13px">
	<div class="page-header">
			<strong>
				${currMenu.cMenuName }
				<i class="icon-double-angle-right"></i>
			</strong>
	</div><!-- /.page-header -->
	
	<div class="row">
	<div class="col-xs-12">
		<form class="form-horizontal" role="form" name="myForm" enctype=”multipart/form-data”  novalidate>
			<input type="hidden" id="form-field-1" ng-model="m.id" />
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 保存路径 </label>

				<div class="col-sm-9">
						<input type="text" ng-model="filepath" name="filepath"  class="col-xs-10 col-sm-5" required />
						<span style="color:red" ng-show=" myForm.filepath.$invalid">
						<span ng-show="myForm.filepath.$error.required">保存路径是必须的。</span>
						</span>
				</div>
			</div>
			<div class="space-4" class="col-xs-10 col-sm-5"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 照片 </label>

				<div class="col-sm-9">
						<input type="file" nv-file-select="" uploader="uploader" multiple  />
				</div>
			</div>
			<div class="space-4"></div>
			<div class="space-4" class="col-xs-10 col-sm-5"></div>
			
			<div class="form-group">
				<label class="col-sm-3 control-label no-padding-right" for="form-field-1">  </label>

				<div class="col-sm-9">
						<ul>
            				<li ng-repeat="item in uploader.queue">
                				<div>Name: {{ item.file.name }}</div>
                				<div>Size: {{ item.file.size/1024/1024|number:2 }} Mb</div>
                				<div ng-show="uploader.isHTML5">
                    				Progress: {{ item.progress }}
                    				<div class="item-progress-box">
                        				<div class="item-progress" ng-style="{ 'width': item.progress + '%' }"></div>
                    				</div>
                				</div>
                				<div ng-if="controller.isImage(item._file)">
                    			Thumbnail (only images):
                        			<!-- Image preview -->
                        			<!--auto height-->
                        			<!--<div ng-thumb="{ file: item.file, width: 100 }"></div>-->
                        			<!--auto width-->
                        				<div ng-thumb="{ file: item._file, height: 100 }"></div>
                        			<!--fixed width and height -->
                        				<!--<div ng-thumb="{ file: item.file, width: 100, height: 100 }"></div>-->
                				</div>
                			<div>
                			</div>
            				</li>
        				</ul>
				</div>
			</div>
			<div class="space-4"></div>
			<div class="space-4" class="col-xs-10 col-sm-5"></div>

			<div class="clearfix form-actions">
				<div class="col-md-offset-3 col-md-9">
					<button type="button" class="btn btn-success" ng-click="upload()"
           				 ng-disabled="!uploader.getNotUploadedItems().length">
        				<span class="glyphicon glyphicon-upload"></span> 上传
    				</button>
				</div>
			</div>
		</form>	
	</div>
	<div>
</div>			
</script> 
</body>
</html>
