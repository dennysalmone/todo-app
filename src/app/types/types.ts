export type task = {
    id: number;
    title: string;
    status: boolean;
}

export type collection = {
    name: string;
    desc: string;
    collectionId: number;
    todos: task[];
}