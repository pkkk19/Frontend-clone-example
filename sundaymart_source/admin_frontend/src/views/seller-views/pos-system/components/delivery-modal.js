import React, { useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import orderService from '../../../../services/seller/order';
import transactionService from '../../../../services/transaction';
import {
  calculateTotalCoupon,
  getCartData,
} from '../../../../redux/selectors/cartSelector';
import { setOrderData } from '../../../../redux/slices/order';
import axios from 'axios';
import { setCartOrder } from '../../../../redux/slices/cart';
import { StripeApi } from '../../../../configs/app-global';

export default function DeliveryModal({
  visibility,
  handleCancel,
  handleSave,
  handleOpenPayment,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const { cartShops, total, coupons, currency } = useSelector(
    (state) => state.cart,
    shallowEqual
  );
  const data = useSelector((state) => getCartData(state.cart));
  const { currencies } = useSelector((state) => state.currency, shallowEqual);
  const [form] = Form.useForm();
  const [delivery_fee, setDelivery_fee] = useState();
  const dispatch = useDispatch();
  const totalCoupon = useSelector((state) => calculateTotalCoupon(state.cart));

  const orderCreate = (body, paymentData) => {
    const payment = {
      payment_sys_id: paymentData.value,
    };
    setLoading(true);
    orderService
      .create(body)
      .then((response) => {
        dispatch(setCartOrder(response.data));
        if (paymentData.label === 'Stripe') {
          stripePay(response.data);
        } else if (paymentData.label === 'Paypal') {
          handleOpenPayment({ paypal: response.data });
          handleCancel();
        } else if (paymentData.label === 'Paystack') {
          handleOpenPayment({ paystack: response.data });
          handleCancel();
        } else if (paymentData.label === 'Razorpay') {
          handleOpenPayment({ razorpay: response.data });
          handleCancel();
        } else {
          createTransaction(response.data.id, payment);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  function createTransaction(id, data) {
    transactionService
      .create(id, data)
      .then((res) => {
        handleSave(res.data.id);
        form.resetFields();
      })
      .finally(() => setLoading(false));
  }

  const stripePay = (createdOrderData) => {
    if (
      data.paymentType.label === 'Stripe' &&
      Object.keys(createdOrderData)?.length
    ) {
      axios
        .post(StripeApi, {
          amount: createdOrderData.price,
          order_id: createdOrderData.id,
        })
        .then((res) => {
          handleOpenPayment({ stripe: res.data });
          handleCancel();
        })
        .catch((error) => console.log(error));
    }
  };

  const onFinish = (values) => {
    console.log('values data => ', values);
    const body = {
      delivery_address_id: data.address.value,
      payment_type: data.paymentType.value,
      user_id: data.user?.value,
      shop_id: shop.id,
      delivery_date: moment(values?.delivery_date).format('YYYY-MM-DD'),
      delivery_time: values?.delivery_time,
      delivery_fee: delivery_fee,
      currency_id: currency.id,
      coupon: coupons.coupon,
      delivery_type_id: values?.delivery.value,
      tax: total.order_tax,
      total: total.order_total + delivery_fee,
      rate: currencies.find((item) => item.id === currency.id)?.rate,
      products: cartShops[0].products?.map((product) => ({
        shop_product_id: product.id,
        price: product.price,
        qty: product.qty,
        tax: product.tax,
        discount: product.discount,
        total_price: product.total_price,
      })),
    };
    console.log('body => ', body);
    orderCreate(body, data.paymentType);
  };

  function getHours(shop) {
    const timeArray = [];
    let start = parseInt(shop?.open_time?.slice(0, 2));
    let end = parseInt(shop?.close_time?.slice(0, 2));
    for (start; start < end; start++) {
      timeArray.push({
        id: `${start}:00-${start + 1}:00`,
        value: `${start}:00 - ${start + 1}:00`,
      });
    }
    return timeArray;
  }

  function formatDeliveries(list) {
    return list.map((item) => ({
      label: item.translation?.title,
      value: item.id,
    }));
  }

  const setDeliveryPrice = (delivery) => {
    const item = shop.deliveries.find((el) => el.id === delivery.value);
    dispatch(setOrderData({ delivery_fee: item.price }));
    setDelivery_fee(item.price);
  };

  console.log('shop', shop);
  return (
    <Modal
      visible={visibility}
      title={t('shipping.info')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
      className='large-modal'
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        {loading && (
          <div className='loader'>
            <Spin />
          </div>
        )}
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name='delivery'
              label={t('delivery')}
              rules={[{ required: true, message: t('required') }]}
            >
              <Select
                options={formatDeliveries(shop.deliveries)}
                labelInValue
                onSelect={setDeliveryPrice}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name='delivery_date'
                  label={t('delivery.date')}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={t('delivery.date')}
                    className='w-100'
                    disabledDate={(current) =>
                      moment().add(-1, 'days') >= current
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={`${t('delivery.time')} (${t('up.to')})`}
                  name='delivery_time'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Select options={getHours(shop)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('delivery.fee')} name='delivery_fee' hidden>
                  <InputNumber min={0} className='w-100' />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
