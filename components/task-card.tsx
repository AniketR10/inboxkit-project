"use client";

import { useState, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { updateTask, deleteTask } from "@/actions/task-actions";
import { useParams } from "next/navigation";

interface TaskCardProps {
  task: any;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusColors = {
    NOT_STARTED: "bg-neutral-200 text-neutral-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700",
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      formRef.current?.requestSubmit();
    }
  };

  const onSubmit = async (formData: FormData) => {
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    await updateTask(formData);
    setIsEditing(false);
  };

  const onDelete = async () => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    await deleteTask(formData);
  };

  const onStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    formData.append("status", e.target.value);
    await updateTask(formData);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="w-full bg-amber-100 border-2 border-black shadow-sm p-3 mb-3 hover:shadow-neo transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
             <select 
               defaultValue={task.status}
               onChange={onStatusChange}
               className={`text-[10px] font-bold uppercase p-1 rounded border border-black/10 cursor-pointer outline-none ${statusColors[task.status as keyof typeof statusColors] || "bg-white"}`}
             >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
             </select>

             {confirmDelete ? (
                <div className="flex gap-2 text-xs">
                    <button
                    onClick={onDelete}
                    className="px-2 py-1 bg-red-600 text-white font-bold border hover:cursor-pointer border-black hover:scale-105"
                    >
                    Delete
                    </button>
                    <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 bg-white border border-black hover:cursor-pointer"
                    >
                    Cancel
                    </button>
                </div>
                ) : (
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-neutral-400 opacity-0 group-hover:opacity-100 
                            hover:text-red-600 hover:scale-125 hover:cursor-pointer transition-all"
                >
                    🗑️
                </button>
                )}


          </div>

          {isEditing ? (
            <form action={onSubmit} ref={formRef}>
              <textarea
                name="title"
                defaultValue={task.title}
                onKeyDown={onKeyDown}
                onBlur={() => formRef.current?.requestSubmit()}
                className="w-full bg-white border border-black p-1 text-sm focus:outline-none resize-none h-16"
                autoFocus
              />
              <button type="submit" hidden />
            </form>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium min-h-10 cursor-text wrap-break-word"
            >
              {task.title}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};