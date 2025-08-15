import React, { useState, useEffect } from "react";
import "./TodoList.css";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const todoKey = "reactTodo";

const getTodosFromLocalStorage = () => {
  const saved = localStorage.getItem(todoKey);
  if (!saved) return [];
  return JSON.parse(saved);
};

const saveTodosToLocalStorage = (todos) => {
  localStorage.setItem(todoKey, JSON.stringify(todos));
};

const TodoList = () => {
  const [Todos, setTodos] = useState(getTodosFromLocalStorage);
  const [inputValue, setInputValue] = useState("");
  const [dateTime, setDateTime] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      setDateTime(`${formattedDate} - ${formattedTime}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddOrUpdateTodo = (e) => {
    e.preventDefault();
    if (!inputValue) return;

    // Prevent duplicate values
    const isDuplicate = Todos.some(
      (todo) =>
        todo.text.toLowerCase() === inputValue.toLowerCase() &&
        (!isEditing || todo.id !== editTodoId)
    );

    if (isDuplicate) {
      setInputValue("");
      return;
    }

    if (isEditing) {
      const updatedTodos = Todos.map((todo) =>
        todo.id === editTodoId ? { ...todo, text: inputValue } : todo
      );
      setTodos(updatedTodos);
      saveTodosToLocalStorage(updatedTodos);
      setIsEditing(false);
      setEditTodoId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      const updatedTodos = [newTodo, ...Todos];
      setTodos(updatedTodos);
      saveTodosToLocalStorage(updatedTodos);
    }

    setInputValue("");
  };

  const handleEdit = (todo) => {
    setInputValue(todo.text);
    setIsEditing(true);
    setEditTodoId(todo.id);
  };

  const toggleCompleted = (id) => {
    const updatedTodos = Todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleDelete = (id) => {
    const updatedTodos = Todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);

    if (isEditing && id === editTodoId) {
      setIsEditing(false);
      setEditTodoId(null);
      setInputValue("");
    }
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    setTodos([]);
    saveTodosToLocalStorage([]);
    setInputValue("");
    setIsEditing(false);
    setEditTodoId(null);
  };

  return (
    <>
      <form onSubmit={handleAddOrUpdateTodo} className="todo-form">
        <h1 className="todo-title">Todo List App</h1>
        <h2 className="datetime">{dateTime}</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter the task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="todo-input"
          />
          <button type="submit" className="btn btn-add">
            {isEditing ? "Update" : "Add"}
          </button>
        </div>

        <ul className="todo-list">
          {Todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <span className="todo-text">{todo.text}</span>

              <button
                className="btn btn-tick"
                type="button"
                onClick={() => toggleCompleted(todo.id)}
                title="Mark as completed"
              >
                <FaCheck />
              </button>

              <button
                className="btn btn-edit"
                type="button"
                onClick={() => handleEdit(todo)}
                title="Edit task"
              >
                <MdEdit />
              </button>

              <button
                className="btn btn-delete"
                type="button"
                onClick={() => handleDelete(todo.id)}
                title="Delete task"
              >
                <MdDeleteForever />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="btn btn-clear"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </form>
    </>
  );
};

export default TodoList;
