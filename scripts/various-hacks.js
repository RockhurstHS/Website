
$(document).ready(function () {
	respond();
	$(window).on('resize', respond);
});

function respond() {
	//position blue event highlights
	if (window.innerWidth < 631) {
		var sectionC = $('#home #wrapSectionSecondary .sectionC:hidden');
		$(sectionC).appendTo('#home #home-alert-box');
		$(sectionC).show();
	} else {
		var sectionC = $('#home #home-alert-box .sectionC');
		$(sectionC).insertAfter('#home #wrapSectionSecondary .sectionB');
	}
	//blue navigation as accordion
	if (window.innerWidth < 481) {
		$("#wrapNav .menu").accordion({
			collapsible: true,
			active: false,
			heightStyle: "content"
		});
	} else {
		$("#wrapNav .menu").accordion("destroy");
	}
}
