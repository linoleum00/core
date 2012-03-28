
/**
 * PrimeFaces Extensions BlockPanel Widget.
 *
 * @author Pavol Slany
 */
PrimeFacesExt.widget.BlockPanel = PrimeFaces.widget.BaseWidget.extend({

	/**
	 * Initializes the widget.
	 * 
	 * @param {object} cfg The widget configuration.
	 */
	init : function(cfg) {
		this.id = cfg.id;
		this.blocked = cfg.blocked;
		
		////////////////////////
		// Mask 
		this.getMask = function() {
			var mask = new PrimeFacesExt.widget.BlockPanel.MaskAround(this.id);
			return (this.getMask = function() {return mask})();
		}

		////////////////////////
		// FOCUS LOST bindings ...
		this.getFocusArea = function() {
			var area = new PrimeFacesExt.widget.BlockPanel.FocusArea(this.id);
			return (this.getFocusArea = function() {return area})();
		}
		
		this.block = function() {
			this.blocked = true;
	        // Show MASK
			this.getMask().show();
			
			// focus area ...
			this.getFocusArea().activate();
		}
		this.unblock = function() {
			this.blocked = false;
	        // Hide MASK
			this.getMask().hide();
			
			// focus area ...
			this.getFocusArea().deactivate()
		}
		
		if(this.blocked) {
			this.block();
		}
		else {
			this.unblock();
		}
		
        PrimeFacesExt.removeWidgetScript(this.id);
    },
    
	block : function () {
		this.block();
    },
	    
	unblock : function () {
		this.unblock();
    }
});

/**
 * @author Pavol Slany
 */
PrimeFacesExt.widget.BlockPanel.FocusArea = function(elementId) {
	var elPanel = $(PrimeFaces.escapeClientId(elementId)); 
	
	// If panel has not focusable elements => create hidden focusable element
	// Add hidden focusable HTML element
	if (!$(PrimeFaces.escapeClientId(elementId)+' :focusable').length)
		elPanel.append($('<a href="" style="width:0px;height:0px;position:absolute;"></a>'));
	
	var focusFirstElement = function() {
		$($(PrimeFaces.escapeClientId(elementId)+' :focusable')[0]).focus();
		isIn = 0;
	}
	
	var activate = false;
	
	var isIn = 0;
	var focusOutTimeout = null;
	var focusOutTimeoutHandler = function() {
		if (isIn < 0 && activate) {
			focusFirstElement();
		}
	};
	var focusin = function() {
		isIn=isIn+1;
		
		if (focusOutTimeout != null) clearTimeout(focusOutTimeout);
		focusOutTimeout = setTimeout(focusOutTimeoutHandler, 20);
	};
	var focusout = function() {
		isIn=isIn-1;
		
		if (focusOutTimeout != null) clearTimeout(focusOutTimeout);
		focusOutTimeout = setTimeout(focusOutTimeoutHandler, 20);
	};
	
	
	return {
		activate: function() {
			if (!activate) {
				elPanel.bind('focusin',focusin);
				elPanel.bind('focusout',focusout);

				focusFirstElement();
			}
			activate = true;
		}
		,
		deactivate: function() {
			if (activate) {
				elPanel.unbind('focusin',focusin);
				elPanel.unbind('focusout',focusout);
			}
			activate = false;
		}
	}
};

/**
 * @author Pavol Slany
 */
PrimeFacesExt.widget.BlockPanel.MaskAround = function(elementId) {
	var maskId = elementId+'_maskAround';
	var destinationOpacity = function() {
		var el = $('<div class="ui-widget-overlay"></div>');
		$('body').append(el);
		var opacity = el.css('opacity');
		el.remove();
		return opacity;
	}();

	var ElementPieceOfMask = function(maskKey) {
		var idEl = maskId + maskKey;
		var elementMustBeVisible = $(PrimeFaces.escapeClientId(idEl)).is(':visible');
		var getMaskElement = function() {
			var maskElement = $(PrimeFaces.escapeClientId(idEl));
			
			if (!maskElement || !maskElement.length) {
				maskElement = $('<div id="'+idEl+'" />');
				maskElement.css({
					position: 'fixed',
					top: 0,
					left: 0,
					display: 'none',
					zIndex : 999999,
					overflow: 'hidden'
				});
				maskElement.append($('<div class="ui-widget-overlay" style="position:absolute;"></div>').css('opacity', 1));
				$('body').append(maskElement);
			}
			return maskElement;
		}
		
		var updateVisibility = function() {
			if (elementMustBeVisible) {
				var maskElement = getMaskElement();
				if ($(PrimeFaces.escapeClientId(idEl)).is(':visible') == false)
					maskElement.fadeTo("fast", destinationOpacity, updateVisibility);
				return;
			}
			// ...
			if ($(PrimeFaces.escapeClientId(idEl)).is(':visible') == true) {
				var maskElement = getMaskElement();
				maskElement.fadeOut('fast', updateVisibility);
			}
		}

		return {
			updatePosition: function(x0,y0,x1,y1) {
				$('<div class="ui-widget-overlay"></div>')
				var el = getMaskElement();
				el.css({
					left: x0,
					top: y0,
					width: (x1-x0),
					height: (y1-y0)
				});
				
				var maxSize = getMaxSize();
				$(el.children()[0]).css({
					left: (0-x0),
					top: (0-y0),
					height: maxSize.height,
					width: maxSize.width
				});
			},
			show: function() {
				elementMustBeVisible = true;
				updateVisibility();
			},
			hide: function() {
				elementMustBeVisible = false;
				updateVisibility();
			}
		};
	};
	
	
	var top 	= new ElementPieceOfMask('_top');
	var left 	= new ElementPieceOfMask('_left');
	var bottom 	= new ElementPieceOfMask('_bottom');
	var right 	= new ElementPieceOfMask('_right');
	
	var getMaxSize = function() {
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		var docWidth = $(document).width();
		var docHeight = $(document).height();
		
		var maxWidth = winWidth > docWidth ? winWidth : docWidth;
		var maxHeight = winHeight > docHeight ? winHeight : docHeight;
		
		return {
			width: maxWidth, 
			height: maxHeight
		};
	}
	
	var updateMaskPositions = function() {
		var maxSize = getMaxSize();
		
		var maxWidth = maxSize.width;
		var maxHeight = maxSize.height;
		
		// Set BORDERS
		var el = $(PrimeFaces.escapeClientId(elementId));
		var x0 = el.offset().left;
		var y0 = el.offset().top;
		var x1 = x0 + el.outerWidth();
		var y1 = y0 + el.outerHeight();
		
		if (x0<0) x0 = 0;
		if (y0<0) y0 = 0;
		if (x1<x0) x1=x0;
		if (y1<y0) y1=y0;
		
		var bodyOffset = {top: $(window).scrollTop(), left: $(window).scrollLeft()};

		top.updatePosition(
				0-bodyOffset.left,
				0-bodyOffset.top,
				maxWidth-bodyOffset.left,
				y0-bodyOffset.top);
		bottom.updatePosition(
				0-bodyOffset.left,
				y1-bodyOffset.top,
				maxWidth-bodyOffset.left,
				maxHeight-bodyOffset.top);
		left.updatePosition(
				0-bodyOffset.left,
				y0-bodyOffset.top,
				x0-bodyOffset.left,
				y1-bodyOffset.top);
		right.updatePosition(
				x1-bodyOffset.left,
				y0-bodyOffset.top,
				maxWidth-bodyOffset.left,
				y1-bodyOffset.top);
	}
	
	var resizeTimer = null;
	$(window).bind('resize', function() {
		if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(updateMaskPositions, 100);
	});

	
	var updatePositions = function() {
		updateMaskPositions();
		if (mustBeShowed) 
			setTimeout(updatePositions, 150);
	};
	var mustBeShowed = false;
	var showAreas = function() {
		mustBeShowed = true;
		
		updatePositions();
		
		top.show();
		bottom.show();
		left.show();
		right.show();
	}
	var hideAreas = function() {
		mustBeShowed = false;
		
		top.hide();
		bottom.hide();
		left.hide();
		right.hide();
	}
	
	
	return {
		show: function() {
			showAreas();
		},
		hide: function() {
			hideAreas();
		}
	};
};