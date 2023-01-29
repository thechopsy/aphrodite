
document.getElementById('search').onsubmit = () => {
    let text = document.getElementById('text').value.trim();
    let url  = `/items?seed=${ text }&app=${ APP }`;

    if (text.startsWith('@')) {
        url = `/assets/${ text.replace('@', '') }.html`;
    }

    window.location.href = url;
    return false;
}
