"use client";

import { updateTask } from "@/actions/task-actions";
import { User } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface AssignmentFormProps {
  data: any;
}

export const AssignmentForm = ({ data }: AssignmentFormProps) => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => setIsEditing(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);

  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const onSubmit = async (formData: FormData) => {
    const assignedTo = formData.get("assignedTo") as string;
    
    const result = await updateTask(formData);

    if (result?.error) {
      alert(result.error);
    } else {
      alert(`Assigned to ${assignedTo}`);
      disableEditing();
    }
  };

  return (
    <div className="pt-4">
       <div className="flex items-start gap-x-3 mb-2">
          <User className="h-5 w-5 mt-0.5 text-neutral-700" />
          <p className="font-semibold text-neutral-700">Assignee</p>
       </div>
        
       {isEditing ? (
         <form action={onSubmit} ref={formRef} className="ml-8">
            <input hidden name="id" value={data.id} readOnly />
            <input hidden name="boardId" value={params.boardId} readOnly />
            
            <div className="flex gap-x-2">
                <input
                    ref={inputRef}
                    name="assignedTo"
                    defaultValue={data.assignedTo || ""}
                    placeholder="Type name (e.g. Rahul)"
                    className="border-2 border-black px-2 py-1 text-sm outline-none focus:shadow-neo w-full bg-neutral-50"
                />
                <button className="bg-black text-white px-3 py-1 text-xs font-bold hover:opacity-80 transition">
                    Save
                </button>
            </div>
         </form>
       ) : (
         <div onClick={enableEditing} className="ml-8 text-sm font-medium py-1 px-2 hover:bg-neutral-100 cursor-pointer w-fit rounded-sm transition border border-transparent hover:border-neutral-300">
            {data.assignedTo ? (
                <div className="flex items-center gap-x-2">
                   <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold border border-black">
                      {data.assignedTo.charAt(0).toUpperCase()}
                   </div>
                   <span>{data.assignedTo}</span>
                </div>
            ) : (
                <span className="text-neutral-500 italic">Unassigned (Click to edit)</span>
            )}
         </div>
       )}
    </div>
  );
};