import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/store/settingsStore'
import { useCategories } from '@/hooks/useCategories'

interface TaskFilterProps {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function TaskFilter({ searchQuery, onSearchChange }: TaskFilterProps) {
  const filterStatus = useSettingsStore((s) => s.filterStatus)
  const filterCategoryId = useSettingsStore((s) => s.filterCategoryId)
  const filterPriority = useSettingsStore((s) => s.filterPriority)
  const sortBy = useSettingsStore((s) => s.sortBy)
  const setFilterStatus = useSettingsStore((s) => s.setFilterStatus)
  const setFilterCategoryId = useSettingsStore((s) => s.setFilterCategoryId)
  const setFilterPriority = useSettingsStore((s) => s.setFilterPriority)
  const setSortBy = useSettingsStore((s) => s.setSortBy)

  const { categories } = useCategories()

  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as typeof filterPriority)}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {categories.length > 0 && (
          <Select
            value={filterCategoryId ?? 'all'}
            onValueChange={(v) => setFilterCategoryId(v === 'all' ? null : v)}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest first</SelectItem>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
