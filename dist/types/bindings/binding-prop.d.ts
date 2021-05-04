import { IBinding, IBindingExpression, IContainer, LambdaTemplateExpression, ITemplateExpression, TemplateNode, Scope } from "../interfaces";
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
export declare class PropBindingExpression<T extends object = object> implements IBindingExpression<T, object> {
    create(target: unknown): IBinding;
}
export declare class ToTargetPropBinding implements IBinding {
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
