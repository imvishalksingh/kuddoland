import api from "./axios";

export async function createOrder(payload) {
  const { data } = await api.post("/orders/create", payload);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get("/orders/my-orders");
  return data;
}

export async function getOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function getAdminOrders() {
  const { data } = await api.get("/orders");
  return data;
}

export async function updateOrderStatus(id, payload) {
  const { data } = await api.put(`/orders/${id}/status`, payload);
  return data;
}

export async function assignShipment(id, payload) {
  const { data } = await api.post(`/orders/${id}/assign-shipment`, payload);
  return data;
}

export async function refundOrder(orderId, payload) {
  const { data } = await api.post(`/payment/refund/${orderId}`, payload);
  return data;
}

export async function requestReturn(id, payload) {
  const { data } = await api.post(`/orders/${id}/return`, payload);
  return data;
}

export async function decideReturn(id, payload) {
  const { data } = await api.post(`/orders/${id}/return-decision`, payload);
  return data;
}
