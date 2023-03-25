import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Tag,
  Button,
  Checkbox,
  Dropdown,
  Menu,
  Divider,
  DatePicker,
} from 'antd';
import React from 'react';
import SearchInput from '../../components/search-input';
import {
  CloudDownloadOutlined,
  MoreOutlined,
  DownOutlined,
  LineChartOutlined,
  BarChartOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import ChartWidget from '../../components/chart-widget';
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const ReportStock = () => {
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
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='http://www.alipay.com/'
        >
          1st menu item
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Row gutter={24} className='mb-4'>
        <Col span={6}>
          <Dropdown overlay={menu}>
            <Button style={{ width: '100%' }} icon={<FilterOutlined />}>
              Filter by date range
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Row gutter={24} className='align-items-center mb-2'>
              <Col span={21}>
                <Title level={2} className='mb-0'>
                  Stock
                </Title>
              </Col>
              <Col span={3}>
                <Space>
                  <Button icon={<CloudDownloadOutlined />}>Download</Button>
                  <MoreOutlined style={{ fontSize: '26px' }} />
                </Space>
              </Col>
            </Row>
            <Table columns={columns} dataSource={data} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportStock;
