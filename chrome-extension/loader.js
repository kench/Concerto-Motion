function configHook(e)
{
	console.log("Key pressed.");
	if (e.which == 67)
	{
		window.location = "settings.html";
	}
	else if (e.which == 65)
	{
		/* Change localStorage["serverEndpoint"] to the URL of your Concerto installation.
		 *
		 */
		localStorage["mac"] = "2421522B50";
		localStorage["serverEndpoint"] = "http://concerto.rpi.edu/screen/";
		localStorage["haveConfiguration"] = true;
		$("#status_message").html("Automatic configuration complete.  Reloading.");
		setTimeout("Concerto.initialize();", 2000);
	}
}

function configMessageLoop()
{
	if (!sessionStorage.message_id)
	{
		$("#status_message").html("Not configured.");
		sessionStorage.message_id = 1;
	}
	else
	{
		if (sessionStorage.message_id == 0)
		{
			$("#status_message").html("Not configured.");
			sessionStorage.message_id = 1;
		}
		else if (sessionStorage.message_id == 1)
		{
			$("#status_message").html("Please connect a keyboard.");
			sessionStorage.message_id = 2;
		}
		else if (sessionStorage.message_id == 2)
		{
			$("#status_message").html("Press C to start the configuration wizard.");
			sessionStorage.message_id = 3;
		}
		else if (sessionStorage.message_id == 3)
		{
			$("#status_message").html("Press A to attempt automatic configuration.");
			sessionStorage.message_id = 0;
		}
		else
		{
			sessionStorage.message_id = 0;
		}
	}
}

function fetchConfiguration()
{
	if (!localStorage["haveConfiguration"])
	{
		// Use for testing.
		var configuration = {
			mac: "2421522B50",
			server_endpoint: "http://concerto.rpi.edu/screen/",
			verification_endpoint: "http://concerto.rpi.edu/screen/" + "index.php?mac='" + "2421522B50" + "'"
		};
	}
	else
	{
		var configuration = {
			mac: localStorage.getItem("mac"),
			server_endpoint: localStorage.getItem("serverEndpoint"),
			verification_endpoint: localStorage.getItem("serverEndpoint") + "index.php?mac='" + localStorage.getItem("mac") + "'"
		};
	}
	return configuration;
}

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
	initialize: function()
	{
		var configuration = fetchConfiguration();
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
		
		// Configuration section here.
		// Chrome supports localStorage, so we'll fetch configuration settings from there.
		if (!localStorage["haveConfiguration"])
		{
			// Redirect to configuration page.
			console.log("Not configured. Waiting to launch configuration wizard.");
			setInterval("configMessageLoop();", 5000);
			$(document).keyup(configHook);
			return;
		}

		$("#status_message").html("Connecting to content server...");
		var verification_request = $.ajax({
			url: configuration.verification_endpoint,
			complete: this.handleResponse,
			async: false
		});
	}
};

$(function() {
	console.log("Initializing Concerto.");
	Concerto.initialize();
});