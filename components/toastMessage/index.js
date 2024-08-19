import { notification } from "antd";

const ToastMessage = (title, message, type) => {
  notification[type]({
    message: title,
    description: message,
    duration: 5.2,
    placement: "topRight",
  });
};

export default ToastMessage;
