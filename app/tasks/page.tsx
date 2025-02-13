'use client';

import { useEffect, useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import tasks from '@/data/tasks';
interface Task {
  id: number;
  title: string;
  url: string;
  points: number;
  completed: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.telegramId) {
      const savedTasks = localStorage.getItem(`tasks_${user.telegramId}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(tasks);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.telegramId) {
      localStorage.setItem(`tasks_${user.telegramId}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
              setUserPoints(data.points || 0);
            }
          })
          .catch((err) => {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data');
          });
      } else {
        setError('No user data available');
      }
    } else {
      setError('This app should be opened in Telegram');
    }
  }, []);

  const handleOpenTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  const handleCompleteTask = async (id: number, points: number) => {
    const newPoints = userPoints + points;
    setUserPoints(newPoints);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    await fetch('/api/update-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramId: user?.telegramId,
        points: newPoints,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Error updating points:', data.error);
        } else {
          console.log('Points updated successfully');
        }
      })
      .catch((err) => {
        console.error('Error updating points:', err);
      });
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Tasks</h1>

      <div className="mb-4 text-lg font-medium">
        Your Points: <span className="text-green-400">{userPoints}</span>
      </div>

      <ul className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-4 border-b border-gray-700 last:border-none"
          >
            <span className="text-lg font-semibold">{task.title}</span>
            {!task.completed ? (
              <button
                onClick={() => {
                  window.open(task.url, '_blank');
                  handleOpenTask(task.id);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded transition-all"
              >
                Task
              </button>
            ) : (
              <button
                onClick={() => handleCompleteTask(task.id, task.points)}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded transition-all"
              >
                Check
              </button>
            )}
          </li>
        ))}
      </ul>
      <BottomNavigation />
    </main>
  );
}
