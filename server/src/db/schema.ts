import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull(),
})

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  workspaceId: text('workspace_id').notNull(),
  title: text('title').notNull(),
  notes: text('notes'),
  completed: boolean('completed').notNull().default(false),
  priority: text('priority').notNull(),
  categoryId: text('category_id'),
  dueDate: timestamp('due_date', { withTimezone: true, mode: 'string' }),
  status: text('status').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
})

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  workspaceId: text('workspace_id').notNull(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull(),
})

export const kanbanColumns = pgTable('kanban_columns', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  crossTasks: boolean('cross_tasks'),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull(),
})

export const userSettings = pgTable('user_settings', {
  userId: text('user_id').primaryKey(),
  theme: text('theme').notNull(),
  sortBy: text('sort_by').notNull(),
  activeWorkspaceId: text('active_workspace_id').notNull().default(''),
  volume: integer('volume').notNull().default(50),
  isShuffle: boolean('is_shuffle').notNull().default(false),
  repeatMode: text('repeat_mode').notNull().default('off'),
  playlists: jsonb('playlists').notNull().default([]),
  history: jsonb('history').notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull(),
})
