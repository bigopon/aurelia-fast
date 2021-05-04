import type { ITemplateExpression, IBinding, IContainer, IBindingExpression, TemplateNode, Scope } from "../interfaces";

export class RefTemplateExpression implements ITemplateExpression<object, object> {
  public constructor(
    readonly type: string | symbol,
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer) {
    return new RefBindingExpression(this.type);
  }
}

export class RefBindingExpression implements IBindingExpression<object, unknown> {
  constructor(
    readonly type: string | symbol,
  ) {}

  create(target: Element) {
    return new RefBinding(target, this.type);
  }
}

export class ViewModelRefTemplateExpression implements ITemplateExpression<object, object> {
  public constructor(
    readonly type: string | symbol,
  ) {}

  compile(node: TemplateNode, target: string | null, context: IContainer) {
    return new ViewModelRefBindingExpression(this.type);
  }
}

export class ViewModelRefBindingExpression implements IBindingExpression<object, unknown> {
  constructor(
    readonly type: string | symbol,
  ) {}

  create(target: Element) {
    return new RefBinding((target as any)['$au'].viewModel, this.type);
  }
}

export class RefBinding implements IBinding {
  scope!: Scope;

  constructor(
    private readonly target: unknown,
    private readonly key: string | symbol,
  ) {}

  bind(scope: Scope) {
    this.scope = scope;
    (scope.source as Record<string, any>)[this.key as string] = this.target;
  }

  unbind() {
    if ((this.scope.source as any)[this.key] === this.target) {
      (this.scope.source as any)[this.key] = null;
    }
  }
}
