import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { DebounceSelect } from '../../../components/search';
import shopService from '../../../services/shop';
import brandService from '../../../services/brand';
import categoryService from '../../../services/category';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchRestProducts } from '../../../redux/slices/product';
import SearchInput from '../../../components/search-input';
import { useTranslation } from 'react-i18next';
import { clearCart, setCartData } from '../../../redux/slices/cart';
import { fetchRestPayments } from '../../../redux/slices/payment';
import { disableRefetch } from '../../../redux/slices/menu';
import { getCartData } from '../../../redux/selectors/cartSelector';

const Filter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { allShops } = useSelector((state) => state.allShops, shallowEqual);
  const { data, currentBag } = useSelector((state) => state.cart, shallowEqual);
  const activeShop = getFirstShopFromList(allShops);
  const cartData = useSelector((state) => getCartData(state.cart));
  async function fetchUserShop(search) {
    const params = { search, status: 'approved' };
    return shopService.search(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation !== null ? item.translation.title : 'no name',
        value: item.id,
      }))
    );
  }

  async function fetchUserBrand(username) {
    return brandService.search(username).then((res) =>
      res.data.map((item) => ({
        label: item.title,
        value: item.id,
      }))
    );
  }

  async function fetchUserCategory(search) {
    const params = { search };
    return categoryService.search(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation !== null ? item.translation.title : 'no name',
        value: item.id,
      }))
    );
  }

  function getFirstShopFromList(shop) {
    const filter = shop.filter((item) => item.status === 'approved');
    if (!shop.length) {
      return null;
    }
    return {
      label: filter[0].translation?.title,
      value: filter[0].id,
      open_time: filter[0].open_time,
      close_time: filter[0].close_time,
    };
  }

  useDidUpdate(() => {
    const params = {
      brand_id: brand?.value,
      category_id: category?.value,
      search,
      shop_id: cartData?.shop.value,
    };
    dispatch(fetchRestProducts(params));
  }, [brand, category, search, cartData.shop]);

  const selectShop = () => dispatch(clearCart());

  useEffect(() => {
    const body = {
      shop_id: data[0].shop?.value,
    };
    if (activeMenu.refetch) {
      dispatch(fetchRestPayments(body));
      dispatch(setCartData({ bag_id: currentBag, shop: activeShop }));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useEffect(() => {
    const body = {
      shop_id: cartData?.shop?.value,
    };
    dispatch(fetchRestPayments(body));
  }, [cartData?.shop]);

  console.log(data[0]);
  return (
    <Card>
      <Row gutter={12}>
        <Col span={9}>
          <SearchInput
            placeholder={t('search')}
            handleChange={setSearch}
            style={{}}
          />
        </Col>
        <Col span={5}>
          <DebounceSelect
            className='w-100'
            placeholder={t('select.shop')}
            fetchOptions={fetchUserShop}
            allowClear={false}
            onChange={(value) => {
              dispatch(setCartData({ bag_id: currentBag, shop: value }));
              selectShop();
            }}
            value={cartData?.shop}
          />
        </Col>
        <Col span={5}>
          <DebounceSelect
            className='w-100'
            placeholder={t('select.category')}
            fetchOptions={fetchUserCategory}
            onChange={(value) => setCategory(value)}
            value={category}
          />
        </Col>
        <Col span={5}>
          <DebounceSelect
            className='w-100'
            placeholder={t('select.brand')}
            fetchOptions={fetchUserBrand}
            onChange={(value) => setBrand(value)}
            value={brand}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default Filter;
