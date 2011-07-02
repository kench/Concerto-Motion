(function( $ ){

  var methods = {
      init : function( options ) {
        $("body").append("<div id='overlay'></div>");
        $("#overlay").hide();
        // Create two padding divs.
        var padding = $('<div></div>');
        padding.addClass("slide slide-normal slide-padding");
        padding.appendTo("#overlay");
        
        padding = $('<div></div>');
        padding.addClass("slide slide-normal slide-padding");
        padding.appendTo("#overlay");
        
        var slide_count = 0;
        for (slide in options["slides"])
        {
        	// Create a slide div for each slide passed into $().init().
        	var newdiv = $('<div></div>');
        	newdiv.attr("id", slide_count);
        	newdiv.addClass("slide slide-normal");
        	var newimg = $('<img></img>');
        	newimg.attr("src", slide);
        	newimg.appendTo(newdiv);
        	if (slide_count == 0)
        	{
        		// First slide is focused.
        		newdiv.removeClass("slide-normal");
        		newdiv.addClass("slide-focused");
        		$('#overlay').data('current_slide', slide_count);
        	}
        	if (slide_count > 3)
        	{
        		// Any slide beyond the fourth is hidden (for now)
        		newdiv.hide();
        	}
        	newdiv.appendTo("#overlay");
        	slide_count++;
        }
        $('#overlay').data('slide_count', slide_count);
      },
      show : function( ) {
        $('#overlay').fadeIn('fast', function() {
                // Animation complete
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