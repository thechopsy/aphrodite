
function url(path = '') { return `https://allnporn.com${ path }` }

module.exports = {

    active:  true,
    id:     'ANP',
    name:   'All N Porn',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/?s=[TERM]'),

    items: ($, host) => {
        let source = $('video source').first();
        let link   = source ? source.attr('src') : '';
        let video  = $('video').first();
        let image  = video ? video.attr('poster') : '';
        let title  = $('h1').text();
        let thumbs = $('article.thumb-block');
        let length = '';
        let media  = `http://${ host }/video?url=${ encodeURIComponent(link) }`;
        let items  = [];

        if (image && link) {
            items.push({ title, image, link: media, length, type: 'media' });
        }

        thumbs.each((i, e) => {
            title  = $(e).find('img').first().attr('alt');
            link   = $(e).find('a').first().attr('href');
            image  = $(e).find('img').first().attr('data-src');
            length = $(e).find('span.duration').first().text() || '';

            if (title && link && image && link.includes('allnporn')) {
                items.push({ title, image, length, type: 'link', link });
            }
        });

        return items;
    }
}
