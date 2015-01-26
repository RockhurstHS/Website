// Slide Set Builder Plugin
// Author:	Chris Wolf
// BBNC: 	6.20
// Created:	11/16/2010
// Updated: 2/8/2011

/***** change log *****

11/03/11 - IMPORTANT - tab element is now <div> instead of <a>
11/10/14 - added many comments specific to Rockhurst High School implementation of this script
12/17/14 - deleted some code blocks we aren't using and those which are setting static dimensions on slideshow elements

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
	console.log('loading slideshow');
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
        var display = options.display; // = slideshow
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

            /** THIS IS WHERE THE SOURCE TABLE IS REMOVED AND REPLACED WITH DIV FORMATTED SLIDESHOW */
            //$(#tabs0 .slide), loops 4 times
            $('#' + display + thisID + ' .' + pane).each(function (i) {//not sure where i gets its initial value of 0
                i = i + 1;
                var specialClass = $(this).attr('class').replace(pane, '');
                //console.log('i = ' + i); //i=0, i=1, i=2, i=3
                //console.log('specialClass = ' + specialClass);
                //specialClass =  first slide-set-1 //first time only
                //specialClass =  slide-set-1 //repeats 3 times

                if (isEditView) {
                    var thisPane = $('.ogPane', this);
                } else {
                    var thisPane = $(this); //$(#tabs0 .slide) , in this case found in the original source as <table class="slide">
                }

                //'browse' = tab = options.tabs
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
                } else { //'browse' lands here
                    var tabContent = i;
                    //console.log('tabContent = ' + tabContent);//tabContent = 1, 2, 3, 4
                }

                if ((isEditView) && (display == 'slider')) {
                    $(this).appendTo('.' + pane + 's', '#' + display + thisID).wrap('<div class="item item-' + i + ' ' + specialClass + '"><div class="gutter"/></div>');
                } else {
                    //$(#tabs0 .slides) <-- this is nearly the same as the selector, but slides has that 's' at the end
                    //.slides class wraps the 4 slide divs
                    //this append inserts 1 slide, so however many iterations are encountered in the loop
                    $('#' + display + thisID + ' .' + pane + 's').append('<div class="item item-' + i + ' ' + specialClass + '"><div class="gutter"/></div>');
                }

                //replace table structure with div structure
                if (($(thisPane).children('tr').length > 0) || ($(thisPane).children('tbody').length > 0)) {
                    //not = Remove elements from the set of matched elements :: select a group, then use not function to further select items to remove from it
                    $('td', thisPane).not('td td', thisPane).each(function () {//td td means td inside td like <td><td> - not sure why cell would be inside cell like this
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

                $(thisPane).remove(); //remove the table markup

                //again, 'browse' = tab = options.tabs
                if (tab == 'mini') { //no
                    var buildTab = '<div class="' + tab + '">' + tabContent + '</div>';
                } else { //yes
                    var buildTab = '<a class="' + tab + '">' + tabContent + '</a>';
                }

                //true in our case, b/c display = 'slideshow'
                if (display != 'slider') { //yes
                    if (isEditView && (display == 'tabs')) { //no
                        $(this).appendTo('#' + display + thisID + ' .navItems').append(tabContent).wrap('<a class="' + tab + '"/>');
                        //  	  $(this).appendTo('.navItems','#'+display+thisID).append(tabContent).wrap('<a href="#" class="'+tab+'"/>');
                    } else if (isEditView && (display != 'tabs')) { //no
                        $(this).appendTo('#' + display + thisID + ' .navItems').append(tabContent).wrap('<a class="' + tab + '"/>');
                    } else { //yes
                        $('#' + display + thisID + ' .navItems').append(buildTab);
                    }
                };
                //jquery selectors api - http://api.jquery.com/category/selectors/ 
                //select img with id attribute imgPartGlyph like <img id="imgPartGlyph" src="" />
                //however, it's not found in page source or page inspection by element therefore comment out
                //$('img[id$=imgPartGlyph]', '#' + display + thisID).css('width', 'auto').css('min-width', 'inherit');
            });
            //:eq = Select the element at index n within the matched set.
            //this is a technique to apply what's called a clearfix to the last of the nav item children (see zero height container problem)
            $('.navItems:eq(' + thisID + ')').append('<div style="clear:both;font-size:0;line-height:0"/>');

            //now attempting to force container dimensions
            

            var tallest = 0;
            var widest = 0;
            $('.item', this).each(function () {

                
                //if taller, not wider (always false in our case)
                $('img', this).each(function () {
                    if ($(this).outerWidth(true) < $(this).outerHeight(true)) {
                        $(this).parents('.item').addClass('tall');
                    }
                });

                if ($(this).outerHeight(true) > tallest) {
                    tallest = $(this).outerHeight(true);
                    if (display == 'tabs') { tallest = tallest+24 }
                    $('.' + pane + 's', '#' + display + thisID).height(tallest);
                }

                if ($(this).outerWidth(true) > widest) {
                    widest = $(this).outerWidth(true);
                }

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

            if (typeof end_SlideSet == 'function') {
                end_SlideSet(tabSelector);
            }

        }); // end execution
    }; // end function
})(jQuery); // end plugin