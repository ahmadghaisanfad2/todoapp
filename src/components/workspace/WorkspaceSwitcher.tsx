import { useState } from 'react'
import { ChevronDown, Plus, Pencil, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useTaskMutations } from '@/hooks/useTaskQuery'
import { useCategories } from '@/hooks/useCategories'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { WorkspaceDialog } from './WorkspaceDialog'
import { cn } from '@/lib/utils'
import type { Workspace } from '@/types'

export function WorkspaceSwitcher() {
  const workspaces = useWorkspaceStore((s) => s.workspaces)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace)
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace)
  const updateWorkspace = useWorkspaceStore((s) => s.updateWorkspace)
  const deleteWorkspace = useWorkspaceStore((s) => s.deleteWorkspace)
  const { deleteTasksByWorkspace } = useTaskMutations()
  const { deleteCategoriesByWorkspace } = useCategories()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | undefined>()
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | undefined>()

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId)

  const handleCreate = () => {
    setEditingWorkspace(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace)
    setDialogOpen(true)
  }

  const handleSave = (data: { name: string; color: string }) => {
    if (editingWorkspace) {
      updateWorkspace(editingWorkspace.id, data)
    } else {
      const id = addWorkspace(data)
      setActiveWorkspace(id)
    }
    setDialogOpen(false)
  }

  const handleDelete = (workspace: Workspace) => {
    setDeletingWorkspace(workspace)
  }

  const confirmDelete = () => {
    if (deletingWorkspace) {
      deleteTasksByWorkspace(deletingWorkspace.id)
      deleteCategoriesByWorkspace(deletingWorkspace.id)
      deleteWorkspace(deletingWorkspace.id)
      setDeletingWorkspace(undefined)
    }
  }

  if (!activeWorkspace) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 max-w-[min(42vw,9.5rem)] gap-1.5 rounded-xl px-2 text-sm font-medium sm:max-w-[12rem] sm:gap-2 sm:px-2.5"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3"
              style={{ backgroundColor: activeWorkspace.color }}
            />
            <span className="truncate">{activeWorkspace.name}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[min(18rem,calc(100vw-2rem))] rounded-xl">
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setActiveWorkspace(workspace.id)}
              className={cn(
                'gap-2 rounded-lg cursor-pointer',
                workspace.id === activeWorkspaceId && 'bg-accent'
              )}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: workspace.color }}
              />
              <span className="flex-1 truncate">{workspace.name}</span>
              {workspace.id === activeWorkspaceId && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
              <div className="flex gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent sm:h-6 sm:w-6"
                  onClick={() => handleEdit(workspace)}
                  aria-label={`Edit ${workspace.name}`}
                >
                  <Pencil className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                </button>
                {workspaces.length > 1 && (
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive/60 hover:text-destructive hover:bg-accent sm:h-6 sm:w-6"
                    onClick={() => handleDelete(workspace)}
                    aria-label={`Delete ${workspace.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                  </button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCreate} className="gap-2 rounded-lg cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            New workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WorkspaceDialog
        key={editingWorkspace?.id ?? 'new'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        workspace={editingWorkspace}
        onSave={handleSave}
      />

      <Dialog open={!!deletingWorkspace} onOpenChange={(open) => { if (!open) setDeletingWorkspace(undefined) }}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-[380px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              Delete &ldquo;{deletingWorkspace?.name}&rdquo; and all its tasks and categories? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingWorkspace(undefined)} className="rounded-xl h-10">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-xl h-10">
              Delete everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
