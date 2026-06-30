"use client";

import { deleteContent } from "@/app/admin/actions";

interface DeleteContentButtonProps {
  resource: string;
  id: string;
  returnTo: string;
}

export function DeleteContentButton({ resource, id, returnTo }: DeleteContentButtonProps) {
  return (
    <form
      action={deleteContent}
      onSubmit={(event) => {
        if (!window.confirm("Xóa nội dung này? Thao tác không thể hoàn tác.")) event.preventDefault();
      }}
      className="mt-3"
    >
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="return_to" value={returnTo} />
      <button className="min-h-10 rounded-lg border border-red-500/20 px-3 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300">Xóa nội dung này</button>
    </form>
  );
}
