import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/components/product-categories.scss';
import { Card, Image, Table, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import getImage from '../../../helpers/getImage';
import CreateCategory from './createCategory';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchSellerCategory } from '../../../redux/slices/category';
import { disableRefetch } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import sellerCategory from '../../../services/seller/category';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';

export default function SellerCategories() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { categories, meta, loading } = useSelector(
    (state) => state.category,
    shallowEqual
  );
  const [columns, setColumns] = useState([
    {
      title: t('name'),
      is_show: true,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('image'),
      is_show: true,
      dataIndex: 'img',
      key: 'img',
      render: (img, row) => {
        return (
          <Image
            src={getImage(img)}
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
            key={img + row.id}
          />
        );
      },
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      dataIndex: 'options',
      render: (data, row) => {
        return (
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setId(row.id);
              setIsModalVisible(true);
            }}
          />
        );
      },
    },
  ]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerCategory({}));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchSellerCategory({ perPage: pageSize, page: current }));
  };

  const categoryDelete = () => {
    setLoadingBtn(true);
    sellerCategory
      .delete(id)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerCategory());
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  console.log('categories', categories);
  return (
    <Card
      title={t('categories')}
      extra={
        <Space>
          <Button
            size='small'
            type='primary'
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            {t('add.category')}
          </Button>
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={categories}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.key}
        onChange={onChangePagination}
        loading={loading}
      />
      {isModalOpen && (
        <CreateCategory handleCancel={handleCancel} isModalOpen={isModalOpen} />
      )}
      <CustomModal
        click={categoryDelete}
        text={t('delete.category')}
        loading={loadingBtn}
      />
    </Card>
  );
}
