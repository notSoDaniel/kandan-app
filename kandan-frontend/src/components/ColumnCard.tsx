import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/api'
import { Item, KandanColumn } from '../types'

interface Props {
    column: KandanColumn
}

function ColumnCard({ column }: Props) {
    const [title, setTitle] = useState('')
    const queryClient = useQueryClient()

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
        <div className="bg-white rounded-lg shadow p-4 w-64 shrink-0">
            <h2 className="font-semibold mb-3">{column.name}</h2>

            {/* Lista de itens */}
            <div className="flex flex-col gap-2 mb-3">
                {items?.map(item => (
                    <div key={item.id} className="bg-gray-50 border rounded p-2 text-sm">
                        {item.title}
                    </div>
                ))}
            </div>

            {/* Formulário novo item */}
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createItem.mutate(title)}
                placeholder="Novo item..."
                className="border rounded px-2 py-1 w-full text-sm mb-2"
            />
            <button
                onClick={() => createItem.mutate(title)}
                disabled={!title.trim() || createItem.isPending}
                className="text-blue-500 text-sm w-full text-left disabled:opacity-50"
            >
                {createItem.isPending ? 'Adicionando...' : '+ Adicionar item'}
            </button>
        </div>
    )
}

export default ColumnCard