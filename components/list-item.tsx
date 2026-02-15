"use client";

import { useState } from "react";
import { TaskForm } from "./task-form";
import { Draggable, Droppable } from "@hello-pangea/dnd";

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
          className="w-full bg-white border-2 border-black shadow-sm p-2 mb-2 hover:shadow-neo transition-all cursor-pointer"
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
          className="shrink-0 w-80 h-full mr-4"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-none bg-neutral-100 border-2 border-black shadow-neo pb-2"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-2 border-b-2 border-black mb-2 bg-white">
              <h3 className="font-black text-sm">{list.title}</h3>
              <button className="hover:bg-neutral-200 p-1 font-bold text-xs">•••</button>
            </div>

            <Droppable droppableId={list.id} type="task">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-y-2 px-1 mx-1 h-full min-h-12.5"
                >
                  {list.tasks.map((task: any, index: number) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <TaskForm
              listId={list.id}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};