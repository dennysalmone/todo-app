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
    access: string[];
    lists: TodoList[]
}

export type DeleteTodo = {
    id: number;
    title: string;
    status: boolean;
    collId: number;
    boardId: number;
}

export type PostTodo = {
    title: string;
    collId: number;
    boardId: number;
}

export type DragAndDropTodo = {
    newListCollectionId: number,
    newTaskIndex: number,
    todo: Task;
    boardId: number,
}

export type DeleteTodoList = {
    listIndex: number,
    boardIndex: number,
    boardId: number,
    collId: number
}

export type PostTodoList = {
    name: string,
    desc: string,
    boardId: number,
}

export type PostBoard = {
    name: string
}

export type DeleteBoard = {
    boardId: number
}

export type getBoards = {
    email: string,
    boards: Board[]
}

export type Access = {
    access: string[]
}

export type changeAccesList = {
    access: string[],
    boardId: number
}