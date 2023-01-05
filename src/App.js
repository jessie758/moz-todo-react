// import logo from './logo.svg';
// import './App.css';
import React, { useState } from "react";
import { nanoid } from "nanoid";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";


// ？？？為什麼task尚未宣告可以直接拿來用？？？
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

// props傳遞物件陣列
function App(props) {
  
  // 使用state處理任務的變動(初始值為index.js傳過來的三個任務)
  const [tasks, setTasks] = useState(props.tasks);

  // 使用state處理過濾器的變動(初始值為All)
  const [filter, setFilter] = useState('All');

  // ？？？有bug？？？
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // 先比對id，直到找到要修改的目標task
      if (id === task.id) {
        return {...task, completed: !task.completed};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return {...task, name: newName};
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }
  
  // 使用map()迭代呼叫Todo()以渲染出待辦事項任務
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    )
  );

  // 使用map()迭代呼叫FilterButton()以渲染出過濾器按鈕
  const filterList = FILTER_NAMES.map((name) => 
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  );
  
  // 處理 <h2> task的單複數顯示文字
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  /* addTask()同時會連動Form和App元件，因此寫在App裡，
     Form則是有需要時再調用（eg回傳資料時）
   */
  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false};
    setTasks([...tasks, newTask]);
  }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}


export default App;
