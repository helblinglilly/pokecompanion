import { Logger } from "$/lib/log";
import { addNotification } from "$/lib/stores/notifications";
import { type TagRecord, type ITagEntryGenerics } from "$/lib/types/ITags";

export function getSortFunction(key: 'id' | 'added' | string, direction: 'asc' | 'desc' | 'custom' | string) {
    const sortByDateDesc = (a: ITagEntryGenerics, b: ITagEntryGenerics) => {
        return new Date(a.added).valueOf() < new Date(b.added).valueOf() ? 1 : -1;
    };

    const sortByDateAsc = (a: ITagEntryGenerics, b: ITagEntryGenerics) => {
        return new Date(a.added).valueOf() > new Date(b.added).valueOf() ? 1 : -1;
    };

    const sortByIdDesc = (a: ITagEntryGenerics, b: ITagEntryGenerics) => {
        return a.id < b.id ? 1 : -1;
    };

    const sortByIdAsc = (a: ITagEntryGenerics, b: ITagEntryGenerics) => {
        return a.id > b.id ? 1 : -1;
    };

    // sortOrder = direction.toLowerCase() as 'asc' | 'desc' | 'custom';
    // sortKey = key.toLowerCase() as 'id' | 'added' | 'alphabetical' | 'custom';
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

export function patchTag(tag: TagRecord){
    return fetch('/api/tag/', {
        method: 'PATCH',
        body: JSON.stringify({
            ...tag,
            description: tag.description.length > 1 ? tag.description : 'No Description'
        }),
        redirect: 'follow' 
    }).then(async (res) => {
        if (res.status !== 200) {
            throw new Error(`Non-200 status code ${res.status}`);
        }
        return (await res.json()) as TagRecord;
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

export function deleteTag(tag: TagRecord){
    return fetch('/api/tags', {
            method: 'DELETE',
            body: JSON.stringify({
                id: tag.id
            })
        }).then((res) => {
            if (!res.ok){
                throw new Error(`Non-200 status code ${res.status}`);
            }
            addNotification({ message: `Deleted "${tag.name}"`, level: 'success' });
            return tag.owner;
        }).catch((err) => {
            addNotification({
                message: 'Failed to delete tag. Please try again',
                level: 'failure'
            });
            Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
                context: 'Failed to delete tag',
                user: tag.owner,
                tag: tag.id
            }); 
        })
}