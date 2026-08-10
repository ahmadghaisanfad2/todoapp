/**
 * Store logic tests — exercise taskStore / kanbanStore / undoStore directly.
 *
 * The stores are TypeScript modules, so these tests import them through the
 * Vite dev server (which transforms TS on the fly) and drive them via
 * page.evaluate — no UI interaction required. This gives real unit coverage
 * of ordering math, batch moves, undo snapshots, and render optimization.
 */
export default async function storeLogicTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')

  /** Resets both stores to a known state and clears the undo stack. */
  async function seed() {
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      const { useUndoStore } = await import('/src/store/undoStore.ts')
      const { useKanbanStore } = await import('/src/store/kanbanStore.ts')

      useUndoStore.setState({ stack: [], lastUndone: null, toastHidden: true })
      useKanbanStore.setState({
        columns: [
          { id: 'todo', name: 'To Do', order: 0 },
          { id: 'inprogress', name: 'In Progress', order: 1 },
          { id: 'done', name: 'Done', order: 2, crossTasks: true },
        ],
      })

      const mk = (id, status, order) => ({
        id,
        title: id,
        notes: null,
        completed: false,
        priority: 'medium',
        categoryId: null,
        workspaceId: 'w1',
        dueDate: null,
        status,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        order,
      })

      useTaskStore.setState({
        tasks: [
          mk('a', 'todo', 0),
          mk('b', 'todo', 1),
          mk('c', 'todo', 2),
          mk('d', 'inprogress', 0),
          mk('e', 'inprogress', 1),
          mk('f', 'done', 0),
        ],
      })
    })
  }

  async function snapshot() {
    return page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      const { useUndoStore } = await import('/src/store/undoStore.ts')
      // The store keeps insertion order; the app's semantic order is the
      // `order` field (see getTasksByColumn). Sort to match what the UI shows.
      const tasks = [...useTaskStore.getState().tasks]
        .sort((x, y) => (x.status === y.status ? x.order - y.order : x.status.localeCompare(y.status)))
        .map((t) => ({
          id: t.id,
          status: t.status,
          order: t.order,
          completed: t.completed,
          updatedAt: t.updatedAt,
        }))
      return {
        tasks,
        undoCount: useUndoStore.getState().stack.length,
      }
    })
  }

  test('moveTask reorders within the same column', async () => {
    await seed()
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      useTaskStore.getState().moveTask('a', 'todo', 2)
    })
    const { tasks } = await snapshot()
    const todo = tasks.filter((t) => t.status === 'todo')
    assert.deepEqual(
      todo.map((t) => t.id),
      ['b', 'c', 'a'],
      'column should be reordered to b, c, a'
    )
    assert.deepEqual(
      todo.map((t) => t.order),
      [0, 1, 2],
      'orders should be compacted'
    )
  })

  test('moveTask crosses columns and compacts the source column', async () => {
    await seed()
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      useTaskStore.getState().moveTask('a', 'inprogress', 0)
    })
    const { tasks } = await snapshot()
    const inprogress = tasks.filter((t) => t.status === 'inprogress')
    assert.deepEqual(
      inprogress.map((t) => t.id),
      ['a', 'd', 'e'],
      'moved task lands at the target index'
    )
    assert.deepEqual(
      inprogress.map((t) => t.order),
      [0, 1, 2]
    )
    const todo = tasks.filter((t) => t.status === 'todo')
    assert.deepEqual(
      todo.map((t) => t.order),
      [0, 1],
      'source column orders should be compacted'
    )
    const a = tasks.find((t) => t.id === 'a')
    assert.equal(a.completed, false, 'moving to a non-done column should not complete the task')
  })

  test('moveTask into done marks the task completed', async () => {
    await seed()
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      useTaskStore.getState().moveTask('a', 'done', 0)
    })
    const { tasks } = await snapshot()
    const a = tasks.find((t) => t.id === 'a')
    const f = tasks.find((t) => t.id === 'f')
    assert.equal(a.status, 'done')
    assert.equal(a.completed, true, 'task moved into Done should be completed')
    assert.equal(a.order, 0, 'inserted at the requested index 0')
    assert.equal(f.order, 1, 'existing done task shifts down')
  })

  test('moveTask clamps out-of-range target indices', async () => {
    await seed()
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      useTaskStore.getState().moveTask('a', 'inprogress', 99)
    })
    const { tasks } = await snapshot()
    const inprogress = tasks.filter((t) => t.status === 'inprogress')
    assert.equal(inprogress.length, 3)
    const a = tasks.find((t) => t.id === 'a')
    assert.equal(a.order, 2, 'task should be clamped to the end of the column')
  })

  test('moveTask no-op does not push an undo entry', async () => {
    await seed()
    const before = await page.evaluate(async () => {
      const { useUndoStore } = await import('/src/store/undoStore.ts')
      return useUndoStore.getState().stack.length
    })
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      useTaskStore.getState().moveTask('a', 'todo', 0) // already at index 0
      useTaskStore.getState().moveTask('nope', 'todo', 5) // unknown task
    })
    const after = await page.evaluate(async () => {
      const { useUndoStore } = await import('/src/store/undoStore.ts')
      return useUndoStore.getState().stack.length
    })
    assert.equal(after, before, 'no-op moves must not pollute the undo stack')
  })

  test('untouched tasks keep object identity and updatedAt (render optimization)', async () => {
    await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      const mk = (id, status, order) => ({
        id,
        title: id,
        notes: null,
        completed: false,
        priority: 'medium',
        categoryId: null,
        workspaceId: 'w1',
        dueDate: null,
        status,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        order,
      })
      useTaskStore.setState({
        tasks: [
          mk('a', 'todo', 0),
          mk('b', 'todo', 1),
          mk('c', 'todo', 2),
          mk('g', 'todo', 3),
          mk('d', 'inprogress', 0),
          mk('f', 'done', 0),
        ],
      })
    })
    const result = await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      const store = useTaskStore.getState()
      const before = new Map(store.tasks.map((t) => [t.id, t]))
      // todo [a,b,c,g] -> move b to the end -> [a,c,g,b]:
      // a keeps order 0; c (1->2), g (2->3), b (1->3) all change.
      store.moveTask('b', 'todo', 3)
      const after = useTaskStore.getState().tasks
      const touched = (id) => {
        const prev = before.get(id)
        const next = after.find((t) => t.id === id)
        return { sameRef: prev === next, updatedAtChanged: prev.updatedAt !== next.updatedAt }
      }
      return {
        b: touched('b'), // moved — must change
        c: touched('c'), // order changed — must change
        g: touched('g'), // order changed — must change
        a: touched('a'), // order unchanged — must NOT change
        d: touched('d'), // different column — must NOT change
        f: touched('f'), // different column — must NOT change
      }
    })
    assert.equal(result.b.sameRef, false, 'moved task should be a new object')
    assert.equal(result.c.sameRef, false, 'reordered task should be a new object')
    assert.equal(result.g.sameRef, false, 'reordered task should be a new object')
    assert.equal(result.a.sameRef, true, 'order-unchanged task should keep identity')
    assert.equal(result.d.sameRef, true, 'other-column task should keep identity')
    assert.equal(result.f.sameRef, true, 'other-column task should keep identity')
    assert.equal(result.a.updatedAtChanged, false, 'order-unchanged task should keep updatedAt')
  })

  test('moveTasksToColumn batch-moves atomically with a single undo entry', async () => {
    await seed()
    const result = await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      const { useUndoStore } = await import('/src/store/undoStore.ts')
      useTaskStore.getState().moveTasksToColumn(['a', 'b'], 'done')
      const tasks = [...useTaskStore.getState().tasks]
        .sort((x, y) => (x.status === y.status ? x.order - y.order : x.status.localeCompare(y.status)))
        .map((t) => ({
          id: t.id,
          status: t.status,
          order: t.order,
          completed: t.completed,
        }))
      return {
        tasks,
        undoCount: useUndoStore.getState().stack.length,
        undoLabel: useUndoStore.getState().stack[0]?.description,
      }
    })
    const todo = result.tasks.filter((t) => t.status === 'todo')
    const done = result.tasks.filter((t) => t.status === 'done')
    assert.deepEqual(todo.map((t) => t.id), ['c'], 'source column keeps only the untouched task')
    assert.deepEqual(done.map((t) => t.id), ['f', 'a', 'b'], 'moved tasks append after existing')
    assert.deepEqual(done.map((t) => t.order), [0, 1, 2], 'orders stay compacted and sequential')
    assert.ok(done.find((t) => t.id === 'a').completed, 'moved tasks sync completed with column')
    assert.equal(result.undoCount, 1, 'batch move must push exactly one undo entry')
    assert.match(result.undoLabel, /2 tasks moved/)
  })

  test('column delete: one batch move + one delete, undo restores everything', async () => {
    await seed()
    const result = await page.evaluate(async () => {
      const { useTaskStore } = await import('/src/store/taskStore.ts')
      const { useKanbanStore } = await import('/src/store/kanbanStore.ts')
      const { useUndoStore } = await import('/src/store/undoStore.ts')

      // Simulate the board's delete-column flow.
      const { tasks } = useTaskStore.getState()
      const ids = tasks.filter((t) => t.status === 'todo').map((t) => t.id)
      useTaskStore.getState().moveTasksToColumn(ids, 'inprogress')
      useKanbanStore.getState().deleteColumn('todo')

      const undoCountAfterDelete = useUndoStore.getState().stack.length

      // Undo #1: restores the column.
      useUndoStore.getState().popUndo()
      const columnsAfterFirstUndo = useKanbanStore.getState().columns.map((c) => c.id)
      const inprogressAfterFirstUndo = useTaskStore
        .getState()
        .tasks.filter((t) => t.status === 'inprogress')
        .sort((x, y) => x.order - y.order)
        .map((t) => t.id)

      // Undo #2: restores the tasks to their original column.
      useUndoStore.getState().popUndo()
      const todoAfterSecondUndo = useTaskStore
        .getState()
        .tasks.filter((t) => t.status === 'todo')
        .sort((x, y) => x.order - y.order)
        .map((t) => t.id)

      return {
        undoCountAfterDelete,
        columnsAfterFirstUndo,
        inprogressAfterFirstUndo,
        todoAfterSecondUndo,
        stackAfter: useUndoStore.getState().stack.length,
      }
    })
    assert.equal(result.undoCountAfterDelete, 2, 'exactly 2 undo entries: batch move + column delete')
    assert.ok(result.columnsAfterFirstUndo.includes('todo'), 'undo #1 restores the deleted column')
    assert.deepEqual(result.inprogressAfterFirstUndo, ['d', 'e', 'a', 'b', 'c'], 'tasks stay moved after undo #1')
    assert.deepEqual(result.todoAfterSecondUndo, ['a', 'b', 'c'], 'undo #2 returns tasks to their column')
    assert.equal(result.stackAfter, 0, 'undo stack fully drained')
  })
}
