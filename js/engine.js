/**
@license
Copyright (c) 2012-2013 Juhana Leinonen.

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

var currentNode = {};
var myChoices = [];

/** @const */
vorple.media.defaults.imagePath = 'img/';

/** @const */
var isIos = /iPhone|iPad|iPod/i.test( navigator.userAgent );

$( function() {
    // start Vorple
    vorple.core.init();

    // remove the spinner and show "click to begin" 
    $( '#loading' ).fadeOut();
    $( '#ready' ).fadeTo( 'slow', 0.99 );
    
    $( document ).one( 'click', function() {
        $( '#splash' ).fadeOut( 1000, startStory );
    });
    
    // fix IE8 bug with the noscript tag
    $( 'noscript' ).hide();
    
    // fullscreen controls

    $( '#fullscreen-button' )
        .on( 'click', function() {
            var element = document.body;    
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen; // || element.mozRequestFullScreen || element.msRequestFullScreen;

            if( requestMethod && /chrome/.test( navigator.userAgent.toLowerCase() ) ) {
                requestMethod.call( element, Element.ALLOW_KEYBOARD_INPUT );
            }
            else {
                if( isIos ) {
                    notify( 'Make a shortcut of this page and start the story '
                        + 'using it and full screen mode is automatically applied.' );
                }
                else {
                    // It's a shame, but only Chrome allows for keyboard input
                    // in full screen mode.
                    notify( 'Full screen mode is supported only on Chrome.' );
                }
            }
        });
});

function cloud( elements, $container ) {
    $.each( elements, function( index, element ) {
        $( '<div></div>' )
            .html( element.html )
            .addClass( 'cloudItem' )
            .css({ 'top': element.top, 'left': element.left })
            .appendTo( $container )
            .jqFloat({
                width: 30,
                height: 30,
                speed: 10000
            });
    });
}

function nodeChosen( node ) {
    return $.inArray( node, myChoices ) > -1;
} 

function showNode( nodeName, scroll, $container ) {
    var node = nodes[ nodeName ];
    var delay = 5000;
    
    if( typeof $container === 'undefined' ) {
        var $container = $( '#story' );
    }
    else {
        $container = $( $container );
    }
    
    if( typeof scroll === 'undefined' ) {
        scroll = true;
    }
    
    if( typeof currentNode.onExit === 'function' ) {
        currentNode.onExit();
    }

    if( scroll ) {
        $( 'a', $container ).replaceWith( function() {
            var $this = $( this );
            return $( '<span></span>' )
                .addClass( $this.attr( 'class' ) )
                .addClass( 'oldLink' )
                .html( $this.html() );
        });
    }
    
    currentNode = node;
    myChoices.push( nodeName );
    
    if( typeof node === 'undefined' ) {
        throw new Error( 'Programming error: node "' + nodeName + '" does not exist' );
    }
    else if( typeof node.content === 'undefined' ) {
        throw new Error( 'Programming error: node "' + nodeName + '" has no content element' );
    }
    
    var $node = $( '<div></div>' )
        .addClass( 'node' )
        .addClass( 'node-' + nodeName )
        .html( node.content )
        .hide()
        .appendTo( $container )
        .css( 'top', node.top )
        .css( 'left', node.left )
        .fadeTo( delay, 0.99 ); // prevents cleartype glitches
        
    var maxHeight = $( window ).height();
    var maxWidth = $( window ).width();
    
    $( '.node' ).each( function() {
        $this = $( this );
        maxHeight = Math.max( maxHeight, $this.position().top + $( window ).height() + $this.height() );
        maxWidth = Math.max( maxWidth, $this.position().left + $( window ).width() + $this.width() );    
    });
    
    $container.css({ height: maxHeight, width: maxWidth });
        
    if( scroll ) {
        $container.animate({
                'top': Math.min( 0, -$node.position().top + Math.max( 0, $( window ).height() / 2 - $node.height() / 2 ) ),
                'left': Math.min( 0, -$node.position().left + Math.max( 0, $( window ).width() / 2 - $node.width() / 2 ) )
            }, 
            delay / 2, 
            'easeOutCirc',
            ( typeof node.onComplete === 'function' ) ? node.onComplete : $.noop
        );
    }
    else if( typeof node.onComplete === 'function' ) {
        node.onComplete();
    }
        
    if( typeof node.onEnter === 'function' ) {
        node.onEnter();
    }
}
    
function startStory() {
    var $container = $( '<div></div>' )
        .attr( 'id', 'story' )
        .draggable({
            'stop': function() {
                // make sure the draggable story area stays on screen
                var $this = $( this );
                var offset = $this.offset(); 
                var animateProps = {};
                
                if( offset.left > 0 ) {
                    animateProps.left = 0;
                }
                if( offset.top > 0 ) {
                    animateProps.top = 0;
                }
                
                if( offset.left + $this.width() < $( window ).width() ) {
                    animateProps.left = $( window ).width() - $this.width();
                }
                if( offset.top + $this.height() < $( window ).height() ) {
                    animateProps.top = $( window ).height() - $this.height();
                }
                
                $this.animate( animateProps );
            },
            'start': function() {
                $( this ).stop();
            }
        })
        .on( 'click', 'a', function( e ) {
            e.preventDefault();

            var $this = $( this );
            var node = $this.attr( 'href' );
            $this.addClass( 'chosenLink', 3000 );
            
            try {
                showNode( node );
            }
            catch( e ){
                $( '<div></div>' )
                    .addClass( 'programming-error' )
                    .text( e.message )
                    .appendTo( 'body' );
            }
            
            return false;
        })
        .appendTo( 'body' );
        
    $( window ).one( 'mousewheel', function() {
        notify( ( isIos ? 'Touch' : 'Click' ) + ' and drag anywhere to move the viewport.' );
    });
        
    showNode( 'start' );
}
