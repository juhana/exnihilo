/**
@license
Copyright (c) 2012-2017 Juhana Leinonen.

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

(function() {
    "use strict";

    const engine = {
        nodes: []
    };
    const myChoices = [];
    let currentNode = {};

    $( function() {
        // remove the spinner and show "click to begin"
        $( '#loading' ).fadeOut();
        $( '#ready' ).fadeTo( 600, 0.99 );

        $( document ).one( 'click', function() {
            $( '#splash' ).fadeOut( 1000, startStory );
        } );
    } );


    /**
     * Make a group of elements "float" around by changing their position
     * a few pixels at a time
     */
    engine.cloud = function( elements, $container ) {
        const move = function( $element ) {
            // break the cycle if the element is not in the DOM
            if( !$.contains( document, $element[0] ) ) {
                return;
            }

            const deltaX = Math.floor( Math.random() * 3 ) - 1;
            const deltaY = Math.floor( Math.random() * 3 ) - 1;

            $element.css({ 
                left: '+=' + deltaX,
                top: '+=' + deltaY
            });

            // move again after a random amount of time
            setTimeout( function() {
                move( $element );
            }, Math.ceil( Math.random() * 500 ) );
        };

        $.each( elements, function( index, element ) {
            const $div = $( '<div></div>' )
                .html( element.html )
                .addClass( 'cloudItem' )
                .css( {'top': element.top, 'left': element.left} )
                .appendTo( $container );

            move( $div );
        } );
    };


    /**
     * Determine if a node (player choice) has been chosen
     */
    engine.nodeChosen = function( node ) {
        return $.inArray( node, myChoices ) > -1;
    };

    engine.getChoices = function() {
        return myChoices;
    };

    engine.showNode = function( nodeName, scroll, $container ) {
        const node = engine.nodes[ nodeName ];
        const delay = 5000;

        if( typeof $container === 'undefined' ) {
            $container = $( '#story' );
        }
        else {
            $container = $( $container );
        }

        const scale = $container[0].getBoundingClientRect().width / $container[0].offsetWidth;

        if( typeof scroll === 'undefined' ) {
            scroll = true;
        }

        if( typeof currentNode.onExit === 'function' ) {
            currentNode.onExit();
        }

        if( scroll ) {
            $( 'a', $container ).replaceWith( function() {
                const $this = $( this );

                return $( '<span></span>' )
                    .addClass( $this.attr( 'class' ) )
                    .addClass( 'oldLink' )
                    .html( $this.html() );
            } );
        }

        currentNode = node;
        myChoices.push( nodeName );

        if( typeof node === 'undefined' ) {
            throw new Error( 'Programming error: node "' + nodeName + '" does not exist' );
        }
        else if( typeof node.content === 'undefined' ) {
            throw new Error( 'Programming error: node "' + nodeName + '" has no content element' );
        }

        const $node = $( '<div></div>' )
            .addClass( 'node' )
            .addClass( 'node-' + nodeName )
            .html( node.content )
            .hide()
            .appendTo( $container )
            .css( 'top', node.top )
            .css( 'left', node.left )
            .fadeTo( delay, 0.99 ); // prevents cleartype glitches

        let maxHeight = $( window ).height();
        let maxWidth = $( window ).width();

        $( '.node' ).each( function() {
            const $this = $( this );
            maxHeight = Math.max( maxHeight, $this.position().top + $( window ).height() + $this.height() * scale );
            maxWidth = Math.max( maxWidth, $this.position().left + $( window ).width() + $this.width() * scale );
        } );

        // $container.css({ height: maxHeight, width: maxWidth });

        const centerTop = -( $node.offset().top - ( $( window ).height() - $node.height() * scale ) / 2 );
        const centerLeft = -( $node.offset().left - ( $( window ).width() - $node.width() * scale ) / 2 );

        if( scroll ) {
            $container.animate( {
                    'top': '+=' + centerTop + 'px',
                    'left': '+=' + centerLeft + 'px'
                },
                delay / 2,
                ( typeof node.onComplete === 'function' ) ? node.onComplete : $.noop
            );
        }
        else if( typeof node.onComplete === 'function' ) {
            node.onComplete();
        }

        if( typeof node.onEnter === 'function' ) {
            node.onEnter();
        }
    };

    function startStory() {
        $( '<div></div>' )
            .attr( 'id', 'story' )
            .on( 'click', 'a', function( e ) {
                e.preventDefault();

                var $this = $( this );
                var node = $this.attr( 'href' );
                $this.addClass( 'chosenLink', 3000 );

                try {
                    engine.showNode( node );
                }
                catch(e) {
                    $( '<div></div>' )
                        .addClass( 'programming-error' )
                        .text( e.message )
                        .appendTo( 'body' );
                }

                return false;
            } )
            .appendTo( 'body' );

        /** adapted from https://stackoverflow.com/a/7557433 */
        function isElementInViewport (el) {
            if( el instanceof jQuery ) {
                el = el[0];
            }

            const rect = el.getBoundingClientRect();

            return (
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left < (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        interact( '#story' ).ignoreFrom( 'a' ).draggable({
            inertia: true,
            onstart: function( event ) {
                const target = event.target;

                target.setAttribute( 'data-startx', target.style.left );
                target.setAttribute( 'data-starty', target.style.top );
            },
            onmove: function( event ) {
                const target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat( target.getAttribute( 'data-x' ) ) || 0) + event.dx,
                    y = (parseFloat( target.getAttribute( 'data-y' ) ) || 0) + event.dy;

                // translate the element
                $( '#story' ).css({
                    left: '+=' + event.dx + 'px',
                    top: '+=' + event.dy + 'px'
                });

                // update the posiion attributes
                target.setAttribute( 'data-x', x );
                target.setAttribute( 'data-y', y );
            },
            onend: function( event ) {
                // make sure the draggable story area stays on screen
                const target = event.target;

                let childrenInView = false;

                $( '#story' ).children().each( function() {
                    const $this = $( this );

                    if( $this.is( ':visible' ) && isElementInViewport( $this ) ) {
                        childrenInView = true;
                        return false;
                    }
                });

                if( !childrenInView ) {
                    $( '#story' ).animate({
                        left: target.getAttribute( 'data-startx' ),
                        top: target.getAttribute( 'data-starty' )
                    }, 300 );

                }
            }
        });

        const scale = function() {
            const windowWidth = $( window ).width();
            const windowHeight = $( window ).height();
            const scale = Math.min( 1, windowWidth / 500 );
            const $story = $( '#story' );
            const $lastChild = $story.children().last();

            $story.css( {
                transform: 'scale(' + scale + ')'
            });

            if( $lastChild.length ) {
                const newLeft = -( $lastChild.offset().left - ( windowWidth - $lastChild.width() * scale ) / 2 );
                const newTop = -( $lastChild.offset().top - ( windowHeight - $lastChild.height() * scale ) / 2 );

                $story.css( {
                    left: '+=' + newLeft + 'px',
                    top: '+=' + newTop + 'px'
                } );
            }
        };

        $( window ).on( 'resize orientationchange', scale );
        scale();

        engine.showNode( 'start' );
    }
    
    window.engine = engine;
})();