
document.getElementById('search').onsubmit = () => {
    let text = document.getElementById('text').value.trim();
    window.location.href = `/items?seed=${ text }&app=${ APP }`;
    return false;
}
