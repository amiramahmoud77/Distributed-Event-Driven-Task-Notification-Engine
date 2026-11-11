import React from 'react';
import { ArrowRight } from 'lucide-react';
import { nextAction, nextStatus, palette, priorityColor } from './constants';
import { Doodle } from './Doodle';
import { formatDate } from './format';
import { PriorityMark } from './PriorityMark';
import type { Task, TaskStatus } from '../../types';

interface TaskRowProps {
  task: Task;
  index: number;
  isDarkMode: boolean;
  isSelected: boolean;
  isNew: boolean;
  startOfToday: Date;
  surface: string;
  border: string;
  mutedClass: string;
  dangerClass: string;
  focus: string;
  onToggle: (id: string) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  index,
  isDarkMode,
  isSelected,
  isNew,
  startOfToday,
  surface,
  border,
  mutedClass,
  dangerClass,
  focus,
  onToggle,
  onStatusChange,
}) => {
  const accent = (status: TaskStatus) => (isDarkMode ? palette[status].dark : palette[status].light);
  const statusColor = accent(task.status);
  const color = isDarkMode ? priorityColor[task.priority].dark : priorityColor[task.priority].light;
  const overdue = !!task.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate) < startOfToday;
  const upcoming = nextStatus[task.status];

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={() => onToggle(task._id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(task._id);
          }
        }}
        className={`pop relative cursor-pointer overflow-hidden border py-5 pl-7 pr-5 outline-none transition-[box-shadow,border-color,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900] ${
          isNew ? 'fresh' : ''
        }`}
        style={{
          background: isSelected ? `${color}12` : surface,
          borderColor: isSelected ? color : border,
          borderRadius: 20,
          boxShadow: isSelected ? `0 0 0 1px ${color}, 0 0 26px ${color}45` : 'none',
          animationDelay: `${400 + index * 70}ms`,
        }}
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[5px]" style={{ background: color, opacity: 0.85 }} />

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3">
          <div className="min-w-0">
            <p dir="auto" style={{ textAlign: 'left' }} className="truncate text-lg font-medium">
              {task.title}
            </p>
            {task.description && (
              <p dir="auto" style={{ textAlign: 'left' }} className={`mt-0.5 truncate text-sm ${mutedClass}`}>
                {task.description}
              </p>
            )}
          </div>

          <span
            className="badge inline-flex h-7 items-center gap-1.5 justify-self-end rounded-full px-3 text-[13px] font-semibold"
            style={{
              color: statusColor,
              background: `${statusColor}1F`,
              border: `1px solid ${statusColor}55`,
              animationDelay: `${600 + index * 70}ms`,
            }}
          >
            <Doodle kind={task.status} className="h-3.5 w-3.5" />
            {palette[task.status].label}
          </span>

          <div className="col-span-2 flex flex-wrap items-center gap-3">
            <PriorityMark priority={task.priority} color={color} isDarkMode={isDarkMode} />
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs ${overdue ? `font-medium ${dangerClass}` : mutedClass}`}
              style={{ background: overdue ? '#F0787826' : isDarkMode ? '#FFFFFF10' : '#14213D0F' }}
            >
              {task.dueDate ? `${overdue ? 'Overdue, ' : 'Due '}${formatDate(task.dueDate)}` : 'No due date'}
            </span>

            {upcoming && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task, upcoming);
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-[filter] hover:brightness-125 ${focus}`}
                style={{
                  color: accent(upcoming),
                  background: `${accent(upcoming)}1F`,
                  border: `1px solid ${accent(upcoming)}55`,
                }}
              >
                {nextAction[task.status]}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};