import React, { useEffect, useRef, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import Channel from "./channel";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  setCurrentChat,
  setNewMessage,
} from "../../redux/slices/chat";
import { createChat, sendMessage, storage } from "../../services/firebase";
import { scrollTo } from "../../utils/scrollTo";
import { getMessages } from "../../utils/getMessages";
import { useTranslation } from "react-i18next";
import UploadMedia from "./upload-media";
import { SUPPORTED_FORMATS } from "../../constants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Chat({ windowSize }) {
  const { t: tl } = useTranslation();
  const inputRef = useRef();
  const nextRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const messageEndRef = useRef();
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const is_shop = router.pathname === "/stores/[id]";
  const is_order = router.pathname === "/order-history";
  const shop_id = router.query.id;
  const { chats, currentChat, newMessage, roleId, messages } = useSelector(
    (state) => state.chat,
    shallowEqual
  );
  const user = useSelector((state) => state.user.data, shallowEqual);
  const groupMessages = useSelector(
    (state) => getMessages(state.chat),
    shallowEqual
  );

  const handleChat = (myChat) => {
    if (user && chats) {
      if (myChat) {
        dispatch(setCurrentChat(myChat));
      } else {
        createChat({
          shop_id: -1,
          roleId: is_shop ? shop_id : is_order ? roleId : "admin",
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            img: user.img,
          },
        });
      }
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, currentChat]);

  useEffect(() => {
    const myChat = chats
      .filter((item) => item?.user?.id == user.id)
      .find((item) =>
        is_shop
          ? item.roleId == shop_id
          : is_order
          ? item.roleId == roleId
          : item.roleId == "admin"
      );
    handleChat(myChat);
    console.log(myChat);
  }, []);

  function handleFile(event) {
    if (!SUPPORTED_FORMATS.includes(event.target.files[0].type)) {
      toast.error("Supported only image formats!");
    } else {
      setFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setUrl(reader.result);
          setModal(true);
        }
      };
      reader?.readAsDataURL(event.target.files[0]);
    }
  }

  const handleOnChange = (value) => {
    dispatch(setNewMessage(value));
  };

  const handleOnSubmit = (url) => {
    const isFile = url?.includes("https");
    const trimmedMessage = newMessage
      .replace(/\&nbsp;/g, "")
      .replace(/<[^>]+>/g, "")
      .trim();
    const payload = {
      chat_content: trimmedMessage,
      chat_id: currentChat?.id,
      sender: 1,
      unread: true,
      roleId: is_shop ? shop_id : is_order ? roleId : "admin",
    };
    if (isFile) payload.chat_img = url;
    if (trimmedMessage || isFile) {
      sendMessage(payload);
      batch(() => {
        dispatch(setNewMessage(""));
        dispatch(addMessage({ ...payload, status: "pending" }));
      });
      const topPosition = messageEndRef.current.offsetTop;
      const container = document.querySelector(
        ".message-list .scrollbar-container"
      );
      scrollTo(container, topPosition - 30, 600);
      setUrl("");
      setModal(false);
    }
  };

  const onAttachClick = () => {
    nextRef.current.click();
  };

  return (
    <div style={{ height: windowSize.width > 768 ? "93vh" : "80vh" }}>
      <input
        type="file"
        ref={nextRef}
        onChange={handleFile}
        accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/svg"
        className="d-none"
      />
      <MainContainer responsive className="chat-container rounded">
        <ChatContainer className="chat-container">
          <MessageList className="message-list">
            <Channel
              groupMessages={groupMessages}
              messageEndRef={messageEndRef}
            />
          </MessageList>
          <MessageInput
            ref={inputRef}
            value={newMessage}
            onChange={handleOnChange}
            onSend={handleOnSubmit}
            placeholder={tl("Message")}
            className="chat-input"
            attachButton={true}
            onAttachClick={onAttachClick}
          />
        </ChatContainer>
      </MainContainer>
      <UploadMedia
        modal={modal}
        url={url}
        setModal={setModal}
        file={file}
        handleOnSubmit={handleOnSubmit}
      />
    </div>
  );
}
