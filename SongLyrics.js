"use strict";

var currentBeat = 1;
var bpm = 80;
var scrollSpeedSeconds = 9;

var currentStartLine = 1;
var offsetCount = 0;
var beatTimer, lineScrollTimer;
var pauseUntil;

function highlightRows(scroll) {
    let wordsDiv = $('#words');

    let $currentLine = $('#words p:nth-child(' + currentStartLine + ')');
    
    if ($currentLine.length > 0) {
        $('#words p:nth-child(' + currentStartLine + ')')[0].scrollIntoView({
            behavior: "smooth"
        });
    }
    
    $('p:not(.text)').removeClass('has-background-primary is-family-monospace has-background-info has-text-white is-size-5 mg-small pl-3 mt-2 mb-2'); 

    let selector = '';

    if (currentStartLine == 1) {
        selector = '#words p:lt(10)';
    }
    else
        selector = '#words p:gt(' + (currentStartLine - 1) + '):lt(10)';

    let $lines = $(selector);
    
    $lines.filter('.lyric').addClass('has-background-primary has-text-white is-size-5 mg-small pl-3');
    $lines.filter('.music').addClass('has-background-info has-text-white is-size-5 mg-small pl-3 mt-2 mb-2')
                            .removeClass('is-hidden');
    $lines.filter('.chords').addClass('has-background-info is-family-monospace has-text-white is-size-5 mg-small pl-3 mt-2 mb-2')
                            .removeClass('is-hidden');
    
                    
}

$(function() {

    $('#btnStop').hide();

    $('#btnStart').click(function() {

        $('#btnStop').show();
        $('#btnStart').hide();

        highlightRows(false);

        lineScrollTimer = window.setInterval(function() {

            if (pauseUntil != null && new Date() > pauseUntil) {
                pauseUntil = null;
                currentStartLine++;        
            }

            if (pauseUntil != null && new Date() < pauseUntil)
                return;
            
            let currentPause = $('#words p:nth-child(' + currentStartLine + ')').data('pause');
            let localScrollSpeed = $('#words p:nth-child(' + currentStartLine + ')').data('scrollspeed');            

            highlightRows(true);
                
            if (currentPause == undefined) {
                currentStartLine++;
            }
            else {

                let t = new Date();
                t.setSeconds(t.getSeconds() + currentPause);

                pauseUntil = t;    
            }

       
        },
        1000 * scrollSpeedSeconds);


        beatTimer = window.setInterval(function() {

            let currentLabel = '#label' + currentBeat;

            $('label').removeClass('currentBeat');
            $(currentLabel).addClass('currentBeat');

            if (currentBeat == 4)
                currentBeat = 1;
            else
                currentBeat++;
            }
            , 1000 * 60 / bpm);

    });

    $('#btnStop').click(function() {
        clearInterval(beatTimer);
        clearInterval(lineScrollTimer);

        $('#btnStart').show();
        $('#btnStop').hide();

    });

});