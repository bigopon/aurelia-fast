const { html, On } = require('../dist/cjs');
const fs = require('fs');
const { resolve } = require('path');

console.log('Running tests generating JSON output for an example template');

fs.writeFileSync(
    resolve(__dirname, './test-output.json'),
    JSON.stringify(html`
        <div ${x => x.count} ${On('click', (x, e) => x)} @click=${x => x} />
        <button ${On('click', (x, e)=> x.onClick(e))} />
        <button ${On('mousedown', (x, e) => x.onMouseEnter(e))} />
        <div square=${{ color: x => x.color, bg: x => x.background }} />
    `, (key, value) => {
        if (typeof value === 'function') {
            return value.toString()
        }
        return value;
    }, 2)
)

console.log('JSON output generated');
