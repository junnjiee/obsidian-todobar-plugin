import { useState } from 'react'
import styles from './TodoList.module.css'

interface TodoItemType {
  checked: boolean
  todo: string
}

type Tab = 'todo' | 'completed'

export function TodoList() {
  const [todoList, setTodoList] = useState<TodoItemType[]>([
    { checked: false, todo: 'finish react component' },
    { checked: true, todo: 'set up server' },
    { checked: false, todo: 'write documentation' },
  ])
  const [tab, setTab] = useState<Tab>('todo')

  return (
    <div>
      {todoList.map((todoItem, idx) => (
        <TodoItem key={idx} todoItem={todoItem} />
      ))}
    </div>
  )
}

interface TodoItemProps {
  todoItem: TodoItemType
}

function TodoItem({ todoItem }: TodoItemProps) {
  return (
    <>
      {todoItem.checked}
      <p className={styles.test}>{todoItem.todo}</p>
    </>
  )
}
