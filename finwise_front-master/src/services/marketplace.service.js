import api from '../api/axios'

export const marketplaceService = {
  getProducts: () => api.get('/marketplace/products').then((res) => res.data),

  acceptOffer: (productId) =>
    api.post('/marketplace/accept', { productId }).then((res) => res.data),
}
