const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export const getStorefront = () => request("/storefront");
export const getProducts = () => request("/products");
export const findGift = (body) => request("/gift-finder", { method: "POST", body: JSON.stringify(body) });
export const submitContact = (body) => request("/contact", { method: "POST", body: JSON.stringify(body) });
export const createOrder = (body) => request("/orders", { method: "POST", body: JSON.stringify(body) });
export const createRazorpayOrder = (body) =>
  request("/payments/razorpay/order", { method: "POST", body: JSON.stringify(body) });
export const verifyRazorpayPayment = (body) =>
  request("/payments/razorpay/verify", { method: "POST", body: JSON.stringify(body) });
export const adminLogin = (body) => request("/admin/login", { method: "POST", body: JSON.stringify(body) });
export const getAdminProducts = (token) => authRequest("/admin/products", token);
export const createAdminProduct = (token, body) => authRequest("/admin/products", token, { method: "POST", body: JSON.stringify(body) });
export const updateAdminProduct = (token, id, body) => authRequest(`/admin/products/${id}`, token, { method: "PUT", body: JSON.stringify(body) });
export const deleteAdminProduct = (token, id) => authRequest(`/admin/products/${id}`, token, { method: "DELETE" });
export const getAdminOrders = (token) => authRequest("/admin/orders", token);
export const getAdminContacts = (token) => authRequest("/admin/contacts", token);
export const updateStorefront = (token, body) => authRequest("/storefront/admin", token, { method: "PUT", body: JSON.stringify(body) });

function authRequest(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
