
$(document).ready(function () {
	respond();
	$(window).on('resize', respond);
});

function respond() {
	//position blue event highlights (sectionC) above weekly news and daily events (sectionA and sectionB) in the DOM
	if (window.innerWidth < 631) {
		var sectionC = $('#home #wrapSectionSecondary .sectionC:hidden');
		$(sectionC).appendTo('#home #home-alert-box');
		$(sectionC).show();
	} else { //replace to original position
		var sectionC = $('#home #home-alert-box .sectionC');
		$(sectionC).insertAfter('#home #wrapSectionSecondary .sectionB');
	}
	//blue navigation as accordion
	if (window.innerWidth < 481) {
		$("#wrapNav .menu").accordion({
			collapsible: true,
			active: false,
			autoHeight: false
		});
	} else { //undo accordion
		$("#wrapNav .menu").accordion("destroy");
		$('#wrapNav .menu li a').removeClass('ui-state-focus');
	}
}
