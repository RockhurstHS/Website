// Slide Set Builder Plugin
// Author:	Chris Wolf
// BBNC: 	6.20
// Created:	11/16/2010
// Updated: 2/8/2011

/***** change log *****

11/03/11 - IMPORTANT - tab element is now <div> instead of <a>

***********************/

/* TO DO
1. add vertical scrolling option for auto qty
*/

var isEditView = window.location.href.match('edit=');
var _protocol = window.location.protocol; //http: https: etc...
var _currentHref = window.location.href; //url of current page

//this is a self-calling function
//jQuery is the argument passed into this function
//explanation: http://stackoverflow.com/questions/2937227/what-does-function-jquery-mean
(function ($) {
    //a jquery extension
    $.fn.SlideSet = function (options) {
        //function call and provided options @ https://www.rockhursths.edu/document.doc?id=7
        var defaults = {
            tabs: 'none',   // 'thumb' uses image; 'tab' uses text; 'browse' uses left and right arrows; 'none' does not build tabs
            prev: '&laquo;', // text for 'previous' button
            next: '&raquo;',  // text for 'next' button
            display: 'tabs',
            start: 0,
            tabParams: {
                effect: "fade",
                fadeOutSpeed: "slow",
                rotate: true,
                tabs: 'div'
            },
            slideshowParams: {
                autoplay: false,
                clickable: false,
                interval: 5000
            },
            scrollParams: {
                vertical: false
            },
            autoscroll: {
                autoplay: false
            },
            tabPosition: 'top',
            tabNavPos: 'top',
            tabQty: 'auto'
        };
        //Merge the contents of two or more objects together into the first object.
        var options = $.extend(defaults, options); //in this case, options overwrites defaults

        var tab = options.tabs;
        var prev = options.prev;
        var next = options.next;

        //in example $('div') div is the value of .selector
        var selector = $(this).selector; //in this case, the value is .slide

        var getPane = selector.split(' ');
        var pane = getPane[getPane.length - 1].replace('.', '');
        var tallest = 0;
        var widest = 0;
        var display = options.display;
        var tabParams = options.tabParams;
        var slideshowParams = options.slideshowParams;
        var tabPosition = options.tabPosition;
        var nav = options.tabNavPos;
        var num = options.tabQty;
        var scrollParams = options.scrollParams;
        var autoScroll = options.autoscroll;
        var autoplay = options.autoscroll.autoplay;
        var start = options.start;

        //i think this is for edit mode only, so i'll ignore for now
        $(this).each(function () {

            if (isEditView) {

                var thisPanel = $(this).closest('div[id$=_updContentPanel]').addClass('hasSlideSet');

                $('.' + pane + 'Set').not(thisPanel).each(function () {
                    $(this).after('<div class="alert" style="color: red;">Removed for Editing... refresh page to reload.</div>').remove();
                });

                var admPane = $(this).parents('.DesignPane');
                $(this).removeClass(pane).addClass('ogPane');
                admPane.addClass(pane);
                if ($(admPane).prev(selector).length == 0) {
                    $(admPane).addClass('first');
                }

            } else {

                if ($(this).prev(selector).length == 0) {
                    $(this).addClass('first');
                }
            }
        });

       
        //convert the tables like <table class="slide"> to divs
        $(selector + '.first').each(function (i) {
            //console.log('i = ' + i); //0
            //console.log('pane = ' + pane); //slide
            //console.log('display = ' + display); //slideshow
            i = i + 1;
            $(this).addClass(pane + '-set-' + i);
            //nextAll = Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
            //wrapAll = Wrap an HTML structure around all elements in the set of matched elements.
            //so, this loop finds the one .slide.first selector, then it finds all its siblings and modifies accordingly
            $(this).nextAll(selector).addClass(pane + '-set-' + i);
            $('.' + pane + '-set-' + i).wrapAll('<div class="' + pane + 'Set ' + display + '"/>'); //slideSet slideshow
        });

        // I didn't uncomment these
        // $('.'+pane+'Nav').each(function(){$(this).remove();}); 
        // $('.'+pane+'s').each(function(){$(this).remove();});

        //foreach slideSet class (there is only one)
        $('.' + pane + 'Set').each(function (i, e) { //(this) = slideSet
            var thisSet = e; //[object HTMLDivElement]"
            var thisID = i; //0
            //console.log('e = ' + e); 
            //console.log('i = ' + i); 
            $(this).attr('id', display + thisID); //adds id="slideshow0" as attribute

            if (tabPosition == 'bottom') { //true
                //prepend = insert as first child of matching element
                $(this).prepend('<div class="' + pane + 's" /><div class="' + pane + 'Nav" />');
            } else {
                $(this).prepend('<div class="' + pane + 'Nav" /><div class="' + pane + 's" />');
            }
            //$(.slideNav, #tabs0) where append = add to last child
            $('.' + pane + 'Nav', '#' + display + thisID).append('<span class="navItems" />');
            //$(#tabs0 .slide)
            $('#' + display + thisID + ' .' + pane).each(function (i) {
                i = i + 1;
                var specialClass = $(this).attr('class').replace(pane, '');
                if (isEditView) {
                    var thisPane = $('.ogPane', this);
                } else {
                    var thisPane = $(this);
                }

                if (tab == 'thumb') {
                    var tabImg = $('img:first', thisPane).attr('src');
                    var tabContent = '<img src="' + tabImg + '"/>';
                } else if ((tab == 'tab') && ($('.' + tab, thisPane).length > 0)) {
                    var tabTxt = $('.' + tab, thisPane).html();
                    var tabContent = tabTxt;
                    $('.' + tab, thisPane).remove();
                } else if (tab == 'mini') {
                    var tabContent = '';
                } else if ($('.' + tab, thisPane).length > 0) {
                    var tabContent = $('.' + tab, thisPane).html();
                } else {
                    var tabContent = i;
                }

                if ((isEditView) && (display == 'slider')) {
                    $(this).appendTo('.' + pane + 's', '#' + display + thisID).wrap('<div class="item item-' + i + ' ' + specialClass + '"><div class="gutter"/></div>');
                } else {
                    $('#' + display + thisID + ' .' + pane + 's').append('<div class="item item-' + i + ' ' + specialClass + '"><div class="gutter"/></div>');
                }

                if (($(thisPane).children('tr').length > 0) || ($(thisPane).children('tbody').length > 0)) {
                    $('td', thisPane).not('td td', thisPane).each(function () {
                        var tdClass = $(this).attr('class');
                        var tdHTML = $(this).html();
                        if ((tdHTML != '') || (tdHTML != '&nbsp;')) {
                            $('.item-' + i + ' .gutter', '#' + display + thisID).append('<div class="' + tdClass + '">' + tdHTML + '</div>');
                            if (tab == 'mini') { tabContent = tabContent + '<div class="' + tdClass + '">' + tdHTML + '</div>' }
                        };
                    });
                } else {
                    $(thisPane).children().each(function () {
                        $('.item-' + i + ' .gutter', '#' + display + thisID).append(this);
                        if (tab == 'mini') { tabContent = tabContent + $(this).html() }
                    });
                };

                $(thisPane).remove();

                if (tab == 'mini') {
                    var buildTab = '<div class="' + tab + '">' + tabContent + '</div>';
                } else {
                    var buildTab = '<a class="' + tab + '">' + tabContent + '</a>';
                }

                if (display != 'slider') {
                    if (isEditView && (display == 'tabs')) {
                        $(this).appendTo('#' + display + thisID + ' .navItems').append(tabContent).wrap('<a class="' + tab + '"/>');
                        //  	  $(this).appendTo('.navItems','#'+display+thisID).append(tabContent).wrap('<a href="#" class="'+tab+'"/>');
                    } else if (isEditView && (display != 'tabs')) {
                        $(this).appendTo('#' + display + thisID + ' .navItems').append(tabContent).wrap('<a class="' + tab + '"/>');
                    } else {
                        $('#' + display + thisID + ' .navItems').append(buildTab);
                    }
                };

                $('img[id$=imgPartGlyph]', '#' + display + thisID).css('width', 'auto').css('min-width', 'inherit');

            });
            $('.navItems:eq(' + thisID + ')').append('<div style="clear:both;font-size:0;line-height:0"/>');

            var tallest = 0;
            var widest = 0;

            $('.item', this).each(function () {

                $('img', this).each(function () {
                    if ($(this).outerWidth(true) < $(this).outerHeight(true)) {
                        $(this).parents('.item').addClass('tall');
                    }
                });

                if ($(this).outerHeight(true) > tallest) {
                    tallest = $(this).outerHeight(true);
                    //if (display == 'tabs') { tallest = tallest+24 }
                    $('.' + pane + 's', '#' + display + thisID).height(tallest);
                };

                if ($(this).outerWidth(true) > widest) {
                    widest = $(this).outerWidth(true);
                };

                if (display != 'slider') {
                    $(this).width(widest).css('position', 'absolute').hide();
                } else {
                    $(this).width(widest);
                }
            });

            // get number of items and generate random number
            var length = $(".item", '#' + display + thisID).length;
            var ran = Math.floor(Math.random() * length) + 1;
            if (start == 'random') {
                start = ran;
            }

            if (tab == 'browse') {
                if (!isEditView) { $('.navItems', '#' + display + thisID).hide(); };
            } else if ((tab == 'none') || (display == 'slider')) {
                $('.' + pane + 'Nav', '#' + display + thisID).remove();
            }

            if (display == 'tabs') {
                $('div.' + pane + 'Nav', '#' + display + thisID).tabs('.' + pane + 's > .item', tabParams);
            } else if ((display == 'slideshow') || (display == 'album')) {

                $('.' + pane + 'Nav', '#' + display + thisID).before('<div class="slideshownav"><span class="backward slidenav">' + prev + '</span><span class="forward slidenav">' + next + '</span></div>');
                $('div.' + pane + 'Nav', '#' + display + thisID).tabs('.' + pane + 's > .item', tabParams).slideshow(slideshowParams);
                var tabsAPI = $('div.' + pane + 'Nav', '#' + display + thisID).data('tabs');
                tabsAPI.click(start);

                if (typeof onSlideBuild == 'function') {
                    onSlideBuild(tabsAPI);
                }

                if ($('.item', '#' + display + thisID).length < 2) {
                    $('.slideshownav', '#' + display + thisID).css('visibility', 'hidden').addClass('disabled');
                }

            };

            if ((display == 'slider') || (display == 'album')) {

                if (display == 'album') {
                    var tabSelector = '.' + tab;
                } else if (display == 'slider') {
                    var tabSelector = '.item';
                }

                var selContainer = $('#' + display + thisID + ' ' + tabSelector).parent();
                selContainer.before('<div class="pageSet"/>');
                var pageSet = selContainer.prev('.pageSet');
                pageSet.append('<a class="prev browse left">' + prev + '</a><div class="wrapItems"><div class="items"/></div><a class="next browse right">' + next + '</a><div style="clear:both;font-size:0;line-height:0"/>');

                if (nav == 'top') {
                    pageSet.prepend('<div class="navi"/>');
                } else if (nav == 'bottom') {
                    pageSet.append('<div class="navi"/>');
                }

                var selWidth = parseInt($(tabSelector, '#' + display + thisID).css('width'));
                var selOutWidth = $(tabSelector, '#' + display + thisID).outerWidth(true);
                if (display == 'slider') {
                    var selOutHeight = tallest;
                } else {
                    var selOutHeight = $(tabSelector, '#' + display + thisID).outerHeight(true);
                }
                var selMargin = parseInt((selOutWidth - selWidth));
                var conWidth = $('.wrapItems', '#' + display + thisID).width();
                var selAmt = $(tabSelector, '#' + display + thisID).length;

                if (num == 'auto') {
                    var qty = Math.floor(conWidth / selOutWidth);
                } else {
                    var qty = num;
                }

                while ($(tabSelector, selContainer).length) {
                    var itemsContainer = $('#' + display + thisID + ' .items');
                    var newContainer = $('<div class="set"/>')
                       .appendTo(itemsContainer);

                    $(tabSelector + ':lt(' + qty + ')', selContainer).appendTo(newContainer);
                }

                $('.set', pageSet).each(function (i) {
                    $(this).addClass('#' + i);
                });

                selContainer.remove();

                $('.set', pageSet)
                 .css('width', selOutWidth * qty)
                 .css('height', selOutHeight)
                 .css('padding', selMargin / 2);

                $('.browse', pageSet)
                 .css('height', selOutHeight + selMargin)
                 .css('line-height', selOutHeight + selMargin + 'px');
                //	 .css('margin',selMargin/2+'px 0px');

                if ($('.set', '#' + display + thisID).length < 2) {
                    $('.browse', '#' + display + thisID).css('visibility', 'hidden').addClass('disabled');
                    $('.navi', '#' + display + thisID).hide();
                }

                $('.wrapItems', pageSet)
                 .css('width', selOutWidth * qty + selMargin)
                 .css('height', selOutHeight + selMargin);

                $('.items', pageSet)
                 .css('width', (selOutWidth * selAmt) * 2);

                var scroller = $('.wrapItems', pageSet);
                scroller.scrollable(scrollParams);
                if (autoplay == true) {
                    scroller.autoscroll(autoScroll);
                }
                if ($('.navi').length > 0) {
                    scroller.navigator();
                }

                if (display == 'album') {
                    var tabsAPI = $('div.' + pane + 'Nav', '#' + display + thisID).data('tabs');
                    var scrollAPI = $('.wrapItems', '#' + display + thisID).data('scrollable');

                    tabsAPI.onClick(function () {
                        var slideIdx = this.getIndex();
                        var currScroll = $(tabSelector, '#' + display + thisID).eq(slideIdx).parent();
                        scrollAPI.seekTo(currScroll, 'fast');
                    });


                }

                if (display == 'slider') {
                    var scrollAPI = $('.wrapItems', '#' + display + thisID).data('scrollable');
                    scrollAPI.seekTo(start, 'fast');
                }

            }

            if (typeof end_SlideSet == 'function') {
                end_SlideSet(tabSelector);
            }

        }); // end execution
    }; // end function
})(jQuery); // end plugin