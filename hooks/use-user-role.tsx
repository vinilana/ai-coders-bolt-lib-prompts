'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole } from '@/lib/types';

interface UseUserRoleReturn {
  isAdmin: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  hasRole: (role: UserRole) => boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const { isLoaded, isSignedIn, user } = useUser();
  
  const userRole = isLoaded && isSignedIn && user?.publicMetadata?.role 
    ? user.publicMetadata.role as UserRole 
    : null;
  
  const isAdmin = userRole === 'admin';
  const isAuthenticated = isLoaded && isSignedIn;
  
  const hasRole = (role: UserRole): boolean => {
    if (!isLoaded || !isSignedIn) return false;
    
    // Check direct role assignment
    if (userRole === role) return true;
    
    // Check role in roles array if exists
    const roles = user?.publicMetadata?.roles as UserRole[] | undefined;
    return roles ? roles.includes(role) : false;
  };

  return {
    isAdmin,
    isAuthenticated,
    userRole,
    hasRole
  };
} 