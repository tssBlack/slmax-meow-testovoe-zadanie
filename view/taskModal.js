import { store } from "../utils/store.js";
import { sanitize, renderMarkdown } from "../utils/sanitize.js";

// безопасная функция рендеринга Markdown
function safeRenderMarkdown(md) {
  return sanitize(renderMarkdown(md));
}

export function taskModal(id) {
  const task = store.getTasks().find((t) => t.id === id);
  if (!task) {
    location.hash = "/board";
    return document.createTextNode("");
  }

  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.tabIndex = -1;

  const modal = document.createElement("div");
  modal.className = "modal";
  overlay.appendChild(modal);

  // Title
  const titleRow = document.createElement("div");
  titleRow.className = "row";
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title";
  const title = document.createElement("input");
  title.type = "text";
  title.value = task.title;
  titleLabel.appendChild(title);
  titleRow.appendChild(titleLabel);
  modal.appendChild(titleRow);

  // Description
  const descRow = document.createElement("div");
  descRow.className = "row";
  const descLabel = document.createElement("label");
  descLabel.textContent = "Description";
  const desc = document.createElement("textarea");
  desc.rows = 6;
  desc.value = task.description || "";
  descLabel.appendChild(desc);
  descRow.appendChild(descLabel);
  modal.appendChild(descRow);

  // Buttons
  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "8px";
  buttons.style.marginTop = "8px";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    const newTitle = title.value.trim();
    if (!newTitle) return alert("Title required");
    store.updateTask(task.id, { title: newTitle, description: desc.value });
    location.hash = "/board";
  });
  buttons.appendChild(saveBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.background = "#ff5c5c";
  deleteBtn.addEventListener("click", () => {
    if (confirm("Delete task?")) {
      store.deleteTask(task.id);
      location.hash = "/board";
    }
  });
  buttons.appendChild(deleteBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => (location.hash = "/board"));
  buttons.appendChild(cancelBtn);

  modal.appendChild(buttons);

  // Preview
  const preview = document.createElement("div");
  preview.className = "card";

  const previewTitle = document.createElement("div");
  previewTitle.className = "card-title";
  previewTitle.textContent = task.title;
  preview.appendChild(previewTitle);

  const previewDesc = document.createElement("div");
  previewDesc.className = "small";
  previewDesc.innerHTML = safeRenderMarkdown(task.description || "");
  preview.appendChild(previewDesc);

  modal.appendChild(preview);

  // live update
  title.addEventListener("input", () => {
    previewTitle.textContent = title.value;
  });

  desc.addEventListener("input", () => {
    previewDesc.innerHTML = safeRenderMarkdown(desc.value);
  });

  // Focus
  setTimeout(() => title.focus(), 0);

  return overlay;
}
