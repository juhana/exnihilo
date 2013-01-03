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

var messages = { my: '', its: '' };
var itsChoices = [];

vorple.media.preloadImage([ 
    'tribal1.png', 
    'tribal2.png', 
    'tribal3.png', 
    'tribal4.png' 
]);

// SoundManager will be included in Vorple in the next release, 
// but for now we'll include it manually.

var baseVolume = 70;
soundManager.setup({ url: 'js/vendor/swf/' });

/** @private */
function fadeToAudio( url ) {
    var audio = soundManager.getSoundById( 'bgMusic' );
    var volume = audio.volume;
    
    audio.setVolume( Math.max( 0, volume - 3 ) );
    volume -= 3;
    
    if( volume > 0 ) {
        setTimeout( function() {
            fadeToAudio( url );
        }, 50 );         
    }
    else {
        soundManager.destroySound( 'bgMusic' );
        soundManager.createSound({
            id: 'bgMusic',
            url: url,
            autoLoad: true,
            autoPlay: true,
            volume: baseVolume,
            onfinish: function() {
                replayMusic();
            }
        });         
    }
}


/** @private */
function replayMusic() {
    soundManager.getSoundById( 'bgMusic' ).play({
        onfinish: function() {
            replayMusic();
        }
    }); 
}


// Start the intro song.
// On iOS the sound must start on user action (touch), 
// so we'll have the music start on touching the intro screen.
if( isIos ) {
    $( function() {
        $( document ).one( 'click', function() {
            replayMusic(); 
        });
        $( '#ready' ).text( 'Touch to begin' );
    });
}
else {
    soundManager.onready( function() {
        soundManager.createSound({
            id: 'bgMusic',
            url: 'music/oppression.mp3',
            autoLoad: true,
            autoPlay: true,
            volume: baseVolume,
            onfinish: function() {
                replayMusic();
            }
        });
    });
}

$( function() {    
    var muted = false;
    

    // have the mute button toggle music and change its graphics when it does so
    $( '#mute-button' ).on( 'click', function( e ) {
        muted = !muted;
        
        if( muted ) {
            baseVolume = 0;
            $( '#mute-button' ).attr( 'src', 'img/sound-off.png' );
        }
        else {
            baseVolume = 70;
            $( '#mute-button' ).attr( 'src', 'img/sound-on.png' );       
        }
        
        var player = soundManager.getSoundById( 'bgMusic' );
        
        if( player ) {
            soundManager.getSoundById( 'bgMusic' ).setVolume( baseVolume );
        }
        
        vorple.cookie.write( 'mute', muted ? '1' : '0' );
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    // change the mute button's graphics if the story starts with 
    // sounds muted and preload the opposite image
    if( vorple.cookie.read( 'mute' ) === '1' ) {
        $( '#mute-button' ).trigger( 'click' );
    }
    else {
        vorple.media.preloadImage( 'sound-off.png' );
    }

});

    
var nodes = {
    'start': {
        content: vorple.media.image( 'tribal1.png', { height: "181", width: "480" } )
            + vorple.html.p( 'In the beginning there was nothing.' )
            + vorple.html.p( 'From nothing ' 
                + vorple.html.link( 'light', 'light' ) + ' and ' 
                + vorple.html.link( 'darkness', 'darkness' ) 
                + ' were born.' 
            )
            + vorple.media.image( 'tribal2.png', { height: "203", width: "480" } ),
        left: 5000,
        top: 1000
    },
    
    'light': {
        content: vorple.html.p( 'I watched the universe define itself around me. '
                + 'Particles, atoms and molecules engaged in an intricate dance '
                + 'formed more and more complex structures.' )
            + vorple.html.p(
                'For eons I was ' 
                + vorple.html.link( 'light-alone', 'alone'  ) + '.'
            ),
        left: 4500,
        top: 1100,
        onEnter: function() {
            // skip if we're coming from the database
            if( nodeChosen( 'darkness' ) ) {
                return;
            }
            
            fadeToAudio( 'music/population_decrease.mp3' );
            
            $( 'body' ).switchClass( 'start', 'light', 3000 );

            // link colors must be changed immediately
            $( 'body' ).addClass( 'light-now' );            
        },
        onExit: function() {
        }
    },
    
    'light-alone': {
        content: vorple.html.tag( 'div', '', { id: 'lightAloneCloud' } ),
        left: 4500,
        top: 1100,
        onEnter: function() {
            cloud([
               {
                   html: vorple.html.link( 'restless', 'restless' ),
                   top: 20,
                   left: 0
               },
               {
                   html: vorple.html.link( 'lonely', 'lonely' ),
                   top: 30,
                   left: 100
               },
               {
                   html: vorple.html.link( 'hopeful', 'hopeful' ),
                   top: 0,
                   left: 200
               },               
               {
                   html: vorple.html.link( 'depressed', 'depressed' ),
                   top: 10,
                   left: 300
               }
            ], $( '#lightAloneCloud' ) );
        },
        onExit: function() {
            $( '#lightAloneCloud' ).fadeOut( 1000 );
        }
    },
    
    'restless': {
        content: vorple.html.p( 'I was restless.' )
            + vorple.html.p( 
                'My wanderlust took me everywhere in the newborn '
                + 'universe. I saw worlds that were desolate and barren, '
                + 'beautiful and lush, strange and dangerous.' )
                + vorple.html.p( 'Then I found a world that was inhabited by '
                + 'curious creatures who were explorers by heart. I knew that '
                + 'I would '
                + vorple.html.link( 'wander', 'wander' )
                + ' with them and '
                + vorple.html.link( 'guide', 'guide' )
                + ' them in their travels.' 
            ),
        left: 4500,
        top: 1100
    },
    
    'wander': {
        content: vorple.html.p(
            'I joined the creatures in their exploration of their world. '
            + 'We discovered new lands and gained new horizons. We strived '
            + vorple.html.link( 'deeper', 'deeper' )
            + ' and '
            + vorple.html.link( 'farther', 'farther' )
            + ' together.'
        ),
        left: 4500,
        top: 1100
    },
        
    'guide': {
        content: vorple.html.p( 
            'The creatures explored their world, discovered new lands '
            + 'and gained new horizons. They strived '
            + vorple.html.link( 'deeper', 'deeper' )
            + ' and '
            + vorple.html.link( 'farther', 'farther' )
            + ' with my guidance.'
        ),
        left: 4500,
        top: 1100
    },
    
    'deeper': {
        content: function() {
            if( nodeChosen( 'wander' ) ) {
                return vorple.html.p(
                    'Their society progressed and wisened. They knew their '
                    + 'world inside out, and they knew themselves. '
                    + 'Their world was a beacon of light in darkness.'
                );
            }
            else {
                return vorple.html.p(
                    'Their society progressed. They came to me '
                    + 'for wisdom, and I provided it to them. '
                    + 'We created a world of truth and beauty.'
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    'farther': {
        content: function() {
            if( nodeChosen( 'wander' ) ) {
                return vorple.html.p(
                    'Soon their world was mapped from end to end and they turned '
                    + 'their attention beyond. They built machines taking them '
                    + 'to other worlds where their lust for discovery could be '
                    + 'kindled and satiated again and again.'
                );
            }
            else {
                return vorple.html.p(
                    'Soon the world was mapped from end to end and we turned '
                    + 'our attention beyond. I watched them build machines '
                    + 'that took them to other worlds, unfamiliar only to them.'
                )
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    'lonely': {
        content: vorple.html.p( 'Being lonely was what defined me.' )
            + vorple.html.p( 'I sought the company of my kind, even though I '
                + 'knew there was no-one else. I was craving for '
                + vorple.html.link( 'solitude', 'solitude' )
                + ' and desperate for '
                + vorple.html.link( 'contact', 'contact' )
                + '.' 
            ),
        left: 4500,
        top: 1100
    },
    
    'solitude': {
        content: vorple.html.p( 
            'I took comfort in the emptiness of space. Time passed and '
            + "I didn't wake from my stupor until a world was formed in the "
            + 'vicinity. Soon the world was inhabited by creatures unlike me, '
            + 'but still: they were something instead of nothing.'
        )
            + vorple.html.p(
                'My instinct was to ' + vorple.html.link( 'embrace', 'embrace' ) 
                + ' or ' + vorple.html.link( 'shun', 'shun' ) + ' them.'
            ),
        left: 4500,
        top: 1100
    },
    
    'contact': {
        content: vorple.html.p(
            'I travelled the universe to find an escape from the loneliness. '
            + 'Ages passed and I found a world that was inhabited by creatures '
            + 'much unlike me. Still, they were there for me.'
        )
            + vorple.html.p(
                'Now that I had found them, I wanted to both ' 
                + vorple.html.link( 'embrace', 'embrace' ) 
                + ' and ' + vorple.html.link( 'shun', 'shun' ) + ' them.'
            ),
        left: 4500,
        top: 1100
    },
    
    'embrace': {
        content: function() {
            if( nodeChosen( 'solitude' ) ) {
                return vorple.html.p(
                    'They were simple beings but I enjoyed their company as '
                    + 'much as I could. I watched them grow, fight, learn, '
                    + 'stumble and rise. I grew to like them.'
                );
            }
            else {
                return vorple.html.p(
                    'My travels had not been in vain, even though the '
                    + 'creatures were so small and simple. I took to them and '
                    + 'they accepted me, and their world was to become my home.'
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    'shun': {
        content: function() {
            if( nodeChosen( 'solitude' ) ) {
                return vorple.html.p(
                    'I had existed alone through the passage of time for as '
                    + 'long as time had existed. The creatures were of no '
                    + 'comfort to me. They lived for but a blink of an eye, '
                    + 'lives without meaning or understanding. '
                    + 'I left them alone. '
                );
            }
            else {
                return vorple.html.p(
                    'I was delighted but kept my distance. They were curious '
                    + 'beings but they did not satisfy my need for a '
                    + 'meaningful contact.'  
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    
    'hopeful': {
        content: vorple.html.p(
                'Yet I remained hopeful.'
            )
            + vorple.html.p(
                'After an unmeasurable span of time I found life. The strange '
                + 'creatures were alone and scared, looking for someone to '
                + vorple.html.link( 'support', 'support' ) + ' and '
                + vorple.html.link( 'comfort', 'comfort' ) + ' them.'
            ),
        left: 4500,
        top: 1100
    },
    
    'support': {
        content: vorple.html.p(
                'The creatures needed something to lean on, and I provided it. '
                + 'Their society bloomed and they produced '
                + vorple.html.link( 'art', 'art' ) + ' and '
                + vorple.html.link( 'knowledge', 'knowledge' ) + '.'
            ),
        left: 4500,
        top: 1100
    },
    
    'comfort': {
        content: vorple.html.p(
                'I comforted them so that they could overcome their fears. '
                + 'Their society bloomed and they produced '
                + vorple.html.link( 'art', 'art' ) + ' and '
                + vorple.html.link( 'knowledge', 'knowledge' ) + '.'
            ),
        left: 4500,
        top: 1100
    },
    
    'art': {
        content: function() {
            if( nodeChosen( 'support' ) ) {
                return vorple.html.p(
                    'We created beautiful art. Divine sights and sounds would '
                    + 'fill their hearts with pride and content.'
                );
            }
            else {
                return vorple.html.p(
                    'They created art. Beautiful sights and sounds would '
                    + 'help them carry their burdens.'
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    'knowledge': {
        content: function() {
            if( nodeChosen( 'support' ) ) {
                return vorple.html.p(
                    'We strived for knowledge. Science and philosophy '
                    + 'flourished and the creatures made giant leaps as a culture.' 
                );
            }
            else {
                return vorple.html.p(
                    'They strived for knowledge. Science and philosophy '
                    + 'advanced the creatures as a culture.'
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    'depressed': {
        content: vorple.html.p(
                'Solitude depressed me.'
            )
            + vorple.html.p(
                'I reclused to a barren and dead world. Time passed, but I '
                + 'was not left alone. Life appeared and grew into strange '
                + 'creatures. I was tempted to '
                + vorple.html.link( 'join', 'join' ) + ' them or '
                + vorple.html.link( 'observe', 'observe' ) + ' them.'
            ),
        left: 4500,
        top: 1100
    },
    
    'join': {
        content: vorple.html.p(
                'The creatures were curious beings and I wanted to learn more. '
                + 'When we were inspired we would '
                + vorple.html.link( 'create', 'create' )
                + '; when they were tired they would '
                + vorple.html.link( 'sleep', 'sleep' ) + ', and I would watch '
                + 'over them.'
            ),
        left: 4500,
        top: 1100 
    },
    
    'observe': {
        content: vorple.html.p(
                'I chose to observe the creatures from afar as they stumbled '
                + 'on. When they were inspired they would ' 
                + vorple.html.link( 'create', 'create' )
                + '; when they were tired they would '
                + vorple.html.link( 'sleep', 'sleep' ) + '. '
                + 'I was intrigued.'
            ),
        left: 4500,
        top: 1100
    },
    
    'create': {
        content: function() {
            if( nodeChosen( 'join' ) ) {
                return vorple.html.p(
                    'We built great and marvelous things. Towers that reached '
                    + 'the skies and machines that would take us outside our '
                    + 'world. We achieved things beyond our dreams.' 
                );
            }
            else {
                return vorple.html.p(
                    'They built great things. Time would destroy what they '
                    + 'made, just so that they could build them again and '
                    + 'better.'
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    'sleep': {
        content: function() {
            if( nodeChosen( 'join' ) ) {
                return vorple.html.p(
                    'The creatures reached the potential of their civilization. '
                    + 'We stopped, and we were content.' 
                );
            }
            else {
                return vorple.html.p(
                    'The creatures reached the height of their civilization '
                    + '&mdash; and stopped.' 
                );
            }
        },
        left: 4500,
        top: 1100,
        onComplete: function() { showNode( 'light-presence', false ); }
    },
    
    
    'darkness-alone': {
        content: vorple.html.tag( 'div', '', { id: 'darknessAloneCloud' } ),
        left: 5500,
        top: 1100,
        onEnter: function() {
            cloud([
               {
                   html: vorple.html.link( 'anxious', 'anxious' ),
                   top: 20,
                   left: 0
               },               
               {
                   html: vorple.html.link( 'angry', 'angry' ),
                   top: 10,
                   left: 100
               },
               {
                   html: vorple.html.link( 'enthusiastic', 'enthusiastic' ),
                   top: 0,
                   left: 200
               },
               {
                   html: vorple.html.link( 'forsaken', 'forsaken' ),
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
        content: vorple.html.p(
                'I was anxious to find a purpose.'
            )
            + vorple.html.p(
                'I scoured the universe but found no solace.'
            )
            + vorple.html.p(
                'Until I stumbled upon a world home to a curious kind of '
                + 'creatures who were ready to accept '
                + vorple.html.link( 'control', 'control' ) + ' and '
                + vorple.html.link( 'influence', 'influence' ) + '.'
            ),
        left: 5500,
        top: 1100
    },
    
    'control': {
        content: vorple.html.p(
            'They took me as their god. I led them into '
            + vorple.html.link( 'war', 'war' ) + ' and their world succumbed '
            + 'into ' + vorple.html.link( 'chaos', 'chaos' ) + '.'
        ),
        left: 5500,
        top: 1100
    },
    
    'influence': {
        content: vorple.html.p(
            'They were like clay in my grip, fulfilling my every wish while '
            + 'believing they did it in their own free will. I guided them '
            + 'to wage ' + vorple.html.link( 'war', 'war' ) + ' and spread '
            + vorple.html.link( 'chaos', 'chaos' ) + ' around them.'
        ),
        left: 5500,
        top: 1100
    },
    
    'war': {
        content: function() {
            if( nodeChosen( 'control' ) ) {
                return vorple.html.p(
                    'I was their commander in chief, waging war with everyone '
                    + 'and no-one in particular. Borders changed, property and '
                    + 'land changed owners and death was ever-present.'
                );
            }
            else {
                return vorple.html.p(
                    'It did not take much to usher them into war. They were '
                    + 'proud, greedy, stubborn and, ultimately, dead.'
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
    
    'chaos': {
        content: function() {
            if( nodeChosen( 'control' ) ) {
                return vorple.html.p(
                    'There was no progress, no growth; everything they built '
                    + 'would be destroyed. '
                    + 'While they were busy surviving they had no time to '
                    + 'question my authority.'
                );
            }
            else {
                return vorple.html.p(
                    'Their society was in constant turmoil, falling down '
                    + 'before it could be rebuilt. I kept them preoccupied '
                    + 'with petty quarrels and self-interest.'
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
   
    'angry': {
        content: vorple.html.p( 'Angry was all I could be.' )
            + vorple.html.p(
                'My rage required a target. I had to feed it with '
                + vorple.html.link( 'death', 'death' ) + ' and '
                + vorple.html.link( 'misery', 'misery' ) + '.'
            ),
        left: 5500,
        top: 1100
    },
   
    'death': {
        content: vorple.html.p( 
                'I found life. Where there is life, there is death. '
                + 'These miserable creatures lived their lives full of '
                + vorple.html.link( 'suffering', 'suffering' )
                + ' and were forgotten without '
                + vorple.html.link( 'mercy', 'mercy' )
                + ' in the vastness of time.'
            ),
        left: 5500,
        top: 1100
    },
   
    'misery': {
        content: vorple.html.p( 
                'There was nothing for me but misery, and I was not about to '
                + 'bear it alone.'
            )
            + vorple.html.p(
                'I found creatures that were in their own way alone but '
                + 'oblivious to their condition. '
                + vorple.html.link( 'suffering', 'Suffering' ) + ' was '
                + 'inevitable; ' + vorple.html.link( 'mercy', 'mercy' )
                + ' was a privilege.'
            ),
        left: 5500,
        top: 1100
    },
    
    'suffering': {
        content: function() {
            if( nodeChosen( 'death' ) ) {
                return vorple.html.p(
                    'Their miserable lives could not be cured with anything '
                    + 'short of death, and inescapable death would soon '
                    + 'take them.'
                );
            }
            else {
                return vorple.html.p(
                    'Misery leads to suffering, and there is no escape from '
                    + 'the pain that surrounds us and defines us.' 
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
    
    'mercy': {
        content: function() {
            if( nodeChosen( 'death' ) ) {
                return vorple.html.p(
                    'They were hopeless creatures with nothing to look forward '
                    + 'to other than death. Death would be merciful, and it '
                    + 'would come for them.'
                );
            }
            else {
                return vorple.html.p(
                    'They were suffering creatures with nothing to look forward '
                    + 'to other than agony. I took pity on them and treated '
                    + 'them kindly.'
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
    
    
    'enthusiastic': {
        content: vorple.html.p(
                'I was enthusiastic about the future.'
            )
            + vorple.html.p(
                'After a while life appeared, and I encountered '
                + 'a curious breed of creatures. I would '
                + vorple.html.link( 'watch', 'watch' )
                + ' them and ' + vorple.html.link( 'learn', 'learn' )
                + ' from them.' 
            ),
        left: 5500,
        top: 1100
    },
    
    'watch': {
        content: vorple.html.p(
            'I watched as the creatures went on with their lives, but '
            + 'I did not ' + vorple.html.link( 'understand', 'understand' )
            + ' them, and I did not see ' 
            + vorple.html.link( 'meaning', 'meaning' ) + ' in their ways.'
        ),
        left: 5500,
        top: 1100
    },
    
    'learn': {
        content: vorple.html.p(
            'The creatures did, thought and felt things I did not comprehend. '
            + 'I craved to ' 
            + vorple.html.link( 'understand', 'understand' )
            + ', to find a ' + vorple.html.link( 'meaning', 'meaning' ) 
            + ' in their ways.'
        ),
        left: 5500,
        top: 1100
    },
    
    'understand': {
        content: function() {
            if( nodeChosen( 'watch' ) ) {
                return vorple.html.p(
                    'I did understand: their small minds were unable to '
                    + 'comprehend the uselessness and futility of their '
                    + 'menial tinkering in a speck of dust meaningless '
                    + 'to the universe. Their ignorance mocked me, enraged me.'
                );
            }
            else {
                return vorple.html.p(
                    'Or the surface their existence served no purpose, '
                    + 'and further study would not change that fact. '
                    + 'They went on without knowing, or caring, that '
                    + 'their lives were for naught.' 
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
    
    'meaning': {
        content: function() {
            if( nodeChosen( 'watch' ) ) {
                return vorple.html.p(
                    'On the surface their existence served no purpose. '
                    + 'They went on without knowing, or caring, that '
                    + 'their lives had no meaning. I could not tolerate '
                    + 'them anymore, and abandoned them.'
                );
            }
            else {
                return vorple.html.p(
                    'Their lives were meaningless, but only on the surface. '
                    + 'Millennia later I had merged with them, become one '
                    + 'of them. Like them, I no longer cared for finding '
                    + 'a meaning.' 
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
    
    
    'forsaken': {
        content: vorple.html.p( 'I was forsaken.' )
            + vorple.html.p(
                'I encountered a breed of miserable creatures. '
                + 'I would become their '
                + vorple.html.link( 'god', 'god' ) + ' and they would learn '
                + ' the meaning of ' + vorple.html.link( 'fear', 'fear' ) + '.'
            ),
        left: 5500,
        top: 1100
    },
    
    'god': {
        content: vorple.html.p(
            'They worshipped me, and I ruled them with iron grip. '
            + 'They too would feel my ' 
            + vorple.html.link( 'isolation', 'isolation' ) + ' and '
            + vorple.html.link( 'despair', 'despair' ) + '.'
        ),
        left: 5500,
        top: 1100
    },

    'fear': {
        content: vorple.html.p(
            'There is no hope; there is no escape. There is only '
            + vorple.html.link( 'isolation', 'isolation' ) + ' and '
            + vorple.html.link( 'despair', 'despair' ) + '.'
        ),
        left: 5500,
        top: 1100
    },
    
    'isolation': {
        content: function() {
            if( nodeChosen( 'god' ) ) {
                return vorple.html.p(
                    'The creatures would look to the skies and dream. '
                    + 'Their god would look at them and strike them down, '
                    + 'for they shall never leave.'
                );
            }
            else {
                return vorple.html.p(
                    'The creatures would look to the skies and fear the '
                    + 'unknown. They would stay in their world and diminish, '
                    + 'as if it were their own will.' 
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
        
    'despair': {
        content: function() {
            if( nodeChosen( 'god' ) ) {
                return vorple.html.p(
                    'They would have no future for I would not allow it for '
                    + 'them.'
                );
            }
            else {
                return vorple.html.p(
                    'They would have no future for they would not allow it '
                    + 'for themselves.'
                );
            }
        },
        left: 5500,
        top: 1100,
        onComplete: function() { showNode( 'darkness-presence', false ); }
    },
    
    'light-presence': {
        content: vorple.html.p(
            'Then I sensed a ' + vorple.html.link( 'light-feels', 'presence' ) + '.'
        ),
        onComplete: function() {
            if( !nodeChosen( 'darkness' ) ) {
                fadeToAudio( 'music/sleepless-night.mp3' );
            }  
        },
        left: 4500,
        top: 1120
    },
    
    'darkness-presence': {
        content: vorple.html.p(
            'Then I sensed a ' + vorple.html.link( 'darkness-feels', 'presence' ) + '.'
        ),
        onComplete: function() {
            if( !nodeChosen( 'light' ) ) {
                fadeToAudio( 'music/sleepless-night.mp3' );
            }  
        },
        left: 5500,
        top: 1120
    }, 
    
    'light-feels': {
        content: vorple.html.tag( 'div', '', { id: 'lightFeelsCloud' } ),
        left: 4500,
        top: 1120,
        onEnter: function() {
            cloud([
               {
                   html: vorple.html.link( 'curiosity', 'curiosity' ),
                   top: 10,
                   left: 100
               },
               {
                   html: vorple.html.link( 'nervousness', 'nervousness' ),
                   top: 0,
                   left: 200
               },
               {
                   html: vorple.html.link( 'unity', 'unity' ),
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
        content: vorple.html.tag( 'div', '', { id: 'darknessFeelsCloud' } ),
        left: 5500,
        top: 1120,
        onEnter: function() {
            cloud([
               {
                   html: vorple.html.link( 'interest', 'interest' ),
                   top: 10,
                   left: 100
               },
               {
                   html: vorple.html.link( 'dread', 'dread' ),
                   top: 0,
                   left: 220
               },
               {
                   html: vorple.html.link( 'affinity', 'affinity' ),
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
            showNode( 'light-contact' );
        }
    },
    
    'nervousness': {}, // extends curiosity
    'unity': {}, // extends curiosity
    
    'interest': {
        content: '',
        left: 5500,
        top: 1120,
        onComplete: function() {
            showNode( 'darkness-contact' );
        }
    },
    
    'dread': {}, // extends interest
    'affinity': {}, // extends interest
        
    'darkness': {},  // extends light
    
    'light-contact': {
        content: vorple.html.p(
                "There's another being, another like me: it is here, and "
                + "we have met each other." 
            )
            + vorple.html.p( "What shall I say?" ),
        left: 4500,
        top: 1200,
        onComplete: function() {
            // skip when played from database
            if( nodeChosen( 'light' ) && nodeChosen( 'darkness' ) ) {
                return;
            }
                
            var mySide = nodeChosen( 'light' ) ? 'light' : 'darkness';
            var itsSide = nodeChosen( 'light' ) ? 'darkness' : 'light';
                
            $( vorple.html.p(
                vorple.html.tag( 'form', 
                    vorple.html.tag( 'span', '&gt;', { id: 'prompt' } )
                    + vorple.html.tag( 'input', null, { id: 'say', type: 'text', size: '30' } ),
                    { id: 'promptForm' }
                )
            ) )
                .hide()
                .appendTo( '.node-' + mySide + '-contact' )
                .fadeTo( 'slow', 0.99 );

            if( !isIos ) {
                // don't focus automatically in mobile devices 
                $( '#say' ).focus();
            } 
            
            $( '#say' )
                .addClass( 'nofocushint' ) // can't add this before initial focus
                .attr( 'autocomplete', 'off' )
                .on( 'click', function() {    // touch-punch fix
                    $( this ).focus();
                });
                
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
                
                $( this ).hide( 'blind', 1000, function() { $( this ).remove(); } );
                
                $( '<div></div>' )
                    .html( vorple.media.image( 'ajax-loader.gif' ) )
                    .attr( 'id', 'ajax-wait' )
                    .hide()
                    .appendTo( '.node-contact' )
                    .fadeIn( 50000 );
                
                $.ajax({
                    url: 'php/fetch.php',
                    dataType: 'json',
                    data: {
                         nodes: myChoices,
                         message: messages.my,
                         side: mySide
                    },
                    success: function( data ) {
                         $( '#ajax-wait' ).stop().hide( 'blind' );
                         messages.its = data.message;
                         itsChoices = data.nodes.split( ',' );
                         
                         var $other = $( '<div></div>' )
                            .attr( 'id', 'other' )
                            .appendTo( '#story' )
                            .css({
                                'background-color': 'transparent'
                            });
                            
                         $.each( itsChoices, function( index, choice ) {
                            var skipNodes = [ 
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
                            
                            var actualShowNode = showNode;
                            showNode = $.noop;
                            actualShowNode( choice, false, $other );
                            showNode = actualShowNode;
                         });
                         
                         // align the other text correctly
                         var itsStartPosition = $( '.node-' + itsSide ).offset();
                         var myStartPosition = $( '.node-' + mySide ).offset();
                         
                         var addX = ( mySide === 'light' ) ? 1000 : -1000;
                         
                         $( '#other' ).css({
                            left: ( myStartPosition.left - itsStartPosition.left ) + $( '#other' ).position().left + addX,
                            top: ( myStartPosition.top - itsStartPosition.top ) + $( '#other' ).position().top
                         });
                         
                         // now we set the paragraph spaces so that the bottom
                         // parts of each sides line up as well.
                         var darknessOffset = $( '.node-darkness-presence' ).offset().top;
                         var lightOffset = $( '.node-light-presence' ).offset().top;
                         var difference = Math.round( Math.abs( darknessOffset - lightOffset ) );
                         var $paragraphs = ( darknessOffset > lightOffset ) 
                            ? $( '.node-light-presence' ).prevAll().not( '.node-light' ) 
                            : $( '.node-darkness-presence' ).prevAll().not( '.node-darkness' );
                         var paragraphCount = $paragraphs.length + 1;
                         var addHeight = Math.floor( difference / paragraphCount );  
                         var remainder = difference - addHeight * paragraphCount;
                         
                         $.each( $paragraphs, function( index ) {
                            $( this ).animate({ 'top': '-=' + ( addHeight * ( index + 1 ) ) });
                         });
                         
                         ( ( darknessOffset > lightOffset ) ? $( '.node-light' ) : $( '.node-darkness' ) ).animate({ 'top': '-=' + ( addHeight * paragraphCount + remainder ) });

                         // line up the tops again
                         if( 
                             $( '#other .node-darkness-presence, #other .node-light-presence' ).offset().top
                             <  $( '#story > .node-darkness-presence, #story > .node-light-presence' ).offset().top
                         ) {
                            $( '#other' ).animate({ 'top': '+=' + difference });
                         }
                         else {
                            $( '#other' ).animate({ 'top': '-=' + difference });
                         }
                         
                         showNode( 'greeting' );
                    },
                    error: function( data ) {
                        $( '#story' ).fadeOut();
                        $( '<div></div>' )
                            .html( 'Network error. Please <a href="">restart</a>.' )
                            .addClass( 'ajax-error' )
                            .appendTo( 'body' );
                    }
                    
                });
                
                return false;
            });
            
            $( window ).one( 'click', function() {
                if( $( '#say' ).is( ':focus' ) ) {
                    notify( 'Type your answer and press enter.' );
                }
            });
        }        
    },
    
    'darkness-contact': {}, // extended from light-contact
    
    'greeting': {
        content: function() {
            var iSay = vorple.html.quote( messages.my );
            var itSays = vorple.html.quote( messages.its );
            
            if( messages.my === '' ) {
                iSay = 'I say nothing.' 
            }
            
            if( messages.its === '' ) {
                itSays = 'It says nothing.' 
            }
             
            return vorple.html.p( iSay, { id: 'myMessage' } )
                + vorple.html.p( itSays, { id: 'itsMessage' } );
        },
        left: 5000,
        top: 1230,
        onComplete: function() {
            setTimeout( function() {
                showNode( 'fate' ); 
            }, 5000);
        }
    },
    
    'fate': {
        content: vorple.html.p(
            'Our encounter is the most significant event since the '
            + 'Beginning, and it will determine the ' 
            + vorple.html.link( 'result', 'fate' )
            + ' of this world.'
        ),
        left: 5000,
        top: 1250,
        onComplete: function() {
            showNode( 'first-tribal', false );
        }
    },
    
    'first-tribal': {
        content: vorple.media.image( 'tribal4.png', { height: '466px', width: '500px' } ),
        left: 5000,
        top: 1250
    },
    
    'result': {
        content: function() {
            // this must be a function, otherwise the finalWord() will be called
            // when the story is loaded, not when we reach this node
            var word = finalWord();

            // out of curiosity and for tweaking final word probabilities
            // we'll save the final word
            $.get( 'php/fetch.php', { word: word } );
            
            return vorple.html.p(
                word
                + vorple.media.image( 'tribal3.png', { height: '220px', width: '620px' } )
            );
        },
        left: 5010,
        top: 1250,
        onComplete: function() {
            showNode( 'restart', false );
        }
    },

    'restart': {
        content: vorple.html.link( '', 'Restart?' ),
        left: 5000,
        top: 1250,
        onEnter: function() {
            $( '.node-restart a' ).css( 
                'background-color', $( 'body' ).css( 'background-color' ) 
            ).on( 'click', function( e ) { 
                window.location.reload(); 
                e.preventDefault();
                e.stopPropagation(); 
            });
        }
    }
};

$.extend( nodes.darkness, nodes.light, {
    'left': 5500,
    'onEnter': function() { 
        if( nodeChosen( 'light' ) ) {
            return;
        }
        
       fadeToAudio( 'music/gloom.mp3' );

       $( 'body' ).switchClass( 'start', 'darkness', 3000 );
       // link colors must be changed immediately
       $( 'body' ).addClass( 'darkness-now' );
       $( '.node-darkness a' ).attr( 'href', 'darkness-alone' );
    } 
});

$.extend( 
    nodes[ 'darkness-contact' ], 
    nodes[ 'light-contact' ], 
    { 'left': 5500 }
);

$.extend( nodes.nervousness, nodes.curiosity );
$.extend( nodes.unity, nodes.curiosity );

$.extend( nodes.dread, nodes.interest );
$.extend( nodes.affinity, nodes.interest );


function finalWord() {
    var alternatives = [
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
    
    for( var block = 0; block < alternatives.length; ++block ) {
        var ok = true;
        
        for( var node = 1; node < alternatives[ block ].length; ++node ) {
            if( !nodeChosen( alternatives[ block][ node ] ) ) {
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
