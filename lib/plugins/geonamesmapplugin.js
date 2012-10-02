// Generated by CoffeeScript 1.3.1
(function() {
	__bind = function(fn, me) {
		return function() {
			return fn.apply(me, arguments);
		};
	}, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key))
				child[key] = parent[key];
		}
		function ctor() {
			this.constructor = child;
		}


		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};

	window.GeoNamesMapPlugin = (function(_super) {
		__extends(GeoNamesMapPlugin, _super);

		GeoNamesMapPlugin.name = 'GeoNamesMapPlugin';

		function GeoNamesMapPlugin() {
			return GeoNamesMapPlugin.__super__.constructor.apply(this, arguments);
		}

		var latitude, longitude;
		var locationName, map, clickCounter = 0;

		GeoNamesMapPlugin.prototype.init = function() {
			var annotation, _i, _len, _ref, _results, _this = this;
			console.log("Initialize GeoNamesMapPlugin");
			//console.info("annotations", this.lime.annotations);
			jQuery(this.lime).bind('timeupdate', function(e) {
			});
			_ref = this.lime.annotations;
			_results = [];
			for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
				annotation = _ref[_i];
				if (annotation.resource.value.indexOf("geonames") > 0 && annotation.resource.value.indexOf("about.rdf") < 0) {
				//	clickCounter = 0;
					jQuery(annotation).bind('becomeActive', function(e) {
						var domEl;
						//	console.info(e.annotation, 'became active');
						//	console.log(_this.lime.widgetContainers);
						domEl = _this.lime.allocateWidgetSpace("GeoNamesMapPlugin");
						if (domEl) {
							//		console.log("geonames annot");
							//	domEl.html("<a href='" + e.annotation.resource + "' target='_blank' >" + e.annotation.resource + "</a>");
							if (e.annotation.ldLoaded) {
								domEl.html(_this.renderAnnotation(e.annotation));
							} else {
								jQuery(e.annotation).bind('ldloaded', function(e2) {
									//console.log("anno is ldLoaded -> rendering");
									return domEl.html(_this.renderAnnotation(e.annotation));
								});
								domEl.html(_this.renderAnnotation(e.annotation));
							}
							domEl.click(function() {//click behaviour - highlight the related widgets by adding a class to them
							//	clickCounter += 1;
								_this.lime.player.pause();

								_this.displayModal(e.annotation);
								//console.log(result);
							});
							return e.annotation.widgets.GeoNamesMapPlugin = domEl;
						} else { debugger;
						}

					});
					_results.push(jQuery(annotation).bind("becomeInactive", function(e) {
						//console.info(e.annotation, 'became inactive');
						if (e.annotation.widgets.GeoNamesMapPlugin) {
                            e.annotation.widgets.GeoNamesMapPlugin.remove();
    						delete e.annotation.widgets.GeoNamesMapPlugin;
                        }
					}));
				}
			}
			return _results;
		};

		GeoNamesMapPlugin.prototype.renderAnnotation = function(annotation) {
			var latDeg, latMin, latSec, lonDeg, lonMin, lonSec, props, _ref, _ref1, returnResult;
			var hasCoord = false;
			//var locationName = "";
			var queryString = "";
			//	console.log("rendering geonamesAnn: ", annotation);
			//props = annotation.entity[annotation.resource.value];
			//console.log("Propo: "+props);
			try {
				if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp = new XMLHttpRequest();
				} else {// code for IE6, IE5
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.open("POST", annotation.resource.value + "/about.rdf", false);
				xmlhttp.send();
				xmlDoc = xmlhttp.responseXML;

				//document.write("<table border='1'>");
				var x = xmlDoc.getElementsByTagName("Feature");
				for ( i = 0; i < x.length; i++) {
					//document.write("<tr><td>");
					locationName = x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
					//document.write("</td><td>");
					latitude = x[i].getElementsByTagName("lat")[0].childNodes[0].nodeValue;
					//document.write("</td><td>");
					longitude = x[i].getElementsByTagName("long")[0].childNodes[0].nodeValue;
					//document.write("</td></tr>");
				}
				if (latitude != "" && longitude != "" && locationName != "") {
					//	console.log("has latitude, longitude and locationName");
					hasCoord = true;
					queryString = "http://maps.google.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=9&size=400x300&format=png&maptype=roadmap&markers=color:green|label:x|" + latitude + "," + longitude + "&sensor=false";
				}
			} catch(exception) {
			}
			//console.log("hasCoord: " + hasCoord);
			returnResult = "<p> Should be a Map here </p>";
			if (hasCoord) {
				//	"<img width= \"100px\" height= \"100px\" src=\"" + queryString + "\"> " ;
				//	return "<img style=\"width: 100px; height: 100px;\" src=\"" + queryString + "\"> " ;
				returnResult = "<div class=\"geonamesMap\"  style=\"background-color: black; height: 270px\" ><img style=\"width: 100%; height: 70%;\" src=\"" + queryString + "\"> " + "<div id=\"mapLabel\" style=\"width: 100%; height: 27%; font-family:verdana; font-size:14px; /media/EXPRESSGATE/MyWorks/For_Seekda/TV Emulator/Dev/ConnectMe_1.2/img/sport.pngkground-image: -ms-linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); background-image: -webkit-gradient(	linear,	left bottom, left top, color-stop(0.32, rgb(33,26,20)), color-stop(0.66, rgb(69,61,55)), color-stop(0.15, rgb(28,22,21))); color: white\"> " + "<table> <tr> <td> <img src=\"img/mapIcon.png\" style=\"width: 40px; height: 40px;\" ></td><td><em style=\"font-size:18px; color: white;\">" + locationName + "</em></td></tr></table>" + "&nbsp;&nbsp;  lat: " + latitude + "; long: " + longitude + "</div><div style=\"width: 100%; height: 3%; background-color: lightgreen;font-size:14px;\">_</div>";
			} else {
				returnResult = "<img width= \"100px\" height= \"100px\" src=\"" + queryString + "\"> ";
			}
			return returnResult;
		};

		function showInModalWindow(outputElement) {

			var output = document.getElementById(outputElement);
			var latlng = new google.maps.LatLng(latitude, longitude);
		//	console.log("latitude: " + latitude + " longitude: " + longitude + " = latlong: " + latlng);
			var myOptions = {
				zoom : 13,
				center : latlng,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}
			var map = new google.maps.Map(output, myOptions);
			
		}


		GeoNamesMapPlugin.prototype.displayModal = function(annotation) {// Modal window script usin jquery

			// Get Modal Window
			//var modalcontainer;
			if (this.lime.player.isFullScreen) {
				modalcontainer = $('.modalwindow');
			} else {
				modalcontainer = $('#modalWindow');
			}

			// Get mask element
			var mask;
			if (this.lime.player.isFullScreen) {
				mask = $('.mask');
			} else {
				mask = $('#mask');
			}
			$(modalcontainer).css('height', "70%");
			$(modalcontainer).empty();
			$(modalcontainer).append("<a href=\"#\" class=\"close\" role=\"button\"><img src=\"img/close-icon.png\" style=\"width: 22px; height: 22px;\"/></a>");
			$(modalcontainer).append("<div id=\"modalContent\" style=\"height: 95%; width: 100%; position: relative; margin: 0 auto; \"> &nbsp");
			//	$(modalcontainer).append("<div id=\"mapLabel\" style=\"width: inherit; height: 25%; font-family:verdana; font-size:14px; /media/EXPRESSGATE/MyWorks/For_Seekda/TV Emulator/Dev/ConnectMe_1.2/img/sport.pngkground-image: -ms-linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); background-image: -webkit-gradient(	linear,	left bottom, left top, color-stop(0.32, rgb(33,26,20)), color-stop(0.66, rgb(69,61,55)), color-stop(0.15, rgb(28,22,21))); color: white\"> " + "<table> <tr> <td> <img src=\"img/mapIcon.png\" style=\"width: 40px; height: 40px;\" ></td><td><em style=\"font-size:18px; color: white;\">" + locationName + "</em></td></tr></table>" + "&nbsp;&nbsp;  lat: " + latitude + "; long: " + longitude + "</div>");
			$(modalcontainer).append("</div>");
		//	console.log("$(modalcontainer) = " + $(modalcontainer).html() + " modalcontainer " + modalcontainer.html());

			//Get the screen height and width
			var maskHeight = $(window).height();
			var maskWidth = $(window).width();

			//Set heigth and width to mask to fill up the whole screen
			$(mask).css({
				'width' : maskWidth,
				'height' : maskHeight
			});

			//transition effect
			$(mask).fadeIn(100);
			$(mask).fadeTo("fast", 0.8);

			//Get the window height and width
			var winH = $(window).height();
			var winW = $(window).width();

			//Set the popup window to center
			$(modalcontainer).css('top', winH / 2 - $(modalcontainer).height() / 2);
			$(modalcontainer).css('left', winW / 2 - $(modalcontainer).width() / 2);

			//transition effect
			$(modalcontainer).fadeIn(100);

			//if close button is clicked
			$('.close').click(function(e) {
				//Cancel the link behavior
				e.preventDefault();
				$(mask).hide();
				$(modalcontainer).hide();
			});

			//if mask is clicked
			$(mask).click(function() {
				$(this).hide();
				$(modalcontainer).hide();
			});

			$(window).resize(function() {

				//var box = modalcontainer;

				//Get the screen height and width
				var maskHeight = $(document).height();
				var maskWidth = $(document).width();

				//Set height and width to mask to fill up the whole screen
				$(mask).css({
					'width' : maskWidth,
					'height' : maskHeight
				});

				//Get the window height and width
				var winH = $(window).height();
				var winW = $(window).width();

				//Set the popup window to center
				$(modalcontainer).css('top', winH / 2 - $(modalcontainer).height() / 2);
				$(modalcontainer).css('left', winW / 2 - $(modalcontainer).width() / 2);
				//box.blur(function() { setTimeout(<bluraction>, 100); });

			});
			showInModalWindow("modalContent");
			//$(modalcontainer).css('height', "70%");
		}

		return GeoNamesMapPlugin;

	})(window.LimePlugin);
	/*AnnotationOverlaysComponent VideoJS component -  displays overlays on top of video */

}).call(this);
