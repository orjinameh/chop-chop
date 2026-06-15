"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { deleteMenuItemAction } from "@/lib/actions";

interface DeleteMenuItemButtonProps {
  id:   string;
  name: string;
}

export function DeleteMenuItemButton({ id, name }: DeleteMenuItemButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    startTransition(async () => {
      const result = await deleteMenuItemAction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${name}" deleted`);
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center gap-1"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {isPending ? "…" : "Delete"}
    </button>
  );
}
