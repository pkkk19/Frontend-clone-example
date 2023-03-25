import React from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import '../../assets/scss/page/chat-icon.scss';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addMenu } from '../../redux/slices/menu';

const ChatIcons = () => {
  const dispatch = useDispatch();
  const decrement = (e) => dispatch(addMenu(e));
  const data = { name: 'Chat', url: 'chat', id: 99 };
  return (
    <NavLink onClick={() => decrement(data)} to='/chat' className='chat'>
      <IoChatbubbleEllipsesOutline className='chat-icon' />
    </NavLink>
  );
};

export default ChatIcons;
