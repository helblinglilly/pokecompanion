import { Logger } from '$/lib/log';
import type { RecordTag } from '$/routes/api/tag/types';
import type Pocketbase from 'pocketbase';

export async function getTagsByUsername(pb: Pocketbase, username: string): Promise<RecordTag[]>{
    try {
        return pb.collection('tags').getFullList({
            filter: `owner.username ~ "${username}"`,
			sort: `-updated`
        })
    } catch(err){
        await Logger.error(
            Logger.ErrorClasses.TagOperation,
            Logger.buildError(err),
            {
                context: 'Failed to get tags for user',
                username
            }
        )

        return [];
    }
}