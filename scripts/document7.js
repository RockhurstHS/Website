/*
====================================================================
 Blackbaud ISD Custom Javascript
--------------------------------------------------------------------
 Client: 		Rockhurst HS
 Author(s): 	Kay Foreman
 Product(s):	BBNC Grow OCC
 Created: 		May 15 2013
 Updated:		Jan 26 2015
-------------------------------------------------------------------- 
 Changelog: 
====================================================================
 mm/dd/yyyy		...
 01/26/2015		JW: for local development, added lines 153-155, commented out lines 156-160, 170, 173
 03/21/2015		JW: turn off repositionRequiredFIeldMarkers
====================================================================
*/

BBI = {

	Debug: {
		version: 1.0,
		updated: 'dd/mm/yyyy 12:00 PM',
		isEditView: !!window.location.href.match('pagedesign')
		
	},
	
	Client: {
		pageLoad: function(){
			this.checkEditView();
			this.showPartTitle();
			//this.repositionRequiredFieldMarkers('.BBFieldCaption');
			this.fixPositioning();
			this.quickSearch();
			this.homeSlideshow();
			this.buildSocialButtons();
		},
		
		getUrlVars: function() {
			// Gets variables and values from URL
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
				vars[key] = unescape(value.replace(/\+/g, " "));
			});
			return vars;
		},
		
		checkEditView: function() {
			// Re-checks isEditView against template design view:
			if (!this.isEditView) {
				this.isEditView = window.location.href.match('templatedesigner');
			}
		},
		
		fixPositioning: function() {
			// Fix positioning:
			$('div[id *= "_panelPopup"]').appendTo('body');
			$('div[id *= "_designPaneCloak"]').css({"top": "0px","left": "0px"});
			$('.DesignPane').css("position", "relative");
		},
		
		showPartTitle: function(){
			// Inform the user that Javascript code is present,
			// Must include "javascript" in the part title:
			if (BBI.Debug.isEditView) {
				if (!$('.jsPartLabel').length) {
					$('td[id$="tdPartName"]:Contains("javascript")').each(function() {
						var uniqueID = $(this).attr("id");
						uniqueID = uniqueID.slice(0,uniqueID.length-11);
						var partName = $(this).html();
						var contentPane = $('div[id*="'+uniqueID+'_pnlPart"]');
						contentPane.append('<div class="jsPartLabel" style="padding:0 4px 0 24px; background:#000; color:#fff; font-size:11px;">'+partName+'</div>');
					});
				}
			}
		},
		
		repositionRequiredFieldMarkers: function(selector) {
		
			// This function alters the default location of the required field markers (*),
			// Moving them from the end of the form fields, to the front of the captions
		
			if (!BBI.Debug.isEditView){
				$(document).ready(function() {
					if ($('.BBFormTable').length) {
						$('.BBFormRequiredFieldMarker').each(function() {
							if ($(this).closest('tr').find(selector).length) {
								$(this).hide();
								$(this).closest('tr').find(selector).prepend('<span class="BBFormRequiredFieldMarker">*</span>');
							}
						});
					}
				});
			}
		},
		
		quickSearch: function() {
			$('input[id$=txtQuickSearch]').attr('value', 'Search');
			$('input[id$=txtQuickSearch]').click(
				function() {
					$(this).attr('value', '');
				}
			);
		},

		homeSlideshow: function() {
			
			$('.slide').SlideSet({
				 display: 'slideshow',
				 tabs: 'browse',
				 prev: '&laquo;',
				 next: '&raquo;',
				 tabParams: {
				  effect: "fade",
				  fadeOutSpeed: "slow",
				  rotate: true
				 },
				 slideshowParams: {
				  autoplay: true
				 },
				 tabPosition: 'bottom',
				 tabNavPos: 'none',
				 tabQty: 'auto'
			});			
			
		},
		buildSocialButtons: function() {
			
			if(!window.location.href.match('edit=')){
				
				$(".socialButtonTable").each(function(){
				
					var buttonType = $(this).find(".socialButtonType").text();
					var buttonClass = "";
					var buttonText = $(this).find(".socialButtonText").text();
					var buttonContent = $(this).find(".socialButtonContent").text();
					var url = "";
					
					if(buttonType.match("Facebook")){ buttonClass="fbButtonLink";url = "http://www.facebook.com/share.php?u=";}
					else if(buttonType.match("Twitter")) { buttonClass="twitterButtonLink"; url = "http://twitter.com/home?status="; buttonContent = escape(buttonContent);}
					else{ console.log("invalid button type: "+buttonType)}		
		
					$(this).after("<a class='buttonLink "+buttonClass+"' target='_blank' href='"+url+buttonContent+"'>"+buttonText+"</a>");
					$(this).hide();
				});
			}
			
		}
		
	}
};

$(document).ready(function () {
	BBI.Client.pageLoad();
});
/*
Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(function () {
	BBI.Client.pageLoad();
});
*/






/*--- Plugins --- */

// jquery.tools.min.js
//JW://document.write('<script src="document.doc?id=6"></script>');

// SlideSet Plugin
//JW://document.write('<script src="document.doc?id=5"></script>');


// Case insensitive version of ':contains()'
jQuery.expr[':'].Contains = function(a, i, m) { 
return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
};


/*==============================================
 Find & Replace All Text
 - Steve Brush
------------------------------------------------
 Replaces ALL occurences of a keyword or phrase
 Usage: $(selector).replaceAll(find,replace);
----------------------------------------------*/
(function($) {
	$.fn.replaceAll = function(find,replace) {
		return this.each(function() {
			while($(this).find(':contains("'+find+'")').length) {
				$(this).find(':contains("'+find+'")').each(function(i) {
					$(this).html($(this).html().toString().replace(find,replace));
				});
			}
		});
	}
})(jQuery);


/*==============================================
 Console Reset
 - Paul Irish
------------------------------------------------
 Lets you use console.log without breaking in IE
 Usage: log('inside coolFunc', this, arguments);
 paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
----------------------------------------------*/
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


/*==============================================
 Default Textbox
 - Chris Wolf
------------------------------------------------
 Inserts default text into a textbox as a tool-
 tip. Good for search fields.
----------------------------------------------*/
(function(a){a.fn.TextboxDefault=function(b){var d={searchtext:"Enter Search Here",offcolor:"#ffffff",oncolor:"#88A0D6"};var b=a.extend(d,b);var f=b.searchtext;var c=b.offcolor;var e=b.oncolor;return this.each(function(){a(this).val(f).css("color",c).click(function(){if(a(this).val()==f){a(this).val("").css("color",e)}}).blur(function(){if(a(this).val()==""){a(this).val(f).css("color",c)}})})}})(jQuery);

/* Cookie plugin
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
jQuery.cookie=function(d,e,b){if(arguments.length>1&&(e===null||typeof e!=="object")){b=jQuery.extend({},b);if(e===null){b.expires=-1}if(typeof b.expires==="number"){var g=b.expires,c=b.expires=new Date();c.setDate(c.getDate()+g)}return(document.cookie=[encodeURIComponent(d),"=",b.raw?String(e):encodeURIComponent(String(e)),b.expires?"; expires="+b.expires.toUTCString():"",b.path?"; path="+b.path:"",b.domain?"; domain="+b.domain:"",b.secure?"; secure":""].join(""))}b=e||{};var a,f=b.raw?function(h){return h}:decodeURIComponent;return(a=new RegExp("(?:^|; )"+encodeURIComponent(d)+"=([^;]*)").exec(document.cookie))?f(a[1]):null};

/* Sessvars v.1.01
 * JavaScript based session object
 * (c) 2008 Thomas Frank
 */
sessvars=function(){var x={};x.$={prefs:{memLimit:2000,autoFlush:true,crossDomain:false,includeProtos:false,includeFunctions:false},parent:x,clearMem:function(){for(var i in this.parent){if(i!="$"){this.parent[i]=undefined}}this.flush()},usedMem:function(){x={};return Math.round(this.flush(x)/1024)},usedMemPercent:function(){return Math.round(this.usedMem()/this.prefs.memLimit)},flush:function(x){var y,o={},j=this.$$;x=x||top;for(var i in this.parent){o[i]=this.parent[i]}o.$=this.prefs;j.includeProtos=this.prefs.includeProtos;j.includeFunctions=this.prefs.includeFunctions;y=this.$$.make(o);if(x!=top){return y.length}if(y.length/1024>this.prefs.memLimit){return false}x.name=y;return true},getDomain:function(){var l=location.href;l=l.split("///").join("//");l=l.substring(l.indexOf("://")+3).split("/")[0];while(l.split(".").length>2){l=l.substring(l.indexOf(".")+1)}return l},debug:function(t){var t=t||this,a=arguments.callee;if(!document.body){setTimeout(function(){a(t)},200);return}t.flush();var d=document.getElementById("sessvarsDebugDiv");if(!d){d=document.createElement("div");document.body.insertBefore(d,document.body.firstChild)}d.id="sessvarsDebugDiv";d.innerHTML='<div style="line-height:20px;padding:5px;font-size:11px;font-family:Verdana,Arial,Helvetica;z-index:10000;background:#FFFFCC;border: 1px solid #333;margin-bottom:12px"><b style="font-family:Trebuchet MS;font-size:20px">sessvars.js - debug info:</b><br/><br/>Memory usage: '+t.usedMem()+" Kb ("+t.usedMemPercent()+'%)&nbsp;&nbsp;&nbsp;<span style="cursor:pointer"><b>[Clear memory]</b></span><br/>'+top.name.split("\n").join("<br/>")+"</div>";d.getElementsByTagName("span")[0].onclick=function(){t.clearMem();location.reload()}},init:function(){var o={},t=this;try{o=this.$$.toObject(top.name)}catch(e){o={}}this.prefs=o.$||t.prefs;if(this.prefs.crossDomain||this.prefs.currentDomain==this.getDomain()){for(var i in o){this.parent[i]=o[i]}}else{this.prefs.currentDomain=this.getDomain()}this.parent.$=t;t.flush();var f=function(){if(t.prefs.autoFlush){t.flush()}};if(window.addEventListener){addEventListener("unload",f,false)}else{if(window.attachEvent){window.attachEvent("onunload",f)}else{this.prefs.autoFlush=false}}}};x.$.$$={compactOutput:false,includeProtos:false,includeFunctions:false,detectCirculars:true,restoreCirculars:true,make:function(arg,restore){this.restore=restore;this.mem=[];this.pathMem=[];return this.toJsonStringArray(arg).join("")},toObject:function(x){if(!this.cleaner){try{this.cleaner=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}catch(a){this.cleaner=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}}if(!this.cleaner.test(x)){return{}}eval("this.myObj="+x);if(!this.restoreCirculars||!alert){return this.myObj}if(this.includeFunctions){var x=this.myObj;for(var i in x){if(typeof x[i]=="string"&&!x[i].indexOf("JSONincludedFunc:")){x[i]=x[i].substring(17);eval("x[i]="+x[i])}}}this.restoreCode=[];this.make(this.myObj,true);var r=this.restoreCode.join(";")+";";eval('r=r.replace(/\\W([0-9]{1,})(\\W)/g,"[$1]$2").replace(/\\.\\;/g,";")');eval(r);return this.myObj},toJsonStringArray:function(arg,out){if(!out){this.path=[]}out=out||[];var u;switch(typeof arg){case"object":this.lastObj=arg;if(this.detectCirculars){var m=this.mem;var n=this.pathMem;for(var i=0;i<m.length;i++){if(arg===m[i]){out.push('"JSONcircRef:'+n[i]+'"');return out}}m.push(arg);n.push(this.path.join("."))}if(arg){if(arg.constructor==Array){out.push("[");for(var i=0;i<arg.length;++i){this.path.push(i);if(i>0){out.push(",\n")}this.toJsonStringArray(arg[i],out);this.path.pop()}out.push("]");return out}else{if(typeof arg.toString!="undefined"){out.push("{");var first=true;for(var i in arg){if(!this.includeProtos&&arg[i]===arg.constructor.prototype[i]){continue}this.path.push(i);var curr=out.length;if(!first){out.push(this.compactOutput?",":",\n")}this.toJsonStringArray(i,out);out.push(":");this.toJsonStringArray(arg[i],out);if(out[out.length-1]==u){out.splice(curr,out.length-curr)}else{first=false}this.path.pop()}out.push("}");return out}}return out}out.push("null");return out;case"unknown":case"undefined":case"function":if(!this.includeFunctions){out.push(u);return out}arg="JSONincludedFunc:"+arg;out.push('"');var a=["\n","\\n","\r","\\r",'"','\\"'];arg+="";for(var i=0;i<6;i+=2){arg=arg.split(a[i]).join(a[i+1])}out.push(arg);out.push('"');return out;case"string":if(this.restore&&arg.indexOf("JSONcircRef:")==0){this.restoreCode.push("this.myObj."+this.path.join(".")+"="+arg.split("JSONcircRef:").join("this.myObj."))}out.push('"');var a=["\n","\\n","\r","\\r",'"','\\"'];arg+="";for(var i=0;i<6;i+=2){arg=arg.split(a[i]).join(a[i+1])}out.push(arg);out.push('"');return out;default:out.push(String(arg));return out}}};x.$.init();return x}();