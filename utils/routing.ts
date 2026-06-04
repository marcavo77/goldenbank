import { ViewState } from '../types';

/**
 * Route mapping: ViewState -> URL path
 */
const ROUTE_MAP: Record<ViewState, string> = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ABOUT: '/about',
  SERVICES: '/services',
  PRICING: '/pricing',
  CONTACT: '/contact',
  LEGAL: '/legal',
  PRIVACY: '/privacy',
  COOKIES: '/cookies',
};

/**
 * Reverse mapping: URL path -> ViewState
 */
const VIEW_MAP: Record<string, ViewState> = Object.entries(ROUTE_MAP).reduce(
  (acc, [view, route]) => {
    acc[route] = view as ViewState;
    return acc;
  },
  {} as Record<string, ViewState>
);

/**
 * Convert ViewState to route path
 */
export const viewToRoute = (view: ViewState): string => {
  return ROUTE_MAP[view] || '/';
};

/**
 * Convert route path to ViewState
 */
export const routeToView = (path: string): ViewState => {
  // Normalize path: remove trailing slash (except root), remove query params and hash
  const normalizedPath = path.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  
  // Check if path exists in map
  if (VIEW_MAP[normalizedPath]) {
    return VIEW_MAP[normalizedPath];
  }
  
  // Default to LANDING for unknown routes
  return 'LANDING';
};

/**
 * Get current path from window.location
 */
export const getCurrentPath = (): string => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

/**
 * Get ViewState from current URL
 */
export const getViewFromURL = (): ViewState => {
  if (typeof window === 'undefined') return 'LANDING';
  return routeToView(getCurrentPath());
};

/**
 * Navigate to a route and update browser history
 */
export const navigateTo = (view: ViewState, replace: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  const route = viewToRoute(view);
  const currentPath = getCurrentPath();
  
  // Only navigate if route is different
  if (route !== currentPath) {
    try {
      if (replace) {
        window.history.replaceState({ view }, '', route);
      } else {
        window.history.pushState({ view }, '', route);
      }
      
      // Dispatch popstate event to trigger view update
      window.dispatchEvent(new PopStateEvent('popstate', { state: { view } }));
    } catch (error) {
      console.error('Error navigating:', error);
    }
  }
};

/**
 * Check if a route requires authentication
 */
export const isProtectedRoute = (view: ViewState): boolean => {
  return view === 'DASHBOARD' || view === 'ADMIN';
};

/**
 * Check if a route is public (accessible without auth)
 */
export const isPublicRoute = (view: ViewState): boolean => {
  return !isProtectedRoute(view);
};

