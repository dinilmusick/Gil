export const DocumentationManager = {
    layers: {
        LAYER_1_ENTRY: ["StartWatchedClone", "RepairRepo", "VerifyRepoIntegrity", "CloneRepo", "GetRepoInfo", "ListRepos", "GetAccountInfo", "ListAccounts", "RemoveAccount", "AddAccount"], // To be populated by DeaTS
        // Add more layers as needed
    },
    endpoints: {
        "StartWatchedClone": {
            "id": "StartWatchedClone",
            "title": "StartWatchedClone",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "RepairRepo": {
            "id": "RepairRepo",
            "title": "RepairRepo",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "VerifyRepoIntegrity": {
            "id": "VerifyRepoIntegrity",
            "title": "VerifyRepoIntegrity",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "CloneRepo": {
            "id": "CloneRepo",
            "title": "CloneRepo",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "GetRepoInfo": {
            "id": "GetRepoInfo",
            "title": "GetRepoInfo",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "ListRepos": {
            "id": "ListRepos",
            "title": "ListRepos",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "GetAccountInfo": {
            "id": "GetAccountInfo",
            "title": "GetAccountInfo",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "ListAccounts": {
            "id": "ListAccounts",
            "title": "ListAccounts",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "RemoveAccount": {
            "id": "RemoveAccount",
            "title": "RemoveAccount",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        "AddAccount": {
            "id": "AddAccount",
            "title": "AddAccount",
            "description": "A logic atom.",
            "payload": {},
            "example": {
                "input": {},
                "output": {
                    "status": "success"
                }
            }
        },
        // "fid": { id: "fid", title: "...", description: "...", payload: {}, example: {} }
    },
    nextSteps: {
        "StartWatchedClone": ["LAYER_1_ENTRY"],
        "RepairRepo": ["LAYER_1_ENTRY"],
        "VerifyRepoIntegrity": ["LAYER_1_ENTRY"],
        "CloneRepo": ["LAYER_1_ENTRY"],
        "GetRepoInfo": ["LAYER_1_ENTRY"],
        "ListRepos": ["LAYER_1_ENTRY"],
        "GetAccountInfo": ["LAYER_1_ENTRY"],
        "ListAccounts": ["LAYER_1_ENTRY"],
        "RemoveAccount": ["LAYER_1_ENTRY"],
        "AddAccount": ["LAYER_1_ENTRY"],
        // "fid": ["LAYER_X"]
    },
    getDocForEndpoint(fid: string) {
        return (this.endpoints as any)[fid] || null;
    },
    getDocsForLayer(layerId: string) {
        const atomIds = (this.layers as any)[layerId] || [];
        return atomIds.map((id: string) => (this.endpoints as any)[id]).filter(Boolean);
    },
    getNextStepsDoc(fid: string) {
        const nextLayerIds = (this.nextSteps as any)[fid] || [];
        let docs: any[] = [];
        for (const layerId of nextLayerIds) {
            docs = docs.concat(this.getDocsForLayer(layerId));
        }
        return docs;
    }
};
