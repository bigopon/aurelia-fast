import type { IContainer } from "@aurelia/kernel";
import { IBinding, IBindingExpression, LambdaTemplateExpression, ITemplateExpression, TemplateNode, Scope } from "../interfaces";
export declare class PropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
    private readonly expressions;
    readonly $isExpression: true;
    constructor(expressions: [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]);
    compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object>;
}
export declare class MultiPropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
    private readonly expressions;
    readonly $isExpression: true;
    constructor(expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>);
    compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object>;
}
export declare class MultiPropBindingExpression<T extends object = object> implements IBindingExpression<T, object> {
    readonly expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>;
    get __i2(): true;
    constructor(expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>);
    create(target: Element): IBinding;
}
export declare class PropBindingExpression implements IBindingExpression<object, object> {
    readonly key: string | symbol;
    readonly expression: LambdaTemplateExpression<object>;
    get __i2(): true;
    constructor(key: string | symbol, expression: LambdaTemplateExpression<object>);
    create(target: Element): IBinding;
}
export declare class ToTargetPropBinding implements IBinding {
    readonly key: string | symbol;
    readonly target: any;
    readonly expression: LambdaTemplateExpression<object>;
    constructor(key: string | symbol, target: any, expression: LambdaTemplateExpression<object>);
    bind(scope: Scope): void;
    unbind(): void;
}
export declare class ToSourcePropBinding implements IBinding {
    bind(scope: Scope): void;
    unbind(): void;
}
export declare class TwoWayPropBinding implements IBinding {
    bind(scope: object): void;
    unbind(): void;
}
