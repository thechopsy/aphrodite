
// --- constants

const SPEED = { SLOW: 500, FAST: 100 } // ms
const BUSY  = 5; // max action depth
const KEYS  = {
    Enter      : 'select',
    ArrowUp    : 'up',
    ArrowDown  : 'down',
    ArrowLeft  : 'left',
    ArrowRight : 'right',
    PageDown   : 'down',
    PageUp     : 'up',
};

// --- running context

let width = {};
let curr  = { lane: { idx: null }, card: { idx: null } };
let moves = { queue: Promise.resolve(), depth: 0 };

// --- resets the card and screen widths on start and resize

function resize() {
   if (curr.card.ele) {
       width.screen = $(window).width();
       width.card   = parseInt(curr.card.ele.css('width'));
       width.margin = parseInt(curr.card.ele.css('margin-left'));
       width.full   = width.card + width.margin;
   }
}

// --- scroll into view the active lane

function showlane() {
    curr.lane.ele[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- loads a lane

function load(params, cb) {
    $.ajax({
        type: 'GET',
        url: `/lane`,
        data: params,
        dataType : 'html',
        success : html => {
            let lane  = $(html);
            let cards = lane.find('.card');

            if (cards.length) {
                cards.click(function() { clicked($(this)) });
                cb(lane);
            }
        }
    });
}

// --- when a card is selected

function clicked(card) {
    let idx = { lane: card.parent('.lane').index(), card: card.index() };

    if (idx.lane === curr.lane.idx && idx.card === curr.card.idx) {
        action('select');
    }
    else {
        action('jump', idx);
    }
}

// --- switch lane

function lane(idx) {
   if (curr.lane.idx != idx) {
       if (curr.lane.ele) {
           curr.lane.ele.attr('data-curr-card', curr.card.idx);
           curr.card.all.removeClass('current');
      }

       curr.lane.idx = idx;
       curr.lane.ele = $(curr.lane.all[idx]);
       curr.card.idx = parseInt(curr.lane.ele.attr('data-curr-card')) || 0;

       curr.lane.all.removeClass('current');
       curr.lane.ele.addClass('current');
       curr.card.all = curr.lane.ele.find('.card');

       showlane();
       card(curr.card.idx, true);
   }
}

// --- switch card

function card(idx, force = false) {
    let delay = 0;

    if (force || curr.card.idx !== idx) {
        curr.card.idx = idx
        curr.card.ele = $(curr.card.all[idx]);
        curr.card.all.removeClass('current');
        curr.card.ele.addClass('current');

        showlane();

        let delta = 0;
        let left  = curr.card.ele.offset().left;
        let right = left + width.card;

        if (right > width.screen)  delta = right - width.screen + width.margin;
        if (left  < 0)             delta = left  - width.margin;

        if (delta) {
            let slide = parseInt(curr.lane.ele.css('transform').split(',')[4]) || 0;
            let speed = moves.depth === 1 ? SPEED.SLOW : SPEED.FAST;

            delay = speed / width.full * Math.min(width.full, Math.abs(delta));

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
            curr.lane.all = $('.lanes .lane');
            lane(curr.lane.idx + 1);
        });
    }
}

// --- process a ui action

function action(which, context) {
    if (which && moves.depth < BUSY) {
        moves.depth++;
        moves.queue = moves.queue.then(() => new Promise(resolve => {
            let delay = 0;

            if (which === 'select') select();
            if (which === 'right' ) delay = card(Math.min(curr.card.idx + 1, curr.card.all.length - 1));
            if (which === 'left'  ) delay = card(Math.max(curr.card.idx - 1, 0));
            if (which === 'down'  ) lane(Math.min(curr.lane.idx + 1, curr.lane.all.length - 1));
            if (which === 'up'    ) lane(Math.max(curr.lane.idx - 1, 0));
            if (which === 'jump'  ) {
                 lane(context.lane);
                 delay = card(context.card)
            }

            setTimeout(() => { resolve() }, delay);
        }))
        .then(() => moves.depth--);
    }
}

// --- initialise

function init() {
    $(window  ).on('resize'    , e => resize());
    $(document).on('swiperight', e => action('right'))
               .on('swipeleft' , e => action('left'))
               .on('keydown'   , e => action(KEYS[e.key]));

    SITES.forEach(s => load ({ site: s, text: SEED }, loaded => {
        $('.lanes').append(loaded);
        curr.lane.all = $('.lanes .lane');
        if (curr.lane.all.length === 1) {  // first one loaded
            lane(0);
            resize();
        }
    }));
}

// --- entry point

$(() => init());

/*

TODO

3. comments
4. codepen

*/
