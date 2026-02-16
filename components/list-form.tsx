"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createList } from "@/actions/create-list";
import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/use-socket";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full bg-accent text-white p-2 font-bold border-2 border-black shadow-neo hover:bg-highlight hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
    >
      {pending ? "Adding..." : "Add List"}
    </button>
  );
}

export const ListForm = () => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { emitChange } = useSocket(params.boardId as string);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      const input = formRef.current?.querySelector("input");
      if (input) (input as HTMLInputElement).focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="shrink-0 w-full h-fit p-3 bg-white border-2 border-black shadow-neo rounded-none mb-4">
        <form
          ref={formRef}
          action={async (formData) => {
             const title = formData.get("title") as string;
             if (!title || title.trim() === "") return;

             formData.append("boardId", params.boardId as string);
             
             await createList(formData);
             
             emitChange(); 
             
             disableEditing();
          }}
          className="space-y-3"
        >
          <input
            id="title"
            name="title"
            required
            placeholder="Enter list title..."
            className="w-full border-2 border-black p-2 outline-none focus:shadow-neo transition-all font-bold text-sm"
          />
          <div className="flex items-center gap-x-2">
            <SubmitButton />
            <button
              onClick={disableEditing}
              type="button"
              className="px-3 py-2 text-sm font-bold hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={enableEditing}
      className="w-full rounded-none bg-accent text-white p-3 font-bold border-2 border-black shadow-neo hover:bg-highlight hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-x-2"
    >
      <span>+</span> Create New List
    </button>
  );
};