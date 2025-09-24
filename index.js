import { store } from "./utils/store.js";
import { router } from "./utils/router.js";
import { debounce } from "./utils/debounce.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("search");
const onlyWithDesc = document.getElementById("onlyWithDesc");
const onlyWithOutDesc = document.getElementById("onlyWithOutDesc");

function render() {
  app.innerHTML = "";
  const view = router.resolve();
  if (view) app.appendChild(view);
}

store.subscribe(render);


function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const filterDesc = onlyWithDesc.checked;
  const filterWoDesc = onlyWithOutDesc.checked

  store.setFilter((task) => {
    let ok = true;
    if (q && !task.title.toLowerCase().includes(q)) ok = false;
    if (filterDesc && !task.description.trim()) ok = false;
    if (filterWoDesc && task.description.trim()) ok = false;
    return ok;
  });
}
searchInput.addEventListener("input", debounce(applyFilters));
onlyWithDesc.addEventListener("change", applyFilters);
onlyWithOutDesc.addEventListener("change", applyFilters);

window.addEventListener("hashchange", render);
render();
