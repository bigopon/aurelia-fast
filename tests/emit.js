const { html, On, Ref } = require('../dist/cjs');
const fs = require('fs');
const { resolve } = require('path');

console.log('Running tests generating JSON output for an example template');

fs.writeFileSync(
    resolve(__dirname, './test-output.json'),
    JSON.stringify(html`
        <div textContent=${x => x.count} ${On('click', (x, e) => x)} @click=${x => x} ${Ref('div') }/>
        <p textContent=${x => x.message}></p>
        <button ${On('click', (x, e)=> x.onClick(e))} textContent='Hello world' />
        <button ${On('mouseenter', (x, e) => x.onMouseEnter(e))} textContent='A self close button' />
        <div data-role="group">
            <input value=${[x => x.message, (v, x) => x.message = v]} />
            <input value=${[x => x.message, (v, x) => x.message = v]} />
            <button ${On('click', x => x.message = 'Hello world ' + Math.random())} textContent="Generate message" />
        </div>
    `.nodes, (key, value) => {
        if (typeof value === 'function') {
            return value.toString()
        }
        return value;
    }, 2)
)

console.log('JSON output generated');
