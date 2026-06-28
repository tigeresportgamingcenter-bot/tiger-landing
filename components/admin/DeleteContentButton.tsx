"use client";

import { deleteContent } from "@/app/admin/actions";

interface DeleteContentButtonProps {
  resource: string;
  id: string;
}

export function DeleteContentButton({ resource, id }: DeleteContentButtonProps) {
  return (
    <form
      action={deleteContent}
      onSubmit={(event) => {
        if (!window.confirm("Xóa nội dung này? Thao tác không thể hoàn tác.")) event.preventDefault();
      }}
    >
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="id" value={id} />
      <button className="min-h-10 px-2 text-xs font-bold text-red-400 hover:text-red-300">Xóa nội dung này</button>
    </form>
  );
}
