import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface Props {
    onClose: () => void
    onCreate: (name: string, columns: string[]) => void
    isLoading: boolean
}

const DEFAULT_COLUMNS = ['Backlog', 'Em andamento', 'Em homologação', 'Concluído']

function CreateBoardModal({ onClose, onCreate, isLoading }: Props) {
    const [name, setName] = useState('')
    const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS)

    function handleAddColumn() {
        setColumns([...columns, ''])
    }

    function handleColumnChange(index: number, value: string) {
        const updated = [...columns]
        updated[index] = value
        setColumns(updated)
    }

    function handleRemoveColumn(index: number) {
        setColumns(columns.filter((_, i) => i !== index))
    }

    function handleCreate() {
        if (!name.trim()) return
        const validColumns = columns.filter(c => c.trim() !== '')
        onCreate(name, validColumns)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Criar novo Board</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* Nome do board */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do board
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        placeholder="Ex: Meu Projeto"
                        className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>

                {/* Colunas */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colunas
                    </label>
                    <div className="flex flex-col gap-2">
                        {columns.map((column, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={column}
                                    onChange={e => handleColumnChange(index, e.target.value)}
                                    placeholder="Nome da coluna..."
                                    className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => handleRemoveColumn(index)}
                                    className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAddColumn}
                        className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                        <Plus size={14} />
                        Adicionar coluna
                    </button>
                </div>

                {/* Botões */}
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name.trim() || isLoading}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50 cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                        {isLoading ? 'Criando...' : 'Criar Board'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateBoardModal