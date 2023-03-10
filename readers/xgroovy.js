
function url(path = '') { return `https://xgroovy.com${ path }` }

module.exports = {

    active:  true,
    id:     'XGV',
    name:   'X Groovy',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/search/[TERM]'),

    items: ($, host) => {
        let source = $('video source').first();
        let link   = source ? source.attr('src') : '';
        let image  = $('meta[property="og:image"]').attr('content')
        let title  = $('h1').text();
        let thumbs = $('.item');
        let length = $('.badge.duration').text() || '';
        let media  = `http://${ host }/video?url=${ encodeURIComponent(link) }`;
        let items  = [];

        if (image && link) {
            items.push({ title, image, link: media, length, type: 'media' });
        }

        thumbs.each((i, e) => {
            title  = $(e).find('img').first().attr('alt');
            link   = $(e).find('a'  ).first().attr('href');
            image  = $(e).find('img').first().attr('src');
            length = $(e).find('.duration').first().text();

            if (title && link && image) {
                items.push({ title, image, length, type: 'link', link });
            }
        });

        return items;
    }
}
