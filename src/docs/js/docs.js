function logger(element, verb, ...arguments) {
  const msg = document.createElement('div');
  msg.classList.add('alert');
  switch (verb) {
    case 'log':
      msg.classList.add('alert-primary');
      break;
    case 'debug':
      msg.classList.add('alert-secondary');
      break;
    case 'info':
      msg.classList.add('alert-info');
      break;
    case 'warn':
      msg.classList.add('alert-warning');
      break;
    case 'error':
      msg.classList.add('alert-danger');
      break;
  }
  const pre = document.createElement('pre');
  pre.innerHTML = arguments.join(' ');
  msg.appendChild(pre);
  element.appendChild(msg);
}

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.getElementsByClassName('show-code')).forEach((e) => {
    e.addEventListener('click', () => {
      const codeBlock = e
        .closest('section')
        .getElementsByClassName('code-blocks')[0];
      codeBlock.classList.toggle('d-block');
      codeBlock.classList.toggle('d-none');
    });
  });

  const subToc = document.getElementById('subToc');

  if (subToc) {
    document.getElementById('tocContents').innerHTML = subToc.innerHTML;
    document.getElementById('tocContainer').classList.remove('d-none');
  }
});
