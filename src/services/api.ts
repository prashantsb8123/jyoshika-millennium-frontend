import { Product, Order, User, AdminAnalytics } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

// Uploaded product/category images come back from the backend as relative paths
// (e.g. "/uploads/products/xyz.jpg"). Resolve them to an absolute URL against the
// backend origin so the browser doesn't try to load them from the frontend's own
// dev server / host, where they don't exist.
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function mapBackendProduct(p: any): Product {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    sku: p.sku,
    categoryId: p.categoryId,
    description: p.description || '',
    category: p.categoryName || p.category?.name || 'Other',
    price: p.price || 0,
    salePrice: p.salePrice != null && p.salePrice < p.price ? p.salePrice : undefined,
    rating: p.rating || 5.0,
    reviewCount: p.reviewCount || 0,
    stockQuantity: p.stockQuantity ?? 10,
    isBestSeller: p.isBestSeller || p.bestSeller || false,
    isNewArrival: p.isNewArrival || p.newArrival || false,
    isFeatured: p.isFeatured || p.featured || false,
    images: p.images && p.images.length > 0
      ? p.images.map((img: any) => resolveImageUrl(typeof img === 'string' ? img : img.imageUrl))
      : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800'],
  };
}

// Adapts the admin product form into the shape the backend expects.
function mapProductToBackend(productData: any) {
  return {
    title: productData.title,
    sku: productData.sku || null,
    description: productData.description,
    categoryId: productData.categoryId || null,
    price: productData.price,
    salePrice: productData.salePrice != null && productData.salePrice !== '' ? Number(productData.salePrice) : null,
    stockQuantity: productData.stockQuantity,
    isBestSeller: productData.isBestSeller || false,
    isNewArrival: productData.isNewArrival || false,
    isFeatured: productData.isFeatured || false,
  };
}

export async function fetchCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (res.ok) {
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map((c: any) => ({
        ...c,
        imageUrl: resolveImageUrl(c.imageUrl),
      }));
    }
  } catch (err) {
    console.error('API fetchCategories error:', err);
  }
  return [];
}

export async function createAdminCategory(categoryData: any, token: string, imageFile?: File) {
  const formData = new FormData();
  formData.append('category', JSON.stringify(categoryData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Failed to create category' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function updateAdminCategory(id: string, categoryData: any, token: string, imageFile?: File) {
  const formData = new FormData();
  formData.append('category', JSON.stringify(categoryData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Failed to update category' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function deleteAdminCategory(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      return { success: true };
    }
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Failed to delete category' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function fetchProducts(params: Record<string, string> = {}): Promise<Product[]> {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${queryString ? '?' + queryString : ''}`);
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.content || []);
      return items.map(mapBackendProduct);
    }
  } catch (err) {
    console.error('API fetchProducts error:', err);
  }
  return [];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/featured`);
    if (res.ok) {
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map(mapBackendProduct);
    }
  } catch (err) {
    console.error('API fetchFeaturedProducts error:', err);
  }
  return [];
}

export async function fetchBestsellerProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/bestsellers`);
    if (res.ok) {
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map(mapBackendProduct);
    }
  } catch (err) {
    console.error('API fetchBestsellerProducts error:', err);
  }
  return [];
}

export async function fetchProductById(idOrSlug: string): Promise<Product | null> {
  try {
    // Try by slug first if non-UUID string, else by ID
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrSlug);
    const endpoint = isUuid ? `${API_BASE}/products/${idOrSlug}` : `${API_BASE}/products/slug/${idOrSlug}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      return mapBackendProduct(data);
    }
  } catch (err) {
    console.error('API fetchProductById error:', err);
  }
  return null;
}

export function mapBackendOrder(o: any): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    userId: o.userId,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    items: (o.items || []).map((it: any) => ({
      productId: it.productId,
      productTitle: it.title,
      productImage: resolveImageUrl(it.image),
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalPrice: it.totalPrice,
    })),
    shippingAddress: {
      addressLine1: o.addressLine1,
      addressLine2: o.addressLine2,
      city: o.city,
      state: o.state,
      pincode: o.pincode,
      country: 'India',
    },
    subtotal: o.subtotal,
    taxAmount: o.taxAmount,
    discountAmount: o.discountAmount,
    totalAmount: o.totalAmount,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    status: o.orderStatus,
    trackingNumber: o.trackingNumber,
    razorpayOrderId: o.razorpayOrderId,
    razorpayKeyId: o.razorpayKeyId,
    returnType: o.returnType,
    returnReason: o.returnReason,
    createdAt: o.createdAt,
  };
}

export async function placeOrder(orderData: any, token?: string): Promise<{ success: boolean; message: string; data?: Order }> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderData)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: 'Order placed successfully', data: mapBackendOrder(data) };
    }
    const errJson = await res.json().catch(() => null);
    const msg = errJson?.message || (await res.text().catch(() => '')) || 'Failed to place order';
    return { success: false, message: msg };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server connection error' };
  }
}

export async function verifyRazorpayPayment(
  orderId: string,
  payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string },
  token?: string
): Promise<{ success: boolean; message?: string; data?: Order }> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return { success: true, data: mapBackendOrder(await res.json()) };
    }
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Payment verification failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function requestOrderReturn(
  orderId: string,
  payload: { returnType: 'RETURN' | 'EXCHANGE'; reason: string },
  token?: string
): Promise<{ success: boolean; message?: string; data?: Order }> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/return`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return { success: true, data: mapBackendOrder(await res.json()) };
    }
    const errJson = await res.json().catch(() => null);
    const msg = errJson?.message || (await res.text().catch(() => '')) || 'Failed to submit request';
    return { success: false, message: msg };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function fetchOrderById(id: string, token?: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (res.ok) {
      return mapBackendOrder(await res.json());
    }
  } catch (err) {
    console.error('API fetchOrderById error:', err);
  }
  return null;
}

export async function fetchMyOrders(token: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map(mapBackendOrder);
    }
  } catch (err) {
    console.error('API fetchMyOrders error:', err);
  }
  return [];
}

export async function fetchAdminOrders(token: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return (Array.isArray(data) ? data : []).map(mapBackendOrder);
    }
  } catch (err) {
    console.error('API fetchAdminOrders error:', err);
  }
  return [];
}

export async function updateAdminOrderStatus(orderId: string, status: string, token: string): Promise<{ success: boolean; message?: string; data?: Order }> {
  try {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      return { success: true, data: mapBackendOrder(await res.json()) };
    }
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Failed to update order status' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function registerCustomer(data: any): Promise<{ success: boolean; message: string; token?: string; user?: User }> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.name || data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role:true
      })
    });
    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        message: 'Registration successful',
        token: result.accessToken,
        user: {
          id: result.userId,
          name: result.fullName,
          email: result.email,
          phone: data.phone,
          role: result.role || 'ROLE_USER',
          rewardPoints: 500,
          createdAt: new Date().toISOString()
        }
      };
    }
    const errJson = await res.json().catch(() => null);
    const msg = errJson?.message || errJson?.error || (await res.text().catch(() => '')) || 'Registration failed';
    return { success: false, message: msg };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server connection error' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; token?: string; user?: User }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        message: 'Login successful',
        token: result.accessToken,
        user: {
          id: result.userId,
          name: result.fullName,
          email: result.email,
          role: result.role,
          rewardPoints: 1000,
          createdAt: new Date().toISOString()
        }
      };
    }
    const errJson = await res.json().catch(() => null);
    const msg = errJson?.message || errJson?.error || (await res.text().catch(() => '')) || 'Authentication failed';
    return { success: false, message: msg };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unable to connect to login server' };
  }
}

export async function fetchAdminDashboard(token: string): Promise<AdminAnalytics | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return {
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        totalCustomers: data.totalCustomers || 0,
        totalProducts: data.totalProducts || 0,
        monthlyRevenueChart: (data.monthlyRevenueChart || []).map((m: any) => ({
          month: m.month,
          sales: m.sales || 0,
          orders: m.orders || 0,
        })),
        categorySalesDistribution: (data.categorySalesDistribution || []).map((c: any) => ({
          category: c.category,
          value: c.value || 0,
        })),
        recentOrders: data.recentOrders || [],
        lowStockItems: (data.lowStockItems || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          stockQuantity: p.stockQuantity,
          image: resolveImageUrl(p.image),
        })),
      };
    }
  } catch (err) {
    console.error('API fetchAdminDashboard error:', err);
  }
  return null;
}

// ---- Coupons ----

export async function fetchAdminCoupons(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('API fetchAdminCoupons error:', err);
  }
  return [];
}

export async function createAdminCoupon(couponData: any, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(couponData)
    });
    if (res.ok) return { success: true, data: await res.json() };
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Failed to create coupon' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function toggleAdminCoupon(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}/toggle-status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return { success: true, data: await res.json() };
    return { success: false, message: 'Failed to update coupon status' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function deleteAdminCoupon(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: res.ok };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function validateCoupon(code: string, orderAmount: number): Promise<{ valid: boolean; message?: string; discountAmount?: number }> {
  try {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderAmount })
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data) {
      return { valid: data.valid, message: data.message, discountAmount: data.discountAmount };
    }
    return { valid: false, message: data?.message || 'Failed to validate coupon' };
  } catch (err: any) {
    return { valid: false, message: err.message || 'Server error' };
  }
}

// ---- Reviews ----

export async function fetchProductReviews(productId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews/product/${productId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('API fetchProductReviews error:', err);
  }
  return [];
}

export async function submitProductReview(payload: { productId: string; reviewerName: string; rating: number; comment: string }) {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return { success: true, data: await res.json() };
    const errJson = await res.json().catch(() => null);
    return { success: false, message: errJson?.message || 'Failed to submit review' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function fetchAdminReviews(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/reviews`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('API fetchAdminReviews error:', err);
  }
  return [];
}

export async function approveAdminReview(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return { success: true, data: await res.json() };
    return { success: false, message: 'Failed to update review' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function deleteAdminReview(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: res.ok };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

// ---- Customers ----

export async function fetchAdminCustomers(token: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/customers`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('API fetchAdminCustomers error:', err);
  }
  return [];
}

export async function createAdminProduct(productData: any, token: string, imageFile?: File) {
  const formData = new FormData();
  formData.append('product', JSON.stringify(mapProductToBackend(productData)));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const errJson = await res.json().catch(() => null);
    const msg = errJson?.message || 'Failed to create product';
    return { success: false, message: msg };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function updateAdminProduct(id: string, productData: any, token: string, imageFile?: File) {
  const formData = new FormData();
  formData.append('product', JSON.stringify(mapProductToBackend(productData)));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const errJson = await res.json().catch(() => null);
    const msg = errJson?.message || 'Failed to update product';
    return { success: false, message: msg };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function deleteAdminProduct(id: string, token: string, restore = false) {
  const res = await fetch(`${API_BASE}/admin/products/${id}${restore ? '?restore=true' : ''}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
