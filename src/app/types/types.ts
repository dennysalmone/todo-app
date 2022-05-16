export interface taskObj {
    id: number;
    title: string;
    status: boolean;
}

export type task = taskObj | null; 