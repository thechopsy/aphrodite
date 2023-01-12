
function url (path  = '') { return `https://efukt.com${ path }` }
function img (style = '') { return style.replace("background-image: url('", '').replace("');", '') }

module.exports = {

    name:   'Efukt',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/search/[TERM]'),

    items: ($) => {
        let source = $('video source').first();
        let link   = source ? source.attr('src') : '';
        let video  = $('video').first();
        let image  = video ? video.attr('poster') : '';
        let title  = $('h1').text();
        let thumbs = $('.tile');
        let length = '';
        let items  = [];

        if (image && link) {
            items.push({ title, image, link, length, type: 'media' });
        }

        thumbs.each((i, e) => {
            title = $(e).find('a').first().attr('title');
            link  = $(e).find('a').first().attr('href' );
            image = $(e).find('a').first().attr('style');

            if (title && link && image) {
                items.push({ title, image: img(image), length, type: 'link', link });
            }
        });

        return items;
    }
}
