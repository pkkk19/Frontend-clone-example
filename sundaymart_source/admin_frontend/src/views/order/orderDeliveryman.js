import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import orderService from '../../services/order';
import { setRefetch } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { AsyncSelect } from '../../components/async-select';
import userService from '../../services/user';

export default function OrderDeliveryman({ orderDetails: data, handleCancel }) {
  console.log('OrderDeliveryman', data);
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    const params = { deliveryman: values.deliveryman.value };
    setLoading(true);
    orderService
      .updateDelivery(data.id, params)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  async function fetchDelivery() {
    const params = {
      page: 1,
      perPage: 10,
      role: 'deliveryman',
    };
    return userService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.firstname + " " +item.lastname || 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Modal
      visible={!!data}
      onCancel={handleCancel}
      footer={[
        <Button
          key='saveBtn'
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button key='cancelBtn' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ deliveryman: data.deliveryman?.id }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('deliveryman')}
              name='deliveryman'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <AsyncSelect fetchOptions={fetchDelivery} className='w-100' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
