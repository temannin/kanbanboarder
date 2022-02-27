import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";

export default function App() {
  const [categories, setCategories] = useState<Array<ICategory>>([
    {
      name: "Doing",
      id: nanoid(),
      items: [
        { id: nanoid(), title: "Task 1" },
        { id: nanoid(), title: "Task 2" },
      ],
    },
    { name: "To Do", id: nanoid(), items: [] },
  ]);

  // ran every time the user is done dragging
  const onDragEnd = (e: any) => {
    // clones current state of the entire board.
    let cloneCategories = categories.slice(0);

    // findById finds the "path" ([0,1]) of both the active id and
    // id the of the item that was dragged over
    let origin: number[] = findById(e.active.id);
    let destination: number[] = findById(e.over.id);

    // right now we only support dragging tasks which explains the below if
    // statement. If we want to support dragging entire sections we will
    // just add another if block.
    if (origin.length === 2) {
      // removes item from origin location
      let item = cloneCategories[origin[0]].items.splice(origin[1], 1)[0];

      // adds item to destination
      if (destination.length === 1) {
        cloneCategories[destination[0]].items.push(item);
        setCategories(cloneCategories);
      }
    }
  };

  const findById = (id: string) => {
    for (let index = 0; index < categories.length; index++) {
      const category = categories[index];

      if (id === category.id) {
        return [index];
      }

      for (let itemIndex = 0; itemIndex < category.items.length; itemIndex++) {
        let path: number[] = [];
        const element = category.items[itemIndex];
        path.push(index);
        path.push(itemIndex);

        if (element.id === id) {
          return path;
        }
      }
    }

    return [-1];
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex">
        {categories.map((category) => {
          return (
            <Category {...category}>
              <div className="w-64 h-64">
                {category.items.map((item) => {
                  return (
                    <Draggable id={item.id}>
                      <Task>{item.title}</Task>
                    </Draggable>
                  );
                })}
              </div>
            </Category>
          );
        })}
      </div>
    </DndContext>
  );
}

function Task(props: any) {
  return (
    <div className="bg-orange-100 w-full p-2 rounded shadow">
      {props.children}
    </div>
  );
}

interface ITransaction {
  origin: number[];
  destination: number[];
}

interface ICard {
  id: string;
  title: string;
  description: string;
}

interface ITask {
  title: string;
  id: string;
}

interface ICategory {
  id: string;
  name: string;
  children?: any;
  items: ITask[];
}

function Category(props: ICategory) {
  let id = props.id;

  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const getItems = () => {};

  useEffect(() => {
    getItems();
  }, []);

  let baseClass = "transition-all p-4";

  return (
    <div className="m-4">
      <div>
        <h1 className="text-center font-bold p-2 bg-red-100">{props.name}</h1>
      </div>
      <div className="transition-all bg-gray-100 rounded-b" ref={setNodeRef}>
        <div
          className={isOver ? `${baseClass} bg-blue-100 rounded` : baseClass}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}

function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="mb-2"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
}
