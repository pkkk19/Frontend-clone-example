import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Card, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { fetchSellerOrders } from '../../../redux/slices/orders';
import formatSortType from '../../../helpers/formatSortType';
import SearchInput from '../../../components/search-input';
import { clearOrder } from '../../../redux/slices/order';
import numberToPrice from '../../../helpers/numberToPrice';
import { DebounceSelect } from '../../../components/search';
import userService from '../../../services/seller/user';
import FilterColumns from '../../../components/filter-column';

const { TabPane } = Tabs;

const statuses = [
  'all',
  'new',
  'accepted',
  'ready',
  'on_a_way',
  'delivered',
  'canceled',
];

export default function SellerOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );
  const { orders, meta, loading, params } = useSelector(
    (state) => state.orders,
    shallowEqual
  );

  const data = activeMenu?.data;

  const goToAddProduct = () => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        id: 'order-add',
        url: 'seller/orders/add',
        name: t('add.order'),
      })
    );
    navigate('/seller/orders/add');
  };

  const goToEdit = (row) => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        url: `seller/orders/${row.id}`,
        id: 'order_edit',
        name: t('edit.order'),
      })
    );
    navigate(`/seller/orders/${row.id}`);
  };

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `seller/order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/seller/order/details/${row.id}`);
  };
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: t('client'),
      is_show: true,
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          {user.firstname} {user.lastname}
        </div>
      ),
    },
    {
      title: t('number.of.products'),
      is_show: true,
      dataIndex: 'order_details_count',
      key: 'rate',
      render: (item) => (
        <div className='text-lowercase'>
          {item} {t('products')}
        </div>
      ),
    },
    {
      title: t('amount'),
      is_show: true,
      dataIndex: 'price',
      key: 'price',
      render: (price, row) => {
        const totalPrice = price;
        return numberToPrice(totalPrice, defaultCurrency.symbol);
      },
    },
    {
      title: t('payment.type'),
      is_show: true,
      dataIndex: 'transaction',
      key: 'transaction',
      render: (transaction) => t(transaction?.payment_system?.tag) || '-',
    },
    {
      title: t('created.at'),
      is_show: true,
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
              disabled={row.status === 'delivered' || row.status === 'canceled'}
            />
          </Space>
        );
      },
    },
  ]);

  function onChangePagination(pagination, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    const paramsData = {
      search: data?.search,
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
      user_id: data?.userId,
      status: data?.status === 'all' ? null : data?.status,
    };
    dispatch(fetchSellerOrders(paramsData));
  }, [activeMenu?.data]);

  useEffect(() => {
    if (activeMenu?.refetch) {
      const params = {
        status: data?.status === 'all' ? null : data?.status,
      };
      dispatch(fetchSellerOrders(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.getAll(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
      }));
    });
  }

  const onChangeTab = (status) => {
    dispatch(setMenuData({ activeMenu, data: { status } }));
  };

  return (
    <Card
      title={t('orders')}
      extra={
        <Space>
          <SearchInput
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
          />
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(user) => handleFilter(user.value, 'userId')}
            onDeselect={() => handleFilter(null, 'userId')}
            style={{ minWidth: 200 }}
          />
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddProduct}
          >
            {t('add.order')}
          </Button>
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Tabs onChange={onChangeTab} type='card' activeKey={data?.status}>
        {statuses.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={orders}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
      />
    </Card>
  );
}
