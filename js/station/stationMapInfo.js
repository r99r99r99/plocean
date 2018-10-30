var myApp = angular.module('myApp',['ui.grid', 'ui.grid.exporter',
                                    'ngTouch','ui.grid.resizeColumns','ui.grid.selection',
                                    'textAngular','ui.bootstrap','highcharts-ng','ngDialog','ui.grid.cellNav', 'ui.grid.pinning']); 
var deviceId;
var stationId;
myApp.controller('customersCtrl',function($scope,$http,$timeout,$modal){
	
	//添加一下内容防止输出乱码
	$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';  
	$http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
	$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	
	
	var mm = "";
	//读取当前站点的配置信息
	$http({  responseType:'json',
		 method:'POST',
		 url:'getCurrStation.do',
		 params:mm})
		 .success(function(res){
			 //得到当前站点的图标
			 var x = res.id;
			 if(x%2==0){
				 res.icon = res.icon.replace('.','_green.');
			 }
			 
			 //得到当前站点的点击后的信息
			 var infomation = res.pic
             + "<br><h3>"+ res.title + '</h3>位于坐标:北纬'+res.latitude+"  东经"+res.longitude
             +"<br>"+res.brief;
			 
			 var startMarker = new ol.Feature({
			        type: 'icon',
			        name: infomation,
			        population: 4000,
			        rainfall: 500,
			        //geometry: new ol.geom.Point([109.4757,18.2093])
			 		geometry: new ol.geom.Point([res.latitude,res.longitude])
			      });
			  
			   var styles = {
			        
			        'icon': new ol.style.Style({
			          image: new ol.style.Icon({
			            anchor: [0.5, 46],
			           anchorXUnits: 'fraction',
			           anchorYUnits: 'pixels',
			            src: 'images/station/icon/'+res.icon
			            	//src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
			          })
			        })
			        
			      };
			      
			  var vectorLayer = new ol.layer.Vector({
			        source: new ol.source.Vector({
			          features: [startMarker]
			        }),
			        style: function(feature) {
			          // hide geoMarker if animation is active
			          return styles[feature.get('type')];
			        }
			      });   
			      
			      
			      var format = 'image/png';
			      //var bounds = [109.37576293945312,18.10930815510142,109.5831298828125,18.33366944577129];
			      var bounds = [109.3359375,18.17138671875,109.599609375,18.3251953125];
			     
			      var mousePositionControl = new ol.control.MousePosition({
			        className: 'custom-mouse-position',
			        target: document.getElementById('location'),
			        coordinateFormat: ol.coordinate.createStringXY(5),
			        undefinedHTML: '&nbsp;'
			      });
			     var untiled = new ol.layer.Image({
			        source: new ol.source.ImageWMS({
			          ratio: 1,
			          url: 'http://192.168.10.230:8080/geoserver/sanya/wms',
			          params: {'FORMAT': format,
			                   'VERSION': '1.1.1',  
			                STYLES: '',
			                LAYERS: 'sanya:sanya02',
			          }
			        })
			      });
			      var tiled = new ol.layer.Tile({
			        visible: false,
			        source: new ol.source.TileWMS({
			          url: 'http://192.168.10.230:8080/geoserver/sanya/wms',
			          params: {'FORMAT': format, 
			                   'VERSION': '1.1.1',
			                   tiled: true,
			                STYLES: '',
			                LAYERS: 'sanya:sanya02',
			             tilesOrigin: -130.85168 + "," + 20.7052
			          }
			        })
			      });
			       var tiled = new ol.layer.Tile({
			           title:"Global Imagery",
			           source:new ol.source.TileWMS({
			              url:'http://192.168.10.230:8080/geowebcache/service/wms',
			              params: {LAYERS:'sanya00218', VERSION:'1.1.1'}
			           })
			      });
			      var projection = new ol.proj.Projection({
			          code: 'EPSG:4326',
			          units: 'degrees',
			          axisOrientation: 'neu',
			          global: true
			      });
			      var map = new ol.Map({
			        controls: ol.control.defaults({
			          attribution: false
			        }).extend([mousePositionControl]),
			        target: 'map',
			        layers: [
			          untiled,
			          tiled,
			          vectorLayer
			        ],
			        view: new ol.View({
			           projection: projection,
			           zoom: 13,
						minZoom: 13,
						maxZoom: 18
			        })
			      });
			      map.getView().on('change:resolution', function(evt) {
			        var resolution = evt.target.get('resolution');
			        var units = map.getView().getProjection().getUnits();
			        var dpi = 25.4 / 0.28;
			        var mpu = ol.proj.METERS_PER_UNIT[units];
			        var scale = resolution * mpu * 39.37 * dpi;
			        if (scale >= 9500 && scale <= 950000) {
			          scale = Math.round(scale / 1000) + "K";
			        } else if (scale >= 950000) {
			          scale = Math.round(scale / 1000000) + "M";
			        } else {
			          scale = Math.round(scale);
			        }
			      });
			      map.getView().fit(bounds, map.getSize());
			      map.on('click', function(evt) {
			        var feature = map.forEachFeatureAtPixel(evt.pixel,
			            function(feature) {
			              return feature;
			            });
			        if (feature) {
			          var coordinates = feature.getGeometry().getCoordinates();
			          popup.setPosition(coordinates);
			          $(element).popover({
			            'placement': 'top',
			            'html': true,
			            'content': feature.get('name')+feature.get('population')
			          });
			          $(element).popover('show');
			        } else {
			          $(element).popover('destroy');
			        }
			      });
			      
			       var element = document.getElementById('popup');
			       
			      var popup = new ol.Overlay({
			        element: element,
			        positioning: 'bottom-center',
			        stopEvent: false,
			        offset: [0, -50]
			      });
			      map.addOverlay(popup);
			      
			      
		 });
	
/*	var map = new ol.Map({
	    target: 'map',
	    layers: [
new ol.layer.Tile({
	  title: "Global Imagery",
	  source: new ol.source.BingMaps({
		  imagerySet: 'Road',
		  key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
		})

	})

	           ],
	    view: new ol.View({
	      center: ol.proj.transform([-93.27, 44.98], 'EPSG:4326', 'EPSG:3857'),
	      zoom: 9
	    }),
	    controls: ol.control.defaults({
	      attributionOptions: {
	        collapsible: false
	      }
	    })
	  });*/

    

});
