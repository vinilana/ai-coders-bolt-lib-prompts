import { NextResponse } from 'next/server';
import { ToolService } from '@/lib/services/ToolService';

// GET /api/tools/[id] - Get a specific tool
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tool = await ToolService.getById(id);
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tool);
  } catch (error) {
    console.error(`Error fetching tool ${(await params).id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}

// PATCH /api/tools/[id] - Update a tool
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const existingTool = await ToolService.getById(id);
    if (!existingTool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    const updatedTool = await ToolService.update(id, data);
    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error(`Error updating tool ${(await params).id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    );
  }
}

// DELETE /api/tools/[id] - Delete a tool
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const existingTool = await ToolService.getById(id);
    if (!existingTool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    await ToolService.delete(id);
    return NextResponse.json(
      { message: 'Tool deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting tool ${(await params).id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete tool' },
      { status: 500 }
    );
  }
} 