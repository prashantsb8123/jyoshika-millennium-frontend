export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  rewardPoints: number;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku?: string;
  title: string;
  slug: string;
  category: string;
  categoryId?: string;
  description: string;
  price: number; // MRP
  salePrice?: number; // optional discounted selling price
  images: string[];
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSoftDeleted?: boolean;
  tags?: string[];
  createdAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage?: string;
  subCategories?: string[];
  featuredCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id?: string;
  fullName?: string;
  phone?: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  landmark?: string;
  isDefault?: boolean;
  type?: 'Home' | 'Work' | 'Other';
}

export type ShippingAddress = Address;
export type PaymentMethod = 'RAZORPAY' | 'STRIPE' | 'COD';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';
export type ReturnType = 'RETURN' | 'EXCHANGE';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCodeApplied?: string;
  rewardPointsUsed?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  status: OrderStatus;
  trackingNumber?: string;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  returnType?: ReturnType;
  returnReason?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle?: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderValue: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit?: number;
  timesUsed?: number;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rewardPoints: number;
  totalSpent: number;
  ordersCount: number;
  joinedDate: string;
}

export interface RecentOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface LowStockItem {
  id: string;
  title: string;
  stockQuantity: number;
  image?: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyRevenueChart: { month: string; sales: number; orders: number }[];
  categorySalesDistribution: { category: string; value: number }[];
  recentOrders: RecentOrderSummary[];
  lowStockItems: LowStockItem[];
}
