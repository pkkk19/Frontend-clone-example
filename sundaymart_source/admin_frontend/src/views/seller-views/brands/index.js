import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/components/product-categories.scss';
import { Button, Card, Image, Table, Space } from 'antd';
import '../../../assets/scss/components/brand.scss';
import { useTranslation } from 'react-i18next';
import getImage from '../../../helpers/getImage';
import CreateBrand from './createBrand';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { disableRefetch } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchSellerBrands } from '../../../redux/slices/brand';
import CustomModal from '../../../components/modal';
import { toast } from 'react-toastify';
import { Context } from '../../../context/context';
import brandSellerService from '../../../services/seller/brand';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';

export default function Brands() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { brands, meta, loading } = useSelector(
    (state) => state.brand,
    shallowEqual
  );
  const [columns, setColumns] = useState([
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'title',
      key: 'title',
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
            height='auto'
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
      dispatch(fetchSellerBrands());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchSellerBrands({ perPage: pageSize, page: current }));
  };

  const brandsDelete = () => {
    setLoadingBtn(true);
    brandSellerService
      .delete(id)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerBrands());
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <Card
      title={t('brands')}
      extra={
        <Space>
          <Button
            size='small'
            type='primary'
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            {t('add.brand')}
          </Button>
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={brands}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      {isModalOpen && (
        <CreateBrand handleCancel={handleCancel} isModalOpen={isModalOpen} />
      )}
      <CustomModal
        click={brandsDelete}
        text={t('delete.brand')}
        loading={loadingBtn}
      />
    </Card>
  );
}
