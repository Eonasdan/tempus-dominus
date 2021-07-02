function showPosts(filteredPosts) {
    let html = '';
    if (!filteredPosts || filteredPosts.length === 0) html = '<h1>No results</h1>';
    filteredPosts.forEach(post => {
        html += `[POSTLOOP]`;
    });
    document.getElementById('post-container').innerHTML = html;
}

const urlParams = new URLSearchParams(window.location.search);
const term = urlParams.get('search');
if (term) {
    document.getElementById('search').value = term;
    const termLower = term.toLowerCase();
    fetch('/js/search.json')
        .then(response => response.json())
        .then(data => {
            if (term.startsWith('tag:'))
                showPosts(data.filter(x => x.tags.includes(termLower.replace('tag:', ''))));
            else
                showPosts(data.filter(x => x.title.toLowerCase().includes(termLower) || x.body.includes(termLower)));
        });
}


function onLinkClick(e) {
    window.location.href = e.target.href;
}

[...document.querySelectorAll('.pager .post-title')].forEach(element => element.addEventListener('click', onLinkClick));