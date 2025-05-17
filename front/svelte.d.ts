declare module '*.svelte' {
    export default class {
        static mount(target: string | HTMLElement): any;
    }
}
