var mac = "2421522B50";
content_server_endpoint = "http://concerto.rpi.edu/screen/";
var verification_endpoint = content_server_endpoint + "index.php?mac='" + mac + "'";
var connection_retry = 0;

function handleConnectionResponse(verification_request, status_code)
{
	if (status_code != "success")
	{
		connection_retry += 3;
		var error_message = "Unable to connect to content server.";
		$("#status_message").html(error_message);
		setTimeout("openConnection()", connection_retry * 1000);
	}
	else if (verification_request.responseText.length > 1000)
	{
		// Screen is not in Concerto database.
		$("#status_message").html("Screen not found in database.");
	}
	else
	{
		$("#status_message").html("Initializing Concerto...");
		$.signage(11);
	}
}

function openConnection()
{
	$("#status_message").html("Connecting to content server...");
	var verification_request = $.ajax({
		url: verification_endpoint,
		complete: handleConnectionResponse,
	});	
}

$(function() {
	// Detect screen dimensions/size.
	if (true)
	{
		$("body").addClass("size-1280x1024");
	}
	
	// Display splash screen and initialize Concerto.
	$("body").removeClass('uninitialized');
	$("body").addClass('initialization');
	jQuery('<div/>', {
	    id: 'status_message',
	    text: 'Initializing...'
	}).appendTo('#container');
	
	openConnection();	
});