import { IBinding, IBindingExpression, IContainer, LambdaTemplateExpression, ITemplateExpression, TemplateNode, Scope } from "../interfaces";

export class PropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
  readonly $isExpression: true = true;
  constructor(
    private readonly expressions: [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]
  ) {
  }

  compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object> {
    if (!target) {
      throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
    }
    throw new Error("Method not implemented.");
  }
}

export class MultiPropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
  readonly $isExpression: true = true;
  constructor(
    private readonly expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>
  ) {
  }

  compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object> {
    if (!target) {
      throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
    }
    throw new Error("Method not implemented.");
  }
}

export class MultiPropBindingExpression<T extends object = object> implements IBindingExpression<T, object> {
  get __i2(): true {
    return true;
  }

  constructor(
    readonly expressions: Record<string | symbol, [toView?: LambdaTemplateExpression<T>, fromView?: LambdaTemplateExpression<T>]>
  ) {
  }

  create(target: Element): IBinding {
    if (!target) {
      throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
    }
    const vm = (target as any).$au?.viewModel;
    if (vm) {

    }
    throw new Error('not implemented');
  }
}

export class PropBindingExpression implements IBindingExpression<object, object> {
  get __i2(): true {
    return true;
  }

  constructor(
    readonly key: string | symbol,
    readonly expression: LambdaTemplateExpression<object>
  ) {

  }

  create(target: Element): IBinding {
    const vm = (target as any).$au?.viewModel;
    if (vm) {
      if (this.key in vm) {
        return new ToTargetPropBinding(this.key, vm, this.expression);
      }
    }
    return new ToTargetPropBinding(this.key, target, this.expression);
    // throw new Error("Method not implemented.");
  }
}

export class ToTargetPropBinding implements IBinding {
  constructor(
    readonly key: string | symbol,
    readonly target: any,
    readonly expression: LambdaTemplateExpression<object>
  ) {

  }

  bind(scope: Scope): void {
    this.target[this.key] = this.expression(scope.source, scope, scope);
  }

  unbind(): void {
    throw new Error("Method not implemented.");
  }
}

export class ToSourcePropBinding implements IBinding {
  bind(scope: Scope): void {
    throw new Error("Method not implemented.");
  }
  unbind(): void {
    throw new Error("Method not implemented.");
  }
}

export class TwoWayPropBinding implements IBinding {
  bind(scope: object): void {
    throw new Error("Method not implemented.");
  }
  unbind(): void {
    throw new Error("Method not implemented.");
  }
}
