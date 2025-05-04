import { NextResponse } from 'next/server';
import { PromptService } from '@/lib/services/PromptService';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/prompts/[id] - Get a specific prompt
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const prompt = await PromptService.getById(id);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(prompt);
  } catch (error) {
    console.error(`Error fetching prompt ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

// PATCH /api/prompts/[id] - Update a prompt
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const existingPrompt = await PromptService.getById(id);
    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    const updatedPrompt = await PromptService.update(id, data);
    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error(`Error updating prompt ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

// DELETE /api/prompts/[id] - Delete a prompt
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const existingPrompt = await PromptService.getById(id);
    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    await PromptService.delete(id);
    return NextResponse.json(
      { message: 'Prompt deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting prompt ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
} 