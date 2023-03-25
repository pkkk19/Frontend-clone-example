import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from '../../../components/search';
import { useNavigate } from 'react-router-dom';
import productService from '../../../services/seller/product';
import { addMenu } from '../../../redux/slices/menu';
import { useDispatch } from 'react-redux';

export default function SelectProduct({ isModalOpen, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `/seller/product/add/${row}`,
        id: 'seller-product-add',
        name: t('seller.product.add'),
      })
    );
    navigate(`/seller/product/add/${row}`);
  };

  const onFinish = (values) => {
    if (values.title) {
      goToShow(values.title.value);
    } else {
      goToShow(values.qr_code.value);
    }
    handleCancel();
  };

  async function fetchCategoriesTitle(search) {
    setLoading(true);
    const params = { search, perPage: 10 };
    return productService
      .search(params)
      .then(({ data }) =>
        data.map((item) => ({
          label: item.translation?.title,
          value: item?.uuid,
        }))
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  async function fetchCategoriesQrCode(qr_code) {
    const params = { qr_code, perPage: 10 };
    return productService
      .search(params)
      .then(({ data }) =>
        data.map((item) => ({
          label: item.qr_code,
          value: item?.uuid,
        }))
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  const gotoNewPage = () => {
    const nextUrl = 'seller/product/add';
    dispatch(
      addMenu({
        url: `/${nextUrl}`,
        id: 'seller-new-product-add',
        name: t('add.new.product'),
      })
    );
    navigate(`/${nextUrl}`);
  };

  // useEffect(() => {
  //     window.addEventListener('scroll', handleScroll);
  //     return () => {
  //         window.removeEventListener('scroll', handleScroll);
  //     };
  // });

  // const handleScroll = () => {
  //     const lastProductLoaded = document.querySelector(
  //         '.products_row > .products_item:last-child'
  //     );
  //     if (lastProductLoaded) {
  //         const lastProductLoadedOffset =
  //             lastProductLoaded.offsetTop + lastProductLoaded.clientHeight;
  //         const pageOffset = window.pageYOffset + window.innerHeight;
  //         if (pageOffset > lastProductLoadedOffset) {
  //             if (lastPage > page) {
  //                 if (!loading) {
  //                     setPage(page + 1);
  //                 }
  //             }
  //         }
  //     }
  // };

  return (
    <Modal
      visible={isModalOpen}
      title={t('add.product')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' key={'newSaveBtn'} onClick={() => gotoNewPage()}>
          {t('add.new.product')}
        </Button>,
        <Button type='primary' key={'saveBtn'} onClick={() => form.submit()}>
          {t('create')}
        </Button>,
        <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='add-product'
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name='title' label={t('search.product.title')}>
          <DebounceSelect
            placeholder={t('search.product.title')}
            fetchOptions={fetchCategoriesTitle}
            style={{ minWidth: 150 }}
            loading={loading}
          />
        </Form.Item>
        <Form.Item name='qr_code' label={t('search.product.qr_code')}>
          <DebounceSelect
            placeholder={t('search.product.qr_code')}
            fetchOptions={fetchCategoriesQrCode}
            style={{ minWidth: 150 }}
            loading={loading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
