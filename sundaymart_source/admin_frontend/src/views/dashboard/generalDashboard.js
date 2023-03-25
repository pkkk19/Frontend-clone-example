import { Alert, Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import OrderChart from './orderChart';
import SalesChart from './salesChart';
import StatisticNumberWidget from './statisticNumberWidget';
import StatisticPriceWidget from './statisticPriceWidget';
import TopCustomers from './topCustomers';
import TopProducts from './topProducts';

export default function GeneralDashboard() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { counts } = useSelector(
    (state) => state.statisticsCount,
    shallowEqual
  );
  const { subscription } = useSelector(
    (state) => state.myShop.myShop,
    shallowEqual
  );

  return (
    <div>
      {subscription && user?.role === 'seller' && (
        <Alert
          message={
            <div>
              {t('your.current.subscription')}{' '}
              <span className='font-weight-bold'>{subscription.type}</span>{' '}
              {t('will.expire.at')} {subscription.expired_at}
            </div>
          }
          type='info'
        />
      )}
      <Row gutter={16} className='mt-3'>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('new.orders')}
            value={counts.count_new_orders}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('cancelled.orders')}
            value={counts.count_canceled_orders}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('delivered.orders')}
            value={counts.count_delivered_orders}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('out.of.stock.products')}
            value={counts.count_out_of_stock_product}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('total.products')}
            value={counts.count_product}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('order.reviews')}
            value={counts.reviews}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('accepted.orders')}
            value={counts.count_accepted_orders}
          />
        </Col>
        <Col flex='0 0 12.5%'>
          <StatisticNumberWidget
            title={t('on.a.way.orders')}
            value={counts.count_on_a_way_orders}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
          <StatisticPriceWidget
            title={t('total.earned')}
            value={counts.total_earned}
            subtitle={t('last.30.days')}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
          <StatisticPriceWidget
            title={t('delivery.earning')}
            value={counts.delivery_earned}
            subtitle={t('last.30.days')}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
          <StatisticPriceWidget
            title={t('total.order.tax')}
            value={counts.tax_earned}
            subtitle={t('last.30.days')}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
          <StatisticPriceWidget
            title={t('total.comission')}
            value={counts.commission_fee}
            subtitle={t('last.30.days')}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <OrderChart />
        </Col>
        <Col span={12}>
          <TopCustomers />
        </Col>
        <Col span={12}>
          <TopProducts />
        </Col>
        <Col span={12} >
          <SalesChart />
        </Col>
      </Row>
    </div>
  );
}
