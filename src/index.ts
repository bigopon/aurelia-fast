import { html } from "./template-compiler";
import { On } from "./template";

interface App {
    name: string;
    value: number;
    message: string;
    count: number;
    onClick(e: MouseEvent): void;
    onMouseEnter(e: MouseEvent): void;
}

html<App>`<div ${x => x.count} ${On('click', (x, e) => x)} @click=${x => x} />
    <button ${On('click', (x, e)=> x.onClick(e))} />
    <button ${On('mousedown', (x, e) => x.onMouseEnter(e))}>
`
