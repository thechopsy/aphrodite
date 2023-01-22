
function url(path = '') { return `https://www.terk.nl${ path }` }

module.exports = {

    active:  false,
    id:     'TRK',
    name:   'Terk',
    match:   url().split(/[\/\.]+/).slice(-2).join('.'),
    domain:  url(),
    search:  url('/search/[TERM]'),

    items: ($) => {
        let source = $('video source').first();
        let link   = source ? source.attr('src') : '';
        let video  = $('video').first();
        let image  = video ? video.attr('poster') : '';
        let title  = $('.vidtitle').text();
        let thumbs = $('.plug') || $('.related_content');
        let items  = [];

    //    if (image && link) {
            items.push({ title, image, link, type: 'media' });
      //  }

        thumbs.each((i, e) => {
            title = $(e).find('img').first().attr('alt');
            link  = $(e).find('a'  ).first().attr('href');
            image = $(e).find('img').first().attr('src');

            if (title && link && image) {
                items.push({ title, image, type: 'link', link });
            }
        });

        return items;
    }
}
