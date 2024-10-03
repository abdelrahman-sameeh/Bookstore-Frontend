import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (
  msg: string,
  type: "warn" | "success" | "error" = 'success',
  duration: number = 3000 // default duration in milliseconds
) => {
  if (type === "warn") toast.warn(msg, { autoClose: duration });
  else if (type === "success") toast.success(msg, { autoClose: duration });
  else if (type === "error") toast.error(msg, { autoClose: duration });
};

export default notify;
