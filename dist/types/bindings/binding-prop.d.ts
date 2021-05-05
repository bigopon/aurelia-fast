import type { IContainer } from "@aurelia/kernel";
import { IObserverLocator } from "@aurelia/runtime";
import { IBinding, IBindingExpression, LambdaTemplateExpression, ITemplateExpression, TemplateNode, Scope, FromViewLambdaTemplateExpression } from "../interfaces";
export declare class PropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
    private readonly expressions;
    get __te(): true;
    constructor(expressions: [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]);
    compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object>;
}
export declare class TwoWayPropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
    private readonly toView;
    private readonly fromView;
    get __te(): true;
    constructor(toView: LambdaTemplateExpression<T, unknown>, fromView: FromViewLambdaTemplateExpression<T, unknown>);
    compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object>;
}
export declare class MultiPropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
    private readonly expressions;
    get __te(): true;
    constructor(expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>);
    compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object>;
}
export declare class MultiPropBindingExpression<T extends object = object> implements IBindingExpression<T, object> {
    readonly expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>;
    get __be(): true;
    constructor(expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>);
    create(target: Element): IBinding;
}
export declare class PropBindingExpression implements IBindingExpression<object, object> {
    readonly key: string | symbol;
    readonly expression: LambdaTemplateExpression<object>;
    readonly context: IContainer;
    get __be(): true;
    constructor(key: string | symbol, expression: LambdaTemplateExpression<object>, context: IContainer);
    create(target: Element): IBinding;
}
export declare class TwoWayPropBindingExpression<T extends object = object> implements IBindingExpression<object, object> {
    readonly key: string | symbol;
    readonly expressions: [LambdaTemplateExpression<T, unknown>, FromViewLambdaTemplateExpression<T, unknown>];
    readonly context: IContainer;
    get __be(): true;
    constructor(key: string | symbol, expressions: [LambdaTemplateExpression<T, unknown>, FromViewLambdaTemplateExpression<T, unknown>], context: IContainer);
    create(target: Element): IBinding;
}
export declare class ToTargetPropBinding implements IBinding {
    readonly key: string | symbol;
    readonly target: any;
    readonly expression: LambdaTemplateExpression<object>;
    readonly observerLocator: IObserverLocator;
    constructor(key: string | symbol, target: any, expression: LambdaTemplateExpression<object>, observerLocator: IObserverLocator);
    bind(scope: Scope): void;
    unbind(): void;
}
export declare class ToSourcePropBinding implements IBinding {
    bind(scope: Scope): void;
    unbind(): void;
}
export declare class TwoWayPropBinding<T extends object = object> implements IBinding {
    readonly key: string | symbol;
    readonly target: any;
    readonly expressions: [LambdaTemplateExpression<T>, FromViewLambdaTemplateExpression<T>];
    readonly observerLocator: IObserverLocator;
    constructor(key: string | symbol, target: any, expressions: [LambdaTemplateExpression<T>, FromViewLambdaTemplateExpression<T>], observerLocator: IObserverLocator);
    bind(scope: Scope<T>): void;
    unbind(): void;
}
