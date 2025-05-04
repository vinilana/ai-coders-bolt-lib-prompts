import { NextResponse } from 'next/server';
import { PromptService } from '@/lib/services/PromptService';
import { FilterOptions } from '@/lib/types';

// GET /api/prompts - Get all prompts with optional filtering
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters: FilterOptions = {};
    
    // Extract filters from query parameters
    if (searchParams.has('title')) {
      filters.title = searchParams.get('title') || undefined;
    }
    
    if (searchParams.has('authorId')) {
      filters.authorId = searchParams.get('authorId') || undefined;
    }
    
    // Handle categoryIds as an array
    const categoryIds = searchParams.getAll('categoryIds');
    if (categoryIds.length > 0) {
      filters.categoryIds = categoryIds;
    }
    
    // Handle toolIds as an array
    const toolIds = searchParams.getAll('toolIds');
    if (toolIds.length > 0) {
      filters.toolIds = toolIds;
    }
    
    // Handle pagination
    if (searchParams.has('page')) {
      const page = parseInt(searchParams.get('page') || '1', 10);
      filters.page = isNaN(page) ? 1 : page;
    }
    
    if (searchParams.has('pageSize')) {
      const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
      filters.pageSize = isNaN(pageSize) ? 10 : pageSize;
    }
    
    const prompts = await PromptService.getAll(filters);
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

// POST /api/prompts - Create a new prompt
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content || !data.authorId) {
      return NextResponse.json(
        { error: 'Title, content, and authorId are required' },
        { status: 400 }
      );
    }
    
    // Ensure arrays are present
    data.categoryIds = data.categoryIds || [];
    data.toolIds = data.toolIds || [];
    
    const newPrompt = await PromptService.create(data);
    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
} 