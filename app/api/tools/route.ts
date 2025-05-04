import { NextResponse } from 'next/server';
import { ToolService } from '@/lib/services/ToolService';

// GET /api/tools - Get all tools
export async function GET() {
  try {
    const tools = await ToolService.getAll();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST /api/tools - Create a new tool
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    const newTool = await ToolService.create(data);
    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    );
  }
} 