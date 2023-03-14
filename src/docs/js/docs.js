document.addEventListener('DOMContentLoaded', () => {
  const subToc = document.getElementById('subToc');

  if (subToc) {
    document.getElementById('tocContents').innerHTML = subToc.innerHTML;
    document.getElementById('tocContainer').classList.remove('d-none');
  }
});
