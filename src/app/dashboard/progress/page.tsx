import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Plus, GripVertical, CheckCircle, Clock, Circle, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { listKanbanTasks, createKanbanTask, updateKanbanTaskStatus, deleteKanbanTask } from '../../../lib/api';

interface Task {
  id: string;
  title: string;
  tag: string;
  status: 'todo' | 'in-progress' | 'done';
}

const ProgressPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingIn, setAddingIn] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    listKanbanTasks()
      .then((data: any) => setTasks(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalProgress = tasks.length > 0
    ? Math.round((tasks.filter((task) => task.status === 'done').length / tasks.length) * 100)
    : 0;

  const moveTask = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const previousTasks = tasks;
    setTasks(tasks.map((task) => task.id === taskId ? { ...task, status: newStatus } : task));
    setError('');
    try {
      await updateKanbanTaskStatus(taskId, newStatus);
    } catch (e: any) {
      setTasks(previousTasks);
      setError('Could not save that move.');
    }
  };

  const handleAddTask = async (status: 'todo' | 'in-progress' | 'done') => {
    if (!newTitle.trim()) return;
    setError('');
    try {
      const task = await createKanbanTask(newTag.trim() || 'General', newTitle.trim(), status);
      setTasks((previousTasks) => [...previousTasks, task]);
      setNewTag('');
      setNewTitle('');
      setAddingIn(null);
    } catch (e: any) {
      setError(e.message || 'Could not add task.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const previousTasks = tasks;
    setTasks(tasks.filter((task) => task.id !== taskId));
    setError('');
    try {
      await deleteKanbanTask(taskId);
    } catch (e: any) {
      setTasks(previousTasks);
      setError(e.message || 'Could not delete task.');
    }
  };

  const Column = ({ title, status, icon: Icon }: { title: string; status: 'todo' | 'in-progress' | 'done'; icon: any }) => (
    <div className="flex-1 min-w-[300px] bg-slate-50 rounded-xl p-4 border border-slate-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Icon className="w-4 h-4" /> {title}
        </h3>
        <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-400 border border-slate-200">
          {tasks.filter((task) => task.status === status).length}
        </span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks.filter((task) => task.status === status).map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{task.tag}</span>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Drag task" className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="font-medium text-slate-800 mb-4">{task.title}</p>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {status !== 'todo' && (
                <button type="button" onClick={() => moveTask(task.id, 'todo')} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">To Todo</button>
              )}
              {status !== 'in-progress' && (
                <button type="button" onClick={() => moveTask(task.id, 'in-progress')} className="text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-blue-600">To Active</button>
              )}
              {status !== 'done' && (
                <button type="button" onClick={() => moveTask(task.id, 'done')} className="text-xs bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-green-600">To Done</button>
              )}
            </div>
          </div>
        ))}

        {addingIn === status ? (
          <div className="bg-white p-3 rounded-lg border border-primary-200 space-y-2">
            <input
              autoFocus
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Tag (e.g. Tech)"
              className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded outline-none"
            />
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask(status)}
              placeholder="Task title"
              className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded outline-none"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => handleAddTask(status)} className="flex-1 bg-primary-600 text-white text-xs font-medium py-1.5 rounded hover:bg-primary-700">Add</button>
              <button type="button" onClick={() => { setAddingIn(null); setNewTag(''); setNewTitle(''); }} className="px-3 text-xs text-slate-500">Cancel</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAddingIn(status)} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-medium hover:border-slate-300 hover:text-slate-500 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Progress Tracker</h1>
          <p className="text-slate-500 mt-1">Kanban board for your MVP tasks.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-700">Total Progress: </span>
            <span className="text-sm font-bold text-green-600">{totalProgress}%</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] overflow-x-auto pb-4">
        <Column title="To Do" status="todo" icon={Circle} />
        <Column title="In Progress" status="in-progress" icon={Clock} />
        <Column title="Done" status="done" icon={CheckCircle} />
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
