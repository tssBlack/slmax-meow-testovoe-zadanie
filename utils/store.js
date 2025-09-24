// utils/store.js
const LS_KEY = 'kanban_data';

function uid(prefix = 't') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export class Store {
  constructor() {
    this.tasks = [];
    this.listeners = [];
    this.filter = null;
    this._undo = null;

    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try { this.tasks = JSON.parse(raw).tasks || []; } catch (e) { this.tasks = []; }
    } else {
      const seedUrl = new URL('../seed.json', import.meta.url).href;
      fetch(seedUrl)
        .then(r => r.json())
        .then(data => {
          this.tasks = data.tasks || [];
          this._commit();
        })
        .catch(() => { this.tasks = []; this._commit(); });
    }
  }

  subscribe(fn) {
    this.listeners.push(fn);
    fn();
  }

  _notify() {
    this.listeners.forEach(f => f());
  }

  _commit() {
    localStorage.setItem(LS_KEY, JSON.stringify({ tasks: this.tasks }));
    this._notify();
  }

  hasUndo() {
    return !!this._undo;
  }

  createTask({ title, description = '', status = 'todo' }) {
    const task = { id: uid(), title: String(title || '').trim(), description, status };
    this._undo = { type: 'create', id: task.id };
    this.tasks.push(task);
    this._commit();
    return task;
  }

  updateTask(id, patch) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    const old = JSON.parse(JSON.stringify(this.tasks[idx]));
    this._undo = { type: 'update', old };
    this.tasks[idx] = Object.assign({}, this.tasks[idx], patch);
    this._commit();
  }

  deleteTask(id) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    const [task] = this.tasks.splice(idx, 1);
    this._undo = { type: 'delete', task, index: idx };
    this._commit();
  }

  moveTask(id, status) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return;
    const from = t.status;
    if (from === status) return;
    this._undo = { type: 'move', id, from, to: status };
    t.status = status;
    this._commit();
  }

  getTask(id) {
    return this.tasks.find(t => t.id === id);
  }

  getTasks() {
    return this.filter ? this.tasks.filter(this.filter) : [...this.tasks];
  }

  setFilter(fn) {
    this.filter = fn;
    this._notify();
  }

  // Откат
  undo() {
    const u = this._undo;
    if (!u) return;
    if (u.type === 'create') {
      this.tasks = this.tasks.filter(t => t.id !== u.id);
    } else if (u.type === 'delete') {
      this.tasks.splice(u.index, 0, u.task);
    } else if (u.type === 'update') {
      const idx = this.tasks.findIndex(t => t.id === u.old.id);
      if (idx !== -1) this.tasks[idx] = u.old;
    } else if (u.type === 'move') {
      const t = this.tasks.find(t => t.id === u.id);
      if (t) t.status = u.from;
    }
    this._undo = null;
    this._commit();
  }
}

export const store = new Store();
