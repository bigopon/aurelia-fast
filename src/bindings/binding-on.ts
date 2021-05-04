import type { ITemplateExpression, LambdaTemplateExpression, IBinding, IContainer, IBindingExpression, TemplateNode, Scope } from "../interfaces";

export class OnTemplateExpression<T extends EventTarget = EventTarget> implements ITemplateExpression<T, Event> {
  $isExpression: true = true;
  public constructor(
    readonly type: string,
    readonly expression: LambdaTemplateExpression<T, Event>
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer) {
    return new OnBindingExpression(this.type, this.expression);
  }
}

export class OnBindingExpression<T extends EventTarget> implements IBindingExpression<T, Event> {
  constructor(
    readonly type: string,
    readonly expression: LambdaTemplateExpression<T, Event>
  ) {}

  create(target: Element) {
    return new EventBinding(target, this.type, this.expression);
  }
}

export class EventBinding<T extends EventTarget> implements IBinding<T> {
  scope!: Scope;

  constructor(
    private readonly target: EventTarget,
    private readonly type: string,
    public readonly expression: LambdaTemplateExpression<T, Event>,
  ) {}

  bind(scope: Scope) {
    this.scope = scope;
    this.target.addEventListener(this.type, this);
  }

  unbind() {
    this.scope = (void 0)!;
    this.target.removeEventListener(this.type, this);
  }

  handleEvent(e: Event) {
    this.expression.call(undefined, this.target as T, e, this.scope);
  }
}
