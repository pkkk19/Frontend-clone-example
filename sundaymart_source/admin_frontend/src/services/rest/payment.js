import request from '../request';

const paymentService = {
  getAll: (params) => request.get('rest/payments', { params }),
  getById: (id, params) => request.get(`rest/payments/${id}`, { params }),
  getId: (id) => request.get(`rest/payments?shop_id=${id}`),
};

export default paymentService;
