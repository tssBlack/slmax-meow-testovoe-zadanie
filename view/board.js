import { store } from "../utils/store.js";
import { cardView } from "./card.js";


export function boardView() {
  const container = document.createElement('div');

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const newBtn = document.createElement('button');
  newBtn.textContent = 'New Task';
  newBtn.addEventListener('click', () => {
    const title = 'newTitle';
    if (!title) return;
    store.createTask({ title, description: 'newDesc', status: 'todo' });
  });
  toolbar.appendChild(newBtn);

  container.appendChild(toolbar);

  const board = document.createElement('div');
  board.className = 'board';

  const statuses = [
    { id: 'todo', title: 'Todo' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  const tasks = store.getTasks();

  statuses.forEach(s => {
    const col = document.createElement('section');
    col.className = 'column';
    col.dataset.status = s.id;

    const h = document.createElement('h2');
    h.textContent = s.title;
    col.appendChild(h);

    const list = document.createElement('div');
    list.className = 'list';

    const items = tasks.filter(t => t.status === s.id);
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No tasks';
      list.appendChild(empty);
    } else {
      items.forEach(t => list.appendChild(cardView(t)));
    }

    // Перемещение карточки
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drop-target'); });
    col.addEventListener('dragleave', () => col.classList.remove('drop-target'));
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drop-target');
      const id = e.dataTransfer.getData('text/plain');
      if (id) {
        store.moveTask(id, s.id);
      }
    });

    col.appendChild(list);
    board.appendChild(col);
  });


  container.appendChild(board);

  return container;
}
