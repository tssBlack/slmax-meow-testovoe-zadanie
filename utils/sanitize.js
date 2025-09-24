export function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitize(str) {
  return escapeHTML(str);
}

export function renderMarkdown(raw) {
  if (!raw) return '';

  let s = escapeHTML(raw);

  // 2)`code`
  const codeMap = [];
  s = s.replace(/`([^`]+?)`/g, (_, codeContent) => {
    const idx = codeMap.push(codeContent) - 1;
    return `@@CODE${idx}@@`;
  });

  // **bold**
  s = s.replace(/\*\*(.+?)\*\*/g, (_, g) => `<strong>${g}</strong>`);

  // _italic_
  s = s.replace(/_(.+?)_/g, (_, g) => `<em>${g}</em>`);
  s = s.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
  );

  s = s.replace(/\r\n|\r|\n/g, '<br>');
  s = s.replace(/@@CODE(\d+)@@/g, (_, n) => {
    const content = escapeHTML(codeMap[Number(n)]);
    return `<code>${content}</code>`;
  });

  return s;
}
