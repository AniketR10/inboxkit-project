"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { ListItem } from "./list-item";
import { ListForm } from "./list-form"; 
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { useSocket } from "@/hooks/use-socket";

interface Task {
  id: string;
  title: string;
  order: number;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface List {
  id: string;
  title: string;
  order: number;
  boardId: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

interface ListContainerProps {
  boardId: string;
  data: List[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const router = useRouter();
  const { socket, emitChange } = useSocket(boardId);

  const [orderedData, setOrderedData] = useState<List[]>(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      console.log(" Board updated by another user. Refreshing...");
      router.refresh();
    };

    socket.on("refresh-board", handleRefresh);

    return () => {
      socket.off("refresh-board", handleRefresh);
    };
  }, [socket, router]);

  const onDragEnd = async (result: any) => {
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
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      
      await updateListOrder({ items, boardId });
      emitChange(); 
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

        reorderedTasks.forEach((task, idx) => {
          task.order = idx;
        });

        sourceList.tasks = reorderedTasks;
        setOrderedData(newOrderedData);
        
        await updateCardOrder({ items: reorderedTasks, boardId: boardId });
        emitChange();
        
      } else {
        const [movedTask] = sourceList.tasks.splice(source.index, 1);

        movedTask.listId = destination.droppableId;

        destList.tasks.splice(destination.index, 0, movedTask);

        destList.tasks.forEach((task, idx) => {
          task.order = idx;
        });

        setOrderedData(newOrderedData);
        
        await updateCardOrder({ items: destList.tasks, boardId: boardId });
        emitChange();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="vertical">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-y-2 h-full pb-10" 
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} list={list} />
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};