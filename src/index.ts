import { html } from "./template-compiler";
import { On, Ref, TwoWay, ViewModelRef } from "./template";
import { TupleLambdaTemplateExpression } from "./interfaces";

interface App {
    name: string;
    value: number;
    message: string;
    count: number;
    color: string;
    background: string;
    onClick(e: MouseEvent): void;
    onMouseEnter(e: MouseEvent): void;
}

html<App>`
    <div ${x => x.count} ${On('click', (x, e) => x)} @click=${x => x} />
    <button ${On('click', (x, e)=> x.onClick(e))} />
    <button ${On('mousedown', (x, e) => x.onMouseEnter(e))}>
    <div square=${{ color: x => x.color, bg: x => x.background }} />
    <div square=${{ color: [x => x.color, (x: string, a) => a.background = x], bg: x => x.background }} />
    <input value=${TwoWay(x => x.message, (v: any, x) => x.message = v)} />
`

const a: TupleLambdaTemplateExpression<App, object> = [, (v, x) => x.message = v];

export { html, On, Ref, ViewModelRef, TwoWay };
