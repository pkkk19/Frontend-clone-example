import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { UserApi } from "../api/main/user";
import firebase from "../services/firebase";

export const getNotification = ({ vapid_key, setNotificationData }) => {
  const messaging = getMessaging(firebase);
  getToken(messaging, { vapid_key })
    .then((currentToken) => {
      if (currentToken) {
        UserApi.firebaseTokenUpdate({ firebase_token: currentToken })
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });

        onMessage(messaging, (payload) => {
          setNotificationData(payload.notification);
        });
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};
