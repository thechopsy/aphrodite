
function url(path = '') { return `https://www.trannytube.net${ path }` }

module.exports = {

    active:  true,
    id:     'TYT',
    name:   'Tranny Tube',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/search/[TERM]'),

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
            title  =  $(e).find('img').first().attr('alt');
            link   =  $(e).find('a'  ).first().attr('href');
            image  =  $(e).find('img').first().data('src');
            length = ($(e).find('.f-left').text() || '/').split('/').pop().trim();

            if (title && link && image) {
                items.push({ title, image, length, type: 'link', link: url(link) });
            }
        });

        return items;
    }
}
