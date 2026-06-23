import * as krnlts from 'krnlts';
import { krnlSystemEntityBase } from 'krnlts';

declare class Gil extends krnlSystemEntityBase {
    constructor(commPort?: number, host?: string);
    addLocal(atom: any): krnlts.krnlLocalFunctionality;
    _decorateError(err: any, fid: string, input: any): Promise<any>;
    boot(): Promise<void>;
}

export { Gil };
