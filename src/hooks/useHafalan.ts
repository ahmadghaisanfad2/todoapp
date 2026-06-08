import { useCallback } from 'react'
import { useHafalanTaskStore } from '@/store/hafalanTaskStore'
import { useSantriStore } from '@/store/santriStore'
import { useHafalanLogStore } from '@/store/hafalanLogStore'
import { generateId } from '@/lib/utils'
import type { HafalanStatus, HafalanLog, HafalanTask, Santri } from '@/types'

export function useHafalan() {
  const tasks = useHafalanTaskStore((s) => s.tasks)
  const updateTask = useHafalanTaskStore((s) => s.updateTask)
  const deleteTask = useCallback(
    (id: string) => {
      useHafalanTaskStore.setState((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }))
      useSantriStore.setState((state) => ({
        santri: state.santri.map((s) => ({
          ...s,
          targetTaskIds: s.targetTaskIds.filter((tid) => tid !== id),
        })),
      }))
      useHafalanLogStore.setState((state) => ({
        logs: state.logs.filter((l) => l.taskId !== id),
      }))
    },
    []
  )

  const santri = useSantriStore((s) => s.santri)
  const updateSantri = useSantriStore((s) => s.updateSantri)
  const deleteSantri = useSantriStore((s) => s.deleteSantri)

  const logs = useHafalanLogStore((s) => s.logs)
  const addLog = useHafalanLogStore((s) => s.addLog)
  const deleteLog = useHafalanLogStore((s) => s.deleteLog)
  const getLatestLog = useHafalanLogStore((s) => s.getLatestLog)
  const hasCompleted = useHafalanLogStore((s) => s.hasCompleted)
  const getLogsBySantriAndTask = useHafalanLogStore((s) => s.getLogsBySantriAndTask)

  const addTask = useCallback(
    (task: Omit<HafalanTask, 'id' | 'createdAt' | 'personalFor'>) => {
      const newId = generateId()
      useHafalanTaskStore.setState((state) => ({
        tasks: [
          ...state.tasks,
          { ...task, personalFor: null, id: newId, createdAt: new Date().toISOString() },
        ],
      }))
      santri.forEach((s) => {
        updateSantri(s.id, {
          targetTaskIds: [...s.targetTaskIds, newId],
        })
      })
    },
    [santri, updateSantri]
  )

  const addSantri = useCallback(
    (santriData: Omit<Santri, 'id' | 'createdAt'>) => {
      useSantriStore.setState((state) => ({
        santri: [
          ...state.santri,
          {
            ...santriData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            targetTaskIds: santriData.targetTaskIds.length > 0
              ? santriData.targetTaskIds
              : tasks.filter((t) => t.personalFor === null).map((t) => t.id),
          },
        ],
      }))
    },
    [tasks]
  )

  const getSantriWithProgress = santri.map((s) => {
    let completed = 0
    let inProgress = 0
    let notStarted = 0

    for (const taskId of s.targetTaskIds) {
      if (hasCompleted(s.id, taskId)) {
        completed++
      } else {
        const latest = getLatestLog(s.id, taskId)
        if (latest) {
          inProgress++
        } else {
          notStarted++
        }
      }
    }

    return {
      ...s,
      progress: {
        total: s.targetTaskIds.length,
        completed,
        inProgress,
        notStarted,
      },
    }
  })

  const getTaskStatus = (santriId: string, taskId: string): HafalanStatus => {
    if (hasCompleted(santriId, taskId)) return 'completed'
    const latest = getLatestLog(santriId, taskId)
    if (latest) return 'in_progress'
    return 'not_started'
  }

  const getTasksForSantri = (santriId: string) => {
    const s = santri.find((s) => s.id === santriId)
    if (!s) return []
    return s.targetTaskIds
      .map((taskId) => {
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return null
        return {
          task,
          status: getTaskStatus(santriId, taskId),
          latestLog: getLatestLog(santriId, taskId),
          allLogs: getLogsBySantriAndTask(santriId, taskId),
        }
      })
      .filter(Boolean) as Array<{
        task: HafalanTask
        status: HafalanStatus
        latestLog: HafalanLog | null
        allLogs: HafalanLog[]
      }>
  }

  const getUnassignedTasks = useCallback(
    (santriId: string) => {
      const s = santri.find((s) => s.id === santriId)
      if (!s) return tasks.filter((t) => t.personalFor === null)
      return tasks.filter(
        (t) =>
          t.personalFor === null &&
          !s.targetTaskIds.includes(t.id)
      )
    },
    [santri, tasks]
  )

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    santri,
    addSantri,
    updateSantri,
    deleteSantri,
    logs,
    addLog,
    deleteLog,
    getSantriWithProgress,
    getTaskStatus,
    getTasksForSantri,
    getUnassignedTasks,
  }
}
