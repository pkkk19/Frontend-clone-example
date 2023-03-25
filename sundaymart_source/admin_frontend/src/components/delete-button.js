import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function DeleteButton({ onClick, type = 'default', ...props }) {
  const { t } = useTranslation();

  const handleClick = () => {
    const isDemo = process.env.REACT_APP_IS_DEMO;
    if (isDemo === 'true') {
      toast.warning(t('cannot.work.demo'));
      return;
    }
    onClick();
  };

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={handleClick}
      type={type}
      {...props}
    />
  );
}
