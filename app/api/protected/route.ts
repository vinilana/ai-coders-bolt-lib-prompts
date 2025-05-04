import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ error: 'Não autorizado' }),
      { status: 401 }
    );
  }
  
  return NextResponse.json({ message: 'Rota de API protegida', userId });
} 