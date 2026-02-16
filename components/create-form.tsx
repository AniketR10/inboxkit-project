"use client";

import { createBoard } from "@/actions/create-board";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full px-6 py-3 bg-accent text-white font-bold border-2 border-black shadow-neo hover:bg-highlight hover:text-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create Board"}
    </button>
  );
}

export const CreateForm = () => {
  
  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    
    if (title.length < 3) {
      alert("Title must be at least 3 characters long");
      return;
    }

    try {
      await createBoard(formData);
    } catch (error) {
      alert("Failed to create board. Title might be too short.");
    }
  };

  return (
    <form action={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-xs">
      <input
        id="title"
        name="title"
        required
        minLength={3}
        placeholder="Enter board title..."
        className="w-full border-2 border-black p-2 outline-none focus:shadow-neo focus:border-accent transition-all"
      />
      <SubmitButton />
    </form>
  );
};