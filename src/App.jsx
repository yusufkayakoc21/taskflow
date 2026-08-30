import { useEffect, useState } from 'react'
import './App.css'

const initialTasks = [
  {
    id: 1,
    title: 'Create the Taskflow dashboard',
    category: 'Development',
    completed: true,
  },
  {
    id: 2,
    title: 'Review the Git workflow',
    category: 'Learning',
    completed: false,
  },
]
const STORAGE_KEY = 'taskflow.tasks'

const loadTasks = () => {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    if (!savedTasks) return initialTasks

    const parsedTasks = JSON.parse(savedTasks)

    return Array.isArray(parsedTasks) ? parsedTasks : initialTasks
  } catch {
    return initialTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [taskTitle, setTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}, [tasks])

  const addTask = (event) => {
    event.preventDefault()

    const trimmedTitle = taskTitle.trim()

    if (!trimmedTitle) return

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: trimmedTitle,
        category: 'Personal',
        completed: false,
      },
    ])

    setTaskTitle('')
  }

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="app-shell">
      <section className="dashboard">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">MY WORKSPACE</span>
            <h1>Taskflow</h1>
            <p>Plan clearly. Work calmly. Finish what matters.</p>
          </div>

          <div className="task-summary">
            <strong>{completedCount}/{tasks.length}</strong>
            <span>tasks completed</span>
          </div>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="What needs to be done?"
            aria-label="Task title"
          />
          <button type="submit">Add task</button>
        </form>

        <nav className="filters" aria-label="Task filters">
          {['all', 'active', 'completed'].map((filterName) => (
            <button
              key={filterName}
              type="button"
              className={filter === filterName ? 'active' : ''}
              onClick={() => setFilter(filterName)}
            >
              {filterName}
            </button>
          ))}
        </nav>

        <section className="task-list" aria-label="Tasks">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <span>✓</span>
              <h2>Nothing here yet</h2>
              <p>Add a task or choose another filter.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <article
                key={task.id}
                className={`task-card ${task.completed ? 'completed' : ''}`}
              >
                <button
                  type="button"
                  className="check-button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.title} as ${
                    task.completed ? 'active' : 'completed'
                  }`}
                >
                  {task.completed ? '✓' : ''}
                </button>

                <div className="task-content">
                  <h2>{task.title}</h2>
                  <span>{task.category}</span>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  )
}

export default App