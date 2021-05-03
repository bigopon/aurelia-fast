import type { ITemplateExpression, IExpression, IBinding, IContainer, IBindingExpression, TemplateNode } from "bindings";

export class RefTemplateExpression implements ITemplateExpression<object, object, unknown> {
  readonly expression: IExpression<object, object, unknown>;

  public constructor(
    readonly type: string | symbol,
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer) {
    return new RefBindingExpression(this.type);
  }
}

export class RefBindingExpression implements IBindingExpression<object, unknown, unknown> {
  readonly expression: IExpression<object, unknown, unknown>;

  constructor(
    readonly type: string | symbol,
  ) {}

  create(target: Element) {
    return new RefBinding(target, this.type);
  }
}

export class RefBinding implements IBinding<object, Event, unknown> {
  readonly expression: IExpression<object, Event, unknown>;

  constructor(
    private readonly target: unknown,
    private readonly key: string | symbol,
  ) {}

  bind(scope: object) {
    scope[this.key] = this.target;
  }

  unbind(scope: object) {
    if (scope[this.key] === this.target) {
      scope[this.key] = null;
    }
  }
}

export class ViewModelRefTemplateExpression implements ITemplateExpression<object, object, unknown> {
  readonly expression: IExpression<object, object, unknown>;

  public constructor(
    readonly type: string | symbol,
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer) {
    return new ViewModelRefBindingExpression(this.type);
  }
}

export class ViewModelRefBindingExpression implements IBindingExpression<object, unknown, unknown> {
  readonly expression: IExpression<object, unknown, unknown>;

  constructor(
    readonly type: string | symbol,
  ) {}

  create(target: Element) {
    return new RefBinding(target['$au'].viewModel, this.type);
  }
}
