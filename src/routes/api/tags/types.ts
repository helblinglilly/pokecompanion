import type { ITagContents } from "$/lib/types/ITags";
import type { RecordModel } from "pocketbase";

export interface IDatabaseTag {
    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    contents: ITagContents;
    showShinyAndGender: boolean;
    created: string;
    updated: string;
    sortKey: 'id' | 'added' | 'alphabetical' | 'custom';
    sortOrder: 'asc' | 'desc' | 'custom';
}

export type RecordTag = IDatabaseTag & RecordModel;