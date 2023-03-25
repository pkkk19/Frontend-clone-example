import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Switch, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import GlobalContainer from '../../../components/global-container';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { fetchShopBonus } from '../../../redux/slices/shop-bonus';
import moment from 'moment';
import shopBonusService from '../../../services/seller/shopBonus';
import DeleteButton from '../../../components/delete-button';

const ShopBonus = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { shopBonus, meta, loading } = useSelector(
    (state) => state.shopBonus,
    shallowEqual
  );
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('order.amount'),
      is_show: true,
      dataIndex: 'order_amount',
      key: 'order_amount',
    },
    {
      title: t('bonus.product'),
      is_show: true,
      dataIndex: 'shop_product',
      key: 'shop_product',
      render: (shop_product, row) => {
        return <>{row.shop_product?.product?.translation?.title}</>;
      },
    },
    {
      title: t('active'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => {
        return (
          <Switch
            key={row.id + status}
            onChange={() => {
              setIsModalVisible(true);
              setActiveId(row.id);
              setType(true);
            }}
            checked={status}
          />
        );
      },
    },
    {
      title: t('expired.at'),
      is_show: true,
      dataIndex: 'expired_at',
      key: 'expired_at',
      render: (expired_at) => (
        <div>
          {moment(new Date()).isBefore(expired_at) ? (
            <Tag color='blue'>{expired_at}</Tag>
          ) : (
            <Tag color='error'>{expired_at}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      dataIndex: 'options',
      render: (data, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => goToEdit(row)}
          />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId(row.id);
              setType(false);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/shop-bonus/${row.id}`,
        id: 'bonus_edit',
        name: t('edit.bonus'),
      })
    );
    navigate(`/seller/shop-bonus/${row.id}`);
  };

  const bannerDelete = () => {
    setLoadingBtn(true);
    shopBonusService
      .delete(id)
      .then(() => {
        dispatch(fetchShopBonus());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  const handleActive = () => {
    setLoadingBtn(true);
    shopBonusService
      .setActive(activeId)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchShopBonus());
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShopBonus());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchShopBonus({ perPage: pageSize, page: current }));
  };

  console.log('bonus', shopBonus);
  return (
    <GlobalContainer
      headerTitle={t('bonus')}
      navLInkTo={'/seller/shop-bonus/add'}
      buttonTitle={t('add.bonus')}
      setColumns={setColumns}
      columns={columns}
    >
      <Table
        columns={columns.filter((items) => items.is_show)}
        dataSource={shopBonus}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={type ? handleActive : bannerDelete}
        text={type ? t('set.active.bonus') : t('delete.bonus')}
        loading={loadingBtn}
      />
    </GlobalContainer>
  );
};

export default ShopBonus;
