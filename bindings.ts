export type IExpression<TSource, TContext, TParent> = (src: TSource, ctx: TContext, parent?: TParent) => unknown;

export interface IContainer {
  get(key: unknown): any;
  getResource(key: unknown): unknown | null;
}

export interface TemplateNode {
  type: string;
  attrs: [];
  children: TemplateNode[];
}

export const enum TemplateExpressionType {
  None,
  Host,
}

export interface ITemplateExpression<TSource, TContext, TParent> {
  expression: IExpression<TSource, TContext, TParent>;
  /**
   * @param node The host element that this template expression belongs.
   * - For attribute, this should be the owning node
   * - For content, this should be the parent node of the content node
   * @param target target attribute of the host node that this expression is attached to
   * Can be empty if there's no attribute attached
   * @param context
   */
  compile(node: TemplateNode, target: string | null, context: IContainer): IBindingExpression<TSource, TContext, TParent>;
}

export interface IBindingExpression<TSource, TContext, TParent> {
  expression: IExpression<TSource, TContext, TParent>;
  create(target: unknown): IBinding<TSource, TContext, TParent>;
}

export interface IBinding<Src, Ctx, Parent> {
  expression: IExpression<Src, Ctx, Parent>;
  bind(scope: object): void;
  unbind(scope: object): void;
}

export class AmorphousTemplateExpression implements ITemplateExpression<object, object, unknown> {
  constructor(
    readonly expression: IExpression<object, object, unknown>
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer): IBindingExpression<object, object, unknown> {
    if (!target) {
      throw new Error('Invalid expression');
    }
    switch (target[0]) {
      case '@': return;
    }
    throw new Error("Method not implemented.");
  }
}
