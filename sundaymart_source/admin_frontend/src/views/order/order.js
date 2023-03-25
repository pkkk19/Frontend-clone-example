import React, { useEffect, useState } from 'react';
import {
  Button,
  Space,
  Table,
  Card,
  Tabs,
  Tag,
  Row,
  Col,
  Typography,
  DatePicker,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CloudDownloadOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import download from 'downloadjs';
import useDidUpdate from '../../helpers/useDidUpdate';
import { fetchOrders } from '../../redux/slices/orders';
import formatSortType from '../../helpers/formatSortType';
import SearchInput from '../../components/search-input';
import { clearOrder } from '../../redux/slices/order';
import numberToPrice from '../../helpers/numberToPrice';
import { DebounceSelect } from '../../components/search';
import userService from '../../services/user';
import exportService from '../../services/export';
import OrderStatusModal from './orderStatusModal';
import OrderDeliveryman from './orderDeliveryman';
import FilterColumns from '../../components/filter-column';
const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const statuses = [
  'all',
  'new',
  'accepted',
  'ready',
  'on_a_way',
  'delivered',
  'canceled',
];

export default function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );
  const [downloading, setDownloading] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);

  const goToEdit = (row) => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        url: `order/${row.id}`,
        id: 'order_edit',
        name: t('edit.order'),
      })
    );
    navigate(`/order/${row.id}`);
  };

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/order/details/${row.id}`);
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
          {user?.firstname} {user?.lastname}
        </div>
      ),
    },
    {
      title: t('number.of.products'),
      is_show: true,
      dataIndex: 'order_details_count',
      key: 'order_details_count',
      render: (order_details_count) => (
        <div className='text-lowercase'>
          {order_details_count} {t('products')}
        </div>
      ),
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {status !== 'delivered' && status !== 'canceled' ? (
            <EditOutlined onClick={() => setOrderDetails(row)} />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: t('deliveryman'),
      is_show: true,
      dataIndex: 'deliveryman',
      key: 'deliveryman',
      render: (deliveryman, row) => (
        <div>
          {row.status === 'ready' ? (
            <Button type='link' onClick={() => setOrderDeliveryDetails(row)}>
              <Space>
                {deliveryman
                  ? `${deliveryman.firstname} ${deliveryman.lastname}`
                  : t('add.deliveryman')}
                <EditOutlined />
              </Space>
            </Button>
          ) : (
            <div>
              {deliveryman?.firstname} {deliveryman?.lastname}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('amount'),
      is_show: true,
      dataIndex: 'price',
      key: 'price',
      render: (price) => numberToPrice(price, defaultCurrency.symbol),
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
            <Button
              icon={<DownloadOutlined />}
              loading={downloading === row.id}
              onClick={() => getInvoiceFile(row.id)}
            />
          </Space>
        );
      },
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { orders, meta, loading, params } = useSelector(
    (state) => state.orders,
    shallowEqual
  );
  const data = activeMenu?.data;

  function onChangePagination(pagination, filters, sorter) {
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
      status: data?.status,
    };
    dispatch(fetchOrders(paramsData));
  }, [activeMenu?.data]);

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
    return userService.search(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
      }));
    });
  }

  const goToAddProduct = () => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        id: 'order-add',
        url: 'order/add',
        name: t('add.order'),
      })
    );
    navigate('/order/add');
  };

  const onChangeTab = (status) => {
    const orderStatus = status === 'all' ? undefined : status;
    dispatch(setMenuData({ activeMenu, data: { status: orderStatus } }));
  };

  function getInvoiceFile(id) {
    setDownloading(id);
    exportService
      .orderExport(id)
      .then((res) => {
        download(res, `invoice_${id}.pdf`, 'application/pdf');
      })
      .finally(() => setDownloading(null));
  }

  const handleCloseModal = () => {
    setOrderDetails(null);
    setOrderDeliveryDetails(null);
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      const params = {
        status: data?.status === 'all' ? null : data?.status,
        page: data?.page,
        perPage: 10,
      };
      dispatch(fetchOrders(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);
  const performance = [
    {
      title: 'Total sales',
      qty: '0',
      percent: '0',
    },
    {
      title: 'Not sales',
      qty: '0',
      percent: '0',
    },
    {
      title: 'Orders',
      qty: '0',
      percent: '0',
    },
    {
      title: 'Average order values',
      qty: '0',
      percent: '0',
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <>
      {/* <Row gutter={24} className='report-products'>
        {performance?.map((item, key) => {
          return (
            <Col span={6}>
              <Card>
                <Row className='mb-5'>
                  <Col>
                    <Text>{item.title}</Text>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Title level={2}>{item.qty}</Title>
                  </Col>
                  <Col span={12} className='d-flex justify-content-end'>
                    <Tag color='geekblue' className='d-flex align-items-center'>
                      {`${item.percent} %`}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row> */}
      <Card
        title={t('orders')}
        extra={
          <Space>
            {/* <RangePicker /> */}
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
            {/* <Button
              icon={<CloudDownloadOutlined />}
              loading={downloading}
              onClick={excelExport}
            >
              Download
            </Button> */}
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
          // rowSelection={rowSelection}
        />
        {orderDetails && (
          <OrderStatusModal
            orderDetails={orderDetails}
            handleCancel={handleCloseModal}
          />
        )}
        {orderDeliveryDetails && (
          <OrderDeliveryman
            orderDetails={orderDeliveryDetails}
            handleCancel={handleCloseModal}
          />
        )}
      </Card>
    </>
  );
}
