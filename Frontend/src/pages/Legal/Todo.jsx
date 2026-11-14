import React from "react";

// Markiert Angaben, die noch ergänzt oder geprüft werden müssen
const Todo = ({ children }) => (
  <span className="legal-todo">[TODO: {children}]</span>
);

export default Todo;
