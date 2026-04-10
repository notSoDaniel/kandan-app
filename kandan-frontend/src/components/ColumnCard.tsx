import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/api'
import { Item, KandanColumn } from '../types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface ItemCardProps {
    item: Item
}

function ItemCard({ item }: ItemCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white border border-gray-200 rounded-lg p-3 text-sm cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
        >
            {item.title}
        </div>
    )
}

interface Props {
    column: KandanColumn
}

function ColumnCard({ column }: Props) {
    const [title, setTitle] = useState('')
    const queryClient = useQueryClient()

    const { setNodeRef } = useDroppable({ id: column.id })

    const { data: items } = useQuery({
        queryKey: ['items', column.id],
        queryFn: async () => {
            const response = await api.get<Item[]>(`/items/column/${column.id}`)
            return response.data
        }
    })

    const createItem = useMutation({
        mutationFn: async (title: string) => {
            const response = await api.post('/items', {
                columnId: column.id,
                title,
                description: '',
                position: items?.length ?? 0,
                parentId: null
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items', column.id] })
            setTitle('')
        }
    })

    return (
        <div className="bg-gray-50 rounded-xl shadow p-4 w-72 shrink-0 flex flex-col gap-3">
            {/* Header da coluna */}
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">{column.name}</h2>
                <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
          {items?.length ?? 0}
        </span>
            </div>

            {/* Lista de itens */}
            <SortableContext
                items={items?.map(i => i.id) ?? []}
                strategy={verticalListSortingStrategy}
            >
                <div ref={setNodeRef} className="flex flex-col gap-2 min-h-12">
                    {items?.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">
                            Nenhum item ainda
                        </p>
                    )}
                    {items?.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            </SortableContext>

            {/* Adicionar item */}
            <div className="flex flex-col gap-1 pt-1 border-t border-gray-200">
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && title.trim() && createItem.mutate(title)}
                    placeholder="Novo item..."
                    className="border rounded-lg px-2 py-1.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => title.trim() && createItem.mutate(title)}
                    disabled={!title.trim() || createItem.isPending}
                    className="text-blue-500 text-sm text-left disabled:opacity-50 cursor-pointer hover:text-blue-700"
                >
                    {createItem.isPending ? 'Adicionando...' : '+ Adicionar item'}
                </button>
            </div>
        </div>
    )
}

export default ColumnCard