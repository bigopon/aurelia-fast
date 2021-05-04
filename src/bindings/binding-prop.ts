import { IBinding, IBindingExpression, IContainer, LambdaTemplateExpression, ITemplateExpression, TemplateNode, Scope } from "../interfaces";

export class PropTemplateExpression<T extends object = object> implements ITemplateExpression<T, object> {
  $isExpression: true = true;
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
  $isExpression: true = true;
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

export class PropBindingExpression<T extends object = object> implements IBindingExpression<T, object> {
  create(target: unknown): IBinding {
    throw new Error("Method not implemented.");
  }
}

export class ToTargetPropBinding implements IBinding {
  bind(scope: Scope): void {
    throw new Error("Method not implemented.");
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
