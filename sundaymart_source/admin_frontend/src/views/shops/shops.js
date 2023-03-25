import React, { useContext, useEffect, useState } from 'react';
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IMG_URL } from '../../configs/app-global';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import shopService from '../../services/shop';
import { fetchShops } from '../../redux/slices/shop';
import { useTranslation } from 'react-i18next';
import ShopStatusModal from './shop-status-modal';
import DeleteButton from '../../components/delete-button';
import SearchInput from '../../components/search-input';
import useDidUpdate from '../../helpers/useDidUpdate';
import FilterColumns from '../../components/filter-column';

const Shops = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopStatus, setShopStatus] = useState(null);
  const { user } = useSelector((state) => state.auth, shallowEqual);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'edit-shop',
        url: `shop/${row.uuid}`,
        name: t('edit.shop'),
      })
    );
    navigate(`/shop/${row.uuid}`);
  };
  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: 'clone-shop',
        url: `shop/${row.uuid}`,
        name: t('clone.shop'),
      })
    );
    navigate(`/shop-clone/${row.uuid}`);
  };
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
    },
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'name',
    },
    {
      title: t('logo'),
      is_show: true,
      dataIndex: 'logo_img',
      render: (img) => {
        return (
          <Image
            alt='images'
            className='img rounded'
            src={img ? IMG_URL + img : 'https://via.placeholder.com/150'}
            effect='blur'
            width={50}
            height={50}
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('background'),
      is_show: true,
      dataIndex: 'back',
      render: (img) => {
        return (
          <Image
            alt={'images background'}
            className='img rounded'
            src={img ? IMG_URL + img : 'https://via.placeholder.com/150'}
            effect='blur'
            width={50}
            height={50}
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('seller'),
      is_show: true,
      dataIndex: 'seller',
    },
    {
      title: t('open_close.time'),
      is_show: true,
      dataIndex: 'open',
    },
    {
      title: t('tax'),
      is_show: true,
      dataIndex: 'tax',
      render: (tax) => `${tax} %`,
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      render: (status, row) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'rejected' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          <EditOutlined onClick={() => setShopStatus(row)} />
        </div>
      ),
    },
    {
      title: t('options'),
      is_show: true,
      dataIndex: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <Button icon={<CopyOutlined />} onClick={() => goToClone(row)} />
            {user?.role !== 'manager' ? (
              <DeleteButton
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedRows([row]);
                  setIsModalVisible(true);
                }}
              />
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { shops, meta, loading, params } = useSelector(
    (state) => state.shop,
    shallowEqual
  );

  const shopDelete = () => {
    setLoadingBtn(true);
    const ids = selectedRows.map((item) => item.id);
    shopService
      .delete({ ids })
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchShops(params));
      })
      .finally(() => setLoadingBtn(false));
  };

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchShops({ perPage: pageSize, page: current }));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShops(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add-shop',
        url: `shop/add`,
        name: t('add.shop'),
      })
    );
    navigate(`/shop/add`);
  };
  const goToImport = () => {
    dispatch(
      addMenu({
        id: 'import-shop',
        url: `shop/import`,
        name: t('import.shop'),
      })
    );
    navigate(`/shop/import`);
  };
  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, [name]: item },
      })
    );
  };

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      search: data?.search,
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchShops(paramsData));
  }, [activeMenu.data]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  return (
    <Card
      title={t('shops')}
      extra={
        <Space>
          <SearchInput
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
          />
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.shop')}
          </Button>
          {/* <Button
            icon={<CloudUploadOutlined />}
            type='primary'
            onClick={goToImport}
          >
            {t('import')}
          </Button> */}
          <DeleteButton type='danger' onClick={shopDelete}>
            {t('delete.all')}
          </DeleteButton>
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        rowSelection={rowSelection}
        columns={columns?.filter((items) => items.is_show)}
        dataSource={shops}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.uuid}
        onChange={onChangePagination}
      />
      {shopStatus && (
        <ShopStatusModal
          data={shopStatus}
          handleCancel={() => setShopStatus(null)}
        />
      )}
      <CustomModal
        click={shopDelete}
        text={t('delete.shop')}
        loading={loadingBtn}
      />
    </Card>
  );
};

export default Shops;
