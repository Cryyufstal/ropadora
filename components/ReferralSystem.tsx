import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface ReferralSystemProps {
  initData: string;
  userId: string;
  startParam: string;
  userData: any;
}

export default function ReferralSystem({
  initData,
  userId,
  startParam,
  userData,
}: ReferralSystemProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
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
    const newTask: Task = { id: 'task3', description: 'Complete a survey', completed: false };
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
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Debug Info</h3>
        <p><strong>Init Data:</strong> {initData}</p>
        <p><strong>Start Param:</strong> {startParam}</p>
        <p><strong>User Data:</strong> {JSON.stringify(userData)}</p>
      </div>
    </div>
  );
}
