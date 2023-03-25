import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import GlobalContainer from '../../components/global-container';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { toast } from 'react-toastify';
import couponService from '../../services/coupon';
import { useDispatch } from 'react-redux';
import { addMenu } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DeleteButton from '../../components/delete-button';

const Coupon = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
    },
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'title',
      render: (item, row) => row.translation?.title,
    },
    {
      title: t('name'),
      is_show: true,
      dataIndex: 'name',
    },
    {
      title: t('type'),
      is_show: true,
      dataIndex: 'type',
    },
    {
      title: t('price'),
      is_show: true,
      dataIndex: 'price',
    },
    {
      title: t('quantity'),
      is_show: true,
      dataIndex: 'qty',
    },
    {
      title: t('expired.at'),
      is_show: true,
      dataIndex: 'expired_at',
      render: (expired_at) => moment(expired_at).format('YYYY-MM-DD'),
    },
    {
      title: t('options'),
      is_show: true,
      dataIndex: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setCouponId(row.id);
                setIsModalVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);
  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `coupon/${row.id}`,
        id: 'coupon_edit',
        name: t('edit.coupon'),
      })
    );
    navigate(`/coupon/${row.id}`);
  };

  const [pageSize, setPageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { setIsModalVisible } = useContext(Context);
  const [couponId, setCouponId] = useState(null);

  function deleteCoupon() {
    couponService.delete(couponId).then(() => {
      toast.success(t('successfully.deleted'));
      setCouponId(null);
      setIsModalVisible(false);
      fetchCoupons();
    });
  }

  function fetchCoupons() {
    setLoading(true);
    const params = {
      page: pageCurrent,
      perPage: pageSize,
    };
    couponService
      .getAll(params)
      .then((res) => {
        setData(res.data);
        setTotal(res.meta.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onChangePagination = (pageNumber) => {
    setPageSize(pageNumber.pageSize);
    setPageCurrent(pageNumber.current);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <GlobalContainer
      headerTitle={t('coupons')}
      navLInkTo={'/coupon/add'}
      buttonTitle={t('add.coupon')}
      columns={columns}
      setColumns={setColumns}
    >
      <Table
        columns={columns?.filter((items) => items.is_show)}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={{
          pageSize: pageSize,
          page: pageCurrent,
          total: total,
        }}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal click={deleteCoupon} text={t('delete.coupon')} />
    </GlobalContainer>
  );
};

export default Coupon;
