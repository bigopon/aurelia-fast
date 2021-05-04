import { OnTemplateExpression } from "./bindings/binding-on";
import { RefTemplateExpression, ViewModelRefTemplateExpression } from "./bindings/binding-ref";
import type { ITemplateExpression, Scope } from "./interfaces";

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
