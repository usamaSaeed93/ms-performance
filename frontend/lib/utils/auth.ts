/**
 * Customer authentication utilities
 */

export const getCustomerToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('customer_token');
};

export const setCustomerToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('customer_token', token);
};

export const removeCustomerToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('customer_token');
};

export const isCustomerAuthenticated = (): boolean => {
  return getCustomerToken() !== null;
};

