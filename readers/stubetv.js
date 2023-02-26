
function url(path = '') { return `https://www.shemaletubes.tv${ path }` }

module.exports = {

    active:  true,
    id:     'STV',
    name:   'Shemale Tube TV',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/s.php?search=[TERM]'),

    items: ($) => {
        let source = $('video source').first();
        let link   = source ? source.attr('src') : '';
        let video  = $('video').first();
        let image  = video ? video.attr('poster') : '';
        let title  = $('h1').text();
        let thumbs = $('.b-thumb-item');
        let length = '';
        let items  = [];

        if (image && link) {
            items.push({ title, image, length, link, type: 'media' });
        }

        thumbs.each((i, e) => {
            title  = $(e).find('img').first().attr('alt');
            link   = $(e).find('a'  ).first().attr('href');
            image  = $(e).find('img').first().data('src');
            length = $(e).find('.b-thumb-item__duration').text() || '';

            if (title && link && image) {
                items.push({ title, image, length, type: 'link', link: url(link) });
            }
        });

        return items;
    }
}
