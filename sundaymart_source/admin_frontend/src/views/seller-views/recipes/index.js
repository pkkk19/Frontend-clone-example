import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image, Space, Switch, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import GlobalContainer from '../../../components/global-container';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import recipeService from '../../../services/seller/recipe';
import { fetchRecipes } from '../../../redux/slices/recipe';
import getImage from '../../../helpers/getImage';
import DeleteButton from '../../../components/delete-button';

export default function SellerRecipes() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/recipes/${row.id}`,
        id: 'recipe_edit',
        name: t('edit.recipe'),
      })
    );
    navigate(`/seller/recipes/${row.id}`);
  };
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
      dataIndex: 'translation',
      key: 'translation',
      render: (translation) => translation?.title,
    },
    {
      title: t('image'),
      is_show: true,
      dataIndex: 'image',
      key: 'image',
      render: (image) => {
        return (
          <Image
            src={getImage(image)}
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => {
        return (
          <Switch
            onChange={() => {
              setIsModalVisible(true);
              setActiveId(row.id);
              setType(true);
            }}
            checked={Boolean(status)}
          />
        );
      },
    },
    {
      title: t('created.at'),
      is_show: true,
      dataIndex: 'created_at',
      key: 'created_at',
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
              setType(false);
            }}
          />
        </Space>
      ),
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { recipes, meta, loading } = useSelector(
    (state) => state.recipe,
    shallowEqual
  );

  const recipeDelete = () => {
    setLoadingBtn(true);
    recipeService
      .delete(id)
      .then(() => {
        dispatch(fetchRecipes());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  const handleActive = () => {
    setLoadingBtn(true);
    recipeService
      .setActive(activeId)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchRecipes());
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchRecipes());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchRecipes({ perPage: pageSize, page: current }));
  };

  return (
    <GlobalContainer
      headerTitle={t('recipes')}
      navLInkTo={'/seller/recipes/add'}
      buttonTitle={t('add.recipe')}
      setColumns={setColumns}
      columns={columns}
    >
      <Table
        columns={columns?.filter((items) => items.is_show)}
        dataSource={recipes}
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
        click={type ? handleActive : recipeDelete}
        text={type ? t('set.active.recipe') : t('delete.recipe')}
        loading={loadingBtn}
      />
    </GlobalContainer>
  );
}
