import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import userService from '../../services/user';
import StatisticNumberWidget from './statisticNumberWidget';
import StatisticPriceWidget from './statisticPriceWidget';
import ChartWidget from '../../components/chart-widget';
import DonutChartWidget from '../../components/donutChartWidget';
import { COLORS } from '../../constants/ChartConstant';

export default function DeliverymanDashboard() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const { counts } = useSelector(
    (state) => state.statisticsCount,
    shallowEqual
  );

  useEffect(() => {
    userService.profileShow().then(({ data }) => setUserData(data));
  }, []);

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Row gutter={24}>
          <Col span={6}>
            <StatisticNumberWidget
              title={t('total.orders')}
              value={counts.orders_count}
            />
          </Col>
          <Col span={6}>
            <StatisticNumberWidget
              title={t('in.progress.orders')}
              value={counts.progress_orders_count}
            />
          </Col>
          <Col span={6}>
            <StatisticNumberWidget
              title={t('cancelled.orders')}
              value={counts.cancel_orders_count}
            />
          </Col>
          <Col span={6}>
            <StatisticNumberWidget
              title={t('delivered.orders')}
              value={counts.delivered_orders_count}
            />
          </Col>
          <Col span={24}>
            <Card>
              <Space>
                <div className='mr-5'>
                  <h2 className='font-weight-bold mb-1'>523,201</h2>
                  <p>
                    <Badge color={COLORS[6]} />
                    Store Customers
                  </p>
                </div>
                <div className='mr-5'>
                  <h2 className='font-weight-bold mb-1'>379,237</h2>
                  <p>
                    <Badge color={COLORS[0]} />
                    Online Customers
                  </p>
                </div>
                <div>
                  <h2 className='font-weight-bold mb-1'>379,237</h2>
                  <p>
                    <Badge color={COLORS[4]} />
                    Balance
                  </p>
                </div>
              </Space>
              <ChartWidget
                type='bar'
                card={false}
                xAxis={[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]}
                series={[
                  {
                    name: 'series-1',
                    data: [30, 40, 45, 50, 49, 60, 70, 91],
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <DonutChartWidget
          series={[3561, 1443]}
          labels={['Delivered — 73%', 'Canceled — 27%']}
          title='Delivered'
          customOptions={{
            colors: ['#45A524', '#DE1F36'],
          }}
          bodyClass='mb-2 mt-3'
          extra={
            <div className='mt-4 mx-auto'>
              <Space size='large'>
                <Space>
                  <div>
                    <Badge color={'#45A524'} />
                    <span className='text-gray-light'>{'Delivered'}</span>
                  </div>
                  <span className='font-weight-bold text-dark'>{75}</span>
                </Space>
                <Space>
                  <div>
                    <Badge color={'#DE1F36'} />
                    <span className='text-gray-light'>{'Canceled'}</span>
                  </div>
                  <span className='font-weight-bold text-dark'>{10}</span>
                </Space>
              </Space>
            </div>
          }
        />
        <ChartWidget
          type='line'
          xAxis={[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]}
          series={[
            {
              name: 'series-1',
              data: [30, 40, 45, 50, 49, 60, 70, 91],
            },
          ]}
        />
      </Col>
    </Row>
  );
}
