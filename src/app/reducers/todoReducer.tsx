import { TodoItemType, TodoListReducerAction } from '../types/todo'

export function todoReducer(
  state: TodoItemType[],
  action: TodoListReducerAction,
) {
  switch (action.type) {
    case 'toggle': {
      return state.map((todoItem, id) => {
        if (action.todoId === id) {
          return { ...todoItem, completed: !todoItem.completed }
        }
        return todoItem
      })
    }
    case 'add': {
      return [...state, { checked: false, todo: action.todo }] as TodoItemType[]
    }
    case 'remove': {
      return state.filter((_, id) => action.todoId !== id)
    }
    case 'removeCompleted': {
      return state.filter((todoItem) => !todoItem.completed)
    }
    case 'edit': {
      return state.map((todoItem, id) => {
        if (action.todoId === id) {
          return { ...todoItem, todo: action.newTodo }
        }
        return todoItem
      })
    }
  }
}
