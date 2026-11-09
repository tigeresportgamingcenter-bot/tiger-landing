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
      className="mt-4"
    >
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="return_to" value={returnTo} />
      <button className="press min-h-12 rounded-lg bg-red-500/15 px-5 text-base font-bold text-red-200 transition-colors hover:bg-red-500/25">Xóa nội dung này</button>
    </form>
  );
}
