import { IContainer, IIndexable } from "@aurelia/kernel";
import { IObserverLocator } from "@aurelia/runtime";
import { ComputedWatcher } from "@aurelia/runtime-html";
import { IBinding, IBindingExpression, IMultiBindingExpression, LambdaTemplateExpression, Scope } from "../interfaces";

export class StyleBindingExpression implements IBindingExpression<object, unknown> {
  get __be(): true { return true; }

  constructor(
    readonly context: IContainer,
    readonly expressions: IMultiBindingExpression<object, unknown>
  ) {

  }

  create(target: HTMLElement) {
    return new StyleBinding(target, this.expressions, this.context.get(IObserverLocator));
  }
}

export class StyleBinding implements IBinding {
  constructor(
    readonly el: HTMLElement,
    readonly expressions: IMultiBindingExpression<object, unknown>,
    readonly oLocator: IObserverLocator,
  ) {}

  bind(scope: Scope) {
    const source = scope.source;
    const { expressions, el } = this;
    for (const prop in expressions) {
      const expression = expressions[prop] as LambdaTemplateExpression<object>;
      const watcher = new ComputedWatcher(
        source as IIndexable,
        this.oLocator,
        expression,
        (newValue) => { el.style[prop as any] = newValue as any },
        true
      );
      el.style[prop as any] = expression(scope.source, scope, scope) as any;
      watcher.$bind();
    }
  }

  unbind() {

  }
}
