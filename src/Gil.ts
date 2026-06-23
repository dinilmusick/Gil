import { GithubManager } from "./entities/GithubManager/GithubManager.ts";
import { krnlSystemEntityBase } from "krnlts";
import { DocumentationManager } from "./libraries/DocumentationManagerConcepts/DocumentationManagerConcepts.ts";

export class Gil extends krnlSystemEntityBase {
    constructor(commPort = 10091, host = "0.0.0.0") {
        super("Gil", null, commPort, host);
        this.addChild(new GithubManager(this));
        this.setDocumentationProvider(DocumentationManager as any);
    }

    addLocal(atom: any) {
        const originalApi = atom.api;
        const id = atom.id;
        const wrappedApi = async (input: any, context: any) => {
            console.log("wrappedApi called for", id, "with input:", JSON.stringify(input));
            try {
                const result = await originalApi(input, context);
                if (result && result.status === "success") {
                    const nextSteps = DocumentationManager.getNextStepsDoc(id);
                    if (nextSteps && nextSteps.length > 0) {
                        result.preemptiveDocumentation = {
                            message: "Progressive Exploration: Based on your successful action, here are the recommended next steps.",
                            nextSteps
                        };
                    }
                } else if (result) {
                    const usageDoc = DocumentationManager.getDocForEndpoint(id);
                    if (usageDoc) result.errorDocumentation = usageDoc;
                }
                return result;
            } catch (err: any) {
                const usageDoc = DocumentationManager.getDocForEndpoint(id);
                return {
                    status: "error",
                    message: err.message || "ERR_SYS_INTERNAL_LOGIC_ERROR",
                    errorDocumentation: usageDoc
                };
            }
        };
        return super.addLocal({ ...atom, api: wrappedApi });
    }

    async _decorateError(err: any, fid: string, input: any): Promise<any> {
        const decorated = await super._decorateError(err, fid, input);
        const atom = this.localFunctionalities.get(fid) || this.remoteFunctionalities.get(fid);
        if (!atom) {
            return {
                status: "error",
                message: `Endpoint '${fid}' not found.`,
                preemptiveDocumentation: {
                    message: "Welcome! It looks like you're exploring the system. Here is the entry-level documentation.",
                    entryPoints: DocumentationManager.getDocsForLayer("LAYER_1_ENTRY")
                }
            };
        }
        return decorated;
    }

    async boot() {
        // Diagnostic 404 Handler: Provide Entry Layer docs when an endpoint is missing
        this.commComponent.defineRpc("call", async (payload: any) => {
            const fid = payload?.fid;
            const atom = this.localFunctionalities.get(fid) || this.remoteFunctionalities.get(fid);
            if (!atom) {
                return {
                    status: "error",
                    message: `Endpoint '${fid}' not found.`,
                    preemptiveDocumentation: {
                        message: "Welcome! It looks like you're exploring the system. Here is the entry-level documentation.",
                        entryPoints: DocumentationManager.getDocsForLayer("LAYER_1_ENTRY")
                    }
                };
            }
            let data = payload.data;
            if (data === undefined && payload) {
                const { fid: _, ...rest } = payload;
                data = rest;
            }
            return await this.call(fid, data);
        });

        await this.activateServiceSuite("UNIFIED_HTTP");
        if ((this as any).unifiedHttpAdapter) {
            (this as any).unifiedHttpAdapter.enableFriendlyRouting = true;
        }
        const { KrnlMagneticLoader } = await import("krnlts");
        await KrnlMagneticLoader.loadAll(this, process.cwd());
        console.log("Gil System initialized.");
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = Number(process.env.KRNL_PORT || 10091);
    const system = new Gil(port);
    await system.boot();
}
