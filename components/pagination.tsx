"use client"

import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageSizeOptions = [5, 10, 20, 50]
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    // Case for few pages
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }
    
    // Case for many pages
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    // Adjust if at the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(startItem + pageSize - 1, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="text-sm text-muted-foreground">
        Mostrando <strong>{startItem}-{endItem}</strong> de <strong>{totalItems}</strong> itens
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <span className="sr-only">Primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 ml-2"
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="hidden sm:flex mx-2">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 mx-0.5"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <span className="sm:hidden mx-2 text-sm">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 mr-2"
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}