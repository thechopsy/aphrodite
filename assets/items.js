
// --- gets a CSS variable value

function getCssVar(name) {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue(`--${ name }`));
}

// --- constants

const SPEED_SLOW   = 500; // ms
const SPEED_FAST   = 100; // ms
const WIDTH_CARD   = getCssVar('content-width');
const WIDTH_MARGIN = getCssVar('content-margin');
const WIDTH_TOTAL  = WIDTH_CARD + WIDTH_MARGIN;
const KEY_PRESSES  = {
    13: 'select',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
};

// --- running context

let width = $(window).width();
let lanes = $('.lanes .lane');
let cards = null;
let curr  = { lane: { idx: null }, card: { idx: null } };
let moves = Promise.resolve();
let depth = 0;

// --- loads a lane

function load(params, cb) {
    $.ajax({
        type: 'GET',
        url: `/lane`,
        data: params,
        dataType : 'html',
        success : html => {
            let lane = $(html);
            if (lane.find('.card').length) cb(lane);
        }
    });
}

// --- switch lane

function lane(idx) {
   if (curr.lane.idx != idx) {
       if (curr.lane.ele) {
           curr.lane.ele.attr('data-curr-card', curr.card.idx);
           cards.removeClass('current');
      }

       curr.lane.idx = idx;
       curr.lane.ele = $(lanes[idx]);
       curr.card.idx = curr.lane.ele.attr('data-curr-card') || 0;

       lanes.removeClass('current');
       curr.lane.ele.addClass('current');
       cards = curr.lane.ele.find('.card');

       curr.lane.ele[0].scrollIntoView({behavior: "smooth", block: "end"});
       card(curr.card.idx, true);
   }
}

// --- switch card

function card(idx, force = false) {
    let delay = 0;

    if (force || curr.card.idx !== idx) {
        curr.card.idx = idx
        curr.card.ele = $(cards[idx]);

        cards.removeClass('current');
        curr.card.ele.addClass('current');

        let delta = 0;
        let left  = curr.card.ele.offset().left;
        let right = left + WIDTH_CARD;

        if (right > width) {
            delta = right - width + WIDTH_MARGIN;
        }

         if (left < 0) {
            delta = left - WIDTH_MARGIN;
        }

        if (delta) {
            let slide = parseInt(curr.lane.ele.css('transform').split(',')[4]) || 0;
            let speed = depth === 1 ? SPEED_SLOW : SPEED_FAST;

            delay = speed / WIDTH_TOTAL * Math.min(WIDTH_TOTAL, Math.abs(delta));

            curr.lane.ele.css('transition-duration',  `${ delay }ms`);
            curr.lane.ele.css('transform', `translateX(${ slide - delta }px)`);
        }
    }

    return delay;
}

// --- select a card

function select() {
    let url = curr.card.ele.attr('data-link');

    if (curr.card.ele.hasClass('media')) {
        if (APP === 'android') url = `/android/play?uri=${ encodeURIComponent(url) }&offset=0&agent=`;
        window.location.href = url;
    }
    else {
        load({ url: encodeURIComponent(url) }, loaded => {
            loaded.insertAfter(curr.lane.ele);
            lanes = $('.lanes .lane');
            lane(curr.lane.idx + 1);
        });
    }
}

// --- process a move via a keypress

function move(which) {
    return new Promise(resolve => {
        let delay = 0;

        if (which === 'select') select();
        if (which === 'right' ) delay = card(Math.min(curr.card.idx + 1, cards.length - 1));
        if (which === 'left'  ) delay = card(Math.max(curr.card.idx - 1, 0));
        if (which === 'down'  ) lane(Math.min(curr.lane.idx + 1, lanes.length - 1));
        if (which === 'up'    ) lane(Math.max(curr.lane.idx - 1, 0));

        setTimeout(() => { resolve() }, delay);
    });
}

// --- key press handler

$(document).keydown(e => {
    let which = KEY_PRESSES[e.keyCode];

    if (which) {
        depth++;
        moves = moves.then(() => move(which)).then(() => depth--);
    }
});

// --- initialise

function init() {
    SITES.forEach(s => load ({ site: s, text: SEED }, loaded => {
        $('.lanes').append(loaded);
        lanes = $('.lanes .lane');
        if (cards === null) lane(0);
    }));
}

// --- entry point

init();

/*

TODO

1. window resize
2. position bug
3. comments
4. codepen

*/
