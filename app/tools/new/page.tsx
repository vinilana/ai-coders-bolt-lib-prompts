"use client"

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolForm from "@/components/tool-form";
import Link from "next/link";

export default function NewToolPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Criar Nova Ferramenta</h1>
      </div>
      
      <ToolForm />
    </div>
  );
}