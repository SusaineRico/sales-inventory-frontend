import client from "./client";

export const createSale = (data) =>
  client.post("/sales", data).then((res) => res.data);

export const getSales = (from, to) =>
  client
    .get("/sales", { params: { from, to } })
    .then((res) => res.data);

export const getSalesSummary = () =>
  client.get("/sales/summary").then((res) => res.data);
