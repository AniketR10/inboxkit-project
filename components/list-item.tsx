"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskForm } from "./task-form";

interface TaskCardProps {
  task: any;
  index: number;
}

function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="w-full bg-amber-100 border-2 border-black shadow-sm p-2 mb-2 hover:shadow-neo transition-all cursor-pointer"
        >
          <span className="font-medium text-sm">{task.title}</span>
        </div>
      )}
    </Draggable>
  );
}

interface ListItemProps {
  list: any;
  index: number;
}

export const ListItem = ({ list, index }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
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
              <h3 className="font-black text-sm uppercase tracking-wide">{list.title}</h3>
              <button className="hover:bg-black/10 p-1 rounded font-bold text-xs transition">•••</button>
            </div>

            <Droppable droppableId={list.id} type="task">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-y-2 px-2 mx-1 h-full min-h-12.5 bg-neutral-50/50"
                >
                  {list.tasks.map((task: any, index: number) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <div className="px-2">
                 <TaskForm
                    listId={list.id}
                    isEditing={isEditing}
                    enableEditing={enableEditing}
                    disableEditing={disableEditing}
                 />
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};