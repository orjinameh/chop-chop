"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createMenuItemAction, updateMenuItemAction } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import type { MenuItem, Category } from "@/types";

interface MenuItemFormProps {
  categories: Category[];
  item?:      MenuItem; // present when editing
}

export function MenuItemForm({ categories, item }: MenuItemFormProps) {
  const router   = useRouter();
  const formRef  = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(item?.image ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = item
        ? await updateMenuItemAction(item.id, fd)
        : await createMenuItemAction(fd);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(item ? "Item updated" : "Item created");
        router.push("/admin/menu");
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl">
      <div className="card p-6 flex flex-col gap-5">

        {/* Name */}
        <Input
          label="Item Name"
          name="name"
          placeholder="e.g. Party Jollof Rice"
          defaultValue={item?.name}
          required
        />

        {/* Description */}
        <Textarea
          label="Description"
          name="description"
          placeholder="Short description of the dish…"
          rows={3}
          defaultValue={item?.description ?? ""}
        />

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (₦)"
            name="price"
            type="number"
            step="50"
            min="0"
            placeholder="2500"
            defaultValue={item?.price}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Category</label>
            <select
              name="categoryId"
              defaultValue={item?.categoryId ?? ""}
              required
              className="h-10 w-full rounded border border-ink-faint bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="" disabled>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Image URL"
            name="image"
            type="url"
            placeholder="https://images.unsplash.com/…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            hint="Paste a direct image URL (Unsplash, Cloudinary, etc.)"
          />
          {imageUrl && (
            <div className="relative h-32 w-32 rounded overflow-hidden border border-ink-faint mt-1">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="128px"
                onError={() => setImageUrl("")}
              />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              value="true"
              defaultChecked={item?.isAvailable ?? true}
              className="h-4 w-4 rounded border-ink-faint text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-ink">Available for ordering</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              value="true"
              defaultChecked={item?.isFeatured ?? false}
              className="h-4 w-4 rounded border-ink-faint text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-ink">Feature on homepage</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-ink-faint">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <><Spinner size="sm" /> Saving…</>
            ) : item ? (
              "Save Changes"
            ) : (
              "Create Item"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
