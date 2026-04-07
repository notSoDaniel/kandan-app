import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/api'
import ColumnCard from '../components/ColumnCard'
import { Board, KandanColumn } from '../types'

function BoardPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [columnName, setColumnName] = useState('')

    const { data: columns, isLoading } = useQuery({
        queryKey: ['columns', id],
        queryFn: async () => {
            const response = await api.get<KandanColumn[]>(`/column/board/${id}`)
            return response.data
        }
    })

    const { data: board } = useQuery({
        queryKey: ['board', id],
        queryFn: async () => {
            const response = await api.get<Board>(`/boards/${id}`)
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

    if (isLoading) return <p>Carregando...</p>

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800">
                    ← Voltar
                </button>
                <h1 className="text-2xl font-bold">{board?.name ?? 'Carregando...'}</h1>
            </div>

            <div className="flex gap-4 items-start">
                {columns?.map(column => (
                    <ColumnCard key={column.id} column={column} />
                ))}

                <div className="bg-gray-200 rounded-lg p-4 w-64 shrink-0">
                    <input
                        type="text"
                        value={columnName}
                        onChange={e => setColumnName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && createColumn.mutate(columnName)}
                        placeholder="Nome da coluna..."
                        className="border rounded px-3 py-2 w-full mb-2"
                    />
                    <button
                        onClick={() => createColumn.mutate(columnName)}
                        disabled={!columnName.trim() || createColumn.isPending}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                    >
                        {createColumn.isPending ? 'Criando...' : '+ Adicionar Coluna'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BoardPage