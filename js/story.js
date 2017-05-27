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

(function() {
    "use strict";

    const messages = {my: '', its: ''};

    let itsChoices = [];
    let muted = false;


    /**
     * Fades out an existing audio track and fades in the next one.
     *
     * @param url The URL to the next audio file to play.
     */
    function fadeToAudio( url ) {
        const audio = document.getElementById( 'bgMusic' );
        const duration = 3000;
        const fadeIn = function() {
            audio.src =  url;
            audio.play();
            $( audio ).animate( { volume: 1 }, duration );
        };

        if( audio ) {
            // jQuery's .animate() is a neat way to fade audio in and out
            $( audio ).animate( { volume: 0 }, duration, fadeIn );
        }
        else {
            fadeIn();
        }
    }


    /**
     * Starts the intro music
     */
    function playIntroMusic() {
        document.getElementById( 'bgMusic' ).play();
    }


    /**
     * Toggles audio on and off
     */
    function toggleMute( e ) {
        const audio = document.getElementById( 'bgMusic' );

        muted = !muted;

        $( '#mute-button' ).attr( 'src', 'img/sound-' + ( muted ? 'off' : 'on' ) + '.png' );
        if( muted ) {
            localStorage.setItem( 'muted', 'true' );
        }
        else {
            localStorage.removeItem( 'muted' );
        }

        audio.muted = muted;

        if( e ) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    engine.nodes = {
        'start': {
            content: '<img src="img/tribal1.png" width="480" height="181" alt="">' +
                "<p>In the Beginning there was nothing.</p>" +
                "<p>From nothing " +
                '<a href="light">light</a> and ' +
                '<a href="darkness">darkness</a> ' +
                "were born." +
                '<img src="img/tribal2.png" width="480" height="203" alt="">',
            left: 5000,
            top: 1000,
            onEnter: function() {
                // change background color
                $( 'body' ).addClass( 'start' );
            }
        },

        'light': {
            content: '<p>I watched the universe define itself around me. '
                + 'Particles, atoms and molecules engaged in an intricate dance '
                + 'formed more and more complex structures.'
                + '<p>For eons I was '
                + '<a href="light-alone">alone</a>.',
            left: 4500,
            top: 1100,
            onEnter: function() {
                // skip if we're coming from the database
                if( engine.nodeChosen( 'darkness' ) ) {
                    return;
                }

                fadeToAudio( 'music/population_decrease.mp3' );

                $( 'body' ).removeClass( 'start' ).addClass( 'light' )
                    .addClass( 'light-now' );   // link colors must be changed immediately
            }
        },

        'light-alone': {
            content: '<div id="lightAloneCloud">',
            left: 4500,
            top: 1100,
            onEnter: function() {
                engine.cloud( [
                    {
                        html: '<a href="restless">restless</a>',
                        top: 5,
                        left: 20
                    },
                    {
                        html: '<a href="lonely">lonely</a>',
                        top: 30,
                        left: 110
                    },
                    {
                        html: '<a href="hopeful">hopeful</a>',
                        top: 0,
                        left: 200
                    },
                    {
                        html: '<a href="depressed">depressed</a>',
                        top: 10,
                        left: 300
                    }
                ], $( '#lightAloneCloud' ) );
            },
            onExit: function() {
                $( '#lightAloneCloud' ).fadeOut( 1000, function() {
                    $( this ).remove();
                } );
            }
        },

        'restless': {
            content: '<p>I was restless.'
                + '<p>My wanderlust took me everywhere in the newborn '
                + 'universe. I saw worlds that were desolate and barren, '
                + 'beautiful and lush, strange and dangerous.'
                + '<p>Then I found a world that was inhabited by '
                + 'curious creatures who were explorers by heart. I knew that '
                + 'I would <a href="wander">wander</a>'
                + ' with them and <a href="guide">guide</a>'
                + ' them in their travels.',
            left: 4500,
            top: 1100
        },

        'wander': {
            content: '<p>I joined the creatures in their exploration of their world. '
                + 'We discovered new lands and gained new horizons. We strived '
                + '<a href="deeper">deeper</a> and '
                + '<a href="farther">farther</a> together.',
            left: 4500,
            top: 1100
        },

        'guide': {
            content: '<p>The creatures explored their world, discovered new lands '
                + 'and gained new horizons. They strived '
                + '<a href="deeper">deeper</a> and '
                + '<a href="farther">farther</a> with my guidance.',
            left: 4500,
            top: 1100
        },

        'deeper': {
            content: function() {
                if( engine.nodeChosen( 'wander' ) ) {
                    return '<p>Their society progressed and wisened. They knew their '
                        + 'world inside out, and they knew themselves. '
                        + 'Their world was a beacon of light in darkness.';
                }
                else {
                    return '<p>Their society progressed. They came to me '
                        + 'for wisdom, and I provided it to them. '
                        + 'We created a world of truth and beauty.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },

        'farther': {
            content: function() {
                if( engine.nodeChosen( 'wander' ) ) {
                    return '<p>Soon their world was mapped from end to end and they turned '
                        + 'their attention beyond. They built machines that would take them '
                        + 'to new worlds where their lust for discovery could be '
                        + 'kindled and satisfied again and again.';
                }
                else {
                    return '<p>Soon their world was mapped from end to end and we turned '
                        + 'our attention beyond. I watched them build machines '
                        + 'that took them to other worlds, unfamiliar only to them.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },

        'lonely': {
            content: '<p>Being lonely was what defined me.'
                + '<p>I sought the company of my kind, even though I '
                + 'knew there was no-one else. I was craving for '
                + '<a href="solitude">solitude</a>'
                + ' but desperate for '
                + '<a href="contact">contact</a>.',
            left: 4500,
            top: 1100
        },

        'solitude': {
            content: '<p>I took comfort in the emptiness of space. Time passed and '
                + "I didn't wake from my stupor until a world was formed in the "
                + 'vicinity. Soon the world was inhabited by creatures that were unlike me, '
                + 'but still: they were something instead of nothing.'
                + '<p>My instinct was to <a href="embrace">embrace</a> '
                + 'or <a href="shun">shun</a> them.',
            left: 4500,
            top: 1100
        },

        'contact': {
            content: '<p>I travelled the universe to find an escape from the loneliness. '
                + 'Ages passed and I found a world that was inhabited by creatures '
                + 'that were much unlike me. Still, they were there for me.'
                + '<p>Now that I had found them, I wanted to both '
                + '<a href="embrace">embrace</a> and '
                + '<a href="shun">shun</a> them.',
            left: 4500,
            top: 1100
        },

        'embrace': {
            content: function() {
                if( engine.nodeChosen( 'solitude' ) ) {
                    return '<p>They were simple beings but I enjoyed their company as '
                        + 'much as I could. I watched them grow, fight, learn, '
                        + 'stumble and rise. I grew to like them.';
                }
                else {
                    return '<p>My travels had not been in vain, even though the '
                        + 'creatures were so small and simple. I took to them and '
                        + 'they accepted me, and their world was to become my home.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },

        'shun': {
            content: function() {
                if( engine.nodeChosen( 'solitude' ) ) {
                    return '<p>I had existed alone through the passage of time for as '
                        + 'long as time had existed. The creatures were of no '
                        + 'comfort to me. They lived but for a blink of an eye, '
                        + 'lives without meaning or understanding. '
                        + 'I left them alone.';
                }
                else {
                    return '<p>I was delighted but kept my distance. They were curious '
                        + 'beings but they did not satisfy my need for a '
                        + 'meaningful contact.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },


        'hopeful': {
            content: '<p>Yet I remained hopeful.'
                + '<p>After an immeasurable span of time I found life. The strange '
                + 'creatures were alone and scared, looking for someone to '
                + '<a href="support">support</a> and '
                + '<a href="comfort">comfort</a> them.',
            left: 4500,
            top: 1100
        },

        'support': {
            content: '<p>The creatures needed something to lean on, and I provided it. '
                + 'Their society bloomed and they produced '
                + '<a href="art">art</a> and '
                + '<a href="knowledge">knowledge</a>.',
            left: 4500,
            top: 1100
        },

        'comfort': {
            content: '<p>I comforted them so that they could overcome their fears. '
                + 'Their society bloomed and they produced '
                + '<a href="art">art</a> and '
                + '<a href="knowledge">knowledge</a>.',
            left: 4500,
            top: 1100
        },

        'art': {
            content: function() {
                if( engine.nodeChosen( 'support' ) ) {
                    return '<p>We created beautiful art. Divine sights and sounds would '
                        + 'fill their hearts with pride and content.';
                }
                else {
                    return '<p>They created art. Beautiful sights and sounds would '
                        + 'help them carry their burdens.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },

        'knowledge': {
            content: function() {
                if( engine.nodeChosen( 'support' ) ) {
                    return '<p>We strived for knowledge. Science and philosophy '
                        + 'flourished and the creatures made giant leaps as a culture.';
                }
                else {
                    return '<p>They strived for knowledge. Science and philosophy '
                        + 'advanced the creatures as a culture.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },

        'depressed': {
            content: '<p>Solitude depressed me.'
                + '<p>I reclused to a barren and dead world. Time passed, but I '
                + 'was not left alone. Life appeared and grew into strange '
                + 'creatures. I was tempted to '
                + '<a href="join">join</a> them or '
                + '<a href="observe">observe</a> them.',
            left: 4500,
            top: 1100
        },

        'join': {
            content: '<p>The creatures were curious beings and I wanted to learn more. '
                + 'When we were inspired we would '
                + '<a href="create">create</a>; when they were tired they would '
                + '<a href="sleep">sleep</a>, and I would watch over them.',
            left: 4500,
            top: 1100
        },

        'observe': {
            content: '<p>I chose to observe the creatures from afar as they stumbled '
                + 'on. When they were inspired they would '
                + '<a href="create">create</a>; when they were tired they would '
                + '<a href="sleep">sleep</a>. I was intrigued.',
            left: 4500,
            top: 1100
        },

        'create': {
            content: function() {
                if( engine.nodeChosen( 'join' ) ) {
                    return '<p>We built great and marvelous things. Towers that reached '
                        + 'the skies and machines that would take us outside our '
                        + 'world. We achieved things beyond our dreams.';
                }
                else {
                    return '<p>They built great things. Time would destroy what they '
                        + 'made, just so that they could build again and stronger.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },

        'sleep': {
            content: function() {
                if( engine.nodeChosen( 'join' ) ) {
                    return '<p>The creatures reached the potential of their civilization. '
                        + 'We stopped, and we were content.';
                }
                else {
                    return '<p>The creatures reached the height of their civilization '
                        + '&mdash; and stopped.';
                }
            },
            left: 4500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'light-presence', false );
            }
        },


        'darkness-alone': {
            content: '<div id="darknessAloneCloud">',
            left: 5500,
            top: 1100,
            onEnter: function() {
                engine.cloud( [
                    {
                        html: '<a href="anxious">anxious</a>',
                        top: 20,
                        left: 0
                    },
                    {
                        html: '<a href="angry">angry</a>',
                        top: 10,
                        left: 100
                    },
                    {
                        html: '<a href="enthusiastic">enthusiastic</a>',
                        top: 0,
                        left: 200
                    },
                    {
                        html: '<a href="forsaken">forsaken</a>',
                        top: 30,
                        left: 350
                    }
                ], $( '#darknessAloneCloud' ) );
            },
            onExit: function() {
                $( '#darknessAloneCloud' ).fadeOut( 1000 );
            }
        },


        'anxious': {
            content: '<p>I was anxious to find a purpose.'
                + '<p>I scoured the universe but found no solace '
                + 'until I stumbled upon a world home to a curious kind of '
                + 'creatures who were ready to accept '
                + '<a href="control">control</a> and '
                + '<a href="influence">influence</a>.',
            left: 5500,
            top: 1100
        },

        'control': {
            content: '<p>They took me as their god. I led them to '
                + '<a href="war">war</a> and their world succumbed '
                + 'into <a href="chaos">chaos</a>.',
            left: 5500,
            top: 1100
        },

        'influence': {
            content: '<p>They were like clay in my grip, fulfilling my every wish while '
                + 'believing they did it in their own free will. I guided them '
                + 'to wage <a href="war">war</a> and spread '
                + '<a href="chaos">chaos</a> around them.',
            left: 5500,
            top: 1100
        },

        'war': {
            content: function() {
                if( engine.nodeChosen( 'control' ) ) {
                    return '<p>I was their commander in chief, waging war with everyone '
                        + 'and no-one in particular. Borders changed, property and '
                        + 'land changed owners and death was ever-present.';
                }
                else {
                    return '<p>It did not take much to usher them into war. They were '
                        + 'proud, greedy, stubborn and, ultimately, dead.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },

        'chaos': {
            content: function() {
                if( engine.nodeChosen( 'control' ) ) {
                    return '<p>There was no progress, no growth; everything they built '
                        + 'would be destroyed. '
                        + 'While they were busy surviving they had no time to '
                        + 'question my authority.';
                }
                else {
                    return '<p>Their society was in constant turmoil, falling down '
                        + 'before it could be rebuilt. I kept them preoccupied '
                        + 'with petty quarrels and self-interest.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },

        'angry': {
            content: '<p>Angry was all I could be.'
                + '<p>My rage required a target. I had to feed it with '
                + '<a href="death">death</a> and '
                + '<a href="misery">misery</a>.',
            left: 5500,
            top: 1100
        },

        'death': {
            content: '<p>I found life. Where there is life, there is death. '
                + 'These miserable creatures lived their lives full of '
                + '<a href="suffering">suffering</a> and were forgotten without '
                + '<a href="mercy">mercy</a> in the vastness of time.',
            left: 5500,
            top: 1100
        },

        'misery': {
            content: '<p>There was nothing for me but misery, and I was not about to '
                + 'bear it alone.'
                + '<p>I found creatures that were in their own way alone but '
                + 'oblivious to their condition. '
                + '<a href="suffering">Suffering</a> was inevitable; ' 
                + '<a href="mercy">mercy</a> was a privilege.',
            left: 5500,
            top: 1100
        },

        'suffering': {
            content: function() {
                if( engine.nodeChosen( 'death' ) ) {
                    return '<p>Their miserable lives could not be cured with anything '
                        + 'short of death, and inescapable death would soon '
                        + 'take them.';
                }
                else {
                    return '<p>Misery leads to suffering, and there is no escape from '
                        + 'the pain that surrounds and defines us.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },

        'mercy': {
            content: function() {
                if( engine.nodeChosen( 'death' ) ) {
                    return '<p>They were hopeless creatures with nothing to look forward '
                        + 'to other than death. Death would be merciful, and it '
                        + 'would come for them.';
                }
                else {
                    return '<p>They were suffering creatures with nothing to look forward '
                        + 'to other than agony. I took pity on them and treated '
                        + 'them kindly.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },


        'enthusiastic': {
            content: '<p>I was enthusiastic about the future.'
                + '<p>After a while life appeared, and I encountered '
                + 'a curious breed of creatures. I would '
                + '<a href="watch">watch</a> them and ' 
                + '<a href="learn">learn</a> from them.',
            left: 5500,
            top: 1100
        },

        'watch': {
            content: '<p>I watched as the creatures went on with their lives, but '
                + 'I did not <a href="understand">understand</a>'
                + ' them, and I did not see '
                + '<a href="meaning">meaning</a> in their ways.',
            left: 5500,
            top: 1100
        },

        'learn': {
            content: '<p>The creatures did, thought and felt things I did not comprehend. '
                + 'I craved <a href="understand">understanding</a>, to find a ' 
                + '<a href="meaning">meaning</a> in their ways.',
            left: 5500,
            top: 1100
        },

        'understand': {
            content: function() {
                if( engine.nodeChosen( 'watch' ) ) {
                    return '<p>I did understand: their small minds were unable to '
                        + 'comprehend the uselessness and futility of their '
                        + 'menial tinkering in a speck of dust meaningless '
                        + 'to the universe. Their ignorance mocked me, enraged me.';
                }
                else {
                    return '<p>Or the surface their existence served no purpose, '
                        + 'and further study would not change that fact. '
                        + 'They went on without knowing, or caring, that '
                        + 'their lives were for naught.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },

        'meaning': {
            content: function() {
                if( engine.nodeChosen( 'watch' ) ) {
                    return '<p>On the surface their existence served no purpose. '
                        + 'They went on without knowing, or caring, that '
                        + 'their lives had no meaning. I could not tolerate '
                        + 'them anymore, and abandoned them.';
                }
                else {
                    return '<p>Their lives were meaningless, but only on the surface. '
                        + 'Millennia later I had merged with them, become one '
                        + 'of them. Like them, I no longer cared for finding '
                        + 'a meaning.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },


        'forsaken': {
            content: '<p>I was forsaken.'
                + '<p>I encountered a breed of miserable creatures. I would become their '
                + '<a href="god">god</a> and they would learn '
                + ' the meaning of <a href="fear">fear</a>.',
            left: 5500,
            top: 1100
        },

        'god': {
            content: '<p>They worshipped me, and I ruled them with iron grip. '
                + 'They too would feel my '
                + '<a href="isolation">isolation</a> and '
                + '<a href="despair">desperation</a>.',
            left: 5500,
            top: 1100
        },

        'fear': {
            content: '<p>There is no escape; there is no hope. There is only '
                + '<a href="isolation">isolation</a> and '
                + '<a href="despair"></a>desperation</a>.',
            left: 5500,
            top: 1100
        },

        'isolation': {
            content: function() {
                if( engine.nodeChosen( 'god' ) ) {
                    return '<p>The creatures would look to the skies and dream. '
                        + 'Their god would look at them and strike them down, '
                        + 'for they shall never leave.';
                }
                else {
                    return '<p>The creatures would look to the skies and fear the '
                        + 'unknown. They would stay in their world and diminish, '
                        + 'as if it were their own will.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },

        'despair': {
            content: function() {
                if( engine.nodeChosen( 'god' ) ) {
                    return '<p>They would have no future for I would not allow it for them.';
                }
                else {
                    return '<p>They would have no future for they would not allow it for themselves.';
                }
            },
            left: 5500,
            top: 1100,
            onComplete: function() {
                engine.showNode( 'darkness-presence', false );
            }
        },

        'light-presence': {
            content: '<p>Then I sensed a <a href="light-feels">presence</a>.',
            onComplete: function() {
                if( !engine.nodeChosen( 'darkness' ) ) {
                    fadeToAudio( 'music/sleepless-night.mp3' );
                }
            },
            left: 4500,
            top: 1120
        },

        'darkness-presence': {
            content: '<p>Then I sensed a <a href="darkness-feels">presence</a>.',
            onComplete: function() {
                if( !engine.nodeChosen( 'light' ) ) {
                    fadeToAudio( 'music/sleepless-night.mp3' );
                }
            },
            left: 5500,
            top: 1120
        },

        'light-feels': {
            content: '<div id="lightFeelsCloud">',
            left: 4500,
            top: 1120,
            onEnter: function() {
                engine.cloud( [
                    {
                        html: '<a href="curiosity">curiosity</a>',
                        top: 10,
                        left: 50
                    },
                    {
                        html: '<a href="nervousness">nervousness</a>',
                        top: 0,
                        left: 200
                    },
                    {
                        html: '<a href="unity">unity</a>',
                        top: 20,
                        left: 350
                    }
                ], $( '#lightFeelsCloud' ) );
            },
            onExit: function() {
                $( '#lightFeelsCloud' ).fadeOut( 1000 );
            }
        },

        'darkness-feels': {
            content: '<div id="darknessFeelsCloud">',
            left: 5500,
            top: 1120,
            onEnter: function() {
                engine.cloud( [
                    {
                        html: '<a href="interest">interest</a>',
                        top: 10,
                        left: 100
                    },
                    {
                        html: '<a href="dread">dread</a>',
                        top: 0,
                        left: 220
                    },
                    {
                        html: '<a href="affinity">affinity</a>',
                        top: 20,
                        left: 300
                    }
                ], $( '#darknessFeelsCloud' ) );
            },
            onExit: function() {
                $( '#darknessFeelsCloud' ).fadeOut( 1000 );
            }
        },

        'curiosity': {
            content: '',
            left: 4500,
            top: 1120,
            onComplete: function() {
                engine.showNode( 'light-contact' );
            }
        },

        'nervousness': {}, // extends curiosity
        'unity': {}, // extends curiosity

        'interest': {
            content: '',
            left: 5500,
            top: 1120,
            onComplete: function() {
                engine.showNode( 'darkness-contact' );
            }
        },

        'dread': {}, // extends interest
        'affinity': {}, // extends interest

        'darkness': {},  // extends light

        'light-contact': {
            content: "<p>There's another being, another like me: it is here, "
                + "and we have met each other."
                + "<p>What shall I say?",
            left: 4500,
            top: 1200,
            onComplete: function() {
                // skip when played from database
                if( engine.nodeChosen( 'light' ) && engine.nodeChosen( 'darkness' ) ) {
                    return;
                }

                const mySide = engine.nodeChosen( 'light' ) ? 'light' : 'darkness';
                const itsSide = engine.nodeChosen( 'light' ) ? 'darkness' : 'light';

                $( '<p><form id="promptForm"><span id="prompt">&gt;<input id="say" type="text" size="30"></span></form>' )
                    .hide()
                    .appendTo( '.node-' + mySide + '-contact' )
                    .fadeTo( 'slow', 0.99 );

                $( '#say' )
                    .focus()
                    .addClass( 'nofocushint' ) // can't add this before initial focus
                    .attr( 'autocomplete', 'off' );
                    /*
                    .on( 'click', function() {    // touch-punch fix
                        $( this ).focus();
                    } );
                    */
                    
                $( '#promptForm' ).on( 'submit', function( e ) {
                    e.preventDefault();

                    messages.my = $.trim( $( '#say' ).val() );

                    // uppercase first letter
                    messages.my = messages.my.charAt( 0 ).toUpperCase()
                        + messages.my.slice( 1 );

                    // add punctuation
                    if( !/[.!?]/.test( messages.my.slice( -1 ) ) ) {
                        messages.my += '.';
                    }

                    $( this ).fadeOut( 1000, function() {
                        $( this ).remove();
                    } );

                    $( '<div></div>' )
                        .html( '<img src="img/ajax-loader.gif" alt="">' )
                        .attr( 'id', 'ajax-wait' )
                        .hide()
                        .appendTo( '.node-contact' )
                        .fadeIn( 50000 );

                    const done = function( data ) {
                        $( '#ajax-wait' ).stop().fadeOut( 1000 );
                        messages.its = data.message;
                        itsChoices = data.nodes.split( ',' );

                        const $other = $( '<div></div>' )
                            .attr( 'id', 'other' )
                            .appendTo( '#story' )
                            .css( {
                                'background-color': 'transparent'
                            } );

                        $.each( itsChoices, function( index, choice ) {
                            const skipNodes = [
                                'start'
                                // I thought I needed more, but in the end
                                // only 'start' has to be skipped.
                                // That's why this is built to accept a list
                                // of nodes to skip.
                            ];

                            if( $.inArray( choice, skipNodes ) > -1 ) {
                                return;
                            }

                            // To prevent the callbacks from messing up the
                            // system, temporarily switch the showNode()
                            // function to nothing
                            const actualShowNode = engine.showNode;
                            engine.showNode = $.noop;
                            actualShowNode( choice, false, $other );
                            engine.showNode = actualShowNode;
                        } );

                        // align the other text correctly
                        const itsStartPosition = $( '.node-' + itsSide ).offset();
                        const myStartPosition = $( '.node-' + mySide ).offset();

                        const addX = ( mySide === 'light' ) ? 1000 : -1000;

                        $other.css( {
                            left: ( myStartPosition.left - itsStartPosition.left ) + $other.position().left + addX,
                            top: ( myStartPosition.top - itsStartPosition.top ) + $other.position().top
                        } );

                        // now we set the paragraph spaces so that the bottom
                        // parts of each sides line up as well.
                        const darknessOffset = $( '.node-darkness-presence' ).offset().top;
                        const lightOffset = $( '.node-light-presence' ).offset().top;
                        const difference = Math.round( Math.abs( darknessOffset - lightOffset ) );
                        const $paragraphs = ( darknessOffset > lightOffset )
                            ? $( '.node-light-presence' ).prevAll().not( '.node-light' )
                            : $( '.node-darkness-presence' ).prevAll().not( '.node-darkness' );
                        const paragraphCount = $paragraphs.length + 1;
                        const addHeight = Math.floor( difference / paragraphCount );
                        const remainder = difference - addHeight * paragraphCount;

                        $.each( $paragraphs, function( index ) {
                            $( this ).animate( {'top': '-=' + ( addHeight * ( index + 1 ) )} );
                        } );

                        ( ( darknessOffset > lightOffset ) ? $( '.node-light' ) : $( '.node-darkness' ) ).animate( {'top': '-=' + ( addHeight * paragraphCount + remainder )} );

                        // line up the tops again
                        if(
                            $( '#other .node-darkness-presence, #other .node-light-presence' ).offset().top
                            < $( '#story > .node-darkness-presence, #story > .node-light-presence' ).offset().top
                        ) {
                            $( '#other' ).animate( {'top': '+=' + difference} );
                        }
                        else {
                            $( '#other' ).animate( {'top': '-=' + difference} );
                        }

                        engine.showNode( 'greeting' );
                    };

                    $.ajax( {
                        url: 'php/fetch.php',
                        dataType: 'json',
                        data: {
                            nodes: engine.getChoices(),
                            message: messages.my,
                            side: mySide
                        },
                        success: done,
                        error: function() {
                            const defaults = {
                                light: [
                                    {
                                        message: 'Hello.',
                                        nodes: 'start,light,light-alone,lonely,contact,embrace,light-presence,light-feels,unity,light-contact'
                                    },
                                    {
                                        message: 'Who are you?',
                                        nodes: 'start,light,light-alone,hopeful,support,knowledge,light-presence,light-feels,unity,light-contact'
                                    },
                                    {
                                        message: 'Hi.',
                                        nodes: 'start,light,light-alone,hopeful,comfort,art,light-presence,light-feels,unity,light-contact'
                                    },
                                    {
                                        message: 'Hello?',
                                        nodes: 'start,light,light-alone,hopeful,support,art,light-presence,light-feels,curiosity,light-contact'
                                    },
                                    {
                                        message: 'I love you.',
                                        nodes: 'start,light,light-alone,restless,guide,farther,light-presence,light-feels,nervousness,light-contact'
                                    },
                                    {
                                        message: 'Welcome.',
                                        nodes: 'start,light,light-alone,hopeful,comfort,art,light-presence,light-feels,unity,light-contact'
                                    },
                                    {
                                        message: 'Greetings.',
                                        nodes: 'start,light,light-alone,hopeful,comfort,art,light-presence,light-feels,unity,light-contact'
                                    },
                                    {
                                        message: 'What are you?',
                                        nodes: 'start,light,light-alone,lonely,contact,embrace,light-presence,light-feels,curiosity,light-contact'
                                    },
                                    {
                                        message: 'Hey.',
                                        nodes: 'start,light,light-alone,depressed,observe,sleep,light-presence,light-feels,nervousness,light-contact'
                                    },
                                    {
                                        message: 'Join me.',
                                        nodes: 'start,light,light-alone,hopeful,support,art,light-presence,light-feels,unity,light-contact'
                                    }
                                ],
                                darkness: [
                                    {
                                        message: 'Hello.',
                                        nodes: 'start,darkness,darkness-alone,enthusiastic,watch,understand,darkness-presence,darkness-feels,interest,darkness-contact'
                                    },
                                    {
                                        message: 'Who are you?',
                                        nodes: 'start,darkness,darkness-alone,angry,death,mercy,darkness-presence,darkness-feels,affinity,darkness-contact'
                                    },
                                    {
                                        message: 'Hi.',
                                        nodes: 'start,darkness,darkness-alone,forsaken,fear,despair,darkness-presence,darkness-feels,dread,darkness-contact'
                                    },
                                    {
                                        message: 'Go away.',
                                        nodes: 'start,darkness,darkness-alone,forsaken,fear,isolation,darkness-presence,darkness-feels,affinity,darkness-contact'
                                    },
                                    {
                                        message: 'I love you.',
                                        nodes: 'start,darkness,darkness-alone,enthusiastic,learn,understand,darkness-presence,darkness-feels,interest,darkness-contact'
                                    },
                                    {
                                        message: 'Hello?',
                                        nodes: 'start,darkness,darkness-alone,angry,misery,mercy,darkness-presence,darkness-feels,interest,darkness-contact'
                                    },
                                    {
                                        message: 'Die.',
                                        nodes: 'start,darkness,darkness-alone,enthusiastic,learn,meaning,darkness-presence,darkness-feels,dread,darkness-contact'
                                    },
                                    {
                                        message: 'Greetings',
                                        nodes: 'start,darkness,darkness-alone,angry,death,mercy,darkness-presence,darkness-feels,affinity,darkness-contact'
                                    },
                                    {
                                        message: 'What are you?',
                                        nodes: 'start,darkness,darkness-alone,enthusiastic,watch,meaning,darkness-presence,darkness-feels,interest,darkness-contact'
                                    },
                                    {
                                        message: 'Leave.',
                                        nodes: 'start,darkness,darkness-alone,angry,misery,mercy,darkness-presence,darkness-feels,interest,darkness-contact'
                                    }
                                ]
                            };

                            done( defaults[ itsSide ][ Math.floor( Math.random() * defaults[ itsSide ].length ) ] );
                        }

                    } );

                    return false;
                } );

                $( window ).one( 'click', function() {
                    if( $( '#say' ).is( ':focus' ) ) {
                        // notify( 'Type your answer and press enter.' );
                        // TODO
                    }
                } );
            }
        },

        'darkness-contact': {}, // extended from light-contact

        'greeting': {
            content: function() {
                let iSay = '"' + messages.my + '"';
                let itSays = '"' + messages.its + '"';

                if( messages.my === '' ) {
                    iSay = 'I say nothing.'
                }

                if( messages.its === '' ) {
                    itSays = 'It says nothing.'
                }

                return '<p id="myMessage">' + iSay
                    + '<p id="itsMessage">' + itSays;
            },
            left: 5000,
            top: 1230,
            onComplete: function() {
                setTimeout( function() {
                    engine.showNode( 'fate' );
                }, 5000 );
            }
        },

        'fate': {
            content: '<p>Our encounter is the most significant event since the '
                + 'Beginning, and it will determine the '
                + '<a href="result">fate</a> of this world.',
            left: 5000,
            top: 1250,
            onComplete: function() {
                engine.showNode( 'first-tribal', false );
            }
        },

        'first-tribal': {
            content: '<img src="img/tribal4.png" width="500" height="466" alt="">',
            left: 5000,
            top: 1250
        },

        'result': {
            content: function() {
                // this must be a function, otherwise the finalWord() will be called
                // when the story is loaded, not when we reach this node
                const word = finalWord();

                // out of curiosity and for tweaking final word probabilities
                // we'll save the final word
                $.get( 'php/fetch.php', {word: word} );

                return '<p>' + word + '<img src="img/tribal3.png" width="620" height="220">';
            },
            left: 5010,
            top: 1250,
            onComplete: function() {
                engine.showNode( 'restart', false );
            }
        },

        'restart': {
            content: '<a href="">Restart?</a>',
            left: 5000,
            top: 1250,
            onEnter: function() {
                $( '.node-restart a' ).css(
                    'background-color', $( 'body' ).css( 'background-color' )
                ).on( 'click', function( e ) {
                    window.location.reload();
                    e.preventDefault();
                    e.stopPropagation();
                } );
            }
        }
    };

    $.extend( engine.nodes.darkness, engine.nodes.light, {
        'left': 5500,
        'onEnter': function() {
            if( engine.nodeChosen( 'light' ) ) {
                return;
            }

            fadeToAudio( 'music/gloom.mp3' );

            $( 'body' ).removeClass( 'start' ).addClass( 'darkness' )
                .addClass( 'darkness-now' );    // link colors must be changed immediately
            $( '.node-darkness a' ).attr( 'href', 'darkness-alone' );
        }
    } );

    $.extend(
        engine.nodes[ 'darkness-contact' ],
        engine.nodes[ 'light-contact' ],
        {'left': 5500}
    );

    $.extend( engine.nodes.nervousness, engine.nodes.curiosity );
    $.extend( engine.nodes.unity, engine.nodes.curiosity );

    $.extend( engine.nodes.dread, engine.nodes.interest );
    $.extend( engine.nodes.affinity, engine.nodes.interest );


    function finalWord() {
        const alternatives = [
            // the first element is the word and the rest are
            // the nodes that must have been chosen for the word to be selected.
            // It's not exactly a class example of good data structure design
            // but it's easier to build this way and it doesn't really matter
            // much because it's just a throwaway.


            // restless - anxious
            [ 'Dominance',
                'farther', 'war' ],
            [ 'Resistance',
                'deeper', 'war' ],
            [ 'Regression',
                'restless', 'chaos' ],

            // restless - angry
            [ 'Diminishment',
                'farther', 'angry' ],
            [ 'Legacy',
                'deeper', 'angry' ],

            // restless - enthusiastic
            [ 'Enlightenment',
                'deeper', 'learn', 'meaning' ],
            [ 'Discovery',
                'farther', 'learn', 'meaning' ],
            [ 'Independence',
                'restless', 'watch', 'meaning' ],
            [ 'Ennui',
                'restless', 'meaning' ],
            [ 'Legacy',
                'deeper', 'watch', 'understand' ],
            [ 'Tragedy',
                'father', 'watch', 'understand' ],
            [ 'Nihilism',
                'deeper', 'understand' ],
            [ 'Emptiness',
                'farther', 'understand' ],

            // restless - forsaken
            [ 'Delusion',
                'farther', 'god', 'isolation' ],
            [ 'Extinction',
                'restless', 'isolation' ],
            [ 'Extinguishment',
                'restless', 'despair' ],

            // lonely - anxious
            [ 'Struggle',
                'embrace', 'anxious' ],
            [ 'Submission',
                'shun', 'chaos' ],
            [ 'Thralldom',
                'shun', 'war' ],

            // lonely - angry
            [ 'Irrelevance',
                'lonely', 'death' ],
            [ 'Harmony',
                'embrace', 'misery', 'mercy' ],
            [ 'Dictatorship',
                'shun', 'misery', 'mercy' ],
            [ 'Agony',
                'lonely', 'misery', 'suffering' ],

            // lonely - enthusiastic
            [ 'Dereliction',
                'solitude', 'shun', 'watch', 'meaning' ],
            [ 'Distancing',
                'contact', 'shun', 'meaning' ],
            [ 'Indifference',
                'shun', 'enthusiastic' ],
            [ 'Zeal',
                'embrace', 'watch', 'understand' ],
            [ 'Warmth',
                'embrace', 'enthusiastic' ],

            // lonely - forsaken
            [ 'Benevolence',
                'embrace', 'isolation' ],
            [ 'Resistance',
                'embrace', 'despair' ],
            [ 'Confinement',
                'shun', 'isolation' ],
            [ 'Apathy',
                'shun', 'despair' ],

            // hopeful - anxious
            [ 'Optimism',
                'art', 'war' ],
            [ 'Anarchy',
                'art', 'chaos' ],
            [ 'Destruction',
                'knowledge', 'anxious' ],

            // hopeful - angry
            [ 'Melancholy',
                'art', 'death' ],
            [ 'Sacrifice',
                'art', 'suffering' ],
            [ 'Bitterness',
                'knowledge', 'death' ],
            [ 'Progress',
                'knowledge', 'misery' ],
            [ 'Divinity',
                'art', 'angry' ],

            // hopeful - enthusiastic
            [ 'Naivete',
                'hopeful', 'learn', 'understand' ],
            [ 'Martyrdom',
                'art', 'watch', 'understand' ],
            [ 'Beauty',
                'art', 'meaning' ],
            [ 'Misbelief',
                'knowledge', 'watch', 'understand' ],
            [ 'Vanity',
                'knowledge', 'meaning' ],

            // hopeful - forsaken
            [ 'Futility',
                'art', 'forsaken' ],
            [ 'Complacency',
                'knowledge', 'isolation' ],
            [ 'Pestilence',
                'knowledge', 'despair' ],

            // depressed - anxious
            [ 'Ruination',
                'create', 'war' ],
            [ 'Downfall',
                'create', 'chaos' ],
            [ 'Aggression',
                'sleep', 'war' ],
            [ 'Lethargy',
                'sleep', 'chaos' ],

            // depressed - angry
            [ 'Misanthropy',
                'create', 'suffering' ],
            [ 'Spirituality',
                'create', 'mercy' ],
            [ 'Passivity',
                'sleep', 'suffering' ],
            [ 'Detachment',
                'sleep', 'mercy' ],

            // depressed - enthusiastic
            [ 'Loss',
                'create', 'watch', 'understand' ],
            [ 'Pretentiousness',
                'create', 'learn', 'understand' ],
            [ 'Grandioseness',
                'create', 'meaning' ],
            [ 'Conformance',
                'sleep', 'understand' ],
            [ 'Negligence',
                'sleep', 'meaning' ],

            // depressed - forsaken
            [ 'Hesitation',
                'create', 'isolation' ],
            [ 'Resignation',
                'create', 'despair' ],
            [ 'Withdrawal',
                'sleep', 'isolation' ],
            [ 'Disinterest',
                'sleep', 'despair' ]
        ];

        for( let block = 0; block < alternatives.length; ++block ) {
            let ok = true;

            for( let node = 1; node < alternatives[ block ].length; ++node ) {
                if( !engine.nodeChosen( alternatives[ block ][ node ] ) ) {
                    ok = false;
                    break;
                }
            }

            if( ok ) {
                return alternatives[ block ][ 0 ];
            }
        }

        return 'Indetermination'; // if this is ever returned there's a bug
    }


    /**
     * INITIALIZATION
     */

    $(function() {
        // There are 4 tribal images named from tribal1.png to tribal4.png.
        // This preloads them all.
        for( let i = 1; i <= 4; ++i ) {
            new Image().src = 'img/tribal' + i + '.png';
        }

        // Preload the sound off icon
        new Image().src = 'img/sound-off.png';

        playIntroMusic();

        // if the game started out muted, mute the audio immediately
        if( localStorage.getItem( 'muted' ) ) {
            toggleMute();
        }

        // have the mute button toggle music and change its graphics when it does so
        $( '#mute-button' ).on( 'click', toggleMute );
    });
})();