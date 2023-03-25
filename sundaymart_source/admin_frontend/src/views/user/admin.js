import React, { useEffect, useState } from 'react';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tabs, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaUserCog } from 'react-icons/fa';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/slices/user';
import formatSortType from '../../helpers/formatSortType';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import useDidUpdate from '../../helpers/useDidUpdate';
import UserShowModal from './userShowModal';
import { useTranslation } from 'react-i18next';
import UserRoleModal from './userRoleModal';
import SearchInput from '../../components/search-input';
import FilterColumns from '../../components/filter-column';

const { TabPane } = Tabs;

const roles = ['admin', 'seller', 'moderator', 'manager', 'deliveryman'];

export default function Admin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { users, loading, meta, params } = useSelector(
    (state) => state.user,
    shallowEqual
  );
  const { user } = useSelector((state) => state.auth, shallowEqual);

  const [uuid, setUuid] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `user/${row.uuid}`,
        id: 'user_edit',
        name: 'User edit',
      })
    );
    navigate(`/user/${row.uuid}`);
  };
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: t('firstname'),
      is_show: true,
      dataIndex: 'firstname',
    },
    {
      title: t('lastname'),
      is_show: true,
      dataIndex: 'lastname',
    },
    {
      title: t('email'),
      is_show: true,
      dataIndex: 'email',
    },
    {
      title: t('role'),
      is_show: true,
      dataIndex: 'role',
    },
    {
      title: t('options'),
      is_show: true,
      dataIndex: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => setUuid(row.uuid)} />
            {row.role !== 'moderator' ? (
              <>
                <Button
                  type='primary'
                  icon={<EditOutlined />}
                  onClick={() => goToEdit(row)}
                />
                <Tooltip title={t('change.user.role')}>
                  <Button
                    disabled={row.email === user.email}
                    onClick={() => setUserRole(row)}
                    icon={<FaUserCog />}
                  />
                </Tooltip>
              </>
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
  ]);

  function onChangePagination(pagination, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      const data = activeMenu.data;
      const params = {
        sort: data?.sort,
        column: data?.column,
        role: data?.role || 'admin',
        perPage: data?.perPage || 10,
        page: data?.page || 1,
        search: data?.search,
      };
      dispatch(fetchUsers(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const handleFilter = (item, name) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      role: data.role,
      perPage: data?.perPage,
      page: data?.page,
      search: data?.search,
    };
    dispatch(fetchUsers(paramsData));
  }, [activeMenu.data]);

  return (
    <Card
      title={t('users')}
      extra={
        <Space>
          <SearchInput
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
          />
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Tabs
        activeKey={activeMenu.data?.role || 'admin'}
        onChange={(key) => handleFilter(key, 'role')}
        type='card'
      >
        {roles.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={users}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
      />

      {uuid && <UserShowModal uuid={uuid} handleCancel={() => setUuid(null)} />}
      {userRole && (
        <UserRoleModal data={userRole} handleCancel={() => setUserRole(null)} />
      )}
    </Card>
  );
}
