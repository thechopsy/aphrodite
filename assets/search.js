
document.getElementById('search').onsubmit = () => {
    let text  = document.getElementById('text').value.trim();
    let site  = document.getElementById('site').value;
    let parts = site.split('|');
    let where = text.length > 1 ? parts[0].replace('[TERM]', encodeURI(text)) : parts[1];

    window.location.href = `/items?url=${ encodeURIComponent(where) }&app=${ APP }`;
    return false;
}
