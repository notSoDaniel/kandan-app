import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/api'
import { Board, Item, KandanColumn } from '../types'
import ColumnCard from '../components/ColumnCard'
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners
} from '@dnd-kit/core'

function BoardPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [columnName, setColumnName] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    )

    const { data: board } = useQuery({
        queryKey: ['board', id],
        queryFn: async () => {
            const response = await api.get<Board>(`/boards/${id}`)
            return response.data
        }
    })

    const { data: columns, isLoading } = useQuery({
        queryKey: ['columns', id],
        queryFn: async () => {
            const response = await api.get<KandanColumn[]>(`/column/board/${id}`)
            return response.data
        }
    })

    const createColumn = useMutation({
        mutationFn: async (name: string) => {
            const response = await api.post('/column', {
                boardId: id,
                name,
                position: columns?.length ?? 0
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', id] })
            setColumnName('')
        }
    })

    const moveItem = useMutation({
        mutationFn: async ({ itemId, columnId, position }: { itemId: string, columnId: string, position: number }) => {
            await api.patch(`/items/${itemId}/move`, { columnId, position })
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['items', variables.columnId] })
        }
    })

    function findColumnByItemId(itemId: string): string | null {
        if (!columns) return null
        for (const column of columns) {
            const items = queryClient.getQueryData<Item[]>(['items', column.id])
            if (items?.find(i => i.id === itemId)) return column.id
        }
        return null
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over || !columns) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeColumnId = findColumnByItemId(activeId)
        const overColumnId = columns.find(c => c.id === overId)?.id
            ?? findColumnByItemId(overId)

        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return

        const activeItems = queryClient.getQueryData<Item[]>(['items', activeColumnId]) ?? []
        const activeItem = activeItems.find(i => i.id === activeId)

        if (!activeItem) return

        queryClient.setQueryData<Item[]>(['items', activeColumnId], old =>
            old?.filter(i => i.id !== activeId) ?? []
        )

        queryClient.setQueryData<Item[]>(['items', overColumnId], old => [
            ...(old ?? []),
            { ...activeItem, columnId: overColumnId }
        ])
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || !columns) return

        const activeId = active.id as string
        const overId = over.id as string

        // Encontra a coluna onde o item está agora (após o dragOver já ter movido)
        const columnId = columns.find(c => c.id === overId)?.id
            ?? findColumnByItemId(activeId)

        if (!columnId) return

        const items = queryClient.getQueryData<Item[]>(['items', columnId]) ?? []
        const position = items.findIndex(i => i.id === activeId)

        moveItem.mutate({
            itemId: activeId,
            columnId,
            position: position >= 0 ? position : items.length
        })
    }
    if (isLoading) return <p>Carregando...</p>

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 cursor-pointer">
                    ← Voltar
                </button>
                <h1 className="text-2xl font-bold">{board?.name ?? 'Carregando...'}</h1>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 items-start overflow-x-auto pb-4">
                    {columns?.map(column => (
                        <ColumnCard key={column.id} column={column} />
                    ))}

                    <div className="bg-gray-200 rounded-xl p-4 w-72 shrink-0">
                        <input
                            type="text"
                            value={columnName}
                            onChange={e => setColumnName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && columnName.trim() && createColumn.mutate(columnName)}
                            placeholder="Nome da coluna..."
                            className="border rounded-lg px-3 py-2 w-full mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => columnName.trim() && createColumn.mutate(columnName)}
                            disabled={!columnName.trim() || createColumn.isPending}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50 cursor-pointer hover:bg-blue-600 transition-colors text-sm"
                        >
                            {createColumn.isPending ? 'Criando...' : '+ Adicionar Coluna'}
                        </button>
                    </div>
                </div>
            </DndContext>
        </div>
    )
}

export default BoardPage