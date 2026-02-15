"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListItem } from "./list-item";
import { ListForm } from "./list-form";

interface ListContainerProps {
  boardId: string;
  data: any[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      );
      setOrderedData(items);
      return;
    }

    if (type === "task") {
      let newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destList = newOrderedData.find(list => list.id === destination.droppableId);

      if (!sourceList || !destList) {
        return;
      }

      if (!sourceList.tasks) sourceList.tasks = [];
      if (!destList.tasks) destList.tasks = [];

      if (source.droppableId === destination.droppableId) {
        const reorderedTasks = reorder(
          sourceList.tasks,
          source.index,
          destination.index
        );

        sourceList.tasks = reorderedTasks;
        
        setOrderedData(newOrderedData);
      } else {
        const [movedTask] = sourceList.tasks.splice(source.index, 1);

        movedTask.listId = destination.droppableId;
        destList.tasks.splice(destination.index, 0, movedTask);

        setOrderedData(newOrderedData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} list={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};