
document.getElementById('search').onsubmit = () => {
    let text = document.getElementById('text').value.trim();
    let url  = `/items?seed=${ text }&app=${ APP }`;

    if (text.startsWith('_')) {
        url = `/assets/${ text.replace('_', '') }.html`;
    }

    window.location.href = url;
    return false;
}
