import { useState, useReducer } from 'react'
import { Notice } from 'obsidian'
import clsx from 'clsx'
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react'

import styles from './TodoList.module.css'
import { TodoItemType } from '../types/todo'
import { todoReducer } from '../reducers/todoReducer'

export function TodoList() {
  const [todoList, todoDispatch] = useReducer(todoReducer, [
    { completed: false, todo: 'finish react component' },
    { completed: true, todo: 'set up server' },
    { completed: false, todo: 'write documentation' },
  ])
  const [inCompletedTab, setInCompletedTab] = useState(false)
  const [editingTodo, setEditingTodo] = useState(-1)

  const editThisTodo = (id: number) => setEditingTodo(id)
  const endEditingTodo = () => setEditingTodo(-1)

  return (
    <div>
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
      <section>
        {todoList.map((todoItem, id) => {
          if (todoItem.completed === inCompletedTab) {
            return (
              <TodoItem
                key={id}
                todoItem={todoItem}
                id={id}
                toggleTodoCheckedState={() => {
                  todoDispatch({ type: 'toggle', todoId: id })
                  new Notice(
                    `Moved to ${!todoItem.completed ? 'Completed' : 'To do'}`,
                  )
                }}
                removeTodo={() => {
                  todoDispatch({ type: 'remove', todoId: id })
                  new Notice('Todo removed')
                }}
                editingTodo={editingTodo}
                editThisTodo={() => editThisTodo(id)}
                endEditTodo={endEditingTodo}
                editTodo={(newTodo: string) =>
                  todoDispatch({ type: 'edit', todoId: id, newTodo: newTodo })
                }
              />
            )
          }
        })}
      </section>
    </div>
  )
}

interface TodoItemProps {
  todoItem: TodoItemType
  id: number
  toggleTodoCheckedState: () => void
  removeTodo: () => void
  editingTodo: number
  editThisTodo: () => void
  endEditTodo: () => void
  editTodo: (newTodo: string) => void
}

function TodoItem(props: TodoItemProps) {
  const [input, setInput] = useState(props.todoItem.todo)

  const confirmNewTodoChange = () => {
    props.editTodo(input)
    props.endEditTodo()
  }

  return (
    <div className={styles.todoItem}>
      {props.editingTodo === props.id ? (
        <>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <div className={styles.todoItemBtnGroup}>
            <div className={styles.iconBtn} onClick={confirmNewTodoChange}>
              <CheckIcon size={14} />
            </div>
            <div className={styles.iconBtn} onClick={props.endEditTodo}>
              <XIcon size={14} />
            </div>
          </div>
        </>
      ) : (
        <>
          <input
            id={props.id.toString()}
            type="checkbox"
            checked={props.todoItem.completed}
            onChange={props.toggleTodoCheckedState}
          />
          <label htmlFor={props.id.toString()}>{props.todoItem.todo}</label>
          <div className={styles.todoItemBtnGroup}>
            <div className={styles.iconBtn} onClick={props.editThisTodo}>
              <PencilIcon size={14} />
            </div>
            <div className={styles.iconBtn} onClick={props.removeTodo}>
              <TrashIcon size={14} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
