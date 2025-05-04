"use client"

import { useState, useEffect } from "react";
import { Category, Tool, FilterOptions } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, Check, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PromptFilterProps {
  categories: Category[];
  tools: Tool[];
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export default function PromptFilter({ 
  categories, 
  tools, 
  onFilterChange, 
  initialFilters = {} 
}: PromptFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categoryIds: initialFilters.categoryIds || [],
    toolIds: initialFilters.toolIds || [],
    searchTerm: initialFilters.searchTerm || "",
  });
  
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [toolOpen, setToolOpen] = useState(false);
  
  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handleCategorySelect = (categoryId: string) => {
    setFilters(prev => {
      const newCategoryIds = prev.categoryIds?.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...(prev.categoryIds || []), categoryId];
        
      return {
        ...prev,
        categoryIds: newCategoryIds,
      };
    });
  };
  
  const handleToolSelect = (toolId: string) => {
    setFilters(prev => {
      const newToolIds = prev.toolIds?.includes(toolId)
        ? prev.toolIds.filter(id => id !== toolId)
        : [...(prev.toolIds || []), toolId];
        
      return {
        ...prev,
        toolIds: newToolIds,
      };
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      categoryIds: [],
      toolIds: [],
      searchTerm: "",
    });
  };
  
  const selectedCategories = categories.filter(
    cat => filters.categoryIds?.includes(cat.id)
  );
  
  const selectedTools = tools.filter(
    tool => filters.toolIds?.includes(tool.id)
  );
  
  const hasActiveFilters = 
    (filters.categoryIds && filters.categoryIds.length > 0) || 
    (filters.toolIds && filters.toolIds.length > 0) ||
    !!filters.searchTerm;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Input
            placeholder="Buscar prompts..."
            value={filters.searchTerm || ""}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        {/* Categories filter */}
        <div className="flex-none">
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="justify-start"
              >
                {selectedCategories.length > 0 ? (
                  <>
                    <Badge 
                      variant="secondary" 
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedCategories.length}
                    </Badge>
                    <span className="ml-2">Categorias</span>
                  </>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" />
                    Categorias
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar categorias..." />
                <CommandList>
                  <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                  <CommandGroup>
                    {categories.map(category => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => handleCategorySelect(category.id)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            filters.categoryIds?.includes(category.id)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{category.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Tools filter */}
        <div className="flex-none">
          <Popover open={toolOpen} onOpenChange={setToolOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="justify-start"
              >
                {selectedTools.length > 0 ? (
                  <>
                    <Badge 
                      variant="secondary" 
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedTools.length}
                    </Badge>
                    <span className="ml-2">Ferramentas</span>
                  </>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" />
                    Ferramentas
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar ferramentas..." />
                <CommandList>
                  <CommandEmpty>Nenhuma ferramenta encontrada.</CommandEmpty>
                  <CommandGroup>
                    {tools.map(tool => (
                      <CommandItem
                        key={tool.id}
                        onSelect={() => handleToolSelect(tool.id)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            filters.toolIds?.includes(tool.id)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{tool.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button 
            variant="ghost"
            onClick={handleClearFilters}
            className="text-muted-foreground"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>
      
      {/* Selected filters display */}
      {(selectedCategories.length > 0 || selectedTools.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map(category => (
            <Badge 
              key={category.id} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {category.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategorySelect(category.id)}
              />
            </Badge>
          ))}
          
          {selectedTools.map(tool => (
            <Badge 
              key={tool.id} 
              variant="outline"
              className="flex items-center gap-1"
            >
              {tool.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleToolSelect(tool.id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}