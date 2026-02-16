"use client";

import { useState, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { updateTask, deleteTask } from "@/actions/task-actions";
import { useParams } from "next/navigation";
import { Trash2, X, Check, User, Plus } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";

interface TaskCardProps {
  task: any;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const params = useParams();
  const { emitChange } = useSocket(params.boardId as string);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const titleFormRef = useRef<HTMLFormElement>(null);
  const assigneeFormRef = useRef<HTMLFormElement>(null);

  const onTitleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    if (title === task.title) {
        setIsEditingTitle(false);
        return;
    }
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    await updateTask(formData);
    emitChange();
    setIsEditingTitle(false);
  };

  const onAssigneeSubmit = async (formData: FormData) => {
    const assignedTo = formData.get("assignedTo") as string;
    if (assignedTo === task.assignedTo) {
        setIsEditingAssignee(false);
        return;
    }
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    await updateTask(formData);
    emitChange();
    setIsEditingAssignee(false);
  };

  const onDelete = async () => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    await deleteTask(formData);
    emitChange();
  };

  const onStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("boardId", params.boardId as string);
    formData.append("status", e.target.value);
    await updateTask(formData);
    emitChange();
  };

  const onKeyDown = (e: React.KeyboardEvent, ref: React.RefObject<HTMLFormElement | null>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.requestSubmit();
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="w-full bg-white border-2 border-black shadow-neo p-3 mb-3 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group relative"
        >
          <div className="flex items-center justify-between mb-3">
             <select 
               value={task.status || "NOT_STARTED"}
               onChange={onStatusChange}
               className="text-[10px] font-bold uppercase py-1 px-2 rounded border-2 border-black cursor-pointer outline-none hover:opacity-80 transition-opacity bg-neutral-100"
               onClick={(e) => e.stopPropagation()}
             >
                <option value="NOT_STARTED">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
             </select>

             {confirmDelete ? (
                <div className="flex items-center gap-1 absolute right-2 bg-white border border-black p-1 shadow-sm z-10">
                    <button onClick={onDelete} className="p-1 bg-red-500 text-white hover:bg-red-600">
                        <Check size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="p-1 bg-neutral-200 text-black hover:bg-neutral-300">
                        <X size={14} />
                    </button>
                </div>
             ) : (
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
             )}
          </div>

          {isEditingTitle ? (
            <form action={onTitleSubmit} ref={titleFormRef} className="w-full mb-3">
              <textarea
                name="title"
                defaultValue={task.title}
                onKeyDown={(e) => onKeyDown(e, titleFormRef)}
                onBlur={() => titleFormRef.current?.requestSubmit()}
                className="w-full bg-yellow-50 border-2 border-black p-2 text-sm font-medium focus:outline-none resize-none min-h-20"
                autoFocus
              />
            </form>
          ) : (
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-medium min-h-16 cursor-text mb-3 text-neutral-700"
            >
              {task.title}
            </div>
          )}

          <div className="pt-2">
            {isEditingAssignee ? (
                <form 
                    action={onAssigneeSubmit} 
                    ref={assigneeFormRef}
                    className="flex items-center gap-2"
                >
                    <div className="relative w-full">
                        <User size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                            name="assignedTo"
                            defaultValue={task.assignedTo || ""}
                            placeholder="Type name..."
                            autoFocus
                            onBlur={() => assigneeFormRef.current?.requestSubmit()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    assigneeFormRef.current?.requestSubmit();
                                }
                            }}
                            className="w-full text-xs border border-black pl-7 pr-2 py-1.5 bg-neutral-50 outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                </form>
            ) : (
                <div 
                    onClick={() => setIsEditingAssignee(true)}
                    className="w-fit cursor-pointer"
                >
                    {task.assignedTo ? (
                        <div className="flex items-center gap-2 bg-yellow-100 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-2 py-1 transition-transform hover:-translate-y-0.5">
                            <div className="h-4 w-4 bg-black text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                                {task.assignedTo.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-bold text-black max-w-30 truncate">
                                {task.assignedTo}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 py-1 px-2 -ml-2 rounded transition-colors group/btn">
                             <div className="border border-dashed border-neutral-400 p-0.5 rounded-full group-hover/btn:border-black">
                                <Plus size={12} />
                             </div>
                             <span className="text-xs font-bold">Assign</span>
                        </div>
                    )}
                </div>
            )}
          </div>

        </div>
      )}
    </Draggable>
  );
};