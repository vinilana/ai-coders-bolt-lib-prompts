import { auth } from '@clerk/nextjs/server';

export async function hasRole(role: string) {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }
  
  // Verifica se o usuário possui o papel necessário nos metadados
  const { sessionClaims } = await auth();
  const roles = sessionClaims?.metadata?.roles as string[] || [];
  
  return roles.includes(role);
} 