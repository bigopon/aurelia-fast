import type { IContainer } from "@aurelia/kernel";
import { IObserverLocator, ObservableGetter } from "@aurelia/runtime";
import { ComputedWatcher } from '@aurelia/runtime-html';
import { IBinding, IBindingExpression, LambdaTemplateExpression, ITemplateExpression, TemplateNode, Scope, FromViewLambdaTemplateExpression, TupleLambdaTemplateExpression } from "../interfaces";

export class PropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
  get $isExpression(): true {
    return true;
  }

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

export class TwoWayPropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
  get $isExpression(): true {
    return true;
  }

  constructor(
    private readonly toView: LambdaTemplateExpression<T, unknown>,
    private readonly fromView: FromViewLambdaTemplateExpression<T, unknown>,
  ) {
  }

  compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<T, object> {
    return new TwoWayPropBindingExpression(target, [this.toView, this.fromView], context);
  }
}

export class MultiPropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
  get $isExpression(): true {
    return true;
  }

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
    readonly expression: LambdaTemplateExpression<object>,
    readonly context: IContainer,
  ) {

  }

  create(target: Element): IBinding {
    const vm = (target as any).$au?.viewModel;
    if (vm) {
      if (this.key in vm) {
        return new ToTargetPropBinding(this.key, vm, this.expression, this.context.get(IObserverLocator));
      }
    }
    return new ToTargetPropBinding(this.key, target, this.expression, this.context.get(IObserverLocator));
    // throw new Error("Method not implemented.");
  }
}

export class TwoWayPropBindingExpression<T extends object = object> implements IBindingExpression<object, object> {
  get __i2(): true {
    return true;
  }

  constructor(
    readonly key: string | symbol,
    readonly expressions: [LambdaTemplateExpression<T, unknown>, FromViewLambdaTemplateExpression<T, unknown>],
    readonly context: IContainer,
  ) {

  }

  create(target: Element): IBinding {
    return new TwoWayPropBinding(this.key, target, this.expressions, this.context.get(IObserverLocator));
  }
}

export class ToTargetPropBinding implements IBinding {
  constructor(
    readonly key: string | symbol,
    readonly target: any,
    readonly expression: LambdaTemplateExpression<object>,
    readonly observerLocator: IObserverLocator,
  ) {

  }

  bind(scope: Scope): void {
    const watcher = new ComputedWatcher(
      scope.source as any,
      this.observerLocator,
      this.expression,
      (newValue) => {
        this.target[this.key] = newValue;
      },
      true
    );
    watcher.$bind();
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

export class TwoWayPropBinding<T extends object = object> implements IBinding {
  constructor(
    readonly key: string | symbol,
    readonly target: any,
    readonly expressions: [LambdaTemplateExpression<T>, FromViewLambdaTemplateExpression<T>],
    readonly observerLocator: IObserverLocator,
  ) {

  }

  bind(scope: Scope<T>): void {
    const targetObsever = this.observerLocator.getObserver(this.target, this.key);
    targetObsever.setValue(this.expressions[0](scope.source, scope, scope), 0, this.target, this.key);
    targetObsever.subscribe({
      handleChange: (newValue) => {
        this.expressions[1](newValue, scope.source, null, scope);
      }
    });

    const watcher = new ComputedWatcher(
      scope.source as any,
      this.observerLocator,
      this.expressions[0] as ObservableGetter,
      (newValue) => {
        if (this.target[this.key] !== newValue) {
          this.target[this.key] = newValue;
        }
      },
      true
    );
    watcher.$bind();
  }
  unbind(): void {
    throw new Error("Method not implemented.");
  }
}
