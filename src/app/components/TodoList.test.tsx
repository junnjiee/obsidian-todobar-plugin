import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from './TodoList'

describe('Todo List', () => {
  it('renders component properly', () => {
    render(<TodoList />)
    expect(screen.getByText('To do')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('To do:')).toBeInTheDocument()
  })

  it('add a todo item', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))

    expect(await screen.findAllByLabelText('todo item')).toHaveLength(1)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('add multiple todo items', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))

    expect(await screen.findAllByLabelText('todo item')).toHaveLength(3)
  })

  it('add an empty todo item', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), '   ')
    await user.click(screen.getByLabelText('add todo'))

    expect(screen.queryByLabelText('todo item')).toBeNull()
  })

  it('edit a todo item', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))

    await user.click(screen.getByLabelText('edit todo'))
    await user.type(screen.getByDisplayValue('this is a todo'), ' edited')
    await user.click(screen.getByLabelText('submit edited todo'))

    expect(screen.getByText('this is a todo edited')).toBeInTheDocument()
  })

  it('submit an empty edit for a todo item', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))

    await user.click(screen.getByLabelText('edit todo'))
    await user.clear(screen.getByDisplayValue('this is a todo'))
    await user.click(screen.getByLabelText('submit edited todo'))

    expect(screen.getByText('this is a todo')).toBeInTheDocument()
  })

  it('remove a todo', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))

    await user.click(screen.getByLabelText('remove todo'))
    expect(screen.queryByText('this is a todo')).toBeNull()
  })

  it('check a todo as complete', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), 'this is a todo')
    await user.click(screen.getByLabelText('add todo'))

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByText('Completed'))
    expect(screen.getByText('this is a todo')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('clear completed todos', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.type(screen.getByPlaceholderText('To do:'), 'first todo')
    await user.click(screen.getByLabelText('add todo'))
    await user.type(screen.getByPlaceholderText('To do:'), 'second todo')
    await user.click(screen.getByLabelText('add todo'))

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((checkbox) => {
      user.click(checkbox)
    })

    await user.click(screen.getByText('Completed'))
    await user.click(screen.getByText('Clear'))
    expect(screen.getByText('No completed tasks.')).toBeInTheDocument()
  })
})
