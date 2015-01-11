$(document).ready(function () {
	positionEventHighlights();
});

function positionEventHighlights() {
	var sectionC = $('#home #wrapSectionSecondary .sectionC:hidden');
	$(sectionC).appendTo('#home-alert-box');
	$(sectionC).show();
	/** css doesn't refresh all the way */
	$('#home-alert-box .sectionC .gutter h4').css('color', 'white');
}