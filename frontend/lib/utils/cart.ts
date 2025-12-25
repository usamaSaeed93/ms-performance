/**
 * Cart utility functions for managing cart in localStorage
 */

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CART_STORAGE_KEY = 'cart';

/**
 * Get all cart items from localStorage
 */
export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  
  return [];
}

/**
 * Save cart items to localStorage
 */
export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/**
 * Add item to cart
 */
export function addToCart(item: CartItem): void {
  const currentCart = getCartItems();
  
  // Check if item already exists in cart
  const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    currentCart[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    currentCart.push(item);
  }
  
  saveCartItems(currentCart);
}

/**
 * Remove item from cart
 */
export function removeFromCart(productId: number): void {
  const currentCart = getCartItems();
  const updatedCart = currentCart.filter(item => item.id !== productId);
  saveCartItems(updatedCart);
}

/**
 * Update item quantity in cart
 */
export function updateCartItemQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  const currentCart = getCartItems();
  const updatedCart = currentCart.map(item => 
    item.id === productId ? { ...item, quantity } : item
  );
  saveCartItems(updatedCart);
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

/**
 * Get total number of items in cart
 */
export function getCartItemCount(): number {
  const items = getCartItems();
  return items.reduce((total, item) => total + item.quantity, 0);
}

