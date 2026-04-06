export interface Board {
  id: string
  name: string
  createdAt: string
}

export interface KandanColumn {
  id: string
  boardId: string
  name: string
  position: number
}

export interface Item {
  id: string
  columnId: string
  parentId: string | null
  title: string
  description: string
  position: number
  createdAt: string
}
