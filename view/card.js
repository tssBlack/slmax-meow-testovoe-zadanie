import { sanitize, renderMarkdown } from "../utils/sanitize.js";

export function cardView(task) {
  const el = document.createElement('div');
  el.className = 'card';
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.dataset.id = task.id;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.innerHTML = sanitize(task.title);
  el.appendChild(title);

  if (task.description) {
    const desc = document.createElement('div');
    desc.className = 'small';
    desc.innerHTML = renderMarkdown(task.description);
    el.appendChild(desc);
  }

  el.draggable = true;
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    el.classList.add('dragging');
  });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));

  el.addEventListener('click', () => {
    location.hash = '/task/' + encodeURIComponent(task.id);
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      location.hash = '/task/' + encodeURIComponent(task.id);
    }
  });

  return el;
}
