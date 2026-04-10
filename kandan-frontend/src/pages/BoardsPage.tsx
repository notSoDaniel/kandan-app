import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/api'
import { Board } from '../types'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import CreateBoardModal from '../components/CreateBoardModal'

function BoardsPage() {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            const response = await api.get<Board[]>('/boards')
            return response.data
        }
    })

    const createBoard = useMutation({
        mutationFn: async ({ name, columns }: { name: string, columns: string[] }) => {
            const boardResponse = await api.post<Board>('/boards', { name })
            const board = boardResponse.data

            await Promise.all(
                columns.map((columnName, index) =>
                    api.post('/column', {
                        boardId: board.id,
                        name: columnName,
                        position: index
                    })
                )
            )

            return board
        },
        onSuccess: (board) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            setShowModal(false)
            navigate(`/boards/${board.id}`)
        }
    })

    const deleteBoard = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/boards/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            setConfirmDelete(null)
        }
    })

    if (isLoading) return <p>Carregando...</p>
    if (isError) return <p>Erro ao carregar boards.</p>

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Meus Boards</h1>

            {/* Botão de criar */}
            <div className="mb-8">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                >
                    + Criar Board
                </button>
            </div>

            {/* Lista de boards */}
            <div className="grid grid-cols-3 gap-4">
                {data?.map(board => (
                    <div
                        key={board.id}
                        onClick={() => navigate(`/boards/${board.id}`)}
                        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow relative"
                    >
                        <h2 className="text-lg font-semibold">{board.name}</h2>
                        <p className="text-sm text-gray-500">{board.createdAt}</p>

                        {confirmDelete === board.id ? (
                            <div
                                className="absolute top-2 right-2 flex gap-1"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => deleteBoard.mutate(board.id)}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded cursor-pointer"
                                >
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={e => {
                                    e.stopPropagation()
                                    setConfirmDelete(board.id)
                                }}
                                className="absolute top-2 right-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded transition-colors cursor-pointer"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <CreateBoardModal
                    onClose={() => setShowModal(false)}
                    onCreate={(name, columns) => createBoard.mutate({ name, columns })}
                    isLoading={createBoard.isPending}
                />
            )}
        </div>
    )
}

export default BoardsPage