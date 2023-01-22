
function url(path = '') { return `https://pornmedium.com${ path }` }

module.exports = {

    active:  true,
    id:     'PNM',
    name:   'Porn Medium',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/search/[TERM]'),

    items: ($, host) => {
        let html   = $('body').html();
        let match  = html.match(/src: "([^"]*)"/);
        let link   = match ? match[1] || '' : '';
        let video  = $('video').first();
        let image  = video ? video.data('poster') : '';
        let title  = $('h5').text();
        let thumbs = $('.product-image');
        let media  = `http://${ host }/video?url=${ encodeURIComponent(link) }`;
        let items  = [];
        let length = '';

        if (image && link) {
            items.push({ title, image, link: media, length, type: 'media' });
        }

        thumbs.each((i, e) => {
            title  = $(e).find('img').first().attr('alt');
            link   = $(e).find('a'  ).first().attr('href');
            image  = $(e).find('img').first().data('src') || $(e).find('img').attr('src');
            length = $(e).find('.vid-info-show .fa-clock').first().parent().text().trim() || '';

            if (title && link && image) {
                items.push({ title, image, length, link: url(link), type: 'link' });
            }
        });

        return items;
    }
}
