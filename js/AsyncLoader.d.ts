declare function htmlToElements(html: string): NodeListOf<Node & ChildNode>;
declare class AsyncLoader {
    cache: Map<string, string>;
    output: HTMLElement;
    level: number;
    constructor(output: HTMLElement, level?: number);
    private _InitialLoad;
    private _InitEvents;
    onPopState(e: PopStateEvent): void;
    onLink(path: string, hash: string, e: Event): void;
    loadHTML(hash: string, html: string): void;
    fetchHTML(url: string): Promise<string>;
}
