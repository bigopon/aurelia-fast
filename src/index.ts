import { html } from "./template-compiler";
import { On } from "./template";

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
`
