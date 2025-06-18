export type Status = 'backlog' | 'todo' | 'in-progress' | 'done' | 'cancelled'
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export const priorityDisplay: Record<Priority, string> = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const statusDisplay: Record<Status, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
}
