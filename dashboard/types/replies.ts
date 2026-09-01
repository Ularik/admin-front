import { DocumentLiteType } from "./document";
import { UserType } from "./user";

export interface ReplyCreateType {
    content: string;
    attachments: File[]
}

export interface ReplyType {
    id: string;
    author_id: string | null;
    task_id: string;
    content: string;
    author: UserType | null;
    attachments: DocumentLiteType[]
}