import client from "./client";

export const getProducts = (lowStock = false) =>
  client
    .get("/products", { params: lowStock ? { lowStock: true } : {} })
    .then((res) => res.data);

export const getProduct = (id) =>
  client.get(`/products/${id}`).then((res) => res.data);

export const createProduct = (data) =>
  client.post("/products", data).then((res) => res.data);

export const updateProduct = (id, data) =>
  client.put(`/products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id) =>
  client.delete(`/products/${id}`).then((res) => res.data);
