export interface IContainer {
  get(key: unknown): any;
  getResource(key: unknown): unknown | null;
}

export class TemplateNode {
  constructor(
    public readonly type: string | Function,
    public readonly attrs: Record<string, any>,
    public readonly children: (TemplateNode | string)[],
  ) {}
}

export type CreateElement = (type: string | Function, attrs: Record<string, any>, ...children: (TemplateNode | string)[]) => TemplateNode;

export type LambdaTemplateExpression<TSource, TContext = any> = (s: TSource, c: TContext, sc?: Scope) => unknown;

export interface ITemplateExpression<TSource, TContext> {
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

export interface IBindingExpression<TSource, TContext> {
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
  | LambdaTemplateExpression<TScope>
  | string
  | number
  | ITemplateExpression<TScope, TContext>

export interface HtmlTagger<TSource = any, TParent = any> {
  (strings: TemplateStringsArray, ...values: TemplateValue<TSource, TParent>[]): any;
}
