export interface taskObj {
    id: number;
    title: string;
    status: boolean;
    collection: number;
    // user_id: number
}

export type collection = {
    collectionId: number;
}

export type task = taskObj; 