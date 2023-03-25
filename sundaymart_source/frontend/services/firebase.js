import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { store } from "../redux/store";
import { setChats, setMessages } from "../redux/slices/chat";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";
import { getStorage } from "firebase/storage";

const cookie = parseCookies();
let config = null;

if (cookie?.settings) {
  config = JSON.parse(cookie?.settings);
}
const firebaseConfig = {
  apiKey: config?.api_key ? config?.api_key : process.env.NEXT_PUBLIC_API_KEY,
  authDomain: config?.auth_domain
    ? config?.auth_domain
    : process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: config?.project_id
    ? config?.project_id
    : process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: config?.storage_bucket
    ? config?.storage_bucket
    : process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: config?.messaging_sender_id
    ? config?.messaging_sender_id
    : process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: config?.app_id ? config?.app_id : process.env.NEXT_PUBLIC_APP_ID,
  measurementId: config?.measurement_id
    ? config?.measurement_id
    : process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { app as default };
export const storage = getStorage(app);
export const db = getFirestore(app);

onSnapshot(
  query(collection(db, "messages"), orderBy("created_at", "asc")),
  (querySnapshot) => {
    const messages = querySnapshot.docs.map((x) => ({
      id: x.id,
      ...x.data(),
      created_at: String(new Date(x.data().created_at?.seconds * 1000)),
    }));
    store.dispatch(setMessages(messages));
  }
);
onSnapshot(
  query(collection(db, "chats"), orderBy("created_at", "asc")),
  (querySnapshot) => {
    const chats = querySnapshot.docs.map((x) => ({
      id: x.id,
      ...x.data(),
      created_at: String(new Date(x.data().created_at?.seconds * 1000)),
    }));
    store.dispatch(setChats(chats));
  }
);

export async function sendMessage(payload) {
  try {
    await addDoc(collection(db, "messages"), {
      ...payload,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    toast.error(error);
  }
}

export async function createChat(payload) {
  try {
    await addDoc(collection(db, "chats"), {
      ...payload,
      created_at: serverTimestamp(),
    });
  } catch (error) {
    toast.error(error);
  }
}
