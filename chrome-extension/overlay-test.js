// Test harness for overlay.
function testOverlay()
{
	$("#overlay").remove();
	var slides = new Array();
	for (var i = 0; i < 10; i++)
	{
		slides[i] = "http://lorempixum.com/640/480/city/" + i.toString();
	}
	$().motion("init", { "slides": slides });
}