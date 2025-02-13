import { useState, useReducer } from 'react'
import { Notice } from 'obsidian'
import clsx from 'clsx'
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react'

import styles from './TodoList.module.css'
import { TodoItemType, TodoListReducerAction } from '../types/todo'
import { todoReducer } from '../reducers/todoReducer'

export function TodoList() {
  const [todoList, todoDispatch] = useReducer(todoReducer, [
    //   { completed: false, todo: 'finish react component' },
    //   { completed: true, todo: 'set up server' },
    //   { completed: false, todo: 'write documentation' },
  ])
  const [inCompletedTab, setInCompletedTab] = useState(false)
  const [editingWhichTodo, setEditingWhichTodo] = useState(-1)

  const editThisTodo = (id: number) => setEditingWhichTodo(id)
  const endEditingTodo = () => setEditingWhichTodo(-1)

  return (
    <section>
      <div className={styles.tabs}>
        <div
          className={clsx(styles.tabItem, {
            [styles.tabItemActive]: !inCompletedTab,
          })}
          onClick={() => setInCompletedTab(false)}
        >
          To do
        </div>
        <div
          className={clsx(styles.tabItem, {
            [styles.tabItemActive]: inCompletedTab,
          })}
          onClick={() => setInCompletedTab(true)}
        >
          Completed
        </div>
      </div>
      <div className={styles.todoList}>
        {todoList.map((todoItem, id) => {
          if (todoItem.completed === inCompletedTab) {
            return (
              <TodoItem
                key={id}
                todoItem={todoItem}
                id={id}
                todoDispatcher={todoDispatch}
                editingWhichTodo={editingWhichTodo}
                editThisTodo={() => editThisTodo(id)}
                endEditingTodo={endEditingTodo}
              />
            )
          }
        })}
        {!inCompletedTab && (
          <NewTodoInput
            addNewTodo={(todo: string) =>
              todoDispatch({ type: 'add', todo: todo })
            }
          />
        )}
        {inCompletedTab &&
          (todoList.filter((todoItem) => todoItem.completed).length > 0 ? (
            <button
              onClick={() => todoDispatch({ type: 'removeCompleted' })}
              aria-label="remove completed todos"
            >
              Clear
            </button>
          ) : (
            <i>No completed tasks.</i>
          ))}
      </div>
    </section>
  )
}

interface TodoItemProps {
  todoItem: TodoItemType
  id: number
  todoDispatcher: (action: TodoListReducerAction) => void
  editingWhichTodo: number
  editThisTodo: () => void
  endEditingTodo: () => void
}

function TodoItem(props: TodoItemProps) {
  const [input, setInput] = useState(props.todoItem.todo)

  const toggleTodoCompleted = () => {
    props.todoDispatcher({ type: 'toggle', todoId: props.id })
    new Notice(`Moved to ${!props.todoItem.completed ? 'Completed' : 'To do'}`)
  }

  const removeTodo = () => {
    props.todoDispatcher({ type: 'remove', todoId: props.id })
    new Notice('Todo removed')
  }

  const confirmNewTodoChange = () => {
    props.todoDispatcher({ type: 'edit', todoId: props.id, newTodo: input })
    props.endEditingTodo()
  }

  return (
    <div className={styles.todoItem} aria-label="todo item">
      {props.editingWhichTodo === props.id ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.input}
          />
          <div className={styles.todoItemBtnGroup}>
            <div
              className={styles.iconBtn}
              onClick={confirmNewTodoChange}
              aria-label="submit edited todo"
            >
              <CheckIcon size={14} />
            </div>
            <div className={styles.iconBtn} onClick={props.endEditingTodo}>
              <XIcon size={14} />
            </div>
          </div>
        </>
      ) : (
        <>
          <input
            id={props.id.toString()}
            type="checkbox"
            aria-label="checkbox"
            checked={props.todoItem.completed}
            onChange={toggleTodoCompleted}
          />
          <label htmlFor={props.id.toString()}>{props.todoItem.todo}</label>
          <div className={styles.todoItemBtnGroup}>
            <div
              className={styles.iconBtn}
              onClick={props.editThisTodo}
              aria-label="edit todo"
            >
              <PencilIcon size={14} />
            </div>
            <div
              className={styles.iconBtn}
              onClick={removeTodo}
              aria-label="remove todo"
            >
              <TrashIcon size={14} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface NewTodoInputProps {
  addNewTodo: (todo: string) => void
}

function NewTodoInput(props: NewTodoInputProps) {
  const [input, setInput] = useState('')

  const resetInput = () => setInput('')

  const confirmAddNewTodo = () => {
    props.addNewTodo(input)
    resetInput()
  }

  return (
    <div className={styles.todoItem}>
      <input
        className={styles.input}
        placeholder="To do:"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className={styles.todoItemBtnGroup}>
        <div
          className={styles.iconBtn}
          onClick={confirmAddNewTodo}
          aria-label="add todo"
          role="button"
        >
          <CheckIcon size={14} />
        </div>
        <div className={styles.iconBtn} onClick={resetInput}>
          <XIcon size={14} />
        </div>
      </div>
    </div>
  )
}
