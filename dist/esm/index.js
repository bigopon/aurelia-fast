class TemplateNode {
    constructor(type, attrs, children) {
        this.type = type;
        this.attrs = attrs;
        this.children = children;
    }
}
class CompiledTemplateNode {
    constructor(type, attrs, children) {
        this.type = type;
        this.attrs = attrs;
        this.children = children;
    }
}

class OnTemplateExpression {
    constructor(type, expression) {
        this.type = type;
        this.expression = expression;
        this.$isExpression = true;
    }
    compile(node, target, context) {
        return new OnBindingExpression(this.type, this.expression);
    }
}
class OnBindingExpression {
    constructor(type, expression) {
        this.type = type;
        this.expression = expression;
    }
    get __i2() {
        return true;
    }
    create(target) {
        return new EventBinding(target, this.type, this.expression);
    }
}
class EventBinding {
    constructor(target, type, expression) {
        this.target = target;
        this.type = type;
        this.expression = expression;
    }
    bind(scope) {
        this.scope = scope;
        this.target.addEventListener(this.type, this);
    }
    unbind() {
        this.scope = (void 0);
        this.target.removeEventListener(this.type, this);
    }
    handleEvent(e) {
        this.expression.call(undefined, this.scope.source, e, this.scope);
    }
}

class RefTemplateExpression {
    constructor(type) {
        this.type = type;
        this.$isExpression = true;
    }
    compile(node, target, context) {
        return new RefBindingExpression(this.type);
    }
}
class RefBindingExpression {
    constructor(type) {
        this.type = type;
    }
    get __i2() {
        return true;
    }
    create(target) {
        return new RefBinding(target, this.type);
    }
}
class ViewModelRefTemplateExpression {
    constructor(type) {
        this.type = type;
        this.$isExpression = true;
    }
    compile(node, target, context) {
        return new ViewModelRefBindingExpression(this.type);
    }
}
class ViewModelRefBindingExpression {
    constructor(type) {
        this.type = type;
    }
    get __i2() {
        return true;
    }
    create(target) {
        return new RefBinding(target['$au'].viewModel, this.type);
    }
}
class RefBinding {
    constructor(target, key) {
        this.target = target;
        this.key = key;
    }
    bind(scope) {
        this.scope = scope;
        scope.source[this.key] = this.target;
    }
    unbind() {
        if (this.scope.source[this.key] === this.target) {
            this.scope.source[this.key] = null;
        }
    }
}

class MultiPropBindingExpression {
    constructor(expressions) {
        this.expressions = expressions;
    }
    get __i2() {
        return true;
    }
    create(target) {
        if (!target) {
            throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
        }
        target.$au?.viewModel;
        throw new Error('not implemented');
    }
}
class PropBindingExpression {
    constructor(key, expression) {
        this.key = key;
        this.expression = expression;
    }
    get __i2() {
        return true;
    }
    create(target) {
        const vm = target.$au?.viewModel;
        if (vm) {
            if (this.key in vm) {
                return new ToTargetPropBinding(this.key, vm, this.expression);
            }
        }
        return new ToTargetPropBinding(this.key, target, this.expression);
        // throw new Error("Method not implemented.");
    }
}
class ToTargetPropBinding {
    constructor(key, target, expression) {
        this.key = key;
        this.target = target;
        this.expression = expression;
    }
    bind(scope) {
        this.target[this.key] = this.expression(scope.source, scope, scope);
    }
    unbind() {
        throw new Error("Method not implemented.");
    }
}

function isExpression(v) {
    return v?.$isExpression === true;
}
function isBindingExpression(v) {
    return v?.__i2 === true;
}
function isSyntheticKey(key) {
    return /^a__\d+$/.test(key);
}
class Template {
    constructor(nodes) {
        this.nodes = nodes;
    }
    compile(context) {
        function compileNode(node) {
            return new CompiledTemplateNode(node.type, Object.entries(node.attrs).map(([key, value]) => {
                const _isSyntheticKey = isSyntheticKey(key);
                switch (typeof value) {
                    case 'object': {
                        if (value === null) {
                            throw new Error('Expression cannot be null');
                        }
                        if (isExpression(value)) {
                            return value.compile(node, _isSyntheticKey ? null : key, context);
                        }
                        else {
                            return new MultiPropBindingExpression(Object.entries(value).reduce((obj, [key2, value2]) => {
                                if (isExpression(value2)) {
                                    value2 = value2.compile(node, _isSyntheticKey ? null : key2, context);
                                }
                                else if (typeof value2 === 'function') {
                                    value2 = new PropBindingExpression(key2, value2);
                                }
                                obj[key2] = value2;
                                return obj;
                            }, {}));
                        }
                    }
                    case 'function': {
                        if (_isSyntheticKey) {
                            throw new Error(`No key for lambda: ${value.toString()}`);
                        }
                        return new PropBindingExpression(key, value);
                    }
                }
                return { name: key, value };
            }), node.children.map(c => typeof c === 'string' ? c : compileNode(c)));
        }
        return new CompiledTemplate(this.nodes.map(compileNode));
    }
}
class CompiledTemplate {
    constructor(nodes) {
        this.nodes = nodes;
    }
    render() {
        const fragment = document.createDocumentFragment();
        const bindings = [];
        this.nodes.forEach(n => {
            const node = fragment.appendChild(document.createElement(typeof n.type === 'string' ? n.type : n.type.name));
            n.attrs.forEach((attrOrBindingExpression) => {
                if (isBindingExpression(attrOrBindingExpression)) {
                    bindings.push(attrOrBindingExpression.create(node));
                }
                else {
                    const { name, value } = attrOrBindingExpression;
                    node[name] = value;
                }
            });
        });
        return new View(fragment, bindings);
    }
}
class View {
    constructor(fragment, bindings) {
        this.fragment = fragment;
        this.bindings = bindings;
        if (fragment.hasChildNodes()) {
            this.firstChild = fragment.firstChild;
            this.lastChild = fragment.lastChild;
        }
    }
    insertBefore(target) {
        target.parentNode.insertBefore(this.fragment, target);
    }
    appendTo(target) {
        target.appendChild(this.fragment);
    }
    remove() {
        let node = this.firstChild;
        let child;
        while (node != null && node !== this.lastChild) {
            child = node;
            node = node.nextSibling;
            this.fragment.appendChild(child);
        }
    }
    bind(scope) {
        this.bindings.forEach(b => b.bind(scope));
    }
    unbind() {
        this.bindings.forEach(b => b.unbind());
    }
}
function On(event, handler) {
    return new OnTemplateExpression(event, handler);
}
function Ref(key) {
    return new RefTemplateExpression(key);
}
function ViewModelRef(key) {
    return new ViewModelRefTemplateExpression(key);
}

const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;
function html(strings, ...values) {
    return new Template(build.call(createNode, strings, ...values));
}
function createNode(type, attrs, ...children) {
    return new TemplateNode(type, attrs, children);
}
const build = function (statics) {
    const fields = arguments;
    const h = this;
    const attrsSyntheticAttrCountMap = new WeakMap();
    const getSyntheticCount = (attrs) => {
        const currentCount = (attrsSyntheticAttrCountMap.get(attrs) ?? 0) + 1;
        attrsSyntheticAttrCountMap.set(attrs, currentCount);
        return currentCount - 1;
    };
    let mode = MODE_TEXT;
    let buffer = '';
    let quote = '';
    let current = [0];
    let char;
    let propName;
    const commit = (field) => {
        if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))) {
            current.push(field ? fields[field] : buffer);
        }
        else if (mode === MODE_TAGNAME && (field || buffer)) {
            current[1] = field ? fields[field] : buffer;
            mode = MODE_WHITESPACE;
        }
        else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
            current[2] = Object.assign(current[2] ?? (current[2] = {}), fields[field]);
        }
        else if (mode === MODE_WHITESPACE && buffer && !field) {
            (current[2] ?? (current[2] = {}))[buffer] = true;
        }
        else if (mode === MODE_WHITESPACE && !buffer && field) {
            (current[2] ?? (current[2] = {}))[`a__${getSyntheticCount(current[2])}`] = fields[field];
        }
        else if (mode >= MODE_PROP_SET) {
            if (mode === MODE_PROP_SET) {
                (current[2] = current[2] || {})[propName] = field ? buffer ? (buffer + fields[field]) : fields[field] : buffer;
                mode = MODE_PROP_APPEND;
            }
            else if (field || buffer) {
                current[2][propName] += field ? buffer + fields[field] : buffer;
            }
        }
        buffer = '';
    };
    for (let i = 0; i < statics.length; i++) {
        if (i) {
            if (mode === MODE_TEXT) {
                commit();
            }
            commit(i);
        }
        for (let j = 0; j < statics[i].length; j++) {
            char = statics[i][j];
            if (mode === MODE_TEXT) {
                if (char === '<') {
                    // commit buffer
                    commit();
                    current = [current, '', null];
                    mode = MODE_TAGNAME;
                }
                else {
                    buffer += char;
                }
            }
            else if (mode === MODE_COMMENT) {
                // Ignore everything until the last three characters are '-', '-' and '>'
                if (buffer === '--' && char === '>') {
                    mode = MODE_TEXT;
                    buffer = '';
                }
                else {
                    buffer = char + buffer[0];
                }
            }
            else if (quote) {
                if (char === quote) {
                    quote = '';
                }
                else {
                    buffer += char;
                }
            }
            else if (char === '"' || char === "'") {
                quote = char;
            }
            else if (char === '>') {
                commit();
                mode = MODE_TEXT;
            }
            else if (!mode) ;
            else if (char === '=') {
                mode = MODE_PROP_SET;
                propName = buffer;
                buffer = '';
            }
            else if (char === '/' && (mode < MODE_PROP_SET || statics[i][j + 1] === '>')) {
                commit();
                if (mode === MODE_TAGNAME) {
                    current = current[0];
                }
                mode = current;
                (current = current[0]).push(h.apply(null, mode.slice(1)));
                mode = MODE_SLASH;
            }
            else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                // <a disabled>
                commit();
                mode = MODE_WHITESPACE;
            }
            else {
                buffer += char;
            }
            if (mode === MODE_TAGNAME && buffer === '!--') {
                mode = MODE_COMMENT;
                current = current[0];
            }
        }
    }
    commit();
    return current.length > 2 ? current.slice(1) : current[1];
};

html `
    <div ${x => x.count} ${On('click', (x, e) => x)} @click=${x => x} />
    <button ${On('click', (x, e) => x.onClick(e))} />
    <button ${On('mousedown', (x, e) => x.onMouseEnter(e))}>
    <div square=${{ color: x => x.color, bg: x => x.background }} />
    <div square=${{ color: [x => x.color, (x, a) => a.background = x], bg: x => x.background }} />
`;

export { On, Ref, ViewModelRef, html };
//# sourceMappingURL=index.js.map
