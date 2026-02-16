"use client";

import { useState, useRef } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskForm } from "./task-form";
import { TaskCard } from "./task-card";
import { updateList, deleteList } from "@/actions/list-actions";
import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/use-socket";

interface ListItemProps {
  list: any;
  index: number;
}

export const ListItem = ({ list, index }: ListItemProps) => {
  const params = useParams();
  
  const { emitChange } = useSocket(params.boardId as string);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    
    if (title === list.title) {
        disableEditing();
        return;
    }
    
    formData.append("id", list.id);
    formData.append("boardId", params.boardId as string);
    
    await updateList(formData);
    emitChange();
    
    disableEditing();
  };

  const onDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this list?");
    
    if (!confirmed) {
      return; 
    }

    const formData = new FormData();
    formData.append("id", list.id);
    formData.append("boardId", params.boardId as string);
    
    await deleteList(formData);
    emitChange();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        formRef.current?.requestSubmit();
    }
  };

  const enableAddingCard = () => {
    setIsAddingCard(true);
  };

  const disableAddingCard = () => {
    setIsAddingCard(false);
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 w-full mb-6 bg-transparent"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-none bg-white border-2 border-black shadow-neo pb-2"
          >
            <div className="flex items-center justify-between px-3 py-3 border-b-2 border-black mb-2 bg-pink-200">
              {isEditing ? (
                 <form action={onSubmit} ref={formRef} className="flex-1 px-2">
                    <input 
                       ref={inputRef}
                       onKeyDown={onKeyDown}
                       name="title"
                       defaultValue={list.title}
                       onBlur={() => formRef.current?.requestSubmit()}
                       className="text-sm font-black bg-transparent focus:bg-white border-none outline-none w-full"
                    />
                    <button type="submit" hidden />
                 </form>
              ) : (
                 <div 
                   onClick={enableEditing}
                   className="font-black text-sm uppercase tracking-wide cursor-pointer w-full truncate"
                 >
                   {list.title}
                 </div>
              )}

              <div className="relative group/actions ml-2">
                  <button className="hover:bg-black/10 p-1 rounded font-bold text-xs transition">•••</button>
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white border-2 border-black shadow-neo hidden group-hover/actions:block z-50 p-1">
                      <p className="text-[10px] text-neutral-400 font-bold px-2 py-1">ACTIONS</p>
                      <button 
                        onClick={onDelete}
                        className="w-full text-left px-2 py-2 text-xs hover:bg-red-100 hover:text-red-600 font-bold border-t border-neutral-100"
                      >
                        Delete List
                      </button>
                  </div>
              </div>
            </div>

            <Droppable droppableId={list.id} type="task">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-y-2 px-2 mx-1 h-full min-h-12.5 transition-colors ${
                      list.tasks.length > 0 ? "bg-transparent" : "bg-neutral-50/50"
                  }`}
                >
                  {list.tasks.map((task: any, index: number) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <div className="px-2 mt-2">
               <TaskForm
                  listId={list.id}
                  isEditing={isAddingCard}       
                  enableEditing={enableAddingCard} 
                  disableEditing={disableAddingCard}
               />
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};