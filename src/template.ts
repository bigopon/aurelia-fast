import { OnTemplateExpression } from "./bindings/binding-on";
import { RefTemplateExpression, ViewModelRefTemplateExpression } from "./bindings/binding-ref";
import { CompiledTemplateNode, FromViewLambdaTemplateExpression, IBinding, IBindingExpression, LambdaTemplateExpression, TupleLambdaTemplateExpression } from './interfaces';
import type { ICompiledAttr, ITemplateExpression, Scope, TemplateNode } from "./interfaces";
import { MultiPropBindingExpression, PropBindingExpression, TwoWayPropBindingExpression, TwoWayPropTemplateExpression } from "./bindings/binding-prop";
import { IContainer } from "@aurelia/kernel";

function isExpression<T1 extends object = object, T2 = unknown>(v: unknown): v is ITemplateExpression<T1, T2> {
  return (v as unknown as ITemplateExpression<T1, T2>)?.__te === true;
}

function isBindingExpression(v: unknown): v is IBindingExpression<object, unknown> {
  return (v as unknown as IBindingExpression<object, unknown>)?.__be === true;
}

function isSyntheticKey(key: string) {
  return /^a__\d+$/.test(key);
}

export class Template {
  constructor(
    readonly nodes: TemplateNode[],
  ) {}

  compile(context: IContainer) {
    function compileNode(node: TemplateNode): CompiledTemplateNode {
      return new CompiledTemplateNode(
        node.type,
        node.attrs === null
          ? []
          : Object
            .entries(node.attrs)
            .map(([key, value]) => {
              const _isSyntheticKey = isSyntheticKey(key);
              switch (typeof value) {
                case 'object': {
                  if (value === null) {
                    throw new Error('Expression cannot be null');
                  }
                  if (isExpression(value)) {
                    return value.compile(node, _isSyntheticKey ? null : key, context);
                  } else if (value instanceof Array) {
                    if (_isSyntheticKey) {
                      throw new Error('Array syntax cannot be used without target prop');
                    }
                    const [toView, fromView] = value;
                    if (typeof toView !== 'function' && typeof fromView !== 'function') {
                      throw new Error('Binding must be at least have 1 direction');
                    }
                    if (toView && fromView) {
                      return new TwoWayPropBindingExpression(
                        key,
                        value as [LambdaTemplateExpression<object, unknown>, FromViewLambdaTemplateExpression<object, unknown>],
                        context
                      );
                    }
                  } else {
                    return new MultiPropBindingExpression(Object.entries(value).reduce((obj, [key2, value2]) => {
                      if (isExpression(value2)) {
                        value2 = value2.compile(node, _isSyntheticKey ? null : key2, context);
                      } else if (typeof value2 === 'function') {
                        value2 = new PropBindingExpression(key2, value2 as any, context);
                      }
                      obj[key2] = value2;
                      return obj;
                    }, {} as { [key: string]: unknown }) as any);
                  }
                }
                case 'function': {
                  if (_isSyntheticKey) {
                    throw new Error(`No key for lambda: ${value.toString()}`);
                  }
                  return new PropBindingExpression(key, value, context);
                }
              }
              return { name: key, value };
            }),
        node.children.map(c => typeof c === 'string' ? c : compileNode(c))
      );
    }
    return new CompiledTemplate(this.nodes.map(compileNode));
  }
}

export class CompiledTemplate {
  constructor(
    readonly nodes: CompiledTemplateNode[]
  ) {

  }

  render() {
    const fragment = document.createDocumentFragment();
    const bindings: IBinding<object>[] = [];
    function renderNode(n: CompiledTemplateNode, parent: Node): void {
      // todo:
      // if n.type === 'function'
      //  get custom element resource
      //  get custom element name
      // if n.type === 'string'
      //  get custom element resource
      //  if no, then proceed all binding
      const node = parent.appendChild(document.createElement(typeof n.type === 'string' ? n.type : n.type.name));
      n.attrs.forEach((attrOrBindingExpression) => {
        if (isBindingExpression(attrOrBindingExpression)) {
          bindings.push(attrOrBindingExpression.create(node));
        } else {
          const { name, value } = attrOrBindingExpression;
          if (/^data-|aria-|\w+:\w+/.test(name as string)) {
            node.setAttribute(name as string, value);
          } else {
            (node as any)[name] = value;
          }
        }
      });
      n.children.forEach(cn =>
        typeof cn === 'string'
          ? node.appendChild(document.createTextNode(cn))
          : renderNode(cn, node)
      );
    }
    this.nodes.forEach(n => renderNode(n, fragment));
    return new View(fragment, bindings);
  }
}

export class View {
  firstChild?: Node;
  lastChild?: Node;

  constructor(
    public fragment: DocumentFragment,
    public bindings: IBinding<object>[]
  ) {
    if (fragment.hasChildNodes()) {
      this.firstChild = fragment.firstChild!;
      this.lastChild = fragment.lastChild!;
    }
  }

  insertBefore(target: Node) {
    target.parentNode!.insertBefore(this.fragment, target);
  }

  appendTo(target: Node) {
    target.appendChild(this.fragment);
  }

  remove() {
    let node = this.firstChild;
    let child: Node;
    while (node != null && node !== this.lastChild) {
      child = node;
      node = node.nextSibling!;
      this.fragment.appendChild(child);
    }
  }

  bind(scope: any) {
    this.bindings.forEach(b => b.bind(scope));
  }

  unbind() {
    this.bindings.forEach(b => b.unbind());
  }
}

export function On<TSrc extends object = object>(event: 'click', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'mousedown', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'mouseup', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'dblclick', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'mousemove', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'mouseover', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'mouseenter', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: 'mouseleave', handler: (src: TSrc, e: MouseEvent, scope?: Scope) => unknown): ITemplateExpression<TSrc, MouseEvent>;
export function On<TSrc extends object = object>(event: string, handler: (src: TSrc, e: Event, scope?: Scope) => unknown): ITemplateExpression<TSrc, Event>;
export function On<TSrc extends object = object, TE extends Event = Event>(event: string, handler: (src: TSrc, e: TE, scope?: Scope) => unknown): ITemplateExpression<TSrc, TE> {
  return new OnTemplateExpression(event, handler as ConstructorParameters<typeof OnTemplateExpression>[1]);
}

export function Ref(key: string | symbol) {
  return new RefTemplateExpression(key);
}

export function ViewModelRef(key: string | symbol) {
  return new ViewModelRefTemplateExpression(key);
}

export function TwoWay<TScope extends object, TContext>(
  toView: LambdaTemplateExpression<TScope, unknown>,
  fromView: FromViewLambdaTemplateExpression<TScope, unknown>,
): ITemplateExpression<TScope, TContext> {
  return new TwoWayPropTemplateExpression<TScope>(toView, fromView);
}
