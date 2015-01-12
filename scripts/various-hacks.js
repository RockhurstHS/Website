$(document).ready(function () {
	positionEventHighlights();
	$(window).on('resize', positionEventHighlights);
});

function positionEventHighlights() {
	if (window.innerWidth < 631) {
		var sectionC = $('#home #wrapSectionSecondary .sectionC:hidden');
		$(sectionC).appendTo('#home #home-alert-box');
		$(sectionC).show();
	} else {
		var sectionC = $('#home #home-alert-box .sectionC');
		$(sectionC).insertAfter('#home #wrapSectionSecondary .sectionB');
	}	
}
