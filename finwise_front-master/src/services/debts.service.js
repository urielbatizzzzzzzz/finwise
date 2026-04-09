import api from '../api/axios'

export const debtsService = {
  /**
   * GET /debts — lista todas las deudas sincronizadas desde NESI
   */
  getDebts: ({ token }) => 
    api.get('/debts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.data ??[]),


  getDebt: ({ token, debtId }) => 
    api.get(`/debts/${debtId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.data ?? null),

  getTotalDebt: ({ token }) => 
    api.get('/debts/total', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.data ?? null),
}