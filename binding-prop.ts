import { IBinding, IBindingExpression, IContainer, IExpression, ITemplateExpression, TemplateNode } from "bindings";

export class PropTemplateExpression implements ITemplateExpression<object, object, unknown> {
  expression: IExpression<object, object, unknown>;

  constructor(
    private readonly expressions: [
      toView?: IExpression<object, object, unknown>,
      fromView?: IExpression<object, object, unknown>
    ]
  ) {
    const [toView, fromView] = expressions;
  }

  compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<object, object, unknown> {
    if (!target) {
      throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
    }
    throw new Error("Method not implemented.");
  }
}


export class MultiPropTemplateExpression implements ITemplateExpression<object, object, unknown> {
  expression: IExpression<object, object, unknown>;

  constructor(
    private readonly expressions: Record<string | symbol, [
      toView?: IExpression<object, object, unknown>,
      fromView?: IExpression<object, object, unknown>
    ]>
  ) {
  }

  compile(node: TemplateNode, target: string, context: IContainer): IBindingExpression<object, object, unknown> {
    if (!target) {
      throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
    }
    throw new Error("Method not implemented.");
  }
}

export class PropBindingExpression implements IBindingExpression<object, object, unknown> {
  expression: IExpression<object, object, unknown>;
  create(target: unknown): IBinding<object, object, unknown> {
    throw new Error("Method not implemented.");
  }

}

export class ToTargetPropBinding implements IBinding<object, object, unknown> {
  expression: IExpression<object, object, unknown>;
  bind(scope: object): void {
    throw new Error("Method not implemented.");
  }
  unbind(scope: object): void {
    throw new Error("Method not implemented.");
  }
}

export class ToSourcePropBinding implements IBinding<object, object, unknown> {
  expression: IExpression<object, object, unknown>;
  bind(scope: object): void {
    throw new Error("Method not implemented.");
  }
  unbind(scope: object): void {
    throw new Error("Method not implemented.");
  }
}

export class TwoWayPropBinding implements IBinding<object, object, unknown> {
  expression: IExpression<object, object, unknown>;
  bind(scope: object): void {
    throw new Error("Method not implemented.");
  }
  unbind(scope: object): void {
    throw new Error("Method not implemented.");
  }

}
