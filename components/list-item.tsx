"use client";

import { useState } from "react";
import { TaskForm } from "./task-form";

function TaskCard({ task }: { task: any }) {
  return (
    <div className="w-full bg-white border-2 border-black shadow-sm p-2 mb-2 hover:shadow-neo transition-all cursor-pointer">
      <span className="font-medium text-sm">{task.title}</span>
    </div>
  );
}

export const ListItem = ({ list }: { list: any }) => {
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="shrink-0 w-80 bg-neutral-100 border-2 border-black shadow-neo p-2 mr-4 h-fit max-h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b-2 border-black mb-2 bg-white">
         <h3 className="font-black text-sm">{list.title}</h3>
         <button className="hover:bg-neutral-200 p-1 font-bold text-xs">•••</button>
      </div>

      <div className="flex flex-col gap-y-2 px-1 overflow-y-auto">
         {list.tasks.map((task: any) => (
            <TaskCard key={task.id} task={task} />
         ))}
      </div>

      <TaskForm 
        listId={list.id} 
        isEditing={isEditing}
        enableEditing={enableEditing}
        disableEditing={disableEditing}
      />
    </div>
  );
};