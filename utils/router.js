import { boardView } from "../view/board.js";
import { taskModal } from "../view/taskModal.js";

export const router = {
  resolve() {
    const hash = location.hash.slice(1);
    if (hash.startsWith("/task/")) {
      const id = hash.split("/")[2];
      return taskModal(id);
    }
    return boardView();
  },
};
