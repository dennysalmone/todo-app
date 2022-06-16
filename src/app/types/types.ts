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