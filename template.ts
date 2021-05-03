import { OnTemplateExpression } from "binding-on";
import { RefTemplateExpression, ViewModelRefTemplateExpression } from "binding-ref";
import { IBinding, IContainer, ITemplateExpression, TemplateNode } from "bindings";

// rendering an element
// 1. instantiate the view model as [var: compVm]
// 2. hydrate inner template
//  2.1 if [var: compVm] has hydrating method, invoke with [params: ...]
//  2.2 foreach node as [var: node] in the inner template
//    2.2.1 if node is a CE, instantiate view model -> [var: compVm]
//    2.2.2 if node is a CE repeat step 1 for this node, recursive, depth first
//    2.2.3 foreach attribute as [var: attr] on node
//      2.2.3.1 if attr is a CA, instantiate view model -> [var: attrVm]
//    2.2.4 if [var: compVm] has hydrated method, invoke with [params: ...]
//  2.3 if [var: compVm] has hydrated method, invoke with [params: ...]

export class TemplateTemplateExpression {

}

export class AmorphousTemplate {
  constructor(
    readonly html: TemplateStringsArray,
    readonly parts: ITemplateExpression<object, object, unknown>[],
  ) {}

  compile(context: IContainer) {
    return new Template(context, []);
  }
}

export class Template {
  constructor(
    readonly context: IContainer,
    readonly nodes: TemplateNode[],
  ) {}

  render() {
    this.nodes.forEach(node => {
      const compiledNode = { type: node.type, attrs: [], children: [] };
      for (let attr in node.attrs) {
        const value = node.attrs[attr] as ITemplateExpression<object, unknown, unknown>;
        if (attr.startsWith('a__')) {
          const bindingExpression = value.compile(node, null, this.context);
          compiledNode.attrs.push(bindingExpression);
        } else {
          compiledNode.attrs.push({ name: attr, value: node.attrs[attr] });
        }
      }
    })
  }
}

export class View {
  private bs: IBinding<object, unknown, unknown>[] = [];
  private cs: View[];
  private isBound: boolean = false;

  constructor(
    readonly root: View,
    readonly parent: View,
    readonly context: IContainer,
    readonly nodes: Element[],
  ) {}

  addBinding(b: IBinding<object, unknown, unknown>) {
    if (this.bs.indexOf(b) > -1) {
      this.bs.push(b);
      if (this.isBound) {
        b.bind(this);
      }
    }
  }

  removeBinding(b: IBinding<object, unknown, unknown>) {
    if (this.bs.indexOf(b) > -1) {
      this.bs.splice(0, 1);
      if (this.isBound) {
        b.unbind(this);
      }
    }
  }

  addChild() {

  }

  removeChild() {

  }

  bind() {
    // call binding + bound
  }

  unbind() {
    // call unbinding + unbound
  }

  attach() {
    // call attaching + attached
    this.cs.forEach(view => view.attach())
  }

  detach() {
    // call detaching + detached
    this.cs.forEach(view => view.detach())
  }
}

function On<TSrc extends object = object>(event: string, handler: (src: TSrc, e: Event, parent?: unknown) => unknown) {
  return new OnTemplateExpression(event, handler);
}

function Ref(key: string | symbol) {
  return new RefTemplateExpression(key);
}

function ViewModelRef(key: string | symbol) {
  return new ViewModelRefTemplateExpression(key);
}

declare function html(...params: unknown[]);

html`<div>${html``}</div>`
