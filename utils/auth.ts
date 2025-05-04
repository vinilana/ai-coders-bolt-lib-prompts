import { auth } from '@clerk/nextjs/server';
import { UserRoleClaims } from '@/lib/types';

export async function hasRole(role: string) {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }
  
  // Verifica se o usuário possui o papel necessário nos metadados
  const { sessionClaims } = await auth();
  const typedClaims = sessionClaims as UserRoleClaims;
  const roles = typedClaims?.metadata?.roles as string[] || [];
  
  return roles.includes(role);
} 