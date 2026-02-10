import Notification from "../models/notification.js";
import beamsClient from "../config/pusherBeams.js";

export const sendNotification = async ({userId,title,message,type,action}) => {

// save in database 
 const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    action,
  });


//  Send push (respect user settings)

   try {
    await beamsClient.publishToInterests(
      [`user-${userId}`],
      {
        web: {
          notification: {
            title,
            body: message,
            data: {
              notificationId: notification._id.toString(),
              type,
              ...action?.params,
            },
          },
        },
        fcm: {
          notification: {
            title,
            body: message,
          },
          data: {
            type,
            screen: action?.screen || "",
            ...action?.params,
          },
        },
      }
    );
  } catch (err) {
    console.error("Push failed:", err.message);
  }  
  return notification;
}



