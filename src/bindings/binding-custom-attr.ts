import { IContainer, IIndexable, Registration } from "@aurelia/kernel";
import { ComputedWatcher, Controller, CustomAttributeDefinition, CustomAttributeType, ICustomAttributeController, INode, IObserverLocator, LifecycleFlags, Scope as AuScope } from "@aurelia/runtime-html";
import { NotImplementedError } from "../error";
import { IBinding, IBindingExpression, IMultiBindingExpression, LambdaTemplateExpression, Scope, TupleLambdaTemplateExpression } from "../interfaces";

export class CustomAttributeBindingExpression<T extends object> implements IBindingExpression<T, unknown> {
  get __be(): true {
    return true;
  }

  constructor(
    readonly context: IContainer,
    readonly Type: CustomAttributeType,
    readonly expressions: LambdaTemplateExpression<object>
      | TupleLambdaTemplateExpression<object, unknown>
      | IMultiBindingExpression<object, unknown>
  ) {

  }

  create(target: HTMLElement) {
    const container = this.context.createChild();
    container.register(
      Registration.instance(INode, target),
      Registration.instance(Element, target),
      Registration.instance(HTMLElement, target)
    );
    const attrVm = container.invoke(this.Type);
    const attrController = Controller.forCustomAttribute(
      null,
      this.context,
      attrVm,
      target as HTMLElement,
      0
    );

    return new CustomAttributeBinding(
      attrController,
      this.expressions,
      this.context.get(IObserverLocator)
    );
  }
}

export class CustomAttributeBinding implements IBinding {
  watchers: any[] = [];
  constructor(
    readonly controller: ICustomAttributeController<object>,
    readonly expressions: LambdaTemplateExpression<object>
      | TupleLambdaTemplateExpression<object, unknown>
      | IMultiBindingExpression<object, unknown>,
    readonly oLocator: IObserverLocator,
  ) {
    
  }

  bind(scope: Scope) {
    const source = scope.source;
    const { controller, controller: { viewModel }, expressions} = this;
    controller.activate(controller, null!, LifecycleFlags.fromBind, AuScope.create(source));
    // lol
    // (viewModel as any).bind?.(scope);

    if (typeof expressions === 'function') {
      const observer = this.oLocator.getObserver(viewModel, 'value');
      const watcher = new ComputedWatcher(
        source as IIndexable,
        this.oLocator,
        expressions,
        (newValue) => { observer.setValue(newValue, 0); },
        true
      );
      observer.setValue(expressions(source, scope, scope), 0);
      watcher.$bind();
      this.watchers.push(watcher);
    } else if (expressions instanceof Array) {
      throw new NotImplementedError('CA two way binding');
    } else {
      for (const prop in expressions) {
        const expression = expressions[prop];
        if (expression instanceof Array) {
          throw new NotImplementedError('CA two way binding');
        }
        if (typeof expression !== 'function') {
          throw new NotImplementedError('Only lambda supported for CA binding');
        }
        const observer = this.oLocator.getAccessor(viewModel, prop);
        const watcher = new ComputedWatcher(
          source as IIndexable,
          this.oLocator,
          expression,
          (newValue) => { observer.setValue(newValue, 0); },
          true
        );
        observer.setValue(expression(source, scope, scope), 0);
        watcher.$bind();
        this.watchers.push(watcher);
      }
    }
  }

  unbind() {
    throw new NotImplementedError();
  }
}
