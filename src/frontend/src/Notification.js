import {notification} from 'antd';

const openNotificationWithIcon = (type, message, description, placement) => {
    notification[type]({
        message,
        description,
        placement
    });
};

export const successNotification = (message, description) =>
    openNotificationWithIcon("success", message, description,   "topRight");

export const infoNotification = (message, description) =>
    openNotificationWithIcon("info", message, description, "topRight");

export const warningNotification = (message, description) =>
    openNotificationWithIcon("warning", message, description, "topRight");

export const errorNotification = (message, description) =>
    openNotificationWithIcon("error", message, description, "bottomLeft");
