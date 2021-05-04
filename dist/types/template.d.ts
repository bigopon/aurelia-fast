import { RefTemplateExpression, ViewModelRefTemplateExpression } from "./bindings/binding-ref";
import { CompiledTemplateNode, IBinding } from './interfaces';
import type { ITemplateExpression, Scope, TemplateNode } from "./interfaces";
import { IContainer } from "@aurelia/kernel";
export declare class Template {
    readonly nodes: TemplateNode[];
    constructor(nodes: TemplateNode[]);
    compile(context: IContainer): CompiledTemplate;
}
export declare class CompiledTemplate {
    readonly nodes: CompiledTemplateNode[];
    constructor(nodes: CompiledTemplateNode[]);
    render(): View;
}
export declare class View {
    fragment: DocumentFragment;
    bindings: IBinding<object>[];
    firstChild?: Node;
    lastChild?: Node;
    constructor(fragment: DocumentFragment, bindings: IBinding<object>[]);
    insertBefore(target: Node): void;
    appendTo(target: Node): void;
    remove(): void;
    bind(scope: any): void;
    unbind(): void;
}
export declare function On<TSrc extends object = object>(event: 'click', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'mousedown', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'mouseup', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'dblclick', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'mousemove', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'mouseover', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'mouseenter', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: 'mouseleave', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export declare function On<TSrc extends object = object>(event: string, handler: (src: TSrc, e: Event, scope?: Scope) => unknown): ITemplateExpression<TSrc, Event>;
export declare function Ref(key: string | symbol): RefTemplateExpression;
export declare function ViewModelRef(key: string | symbol): ViewModelRefTemplateExpression;
