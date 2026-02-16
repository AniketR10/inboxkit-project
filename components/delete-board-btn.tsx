"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      disabled={pending}
      type="submit" 
      className="text-neutral-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export const DeleteBoardButton = ({ boardId }: { boardId: string }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this board?");
    
    if (!confirmed) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteBoard} onSubmit={handleSubmit} className="z-50">
      <input type="hidden" name="boardId" value={boardId} />
      <SubmitButton />
    </form>
  );
};