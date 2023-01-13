
// --- constants

const OVERLAP  =  10; // percentage of width
const ROTATION =  45; // degrees
const DELAY    = 250; // milliseconds - for various animations
const SWIPE    =  75; // pixels - min swipe length
const ANDROID  = APP === 'android';

// --- globals

var found = [ ...document.querySelectorAll('div.content') ];
var index = Math.floor(found.length / 2);
var items = [];

found.forEach((e, i) => i % 2 ? items.unshift(e) : items.push(e)); // fan fold

// --- move to previous item

function action_prev() {
    if (index) {
        index--;
        action_flow();
    }
}

// --- move to next item

function action_next() {
    if (items.length > (index + 1)) {
        index++;
        action_flow();
    }
}

// --- jump to specified item

function action_goto(i) {
    if (index !== i) {
        index = i;
        action_flow();
    }
}

// --- plays an item

function action_play() {
    let curr = items[index];
    let link = curr.getAttribute('data-link');
    let type = curr.getAttribute('data-type');
    let url  = `/items?url=${ encodeURIComponent(link) }&app=${ APP }`;

    if (type === 'media') {
        url = ANDROID ? `/android/play?uri=${ encodeURIComponent(link) }&offset=0&agent=` : link;
    }

    window.location.href = url;
}

// --- goto home

function action_home() {
    window.location.href = `/?app=${ APP }`;
}

// --- reflow the items

function action_flow() {
    items.forEach((c, i) =>  {
        let transform = '';
        let zindex    = '';
        let offset    = c.clientWidth / OVERLAP;

        if (i < index) {
            transform = `translateX(-${ offset * (index - i) }%) rotateY(${ ROTATION }deg)`;
            zindex    =  i;
        }

        else if (i === index) {
            transform = 'rotateY(0deg) translateZ(140px)';
            zindex    =  items.length;
        }

        else /* if (i > index) */ {
            transform = `translateX(${ offset * (i - index) }%) rotateY(-${ ROTATION }deg)`;
            zindex    =  items.length - i;
        }

        c.style.transform = transform;
        c.style.zIndex    = zindex;

        c.classList.remove('current');
        c.classList.add(c.getAttribute('data-type'));
    });

    if (items.length) setTimeout (() => { items[index].classList.add ('current') }, DELAY);
}

// --- state management

function state(event, context) {

    if (event === 'left') {
        action_prev();
    }

    else if (event === 'right') {
        action_next();
    }

    else if (event === 'select') {
        context === index ?  action_play() : action_goto(context);
    }

    else if (event === 'submit') {
        action_play();
    }

    else if (event === 'home') {
        action_home();
    }

    else {
        // do nothing here
    }
}

// --- event management

function events() {

    document.addEventListener('keydown', event => {
        const EVENTS = {
            ArrowLeft:  'left',
            ArrowRight: 'right',
            ArrowUp:    'home',
            Enter:      'submit'
        };

        state(EVENTS[event.key]);
    });

    let touched = 0

    document.addEventListener('touchstart', event => {
        touched = event.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', event => {
        let moved = touched - event.changedTouches[0].screenX;
        if (Math.abs(moved) > SWIPE && moved < 0) state('left');
        if (Math.abs(moved) > SWIPE && moved > 0) state('right');
        if (Math.abs(moved) < SWIPE) state('submit');
    });

    addEventListener('resize', (event) => { action_flow() });
}

// --- initialisation

function init() {
    document.documentElement.style.setProperty('--content-sizing', ANDROID ? '0.4' : '0.6');

    items.forEach((c, i) =>  {
        if (!ANDROID) c.onclick = () => { state('select', i) };
        c.style.zIndex = index === i ? 1 : 0;
    });

    setTimeout (() => { action_flow() }, DELAY);
    events();
}

init();
