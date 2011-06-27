var Concerto = {
	settings: null,
	retry_count: 0,
	handleResponse: function(verification_request, status_code)
	{
		if (status_code != "success")
		{
			retry_count++;
			var error_message = "Unable to connect to content server.";
			$("#status_message").html(error_message);
			setTimeout("openConnection()", retry_count * 1000);
		}
		else if (verification_request.responseText.length > 1000)
		{
			// Screen is not in Concerto database.
			$("#status_message").html("Screen not found in database.");
		}
		else
		{
			$("#status_message").html("Initializing Concerto...");
			$.signage(11, Concerto.settings);
		}
	},
	initialize: function(configuration)
	{
		this.settings = configuration;
		function openConnection()
		{
			$("#status_message").html("Connecting to content server...");
			var verification_request = $.ajax({
				url: configuration.verification_endpoint,
				async: false
			});
		}

		function isResolution(width, height)
		{
			// Resolution tolerance of 5%
			var tolerance = .005;
			var height_t = height * tolerance;
			var width_t = width * tolerance;
			var lb_height = height - height_t;
			var ub_height = height + height_t;
			var lb_width = width - width_t;
			var ub_width = width + width_t;
			if ((screen.width < ub_width) && (screen.width > lb_width) && (screen.height > lb_height) && (screen.height < ub_height))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		
		// Detect screen dimensions/size.

		if (isResolution(1920, 1200))
		{
			$("body").addClass("size-1920x1200");
		}
		else if (isResolution(1680, 1050))
		{
			$("body").addClass("size-1680x1050");
		}
		else if (isResolution(1400, 1050))
		{
			$("body").addClass("size-1400x1050");
		}
		else
		{
			// Assume baseline resolution of 1280x1024.
			$("body").addClass("size-1280x1024");
		}

		// Display splash screen and initialize Concerto.
		$("body").removeClass('uninitialized');
		$("body").addClass('initialization');
		jQuery('<div/>', {
		    id: 'status_message',
		    text: 'Initializing...'
		}).appendTo('#container');

		$("#status_message").html("Connecting to content server...");
		var verification_request = $.ajax({
			url: configuration.verification_endpoint,
			complete: this.handleResponse,
			async: false
		});
	}
};

$(function() {
	var configuration = {
		mac: "2421522B50",
		server_endpoint: "http://concerto.rpi.edu/screen/",
		verification_endpoint: "http://concerto.rpi.edu/screen/" + "index.php?mac='" + "2421522B50" + "'"
	};
	Concerto.initialize(configuration);
});