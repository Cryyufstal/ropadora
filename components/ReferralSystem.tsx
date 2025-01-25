import { useEffect, useState } from 'react';

export default function ReferralSystem({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // استرداد المهام عند التحميل
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/tasks`);
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]);

  const addTask = async () => {
    const newTask = { id: 'task3', description: 'Complete a survey', completed: false };
    try {
      const res = await fetch(`/api/users/${userId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: [newTask] }),
      });

      const updatedTasks = await res.json();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.description} - {task.completed ? 'Completed' : 'Incomplete'}
          </li>
        ))}
      </ul>
      <button
        onClick={addTask}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Add Task
      </button>
    </div>
  );
}
