import type { ITemplateExpression, LambdaTemplateExpression, IBinding, IContainer, IBindingExpression, TemplateNode, Scope } from "../interfaces";
export declare class OnTemplateExpression<T extends EventTarget = EventTarget> implements ITemplateExpression<T, Event> {
    readonly type: string;
    readonly expression: LambdaTemplateExpression<T, Event>;
    $isExpression: true;
    constructor(type: string, expression: LambdaTemplateExpression<T, Event>);
    compile(node: TemplateNode, target: string | null, context: IContainer): OnBindingExpression<T>;
}
export declare class OnBindingExpression<T extends EventTarget> implements IBindingExpression<T, Event> {
    readonly type: string;
    readonly expression: LambdaTemplateExpression<T, Event>;
    constructor(type: string, expression: LambdaTemplateExpression<T, Event>);
    get __i2(): true;
    create(target: Element): EventBinding<T>;
}
export declare class EventBinding<T extends EventTarget> implements IBinding<T> {
    private readonly target;
    private readonly type;
    readonly expression: LambdaTemplateExpression<T, Event>;
    scope: Scope;
    constructor(target: EventTarget, type: string, expression: LambdaTemplateExpression<T, Event>);
    bind(scope: Scope): void;
    unbind(): void;
    handleEvent(e: Event): void;
}
