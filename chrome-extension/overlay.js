(function( $ ){

  var methods = {
      init : function( options ) {
        $("body").append("<div id='overlay'></div>");
        $("#overlay").hide();
        // Create two padding divs.
        var padding = $('<div></div>');
        padding.addClass("slide slide-normal slide-filler slide-visible");
        padding.appendTo("#overlay");
        
        padding = $('<div></div>');
        padding.addClass("slide slide-normal slide-filler slide-visible");
        padding.appendTo("#overlay");
        
        var slide_count = 0;
        var slides = options["slides"];
        for (var i = 0; i < slides.length; i++)
        {
        	// Create a slide div for each slide passed into $().init().
        	var newdiv = $('<div></div>');
        	newdiv.attr("id", slide_count);
        	newdiv.addClass("slide slide-normal slide-visible");
        	var newimg = $('<img></img>');
        	newimg.attr("src", slides[i]);
        	newimg.addClass('slide-img');
        	newimg.appendTo(newdiv);
        	if (slide_count == 0)
        	{
        		// First slide is focused.
        		newdiv.removeClass("slide-normal");
        		newdiv.addClass("slide-focused");
        		$('#overlay').data('current_slide', slide_count);
        	}
        	if (slide_count > 2)
        	{
        		// Any slide beyond the third is hidden (for now)
        		newdiv.css("display", "none");
        	}
        	newdiv.appendTo("#overlay");
        	slide_count++;
        }
        $('#overlay').data('slide_count', slide_count);
      },
      show : function( ) {
        $('#overlay').fadeIn('fast', function() {
                // Animation complete.  Register event handlers.
                DepthJS = {
                      onRegister: function(x, y, z, data) {
                        $().motion("show");
                      },
                      onUnregister: function() {
                        $().motion("hide");
                      },
                      onSwipeLeft: function() {
                        $().motion("next");
                      },
                      onSwipeRight: function() {
                        $().motion("previous");
                      }
                };
                $("body").keypress(function(e)
                {
                	if (e.charCode == 110)
                	{
                		// Proceed to next item.
                		$().motion("next");
                	}
                	else if (e.charCode == 112)
                	{
                		// Proceed to previous item.
                		$().motion("previous");
                	}
                	else if (e.charCode == 101)
                	{
                		// Hide overlay.
                		$().motion("hide");
                	}
                });
        });
      },
      hide : function( ) {
        $('#overlay').fadeOut('fast', function() {
                // Animation complete
        });
      },
      next: function( ) {
        var current_slide = $('#overlay').data('current_slide');
        var slide_count = $('#overlay').data('slide_count');
        if (current_slide != slide_count)
        {
        	// Fade leftmost slide.
        	$('#overlay .slide-visible:first').fadeOut("fast", function()
        	{
        		$('#overlay #' + (current_slide + 3).toString()).fadeIn("fast").removeClass("slide-hidden").addClass("slide-visible");
        	}).removeClass("slide-visible").addClass("slide-hidden");
        	// Move cursor.
        	$('#overlay #' + current_slide.toString()).removeClass("slide-focused");
        	$('#overlay #' + current_slide.toString()).addClass("slide-normal");
        	current_slide++;
        	$('#overlay #' + current_slide.toString()).removeClass("slide-normal");
        	$('#overlay #' + current_slide.toString()).addClass("slide-focused");
        }
      },
      previous: function( ) {
        var current_slide = $('#overlay').data('current_slide');
        if (current_slide != 0)
        {
        	$('#overlay #' + current_slide.toString()).removeClass("slide-focused");
        	$('#overlay #' + current_slide.toString()).addClass("slide-normal");
        	current_slide--;
        	$('#overlay #' + current_slide.toString()).removeClass("slide-normal");
        	$('#overlay #' + current_slide.toString()).addClass("slide-focused");
        }
      },
      update : function( content ) {
      }
    };
  $.fn.motion = function(method) {
  
    if (methods[method])
    {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.motion' );
    } 

  };
})( jQuery );

// Initialize keyboard + Kinect events and callbacks.
$(function()
{
	$("body").keypress(function(e)
	{
		if (e.charCode == 111)
		{
			// Show overlay.
			$().motion("show");
		}
	});
});