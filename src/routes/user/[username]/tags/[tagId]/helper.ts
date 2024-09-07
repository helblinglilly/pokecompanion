import { Logger } from "$/lib/log";
import { addNotification } from "$/lib/stores/notifications";
import type { RecordTag, ITagMeta, ITagDatabase, ITagEntryGenerics } from "$/routes/api/tag/types";

export function getSortFunction(key: ITagDatabase['sortKey'], direction: ITagDatabase['sortOrder']) {
    const sortByDateDesc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
        return new Date(a.added).valueOf() < new Date(b.added).valueOf() ? 1 : -1;
    };

    const sortByDateAsc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
        return new Date(a.added).valueOf() > new Date(b.added).valueOf() ? 1 : -1;
    };

    const sortByIdDesc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
        return a.id < b.id ? 1 : -1;
    };

    const sortByIdAsc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
        return a.id > b.id ? 1 : -1;
    };

    let sortFunction = sortByIdAsc;
    if (key === 'id') {
        if (direction === 'asc') {
            sortFunction = sortByIdAsc;
        } else {
            sortFunction = sortByIdDesc;
        }
    } else if (key === 'added') {
        if (direction === 'asc') {
            sortFunction = sortByDateAsc;
        } else {
            sortFunction = sortByDateDesc;
        }
    }

    return {
        sortFunction,
        sortKey: key.toLowerCase() as 'id' | 'added' | 'alphabetical' | 'custom',
        sortOrder: direction.toLowerCase() as 'asc' | 'desc' | 'custom'
    };
}

export function patchTag(tag: ITagMeta & {id: string}): Promise<RecordTag | void>{
    return fetch(`/api/tag/${tag.id}`, {
        method: 'PATCH',
        body: JSON.stringify(tag),
        redirect: 'follow' 
    }).then(async (res) => {
        if (res.status !== 200) {
            throw new Error(`Non-200 status code ${res.status}`);
        }
        return (await res.json()) as RecordTag;
    }).catch((err) => {
        addNotification({
            message: 'Failed to update tag. Please try again',
            level: 'failure'
        });
        Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
            context: 'Failed to update tag',
            tag: tag,
        });
    })
}

export function deleteTag(tagId: string){
    return fetch(`/api/tags/${tagId}`, {
            method: 'DELETE'
        }).then((res) => {
            if (!res.ok){
                throw new Error(`Non-200 status code ${res.status}`);
            }
        }).catch((err) => {
            addNotification({
                message: 'Failed to delete tag. Please try again',
                level: 'failure'
            });
        })
}