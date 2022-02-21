import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { nanoid } from "nanoid";

export default function App() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = <Draggable>Drag me</Draggable>;

  const [categories, setCategories] = useState(["To Do", "Doing", "Done"]);

  return (
    <DndContext
      onDragOver={(e: any) => {
        console.log(e);
      }}
      onDragStart={(e: any) => {
        console.log("Start");
      }}
      onDragEnd={handleDragEnd}
    >
      {!isDropped ? draggableMarkup : null}
      <div className="flex">
        {categories.map((item) => {
          return <Sector name={item} />;
        })}
      </div>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  }
}

interface SectorProps {
  name: string;
}

interface ICard {
  id: string;
}

function Sector(props: SectorProps) {
  const [cards, setCards] = useState<Array<ICard>>([]);

  return (
    <Droppable id={props.name}>
      <div className="w-64 h-64 bg-blue-500 m-4"></div>
    </Droppable>
  );
}

function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div className="transition-all p-8" ref={setNodeRef}>
      <div
        className={
          isOver
            ? "transition-all bg-green-300 p-4"
            : "transition-all bg-white p-4"
        }
      >
        {props.children}
      </div>
    </div>
  );
}

function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
