"use client";

import { useState } from "react";

const TODO = [
  {
    id: 1,
    item: "first task",
    status: false,
  },
];

export default function Home() {
  const [todos, setTodos] = useState(TODO);
  const [inputValue, setInputValue] = useState("");

  const handleDelete = (id) => {
    setTodos((prevState) => prevState.filter((todo) => todo.id != id));
  };
  const handleFinished = (id) => {
    console.log("id", id);
    setTodos((prevState) =>
      prevState.map((todo) => {
        if (todo.id === id) {
          return {
            id,
            item: todo.item,
            status: true,
          };
        } else {
          return todo;
        }
      })
    );
  };

  const addTodo = () => {
    if (!inputValue) return;

    const newTodo = {
      id: todos.length + 1,
      item: inputValue,
      status: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          placeholder="Enter task here"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <table>
        <tr>
          <th>No</th>
          <th>Todo Item</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        {todos.map((todo) => (
          <tr>
            <td>{todo.id}</td>
            <td>{todo.item}</td>
            <td>{todo.status ? "Complete" : "Pending"}</td>
            <td>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
              <button onClick={() => handleFinished(todo.id)}>Finished</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
