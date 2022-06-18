export type Task = {
    id: number;
    title: string;
    status: boolean;
}

export type TodoList = {
    name: string;
    desc: string;
    collectionId: number;
    todos: Task[];
}

export type Board = {
    name: string;
    id: number;
    author: string;
    acess: string[];
    lists: TodoList[]
}

export type Index = number