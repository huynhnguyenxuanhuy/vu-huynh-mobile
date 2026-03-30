import api from "./api";

export const createOrder = (data) => {
  return api.post("/orders", data);
};

export const getMyOrders = () => {
  return api.get("/orders/my");
};

export const getAdminOrders = () => {
  return api.get("/admin/orders");
};

export const deleteAdminOrder = (id) => {
  return api.delete(`/admin/orders/${id}`);
};

export const getAdminDashboard = () => {
  return api.get("/admin/dashboard");
};

export const getAdminUsers = () => {
  return api.get("/admin/users");
};