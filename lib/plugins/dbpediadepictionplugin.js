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

	window.DBPediaDepictionPlugin = (function(_super) {
		__extends(DBPediaDepictionPlugin, _super);

		DBPediaDepictionPlugin.name = 'DBPediaDepictionPlugin';

		function DBPediaDepictionPlugin() {
			return DBPediaDepictionPlugin.__super__.constructor.apply(this, arguments);
		}


		DBPediaDepictionPlugin.prototype.init = function() {
			var annotation, _i, _len, _ref, _results, _this = this;
			console.info("Initialize DBPediaDepictionPlugin");
			//console.info("annotations", this.lime.annotations);
			jQuery(this.lime).bind('timeupdate', function(e) {
			});
			_ref = this.lime.annotations;
			_results = [];
			for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
				annotation = _ref[_i];
				jQuery(annotation).bind('becomeActive', function(e) {
					var domEl;
					//console.info(e.annotation, 'became active');
					if (annotation.resource.value.indexOf("geonames") < 0 ) {
					domEl = _this.lime.allocateWidgetSpace();
					if (domEl) {
						//domEl.html("<a href='" + e.annotation.resource + "' target='_blank'>" + e.annotation.resource + "</a>");
						if (e.annotation.ldLoaded) {
							domEl.html(_this.renderAnnotation(e.annotation));
						} else {
							jQuery(e.annotation).bind('ldloaded', function(e2) {
								return domEl.html(_this.renderAnnotation(e.annotation));
							});
						}
						
						domEl.click(function() {//click behaviour - pause player and display modal window
							
							_this.lime.player.pause();
							_this.displayModal(e.annotation);
							
						});
						
						return e.annotation.widgets.DBPediaDepictionPlugin = domEl;
					} else { debugger;
					}
					}
				});
				_results.push(jQuery(annotation).bind("becomeInactive", function(e) {
					//console.info(e.annotation, 'became inactive');
                    if (e.annotation.widgets.DBPediaDepictionPlugin) {
					    e.annotation.widgets.DBPediaDepictionPlugin.remove();
					    delete e.annotation.widgets.DBPediaDepictionPlugin;
                    }
				}));
			}
			return _results;
		};
		
		
		DBPediaDepictionPlugin.prototype.renderAnnotation = function(annotation) {
			var depiction, label, page, props, _ref, _ref1;
			//console.info("rendering", annotation);
			props = annotation.entity[annotation.resource.value];
			//console.log(props);
            if (!props) {
                console.error("Entity URI mismatch!", annotation.entity, annotation.resource.value, annotation);
            } else {
                if (props['http://www.w3.org/2000/01/rdf-schema#label']){
                    label = _(props['http://www.w3.org/2000/01/rdf-schema#label']).detect(function(labelObj) {
                        return labelObj.lang === 'en';
                    }).value;
                } else {label = ""}

                depiction = ( _ref = props['http://xmlns.com/foaf/0.1/depiction']) != null ? _ref[0].value : void 0;
                page = ( _ref1 = props['http://xmlns.com/foaf/0.1/page']) != null ? _ref1[0].value : void 0;
                //console.info(label, depiction);
                //return;
                return "<div class=\"depictionWidget\" style=\"background-color: red;\" >"+
                "<div id=\"text_canvas\" style=\"width: inherit; height: inherit; "+
                 "background-image: linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); "+
                 "background-image: -o-linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); "+
                 "background-image: -moz-linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); "+
                 "background-image: -webkit-linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); "+
                 "background-image: -ms-linear-gradient(bottom, rgb(33,26,20) 32%, rgb(69,61,55) 66%, rgb(28,22,21) 15%); "+
                 "background-image: -webkit-gradient(linear,left bottom, left top, color-stop(0.32, rgb(33,26,20)), color-stop(0.66, rgb(69,61,55)), color-stop(0.15, rgb(28,22,21))); "+
                 "color: white; overflow:hidden; font-size: 14px;\">" +
                     "<img src=\"" + depiction + "\" width=\"80%\" style=\"margin-top: 10px;\"/>" +
                    "<table style=\" height: 27px; width: 90%; align:center;\">"+
                        "<tr >"+
                            "<td style=\" height: 27px;font-size: 16px; font-weight: bold; text-align:right;\" >"+
                                label+
                            "</td>"+
                            "<td style=\"text-align:left;\">"+
                                "<img src=\"img/pic.png\" style=\"width: 25px; height: 25px;\" />"+
                            "</td>"+
                        "</tr>"+
                    "</table>"+
                "</div>"+
                "<div id=\"textBorder\" style=\"width: inherit; height: 10px; background-color: yellow; bottom:1px;\"> &nbsp;</div>"+
                "</div>";
            }
 
		}; 

		function showDepictionInModalWindow(annotation) {  // TO BE RESTRUCTURED
			var x;
			
			props = annotation.entity[annotation.resource.value];			
			label = _(props['http://www.w3.org/2000/01/rdf-schema#label']).detect(function(labelObj) {
				return labelObj.lang === 'en';
			}).value;
			depiction = ( _ref = props['http://xmlns.com/foaf/0.1/depiction']) != null ? _ref[0].value :
			void 0;
			  var result = "<img id=\"bigImage\" src=\""+depiction+"\" style=\"height: 350px\"/>"+           
           	"<h1>Related Images</h1>"+
							"<ul class=\"hoverbox\">"+
							"<li>"+
							"<a href=\"#\" class=\"lsiLink\"><img src=\""+depiction+"\" alt=\"description\" /><img src=\""+depiction+"\" alt=\"description\" class=\"preview lsiImg\" /></a>"+
							"</li>";
			try {
				var lodResource = "http://devserver.sti2.org:8080/connectme-services/api/invoke?lod=" + annotation.resource.value + "&mediaType=image&liit=10";
				if (lodResource.indexOf("Flachau") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Flachau.rdf";
				}
				if (lodResource.indexOf("Zorbing") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Zorbing.rdf";
				}
				if (lodResource.indexOf("Canyoning") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Canyoning.rdf";
				}
				if (lodResource.indexOf("Freeskiing") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Freeskiing.rdf";
				}
				if (lodResource.indexOf("Mountainbiking") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Mountainbiking.rdf";
				}
				if (lodResource.indexOf("Rafting") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Rafting.rdf";
				}
				if (lodResource.indexOf("Sauna") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Sauna.rdf";
				}
				if (lodResource.indexOf("Skateboarding") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Skateboarding.rdf";
				}
				if (lodResource.indexOf("Sledding") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Sledding.rdf";
				}
				if (lodResource.indexOf("Snowboarding") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Snowboarding.rdf";
				}
				if (lodResource.indexOf("Snowshoe") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Snowshoe.rdf";
				}
				if (lodResource.indexOf("Trampoline") > 0) {
					lodResource = "http://devserver.sti2.org/connectme/uitests/lime6/LSI/Trampoline.rdf";
				}
				if (window.XMLHttpRequest)
						  {// code for IE7+, Firefox, Chrome, Opera, Safari
						  xmlhttp=new XMLHttpRequest();
						  }
						else
						  {// code for IE6, IE5
						  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
						  }
				xmlhttp.open("GET",lodResource,false);
				xmlhttp.send();
				xmlDoc=xmlhttp.responseXML;
				console.log(xmlDoc);
				x = xmlDoc.getElementsByTagName("Description");          
				for ( i = 0; i < 10; i++) {						
					var image = x[i].getAttribute('rdf:about');		
					result+="<li>"+					        
							"<a href=\"#\" class=\"lsiLink\"><img src=\"" + image + "\" alt=\"description\" /><img src=\"" + image + "\" alt=\"description\" class=\"preview lsiImg\" /></a>"+
							"</li>";
					}
				}catch(exception)
				{
					console.log(exception);
				}		   
			result+="</ul>";
			
			var modalContent = $('#modalContent');
			$(modalContent).append(result);
			$('.lsiLink').click(function(e) {
				//Cancel the link behavior
				e.preventDefault();
				var lsiImageSource = $(e.target).attr("src");
				console.log(lsiImageSource);
				$('#bigImage').attr("src",lsiImageSource);
				
			});
		
		}

		DBPediaDepictionPlugin.prototype.displayModal = function(annotation) {// Modal window script usin jquery

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
			$(modalcontainer).append("<div id=\"modalContent\" style=\"height: 95%; width: 100%; position: relative; margin: 0 auto; text-align: center;\"> &nbsp");
			$(modalcontainer).append("</div>");
			

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
				$(modalcontainer).empty();
			});

			//if mask is clicked
			$(mask).click(function() {
				$(this).hide();
				$(modalcontainer).hide();
				$(modalcontainer).empty();
			});

			$(window).resize(function() {

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
			showDepictionInModalWindow(annotation);
		}


		 return DBPediaDepictionPlugin;

	})(window.LimePlugin);

}).call(this);