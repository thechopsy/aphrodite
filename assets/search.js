
function working(busy) {
    document.getElementById('text').disabled = busy;
    document.getElementById('site').disabled = busy;
}

document.getElementById('search').onsubmit = () => {
    let text  = document.getElementById('text').value.trim();
    let site  = document.getElementById('site').value;
    let parts = site.split('|');
    let where = text.length > 1 ? parts[0].replace('[TERM]', encodeURI(text)) : parts[1];

    working(true);
    setTimeout (() => { working(false) }, 2500);

    window.location.href = `/items?url=${ encodeURIComponent(where) }&app=${ APP }`;
    return false;
}
