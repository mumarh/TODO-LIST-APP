import React, { useState, useEffect } from "react";
import "./TodoList.css";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";


const todoKey = "reactTodo";
     
     //Get Data Function
const getTodosFromLocalStorage = () => {
  const saved = localStorage.getItem(todoKey);
  if(!saved) return [];
  return JSON.parse(saved);
};
       
        //Store Data Function
const saveTodosToLocalStorage = (todos) => {
  localStorage.setItem(todoKey, JSON.stringify(todos));
};

const TodoList = () => {
  const [Todos, setTodos] = useState(getTodosFromLocalStorage);
  const [inputvalue, setInputvalue] = useState("");
  const [dateTime, setDateTime] = useState("");

       //Date Function
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      setDateTime(`${formattedDate} - ${formattedTime}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


     //Submit Function
  const handleAddTodo = (e) => {
    e.preventDefault();

    if (!inputvalue.trim()) return;

    const todoTexts = Todos.map((todo) => todo.text.toLowerCase());
    if (todoTexts.includes(inputvalue.trim().toLowerCase())) {
      setInputvalue("");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputvalue.trim(),
      completed: false,
    };

    const updatedTodos = [newTodo, ...Todos];
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
    setInputvalue("");
  };


    //Toggle function
  const toggleCompleted = (id) => {
    const updatedTodos = Todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };


      //Delete Function
  const handleDelete = (id) => {
    const updatedTodos = Todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };


  return (
    <>
      <form onSubmit={handleAddTodo} className="todo-form">
        <h1 className="todo-title">Todo List App</h1>
        <h2 className="datetime">{dateTime}</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter the task"
            value={inputvalue}
            onChange={(e) => setInputvalue(e.target.value)}
            className="todo-input"
          />
          <button type="submit" className="btn btn-add">
            Add
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
                onClick={() => toggleCompleted(todo.id)}
                title="Mark as completed"
              >
                <FaCheck />
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(todo.id)}
                title="Delete task"
              >
                <MdDeleteForever />
              </button>
            </li>
          ))}
            <button
            className="btn btn-clear"
            onClick={() => {
            setTodos([]);
            saveTodosToLocalStorage([]);
            }}>
            Clear All
            </button>
        </ul>
      </form>
    </>
  );
};

export default TodoList;