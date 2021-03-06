﻿/*
write a script to

inject Home page links to accordion
remove home page links from accordion

*/

$(document).ready(function () {
	respond();
	$(window).on('resize', respond);
	correctFormCSS();
});

var respond = function() {
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

var correctFormCSS = function () {
	//strip form inline style from custom error message validator
	//should be only if "display: inline;" ?
	$('.BBFormErrorMessage').removeAttr('style');
};

window.onload = function showGoogleCalendarInAgendaMode() {
	if (window.innerWidth < 900) {
		var element = document.getElementById('rhs-google-calendars');
		var source = element.src.split("?showTitle=0");
		var left = source[0];
		var right = source[1];
		element.src = left + '?showTitle=0&mode=AGENDA' + right;
		//console.log(left + '?showTitle=0&mode=AGENDA' + right);
	}
}
