import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Схема валідації
const validationSchema = Yup.object({
  todo: Yup.string()
    .min(5, "Має бути не менше 5 символів")
    .required("Обов'язкове поле"),
});

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  const handleAddTodo = (values, { resetForm }) => {
    const newTodo = {
      id: Date.now(),
      text: values.todo,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    resetForm();
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  return (
    <div className="container">
      <h1>TODO Список</h1>
      <Formik
        initialValues={{ todo: "" }}
        validationSchema={validationSchema}
        onSubmit={handleAddTodo}
      >
        {({ isSubmitting }) => (
          <Form className="form js--form">
            <div className="dern">
              <Field
                type="text"
                name="todo"
                className="form__input js--form__input"
              />

              <button
                type="submit"
                className="form__btn"
                disabled={isSubmitting}
              >
                Додати
              </button>
            </div>
            <div>
              <ErrorMessage
                name="todo"
                component="div"
                className="error-message"
              />
            </div>
          </Form>
        )}
      </Formik>

      <ul className="js--todos-wrapper">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${
              todo.completed ? "todo-item--checked" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            <span className="todo-item__description">{todo.text}</span>
            <button
              className="todo-item__delete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
