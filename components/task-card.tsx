"use client";

import { useState, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { updateTask, deleteTask } from "@/actions/task-actions"; // Ensure fetch paths are correct
import { useParams } from "next/navigation";
import { Trash2, X, Check } from "lucide-react";
// 1. IMPORT SOCKET HOOK
import { useSocket } from "@/hooks/use-socket";

interface TaskCardProps {
  task: any;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const params = useParams();
  // 2. INITIALIZE SOCKET
  const { emitChange } = useSocket(params.boardId as string);

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const statusColors = {
    NOT_STARTED: "bg-neutral-200 text-neutral-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700",
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  // --- 3. UPDATE ACTIONS TO EMIT CHANGE ---

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    if (title === task.title) {
        setIsEditing(false);
        return;
    }

    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    
    await updateTask(formData);
    
    emitChange(); // <--- Notify others
    setIsEditing(false);
  };

  const onDelete = async () => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    
    await deleteTask(formData);
    
    emitChange(); // <--- Notify others
  };

  const onStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    formData.append("status", newStatus);
    formData.append("title", task.title); // API might require title

    await updateTask(formData);
    
    emitChange(); // <--- Notify others
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="w-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 mb-3 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group relative"
        >
          <div className="flex items-center justify-between mb-3">
             <select 
               value={task.status || "NOT_STARTED"}
               onChange={onStatusChange}
               className={`text-[10px] font-bold uppercase py-1 px-2 rounded border-2 border-black cursor-pointer outline-none hover:opacity-80 transition-opacity ${
                 // @ts-ignore
                 statusColors[task.status] || "bg-neutral-100"
               }`}
               onClick={(e) => e.stopPropagation()}
             >
                <option value="NOT_STARTED">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
             </select>

             {confirmDelete ? (
                <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-5 duration-200 absolute right-2 bg-white border border-black p-1 shadow-sm z-10">
                    <button
                        onClick={onDelete}
                        className="p-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Confirm Delete"
                    >
                        <Check size={14} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => setConfirmDelete(false)}
                        className="p-1 bg-neutral-200 text-black hover:bg-neutral-300 transition-colors"
                        title="Cancel"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
             ) : (
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
             )}
          </div>

          {isEditing ? (
            <form action={onSubmit} ref={formRef} className="w-full">
              <textarea
                name="title"
                defaultValue={task.title}
                onKeyDown={onKeyDown}
                onBlur={() => formRef.current?.requestSubmit()}
                className="w-full bg-yellow-50 border-2 border-black p-2 text-sm font-medium focus:outline-none resize-none min-h-20"
                autoFocus
              />
            </form>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium min-h-15 cursor-text wrap-break-word leading-relaxed text-neutral-700"
            >
              {task.title}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};