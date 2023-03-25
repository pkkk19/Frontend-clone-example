import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Tag,
  Menu,
  Divider,
  DatePicker,
  Dropdown,
  Button,
} from 'antd';
import React from 'react';
import ChartWidget from '../../components/chart-widget';
import {
  BarChartOutlined,
  FilterOutlined,
  LineChartOutlined,
  MoreOutlined,
} from '@ant-design/icons';
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const ReportOverview = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const menu = (
    <Menu>
      <Menu.Item>item 1</Menu.Item>
      <Menu.Item>item 2</Menu.Item>
    </Menu>
  );
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
    {
      title: 'Products sold',
      qty: '0',
      percent: '0',
    },
    {
      title: 'Returns',
      qty: '0',
      percent: '0',
    },
    {
      title: 'Variation Sold',
      qty: '0',
      percent: '0',
    },
    {
      title: 'Views',
      qty: '0',
      percent: '0',
    },
  ];
  return (
    <>
      <Row gutter={24} className='mb-4'>
        <Col span={12}>
          <Space size='large'>
            <Dropdown overlay={menu}>
              <Button icon={<FilterOutlined />}>Filter by date range</Button>
            </Dropdown>
            <RangePicker />
          </Space>
        </Col>
      </Row>
      <Divider orientation='left'>Performance</Divider>
      <Row gutter={24}>
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
      </Row>
      <Row gutter={24} className='mb-2'>
        <Col span={20}>
          <Divider orientation='left'>Charts</Divider>
        </Col>
        <Col span={4}>
          <Dropdown overlay={menu}>
            <Button icon={<FilterOutlined />}>by date</Button>
          </Dropdown>
          <Divider type='vertical' style={{ height: '80%' }} />
          <Space>
            <LineChartOutlined style={{ fontSize: '18px' }} />
            <BarChartOutlined style={{ fontSize: '18px' }} />
            <MoreOutlined style={{ fontSize: '18px' }} />
          </Space>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Card title='Net Sales'>
            <ChartWidget />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Orders'>
            <ChartWidget />
          </Card>
        </Col>
      </Row>
      <Divider orientation='left'>Leaderboards</Divider>
      <Row gutter={24}>
        <Col span={12}>
          <Card title='Top categories - Items sold'>
            <Table columns={columns} dataSource={data} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Top products - Items sold'>
            <Table columns={columns} dataSource={data} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportOverview;
