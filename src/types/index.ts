/**
 * Shared type definitions for Reef Forge Frontend
 * This file contains all common interfaces and types used across the application
 */

// ============================================================================
// Basket and Product Types
// ============================================================================

/**
 * Represents an item in the shopping basket
 */
export interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
  photoUrls: string[];
}

/**
 * Extended basket item with additional product details
 */
export interface FragRackItem extends BasketItem {
  description: string;
  colour: string;
  stockQuantity: number;
}

/**
 * Product data structure from backend API
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  code: string;
  colour: string;
  stockQuantity: number;
  photoUrls: string[];
}

// ============================================================================
// Order Types
// ============================================================================

/**
 * Order submission data structure
 */
export interface OrderSubmission {
  orderId: string;
  userEmail: string;
  userAddress: UserAddress;
  basketItems: BasketItem[];
  totalPrice: number;
  shippingPrice: number;
  discountCode?: string;
  discountMultiplier?: number;
}

/**
 * User address from Stripe
 */
export interface UserAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

/**
 * Order details for display
 */
export interface Order {
  id: number;
  orderId: string;
  userEmail: string;
  orderDate: string;
  totalPrice: number;
  items: OrderItem[];
}

/**
 * Individual item within an order
 */
export interface OrderItem {
  id: number;
  fragRackId: number;
  quantity: number;
  priceAtPurchase: number;
  fragRack: FragRackItem;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standardized API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Stock check response
 */
export interface StockCheckResponse {
  available: boolean;
  currentStock: number;
  requestedQuantity: number;
}

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * User registration data
 */
export interface UserRegistration extends AuthCredentials {
  confirmPassword?: string;
}

/**
 * JWT token payload
 */
export interface JwtPayload {
  email: string;
  role: string;
  isAdmin?: string; // Legacy field from backend - will be converted to role
  iat?: number;
  exp?: number;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * Discount code configuration
 */
export interface DiscountCode {
  code: string;
  multiplier: number; // e.g., 0.9 for 10% off
  description?: string;
  validFrom?: Date;
  validUntil?: Date;
}

/**
 * Checkout form data
 */
export interface CheckoutFormData {
  email: string;
  discountCode?: string;
}

// ============================================================================
// Upload Types
// ============================================================================

/**
 * GCS upload URL response
 */
export interface GcsUploadUrl {
  url: string;
  fileName: string;
  publicUrl: string;
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  success: boolean;
  url: string;
  error?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for basket-related components
 */
export interface BasketComponentProps {
  discount?: number;
  onClose?: () => void;
}

/**
 * Props for product card components
 */
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic callback type
 */
export type Callback<T = void> = () => T;

/**
 * Async callback type
 */
export type AsyncCallback<T = void> = () => Promise<T>;

/**
 * Event handler type
 */
export type EventHandler<E = Event> = (event: E) => void;

/**
 * Status of async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
