
function url(path = '') { return `https://pornone.com${ path }` }

module.exports = {

    name:   'Porn One',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/search/[TERM]'),

    items: ($) => {
        let source = $('video source').first();
        let link   = source ? source.attr('src') : '';
        let video  = $('video').first();
        let image  = video ? video.attr('poster') : '';
        let title  = $('h1').text();
        let thumbs = $('a.links');
        let length = '';
        let items  = [];

        if (image && link) {
            items.push({ title, image, link, length,type: 'media' });
        }

        thumbs.each((i, e) => {
            title  = $(e).find('img.imgvideo').first().attr('alt');
            link   = $(e).attr('href');
            image  = $(e).find('img.imgvideo').first().attr('src');
            length = $(e).find('.leading-4').first().text() || '';

            if (title && link && image) {
                items.push({ title, image, length, type: 'link', link });
            }
        });

        return items;
    }
}
