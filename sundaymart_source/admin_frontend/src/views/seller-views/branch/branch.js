import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import GlobalContainer from '../../../components/global-container';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { fetchBranch } from '../../../redux/slices/branch';
import branchService from '../../../services/seller/branch';
import DeleteButton from '../../../components/delete-button';

const SellerBranch = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { branches, meta, loading } = useSelector(
    (state) => state.branch,
    shallowEqual
  );
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'title',
      key: 'title',
      render: (title, row) => {
        return <>{row?.translation?.title}</>;
      },
    },
    {
      title: t('address'),
      is_show: true,
      dataIndex: 'address',
      key: 'address',
      render: (title, row) => {
        return <>{row?.translation?.address}</>;
      },
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      dataIndex: 'options',
      render: (data, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => goToEdit(row)}
          />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId(row.id);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/branch/${row.id}`,
        id: 'branch_edit',
        name: t('edit.branch'),
      })
    );
    navigate(`/seller/branch/${row.id}`);
  };

  const branchDelete = () => {
    setLoadingBtn(true);
    branchService
      .delete(id)
      .then(() => {
        dispatch(fetchBranch());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBranch());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchBranch({ perPage: pageSize, page: current }));
  };

  return (
    <GlobalContainer
      headerTitle={t('branch')}
      navLInkTo={'/seller/branch/add'}
      buttonTitle={t('add.branch')}
      setColumns={setColumns}
      columns={columns}
    >
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={branches}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={branchDelete}
        text={'delete.branch'}
        loading={loadingBtn}
      />
    </GlobalContainer>
  );
};

export default SellerBranch;
