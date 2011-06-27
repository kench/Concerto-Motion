(function( $ ){

  var methods = {
      init : function( options ) {
        $("body").append("<div id='overlay'></div>");
        //$("#overlay").hide();
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
        
      },
      previous: function( ) {
        
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