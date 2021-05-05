import { DI, IContainer } from '@aurelia/kernel';

export class TemplateNode {
  constructor(
    public readonly type: string | Function,
    public readonly attrs: Record<string, any>,
    public readonly children: (TemplateNode | string)[],
  ) {}
}

export class CompiledTemplateNode {
  constructor(
    public readonly type: string | Function,
    public readonly attrs: (ICompiledAttr | IBindingExpression<object, unknown>)[],
    public readonly children: (CompiledTemplateNode | string)[],
  ) {}
}

export interface ICompiledAttr {
  name: string | symbol;
  value: any;
}

export type CreateElement = (type: string | Function, attrs: Record<string, any>, ...children: (TemplateNode | string)[]) => TemplateNode;

export type LambdaTemplateExpression<TSource, TContext = any> = (s: TSource, c: TContext, sc?: Scope) => unknown;
export type FromViewLambdaTemplateExpression<TSrc, TContext = any, TVal = any> = (v: TVal, s: TSrc, c: TContext, sc: Scope) => unknown;
export type TupleLambdaTemplateExpression<TSrc, TContext> =
  [toView: LambdaTemplateExpression<TSrc, TContext>, fromView: FromViewLambdaTemplateExpression<TSrc, TContext>]
  | [toView: undefined, fromView: FromViewLambdaTemplateExpression<TSrc, TContext>]
  | [toView: LambdaTemplateExpression<TSrc, TContext>, fromView: null]
  // | [toView?: LambdaTemplateExpression<TSrc, TContext>, fromView?: FromViewLambdaTemplateExpression<TSrc, TContext>]

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

export type IMultiTemplateExpression<TSource, TContext> = {
  [key: string]: LambdaTemplateExpression<TSource, TContext>
    | TupleLambdaTemplateExpression<TSource, TContext>
    | ITemplateExpression<TSource, TContext>;
}

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
export type TemplateValue<TScope, TContext = any> =
  | string
  | number
  | TupleLambdaTemplateExpression<TScope, TContext>
  // | [LambdaTemplateExpression<TScope, TContext>, FromViewLambdaTemplateExpression<TScope, TContext>]
  // | [null, FromViewLambdaTemplateExpression<TScope, TContext>]
  | LambdaTemplateExpression<TScope>
  | ITemplateExpression<TScope, TContext>
  | IMultiTemplateExpression<TScope, TContext>
