import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getTranslationFields from '../../../helpers/getTranslationFields';
import LanguageList from '../../../components/language-list';
import Map from '../../../components/map';
import getDefaultLocation from '../../../helpers/getDefaultLocation';
import { fetchBranch } from '../../../redux/slices/branch';
import branchService from '../../../services/seller/branch';
import AddressInput from "../../../components/address-input";

const SellerBranchAdd = () => {
  const { t } = useTranslation();
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const [location, setLocation] = useState(getDefaultLocation(settings));
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    const body = {
      title: getTranslationFields(languages, values, 'title'),
      address: getTranslationFields(languages, values, 'address'),
      longitude: location.lng,
      latitude: location.lat,
    };
    setLoadingBtn(true);
    const nextUrl = 'seller/branch';
    branchService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchBranch());
      })
      .finally(() => setLoadingBtn(false));
    console.log('body', body);
  };

  return (
    <Card title={t('add.branch')} className='h-100' extra={<LanguageList />}>
      <Form
        name='branch-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ clickable: true, ...activeMenu.data }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={12}>
          <Col span={12}>
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
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item, idx) => (
                <AddressInput
                    setLocation={setLocation}
                    form={form}
                    item={item}
                    idx={idx}
                    defaultLang={defaultLang}
                />
            ))}
          </Col>
          <Col span={24}>
            <Map
              location={location}
              setLocation={setLocation}
              setAddress={(value) =>
                form.setFieldsValue({ [`address[${defaultLang}]`]: value })
              }
            />
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
};

export default SellerBranchAdd;
