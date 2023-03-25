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
import bonusService from '../../../services/seller/bonus';
import { fetchBonus } from '../../../redux/slices/product-bonus';
import moment from 'moment';
import DeleteButton from '../../../components/delete-button';

const ProductBonus = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { bonus, meta, loading } = useSelector(
    (state) => state.bonus,
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
      title: t('bonus.product'),
      is_show: true,
      dataIndex: 'bonus_product',
      key: 'bonus_product',
      render: (bonus_product, row) => {
        return <>{row.bonus_product.product.translation.title}</>;
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
        url: `seller/product-bonus/${row.id}`,
        id: 'bonus_edit',
        name: t('edit.bonus'),
      })
    );
    navigate(`/seller/product-bonus/${row.id}`);
  };

  const bannerDelete = () => {
    setLoadingBtn(true);
    bonusService
      .delete(id)
      .then(() => {
        dispatch(fetchBonus());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  const handleActive = () => {
    setLoadingBtn(true);
    bonusService
      .setActive(activeId)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchBonus());
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBonus());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchBonus({ perPage: pageSize, page: current }));
  };

  return (
    <GlobalContainer
      headerTitle={t('bonus')}
      navLInkTo={'/seller/product-bonus/add'}
      buttonTitle={t('add.bonus')}
      setColumns={setColumns}
      columns={columns}
    >
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={bonus}
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

export default ProductBonus;
