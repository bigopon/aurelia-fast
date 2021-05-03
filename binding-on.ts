import type { ITemplateExpression, IExpression, IBinding, IContainer, IBindingExpression, TemplateNode } from "bindings";

export class OnTemplateExpression implements ITemplateExpression<object, Event, unknown> {
  public constructor(
    readonly type: string,
    readonly expression: IExpression<object, Event, unknown>
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer) {
    return new OnBindingExpression(this.type, this.expression);
  }
}

export class OnBindingExpression implements IBindingExpression<object, Event, unknown> {
  constructor(
    readonly type: string,
    readonly expression: IExpression<object, Event, unknown>
  ) {}

  create(target: Element) {
    return new EventBinding(target, this.type, this.expression);
  }
}

export class EventBinding implements IBinding<object, Event, unknown> {
  constructor(
    private readonly target: Element,
    private readonly type: string,
    public readonly expression: IExpression<object, Event, unknown>,
  ) {}

  bind(scope) {
    this.target.addEventListener(this.type, this);
  }

  unbind(scope) {
    this.target.removeEventListener(this.type, this);
  }

  handleEvent(e: Event) {
    this.expression.call(undefined, this.target, e);
  }
}
