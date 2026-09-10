import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Plus, GripVertical, CheckCircle, Clock, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  tag: string;
  status: 'todo' | 'in-progress' | 'done';
}

const ProgressPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Competitor Analysis', tag: 'Validation', status: 'done' },
    { id: '2', title: 'Design DB Schema', tag: 'Tech', status: 'in-progress' },
    { id: '3', title: 'Set up Next.js', tag: 'Tech', status: 'done' },
    { id: '4', title: 'Write Landing Copy', tag: 'Marketing', status: 'todo' },
    { id: '5', title: 'Configure Stripe', tag: 'Payments', status: 'todo' },
  ]);

  const moveTask = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'todo': return 'bg-slate-100 border-slate-200';
          case 'in-progress': return 'bg-blue-50 border-blue-200';
          case 'done': return 'bg-green-50 border-green-200';
          default: return 'bg-slate-100';
      }
  };

  const Column = ({ title, status, icon: Icon }: { title: string, status: 'todo' | 'in-progress' | 'done', icon: any }) => (
    <div className="flex-1 min-w-[300px] bg-slate-50 rounded-xl p-4 border border-slate-200 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Icon className="w-4 h-4" /> {title}
            </h3>
            <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-400 border border-slate-200">
                {tasks.filter(t => t.status === status).length}
            </span>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto">
            {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{task.tag}</span>
                        <button className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="font-medium text-slate-800 mb-4">{task.title}</p>
                    
                    {/* Quick Move Buttons (Simulating Drag Drop for now) */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {status !== 'todo' && (
                             <button onClick={() => moveTask(task.id, 'todo')} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">To Todo</button>
                        )}
                        {status !== 'in-progress' && (
                             <button onClick={() => moveTask(task.id, 'in-progress')} className="text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-blue-600">To Active</button>
                        )}
                        {status !== 'done' && (
                             <button onClick={() => moveTask(task.id, 'done')} className="text-xs bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-green-600">To Done</button>
                        )}
                    </div>
                </div>
            ))}
             <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-medium hover:border-slate-300 hover:text-slate-500 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Task
            </button>
        </div>
    </div>
  );

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
                <span className="text-sm font-bold text-green-600">45%</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] overflow-x-auto pb-4">
        <Column title="To Do" status="todo" icon={Circle} />
        <Column title="In Progress" status="in-progress" icon={Clock} />
        <Column title="Done" status="done" icon={CheckCircle} />
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;