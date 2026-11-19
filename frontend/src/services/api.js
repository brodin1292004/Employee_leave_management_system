import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({ baseURL: BASE });

// attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if the access token expired, get a new one using the refresh token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const refresh = localStorage.getItem("refresh");
    if (
      err.response?.status === 401 &&
      refresh &&
      !original._retry &&
      !original.url.includes("/login/")
    ) {
      original._retry = true;
      try {
        const res = await axios.post(`${BASE}/accounts/token/refresh/`, { refresh });
        localStorage.setItem("access", res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// works for both plain lists and paginated {results: []} responses
export const toList = (data) => (Array.isArray(data) ? data : data?.results || []);

// turns a DRF error response into one readable message
export const errorText = (err) => {
  const data = err.response?.data;
  if (!data) return "Cannot connect to the server.";
  if (typeof data === "string") return "Something went wrong on the server.";
  if (data.detail) return data.detail;
  return Object.entries(data)
    .map(([k, v]) => `${k}: ${[].concat(v).join(" ")}`)
    .join(" | ");
};

export default api;
