import { notify } from "./notify";

export const serverErrorNotification = () => {
  notify("Some server error occured", "error");
};
