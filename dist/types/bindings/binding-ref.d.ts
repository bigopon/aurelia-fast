import type { IContainer } from "@aurelia/kernel";
import type { ITemplateExpression, IBinding, IBindingExpression, TemplateNode, Scope } from "../interfaces";
export declare class RefTemplateExpression implements ITemplateExpression<object, object> {
    readonly type: string | symbol;
    $isExpression: true;
    constructor(type: string | symbol);
    compile(node: TemplateNode, target: string | null, context: IContainer): RefBindingExpression;
}
export declare class RefBindingExpression implements IBindingExpression<object, unknown> {
    readonly type: string | symbol;
    get __i2(): true;
    constructor(type: string | symbol);
    create(target: Element): RefBinding;
}
export declare class ViewModelRefTemplateExpression implements ITemplateExpression<object, object> {
    readonly type: string | symbol;
    $isExpression: true;
    constructor(type: string | symbol);
    compile(node: TemplateNode, target: string | null, context: IContainer): ViewModelRefBindingExpression;
}
export declare class ViewModelRefBindingExpression implements IBindingExpression<object, unknown> {
    readonly type: string | symbol;
    get __i2(): true;
    constructor(type: string | symbol);
    create(target: Element): RefBinding;
}
export declare class RefBinding implements IBinding {
    private readonly target;
    private readonly key;
    scope: Scope;
    constructor(target: unknown, key: string | symbol);
    bind(scope: Scope): void;
    unbind(): void;
}
