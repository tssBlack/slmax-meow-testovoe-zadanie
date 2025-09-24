// Базовое экранирование HTML
export function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Простейший markdown
export function sanitize(str) {
  if (!str) return "";
  let s = escapeHTML(str);

  s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  s = s.replace(/_(.+?)_/g, "<i>$1</i>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");

  return s.replace(/\n/g, "<br>");
}

// для desc
export function renderMarkdown(str) {
  if (!str) return "";
  let s = escapeHTML(str);

  s = s.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  s = s.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  s = s.replace(/^# (.+)$/gm, "<h1>$1</h1>");


  s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  s = s.replace(/_(.+?)_/g, "<i>$1</i>");

  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  s = s.replace(/\[(.+?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  return s.replace(/\n/g, "<br>");
}
