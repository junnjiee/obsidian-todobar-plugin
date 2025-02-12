export interface TodoItemType {
  completed: boolean
  todo: string
}

export type TodoListReducerAction =
  | { type: 'toggle'; todoId: number }
  | { type: 'add'; todo: string }
  | { type: 'remove'; todoId: number }
  | { type: 'removeCompleted' }
  | { type: 'edit'; todoId: number; newTodo: string }
