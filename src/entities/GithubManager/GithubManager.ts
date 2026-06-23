import { StartWatchedCloneAtom } from "./functionalities/StartWatchedClone/StartWatchedClone.ts";
import { RepairRepoAtom } from "./functionalities/RepairRepo/RepairRepo.ts";
import { VerifyRepoIntegrityAtom } from "./functionalities/VerifyRepoIntegrity/VerifyRepoIntegrity.ts";
import { CloneRepoAtom } from "./functionalities/CloneRepo/CloneRepo.ts";
import { GetRepoInfoAtom } from "./functionalities/GetRepoInfo/GetRepoInfo.ts";
import { ListReposAtom } from "./functionalities/ListRepos/ListRepos.ts";
import { GetAccountInfoAtom } from "./functionalities/GetAccountInfo/GetAccountInfo.ts";
import { ListAccountsAtom } from "./functionalities/ListAccounts/ListAccounts.ts";
import { RemoveAccountAtom } from "./functionalities/RemoveAccount/RemoveAccount.ts";
import { AddAccountAtom } from "./functionalities/AddAccount/AddAccount.ts";
import { krnlEntityBase } from "krnlts";
import { z } from "zod";

export class GithubManager extends krnlEntityBase {
    constructor(owner: krnlEntityBase | null) {
        super("GithubManager", owner);
        this.addLocal(AddAccountAtom);
        this.addLocal(RemoveAccountAtom);
        this.addLocal(ListAccountsAtom);
        this.addLocal(GetAccountInfoAtom);
        this.addLocal(ListReposAtom);
        this.addLocal(GetRepoInfoAtom);
        this.addLocal(CloneRepoAtom);
        this.addLocal(VerifyRepoIntegrityAtom);
        this.addLocal(RepairRepoAtom);
        this.addLocal(StartWatchedCloneAtom);
        // Scaffolding: addLocal(FuncAtom), addChild(ChildEntity)
    }
}
