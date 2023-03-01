import axios from "axios";

const token = "cfv72m9r01qtdvl3k5bgcfv72m9r01qtdvl3k5c0";

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: { token: token },
});
