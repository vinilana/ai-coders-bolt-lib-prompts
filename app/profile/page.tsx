'use client';

import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Não autenticado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-medium">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 