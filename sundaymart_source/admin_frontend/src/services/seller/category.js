import request from '../request';

const sellerCategory = {
  getAll: (params) => request.get('dashboard/seller/shop/category', { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/shop/category/${params}`),
  create: (params) =>
    request.post('dashboard/seller/shop/category', params, {}),
  search: (params) =>
    request.get('dashboard/seller/shop/category/all-category', { params }),
};

export default sellerCategory;
