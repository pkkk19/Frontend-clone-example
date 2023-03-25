import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../../redux/slices/menu';
import discountService from '../../../services/seller/discount';
import { fetchDiscounts } from '../../../redux/slices/discount';
import { DebounceSelect } from '../../../components/search';
import productService from '../../../services/seller/product';
import { useTranslation } from 'react-i18next';
import ImageUploadSingle from '../../../components/image-upload-single';

export default function DiscountAdd() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [hasDate, setHasDate] = useState(activeMenu.data?.has_date);
  const [image, setImage] = useState(activeMenu.data?.image || null);

  useEffect(() => {
    return () => {
      const values = form.getFieldsValue(true);
      const start = JSON.stringify(values.start);
      const end = JSON.stringify(values.end);
      const data = { ...values, start, end };
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    const body = {
      price: values.price,
      type: values.type,
      products: values.products.map((item) => item.value),
      start: values.start
        ? moment(values.start).format('YYYY-MM-DD')
        : undefined,
      end: values.end ? moment(values.end).format('YYYY-MM-DD') : undefined,
      images: [image?.name],
    };
    setLoadingBtn(true);
    const nextUrl = 'seller/discounts';
    discountService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchDiscounts({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  async function fetchProducts(search) {
    const params = { search };
    return productService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.product.translation?.title,
        value: item.id,
      }))
    );
  }

  const getInitialValues = () => {
    const data = activeMenu.data;
    if (!activeMenu.data?.start) {
      return data;
    }
    const start = activeMenu.data.start;
    const end = activeMenu.data.end;
    return {
      ...data,
      start: moment(start, 'YYYY-MM-DD'),
      end: moment(end, 'YYYY-MM-DD'),
    };
  };

  const handleChange = (event) => {
    setHasDate(event.target.checked);
  };

  return (
    <Card title={t('add.discount')} className='h-100'>
      <Form
        name='discount-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ ...getInitialValues() }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('type')}
              name={'type'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select>
                <Select.Option value='fix'>{t('fix')}</Select.Option>
                <Select.Option value='percent'>{t('percent')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('price')}
              name='price'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <InputNumber min={0} className='w-100' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('image')}
              name='image'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <ImageUploadSingle
                form={form}
                image={image}
                setImage={setImage}
                name='image'
                type='discounts'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name='has_date' valuePropName='checked'>
              <Checkbox checked={hasDate} onChange={handleChange}>
                {t('choose.discount.date')}
              </Checkbox>
            </Form.Item>
          </Col>
          {hasDate && (
            <>
              <Col span={6}>
                <Form.Item
                  label={t('start.date')}
                  name='start'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <DatePicker
                    className='w-100'
                    placeholder=''
                    disabledDate={(current) =>
                      moment().add(-1, 'days') >= current
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t('end.date')}
                  name='end'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <DatePicker
                    className='w-100'
                    placeholder=''
                    disabledDate={(current) =>
                      moment().add(-1, 'days') >= current
                    }
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={24}>
            <Form.Item
              label={t('products')}
              name='products'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect fetchOptions={fetchProducts} mode='multiple' />
            </Form.Item>
          </Col>
        </Row>
        <div className='flex-grow-1 d-flex flex-column justify-content-end'>
          <div className='pb-5'>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('submit')}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}
