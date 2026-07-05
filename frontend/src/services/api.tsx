const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// ---------------- AUTH HELPERS ----------------

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("approvalStatus");
  window.location.href = "/login";
};

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",

    Authorization: token ? `Bearer ${token}` : "",
  };
};
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let res = await fetch(url, {
    ...options,

    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      res = await fetch(url, {
        ...options,

        headers: {
          ...getHeaders(),
          ...(options.headers || {}),
        },
      });
    } else {
      alert("Session expired");

      clearAuth();

      throw new Error("Unauthorized");
    }
  }

  return res;
};
// ---------------- PRODUCTS ----------------

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products/`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// ---------------- AUTH ----------------

export const signupUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${BASE_URL}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw result;
  }

  return result;
};
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  localStorage.setItem("token", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("userId", String(data.user.id));
  localStorage.setItem("userType", data.user.role);
  localStorage.setItem("userEmail", data.user.email);
  localStorage.setItem("approvalStatus", data.user.approval_status);

  return data;
};

const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    clearAuth();

    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        refresh,
      }),
    });

    const data = await res.json();

    if (data.access) {
      localStorage.setItem("token", data.access);

      return data.access;
    }

    clearAuth();

    return null;
  } catch {
    clearAuth();

    return null;
  }
};

// ---------------- CART ----------------

export const addCart = async (user: number, product: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/cart/add/`, {
    method: "POST",

    body: JSON.stringify({
      user,
      product,
      quantity: 1,
    }),
  });

  return res.json();
};

export const getCart = async (userId: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/cart/?user=${userId}`);

  if (!res.ok) {
    return [];
  }

  return res.json();
};

export const removeCart = async (id: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/cart/remove/${id}/`, {
    method: "DELETE",
  });

  if (res.status === 204) {
    return null;
  }

  return res.json();
};

// ---------------- ORDERS ----------------

export const createOrder = async (data: Record<string, unknown>) => {
  const res = await fetchWithAuth(`${BASE_URL}/orders/create/`, {
    method: "POST",

    body: JSON.stringify(data),
  });

  return res.json();
};

export const getOrders = async (userId: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/orders/?user=${userId}`);

  return res.json();
};

// ---------------- WISHLIST ----------------

export const getWishlist = async (userId: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/wishlist/?user=${userId}`);

  if (!res.ok) {
    return [];
  }

  return res.json();
};

export const addWishlist = async (product: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/wishlist/`, {
    method: "POST",

    body: JSON.stringify({
      product,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};

export const removeWishlist = async (id: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/wishlist/${id}/`, {
    method: "DELETE",
  });

  if (res.status === 204) {
    return null;
  }

  return res.json();
};

export const subscribeNewsletter = async (email: string) => {
  const res = await fetch(`${BASE_URL}/newsletter/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Subscription failed");
  }

  return data;
};

export async function getProfile(user: number) {
  const response = await fetchWithAuth(`${BASE_URL}/profile/?user=${user}`);

  return await response.json();
}

export async function updateProfile(data: Record<string, unknown>) {
  const response = await fetchWithAuth(`${BASE_URL}/profile/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export const getAddresses = async (user: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/addresses/?user=${user}`);

  return res.json();
};

export const addAddress = async (data: Record<string, unknown>) => {
  const res = await fetchWithAuth(`${BASE_URL}/addresses/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const removeAddress = async (id: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/addresses/delete/${id}/`, {
    method: "DELETE",
  });

  return res;
};

// ---------------- SELLER PRODUCTS ----------------

export const getSellerProducts = async (sellerId: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/products/?seller=${sellerId}`);

  return res.json();
};

export const getUsers = async (role?: string) => {
  let url = `${BASE_URL}/users/`;

  if (role) {
    url += `?role=${role}`;
  }

  const res = await fetchWithAuth(url);

  return res.json();
};

export const addUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}) => {
  const res = await fetchWithAuth(`${BASE_URL}/users/add/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateUser = async (id: number, data: Record<string, unknown>) => {
  const res = await fetchWithAuth(`${BASE_URL}/users/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteUser = async (id: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/users/delete/${id}/`, {
    method: "DELETE",
  });

  return res.json();
};

export const addDeliveryAgent = async (data: {
  username: string;
  email: string;
  password: string;
  phone?: string;
}) => addUser({ ...data, role: "delivery" });

export const updateDeliveryAgent = async (
  id: number,
  data: Record<string, unknown>,
) => updateUser(id, data);

export const deleteDeliveryAgent = async (id: number) => deleteUser(id);

export const getAllOrders = async () => {
  const res = await fetchWithAuth(`${BASE_URL}/orders/`);

  return res.json();
};

export const addSellerProduct = async (data: FormData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/products/add/`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: data,
  });

  const responseData = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(JSON.stringify(responseData));
  }

  return responseData;
};

export const updateSellerProduct = async (id: number, data: FormData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/products/update/${id}/`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: data,
  });

  const responseData = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(JSON.stringify(responseData));
  }

  return responseData;
};

export const deleteSellerProduct = async (id: number) => {
  const res = await fetchWithAuth(`${BASE_URL}/products/delete/${id}/`, {
    method: "DELETE",
  });

  if (res.status === 204) {
    return null;
  }

  return res.json();
};

export const getSellerOrders = async (sellerId: number) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/orders/seller/?seller=${sellerId}`,
  );

  return res.json();
};

export const getDeliveryOrders = async (deliveryAgentId: number) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/orders/delivery/?delivery_agent=${deliveryAgentId}`,
  );

  return res.json();
};

export const assignDeliveryAgent = async (
  orderId: number,
  deliveryAgentId: number,
) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/orders/assign-delivery/${orderId}/`,
    {
      method: "PUT",
      body: JSON.stringify({
        delivery_agent_id: deliveryAgentId,
        status: "shipped",
      }),
    },
  );

  return res.json();
};

export const getDeliveryAgents = async () => {
  const res = await fetchWithAuth(`${BASE_URL}/delivery-agents/`);

  return res.json();
};

export const getDeliveryAgentProfile = async (deliveryAgentId: number) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/delivery-agent-profile/?delivery_agent=${deliveryAgentId}`,
  );

  return res.json();
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const res = await fetchWithAuth(
    `${BASE_URL}/orders/update-status/${orderId}/`,
    {
      method: "PUT",

      body: JSON.stringify({
        status,
      }),
    },
  );

  return res.json();
};
