export interface IContainer {
    get(key: unknown): any;
    getResource(key: unknown): unknown | null;
}
export declare class TemplateNode {
    readonly type: string | Function;
    readonly attrs: Record<string, any>;
    readonly children: (TemplateNode | string)[];
    constructor(type: string | Function, attrs: Record<string, any>, children: (TemplateNode | string)[]);
}
export declare class CompiledTemplateNode {
    readonly type: string | Function;
    readonly attrs: ICompiledAttr[];
    readonly children: (CompiledTemplateNode | string)[];
    constructor(type: string | Function, attrs: ICompiledAttr[], children: (CompiledTemplateNode | string)[]);
}
export interface ICompiledAttr {
    name: string | symbol;
    value: any;
}
export declare type CreateElement = (type: string | Function, attrs: Record<string, any>, ...children: (TemplateNode | string)[]) => TemplateNode;
export declare type LambdaTemplateExpression<TSource, TContext = any> = (s: TSource, c: TContext, sc?: Scope) => unknown;
export declare type FromViewLambdaTemplateExpression<TSrc, TContext = any, TVal = any> = (v: TVal, s: TSrc, c: TContext, sc: Scope) => unknown;
export declare type TupleLambdaTemplateExpression<TSrc, TContext> = [
    toView: LambdaTemplateExpression<TSrc, TContext>,
    fromView: never
] | [toView: never, fromView: FromViewLambdaTemplateExpression<TSrc, TContext>] | [toView: LambdaTemplateExpression<TSrc, TContext>, fromView: FromViewLambdaTemplateExpression<TSrc, TContext>];
export interface ITemplateExpression<TSource, TContext> {
    readonly $isExpression: true;
    /**
     * @param node The host element that this template expression belongs.
     * - For attribute, this should be the owning node
     * - For content, this should be the parent node of the content node
     * @param target target attribute of the host node that this expression is attached to
     * Can be empty if there's no attribute attached
     * @param context
     */
    compile(node: TemplateNode, target: string | null, context: IContainer): IBindingExpression<TSource, TContext>;
}
export declare type IMultiTemplateExpression<TSource, TContext> = {
    [key: string]: LambdaTemplateExpression<TSource, TContext> | TupleLambdaTemplateExpression<TSource, TContext> | ITemplateExpression<TSource, TContext>;
};
export interface IBindingExpression<TSource, TContext> {
    readonly __i2: true;
    create(target: Element): IBinding<TSource extends object ? TSource : object>;
}
export interface IBinding<T extends object = object> {
    bind(scope: Scope<T>): void;
    unbind(): void;
}
export interface Scope<T extends object = object> {
    readonly source: T;
    readonly parent: Scope;
}
/**
 * Represents the types of values that can be interpolated into a template.
 * @public
 */
export declare type TemplateValue<TScope, TContext = any> = string | number | LambdaTemplateExpression<TScope> | TupleLambdaTemplateExpression<TScope, TContext> | ITemplateExpression<TScope, TContext> | IMultiTemplateExpression<TScope, TContext>;
