import React from 'react';
import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  TimePicker,
} from 'antd';
import { DebounceSelect } from '../../components/search';
import TextArea from 'antd/es/input/TextArea';
import userService from '../../services/user';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AddressInput from '../../components/address-input';
import { AsyncSelect } from '../../components/async-select';
import groupService from '../../services/group';
import MediaUpload from '../../components/upload';
import DrawingMap from '../../components/drawing-map';

const ShopAddData = ({
  logoImage,
  setLogoImage,
  backImage,
  setBackImage,
  form,
  location,
  setLocation,
}) => {
  const { t } = useTranslation();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  async function fetchUserList(search) {
    const params = { search, 'roles[0]': 'user' };
    return userService.search(params).then((res) =>
      res.data.map((item) => ({
        label: item.firstname + ' ' + item.lastname,
        value: item.id,
      }))
    );
  }

  async function fetchGroup() {
    return groupService.getActive().then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title || 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Row gutter={36}>
      <Col span={8}>
        <Card>
          <Row>
            <Col span={12}>
              <Form.Item label={t('logo.image')}>
                {/* <ImageUploadSingle
                  type={'shops/logo'}
                  image={logoImage}
                  setImage={setLogoImage}
                  form={form}
                  name='logo_img'
                /> */}
                <MediaUpload
                  type='shops/logo'
                  imageList={logoImage}
                  setImageList={setLogoImage}
                  form={form}
                  multiple={false}
                  name='logo_img'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('background.image')}>
                {/* <ImageUploadSingle
                  type={'shops/background'}
                  image={backImage}
                  setImage={setBackImage}
                  form={form}
                  name='background_img'
                /> */}
                <MediaUpload
                  type='shops/background'
                  imageList={backImage}
                  setImageList={setBackImage}
                  form={form}
                  multiple={false}
                  name='background_img'
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='status' label={t('status')}>
                <Select disabled>
                  <Select.Option value='new'>{t('new')}</Select.Option>
                  <Select.Option value='edited'>{t('edited')}</Select.Option>
                  <Select.Option value='approved'>
                    {t('approved')}
                  </Select.Option>
                  <Select.Option value='rejected'>
                    {t('rejected')}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={t('status.note')} name='status_note'>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('visibility')}
                name='visibility'
                valuePropName='checked'
              >
                <Switch disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title={t('shop.working.hours')}>
          <Row>
            <Col span={24}>
              <Form.Item
                name='open_time'
                label={t('open.hours')}
                rules={[{ required: true, message: t('required') }]}
              >
                <TimePicker className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='close_time'
                label={t('close.hours')}
                rules={[{ required: true, message: t('required') }]}
              >
                <TimePicker className='w-100' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={16}>
        <Card title={t('general')}>
          <Row>
            <Col span={24}>
              {languages.map((item, idx) => (
                <Form.Item
                  key={'title' + idx}
                  label={t('title')}
                  name={`title[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                    { min: 2, message: t('title.requared') },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <Input />
                </Form.Item>
              ))}
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('seller')}
                name='user'
                rules={[{ required: true, message: t('required') }]}
              >
                <DebounceSelect fetchOptions={fetchUserList} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('group')}
                name='group_id'
                rules={[{ required: true, message: t('required') }]}
              >
                <AsyncSelect fetchOptions={fetchGroup} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('phone')}
                name='phone'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              {languages.map((item, idx) => (
                <Form.Item
                  key={'desc' + idx}
                  label={t('description')}
                  name={`description[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                    { min: 2, message: t('title.requared') },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <TextArea rows={4} />
                </Form.Item>
              ))}
            </Col>
          </Row>
        </Card>

        <Card title={t('order.info')}>
          <Row>
            <Col span={24}>
              <Form.Item
                label={t('min.amount')}
                name='min_amount'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('tax')}
                name='tax'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} addonAfter={'%'} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('admin.comission')}
                name='percentage'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' addonAfter={'%'} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Card title={t('address')}>
          <Row gutter={12}>
            <Col span={12}>
              {languages.map((item, idx) => (
                <AddressInput
                  setLocation={setLocation}
                  form={form}
                  item={item}
                  idx={idx}
                  key={idx}
                  defaultLang={defaultLang}
                />
              ))}
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('delivery.range')}
                name='delivery_range'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              {/* <DrawingMap /> */}
              <DrawingMap
                location={location}
                setLocation={setLocation}
                setAddress={(value) =>
                  form.setFieldsValue({ [`address[${defaultLang}]`]: value })
                }
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ShopAddData;
