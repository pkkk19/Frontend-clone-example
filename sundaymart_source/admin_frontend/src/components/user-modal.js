import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import userService from '../services/user';
import ImageUploadSingle from './image-upload-single';
import Loading from './loading';
import moment from 'moment';
import createImage from '../helpers/createImage';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/auth';

export default function UserModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  function fetchProfile() {
    setLoading(true);
    userService
      .profileShow()
      .then((res) => {
        const obj = {
          ...res.data,
          birthday: moment(res.data.birthday),
          image: createImage(res.data.img),
        };
        setImage(obj.image);
        setData(obj);
        console.log('obj => ', obj);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const onFinish = (values) => {
    console.log('values => ', values);
    const payload = {
      ...values,
      birthday: moment(values.birthday).format('YYYY-MM-DD'),
      images: [image?.name],
      phone: undefined,
      email: undefined,
    };
    setLoadingBtn(true);
    userService
      .profileUpdate(payload)
      .then((res) => {
        dispatch(updateUser(res.data));
        handleCancel();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('edit.profile')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <Form
          layout='vertical'
          name='lang-form'
          form={form}
          onFinish={onFinish}
          initialValues={{ ...data }}
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item label={t('avatar')}>
                <ImageUploadSingle
                  type='users'
                  image={image}
                  setImage={setImage}
                  form={form}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('firstname')}
                name='firstname'
                help={error?.firstname ? error.firstname[0] : null}
                validateStatus={error?.firstname ? 'error' : 'success'}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('lastname')}
                name='lastname'
                help={error?.lastname ? error.lastname[0] : null}
                validateStatus={error?.lastname ? 'error' : 'success'}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('phone')}
                name='phone'
                help={error?.phone ? error.phone[0] : null}
                validateStatus={error?.phone ? 'error' : 'success'}
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('email')}
                name='email'
                help={error?.email ? error.email[0] : null}
                validateStatus={error?.email ? 'error' : 'success'}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input type='email' disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('birthday')}
                name='birthday'
                rules={[{ required: true, message: t('required') }]}
              >
                <DatePicker
                  className='w-100'
                  placeholder=''
                  disabledDate={(current) => moment().add(0, 'days') <= current}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('gender')}
                name='gender'
                rules={[{ required: true, message: t('required') }]}
              >
                <Select picker='dayTime' className='w-100'>
                  <Select.Option value='male'>{t('male')}</Select.Option>
                  <Select.Option value='female'>{t('female')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('password')}
                name='password'
                help={error?.password ? error.password[0] : null}
                validateStatus={error?.password ? 'error' : 'success'}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input.Password
                  type='password'
                  className='w-100'
                  disabled={process.env.REACT_APP_IS_DEMO === 'true'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('password.confirmation')}
                help={
                  error?.password_confirmation
                    ? error.password_confirmation[0]
                    : null
                }
                validateStatus={
                  error?.password_confirmation ? 'error' : 'success'
                }
                name='password_confirmation'
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(t('two.passwords.dont.match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  type='password'
                  disabled={process.env.REACT_APP_IS_DEMO === 'true'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
