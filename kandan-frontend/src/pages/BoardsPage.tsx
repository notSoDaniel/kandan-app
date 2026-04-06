import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import {Board} from '../types';

function BoardsPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            const response = await api.get<Board[]>('/boards')
            return response.data
        }
    })

    if (isLoading) return <p>Carregando...</p>
    if (isError) return <p>Erro ao carregar boards.</p>

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Meus Boards</h1>
            <div className="grid grid-cols-3 gap-4">
                {data?.map(board => (
                    <div key={board.id} className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">{board.name}</h2>
                        <p className="text-sm text-gray-500">{board.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BoardsPage