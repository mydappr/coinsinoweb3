import { toast } from "react-toastify";

function UseToaster() {
  const Toast = (message) => {
    return toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      color: "#232232",
    });
  };

  return { Toast };
}

export default UseToaster;
