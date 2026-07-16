/**
 * Machine-readable CADS component catalog for AI agents and docs.
 * Versioned with the package; Figma node IDs filled as components are mapped.
 */
interface CadsPropDef {
    name: string;
    type: string;
    default?: string;
    description?: string;
    required?: boolean;
}
interface CadsComponentManifest {
    name: string;
    exportName: string;
    importFrom: string;
    description: string;
    /** Figma component key / node id when mapped (Code Connect substitute). */
    figma?: {
        fileKey: string;
        /** Node id in Figma URL form (e.g. "1234:5678"). */
        nodeId?: string;
        componentKey?: string;
    };
    props: CadsPropDef[];
    variableDependencies: string[];
    usageRules: string[];
    example: string;
}
declare const CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";
declare const cadsManifest: {
    version: string;
    package: string;
    figmaFileKey: string;
    components: CadsComponentManifest[];
};

export { CADS_FIGMA_FILE_KEY, type CadsComponentManifest, type CadsPropDef, cadsManifest, cadsManifest as default };
