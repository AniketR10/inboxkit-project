"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createTask } from "@/actions/create-task";
import { useParams } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full bg-accent text-white p-2 font-bold border-2 border-black shadow-neo hover:bg-highlight hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-sm"
    >
      {pending ? "Adding..." : "Add Card"}
    </button>
  );
}

interface TaskFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

export const TaskForm = ({
  listId,
  enableEditing,
  disableEditing,
  isEditing
}: TaskFormProps) => {
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={async (formData) => {
           formData.append("listId", listId);
           formData.append("boardId", params.boardId as string);
           await createTask(formData);
           disableEditing();
        }}
        className="m-1 py-0.5 px-1 space-y-4"
      >
        <textarea
          id="title"
          name="title"
          required
          placeholder="Enter a title for this card..."
          className="w-full bg-white border-2 border-black p-2 outline-none focus:shadow-neo transition-all font-medium resize-none"
        />
        <div className="flex items-center gap-x-2">
          <SubmitButton />
          <button
            onClick={disableEditing}
            type="button"
            className="px-2 py-2 text-sm font-bold hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="pt-2 px-2">
      <button
        onClick={enableEditing}
        className="h-auto w-full justify-start rounded-none p-2 px-2 text-sm font-medium text-neutral-600 hover:text-black hover:bg-neutral-200 flex items-center gap-x-1"
      >
        <span>+</span> Add a card
      </button>
    </div>
  );
};