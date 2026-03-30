import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
  const resetFilters = useSettingsStore((s) => s.resetFilters)

  const { categories } = useCategories()

  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterCategoryId !== null
  const hasActiveSearch = searchQuery.trim().length > 0

  const handleReset = () => {
    resetFilters()
    onSearchChange('')
  }

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
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="h-10 w-[120px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as typeof filterPriority)}>
          <SelectTrigger className="h-10 w-[120px] text-sm">
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
            <SelectTrigger className="h-10 w-[140px] text-sm">
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
          <SelectTrigger className="h-10 w-[130px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest first</SelectItem>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        {(hasActiveFilters || hasActiveSearch) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10 gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
