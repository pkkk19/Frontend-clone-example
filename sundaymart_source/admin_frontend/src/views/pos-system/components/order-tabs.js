import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Select, Space, Spin } from 'antd';
import '../../../assets/scss/components/pos-tabs.scss';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from '../../../components/search';
import {
  CloseOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import userService from '../../../services/user';
import { isArray } from 'lodash';
import {
  addBag,
  removeBag,
  setCartCurrency,
  setCartData,
  setCurrentBag,
} from '../../../redux/slices/cart';
import { AsyncSelect } from '../../../components/async-select';
import { getCartData } from '../../../redux/selectors/cartSelector';
import PosUserModal from './pos-user-modal';
import PosUserAddress from './pos-user-address';

export default function OrderTabs() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { currencies, loading } = useSelector(
    (state) => state.currency,
    shallowEqual
  );
  const { currentBag, bags, currency } = useSelector(
    (state) => state.cart,
    shallowEqual
  );
  const data = useSelector((state) => getCartData(state.cart));
  const { payments } = useSelector((state) => state.payment, shallowEqual);

  const [users, setUsers] = useState([]);
  const [refetchAddresses, setRefetchAddresses] = useState(false);
  const [addressModal, setAddressModal] = useState(null);
  const [userModal, setUserModal] = useState(null);
  const cartData = useSelector((state) => getCartData(state.cart));
  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.search(params).then(({ data }) => {
      setUsers(data);
      return formatUser(data);
    });
  }

  function formatUser(data) {
    if (!data) return;
    if (isArray(data)) {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
      }));
    } else {
      return {
        label: `${data.firstname} ${data.lastname}`,
        value: data.id,
      };
    }
  }

  async function fetchUser(uuid) {
    if (!uuid) return [];
    setRefetchAddresses(false);
    return userService.getById(uuid).then(({ data }) =>
      data.addresses.map((item) => ({
        label: item.address,
        value: item.id,
      }))
    );
  }

  function selectUser(userObj) {
    const user = users.find((item) => item.id === userObj.value);
    dispatch(
      setCartData({
        user: userObj,
        userUuid: user.uuid,
        bag_id: currentBag,
        userOBJ: user,
      })
    );
    form.setFieldsValue({ address: null });
    setRefetchAddresses(true);
  }

  const goToAddClient = () => setUserModal(true);

  const goToAddClientAddress = () => {
    if (!data.userUuid) {
      toast.warning(t('please.select.client'));
      return;
    }
    setAddressModal(data.userUuid);
  };

  const closeTab = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(removeBag(item));
  };

  function selectCurrency(item) {
    const currentCurrency = currencies.find((el) => el.id === item.value);
    dispatch(setCartCurrency(currentCurrency));
  }

  useEffect(() => {
    if (!currency) {
      const currentCurrency = currencies.find((item) => item.default) || {};
      const formCurrency = {
        label: `${currentCurrency?.title} (${currentCurrency?.symbol})`,
        value: currentCurrency?.id,
      };
      dispatch(setCartCurrency(currentCurrency));
      form.setFieldsValue({
        currency: formCurrency,
      });
    } else {
      const formCurrency = {
        label: `${currency.title} (${currency.symbol})`,
        value: currency.id,
      };
      form.setFieldsValue({
        currency: formCurrency,
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      user: data.user || null,
      payment_type: data.paymentType || null,
      address: data.address || null,
    });
  }, [currentBag]);

  return (
    <div className='order-tabs'>
      <div className='tabs-container'>
        <div className='tabs'>
          {bags.map((item) => (
            <div
              key={'tab' + item}
              className={item === currentBag ? 'tab active' : 'tab'}
              onClick={() => dispatch(setCurrentBag(item))}
            >
              <Space>
                <ShoppingCartOutlined />
                <span>
                  {t('bag')} - {item}
                </span>
                {item && item === currentBag ? (
                  <CloseOutlined
                    onClick={(event) => closeTab(event, item)}
                    className='close-button'
                    size={12}
                  />
                ) : (
                  ''
                )}
              </Space>
            </div>
          ))}
        </div>
        <Button
          size='small'
          type='primary'
          shape='circle'
          icon={<PlusOutlined />}
          className='tab-add-button'
          onClick={() => dispatch(addBag({ shop: cartData.shop }))}
        />
      </div>
      <Card className={!!currentBag ? '' : 'tab-card'}>
        {loading && (
          <div className='loader'>
            <Spin />
          </div>
        )}
        <Form
          layout='vertical'
          name='pos-form'
          form={form}
          initialValues={{
            user: data.user || null,
            address: data.address || null,
            currency: currency || undefined,
            payment_type: data.paymentType || null,
            deliveries: data.deliveries,
          }}
        >
          <Row gutter={6} style={{ marginBottom: 15 }}>
            <Col span={9}>
              <Form.Item
                name='user'
                rules={[{ required: true, message: '' }]}
                className='w-100'
              >
                <DebounceSelect
                  placeholder={t('select.client')}
                  fetchOptions={getUsers}
                  onSelect={selectUser}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button icon={<UserAddOutlined />} onClick={goToAddClient} />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                name='address'
                rules={[{ required: true, message: '' }]}
              >
                <AsyncSelect
                  fetchOptions={() => fetchUser(data.userUuid)}
                  onSelect={(address) =>
                    dispatch(setCartData({ address, bag_id: currentBag }))
                  }
                  refetch={refetchAddresses}
                  className='w-100'
                  placeholder={t('select.address')}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={goToAddClientAddress}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='currency'
                rules={[{ required: true, message: 'missing_currency' }]}
              >
                <Select
                  placeholder={t('select.currency')}
                  onSelect={selectCurrency}
                  labelInValue
                >
                  {currencies.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
                      {`${item.title} (${item.symbol})`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='payment_type'
                rules={[{ required: true, message: t('missing.payment.type') }]}
              >
                <Select
                  placeholder={t('select.payment.type')}
                  labelInValue
                  onSelect={(paymentType) =>
                    dispatch(setCartData({ paymentType, bag_id: currentBag }))
                  }
                >
                  {payments
                    .filter((item) => item.shop_id === data?.shop?.value)
                    .filter(
                      (el) =>
                        el.payment.tag === 'cash' || el.payment.tag === 'wallet'
                    )
                    .map((item, index) => (
                      <Select.Option key={index} value={item.id}>
                        {item.payment?.tag}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      {addressModal && (
        <PosUserAddress
          uuid={addressModal}
          handleCancel={() => setAddressModal(null)}
          refetch={setRefetchAddresses}
        />
      )}
      {userModal && (
        <PosUserModal
          visible={userModal}
          handleCancel={() => setUserModal(false)}
        />
      )}
    </div>
  );
}
