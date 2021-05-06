import { IObserverLocator } from '@aurelia/runtime';
import { ComputedWatcher, INode, Controller, IObserverLocator as IObserverLocator$1, Scope, CustomAttribute } from '@aurelia/runtime-html';
import { Registration } from '@aurelia/kernel';

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
    }
    get __te() {
        return true;
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
    get __be() {
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
    }
    get __te() {
        return true;
    }
    compile(node, target, context) {
        return new RefBindingExpression(this.type);
    }
}
class RefBindingExpression {
    constructor(type) {
        this.type = type;
    }
    get __be() {
        return true;
    }
    create(target) {
        return new RefBinding(target, this.type);
    }
}
class ViewModelRefTemplateExpression {
    constructor(type) {
        this.type = type;
    }
    get __te() {
        return true;
    }
    compile(node, target, context) {
        return new ViewModelRefBindingExpression(this.type);
    }
}
class ViewModelRefBindingExpression {
    constructor(type) {
        this.type = type;
    }
    get __be() {
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

class NotImplementedError extends Error {
    constructor(message) {
        super(message ? `Not implemented: ${message}` : 'Not implemented');
    }
}

class TwoWayPropTemplateExpression {
    constructor(toView, fromView) {
        this.toView = toView;
        this.fromView = fromView;
    }
    get __te() {
        return true;
    }
    compile(node, target, context) {
        return new TwoWayPropBindingExpression(target, [this.toView, this.fromView], context);
    }
}
class MultiPropBindingExpression {
    constructor(expressions) {
        this.expressions = expressions;
    }
    get __be() {
        return true;
    }
    create(target) {
        if (!target) {
            throw new Error('Invalid usage of prop binding expression. Example: prop=${x => x.value}');
        }
        target.$au?.viewModel;
        throw new NotImplementedError();
    }
}
class PropBindingExpression {
    constructor(key, expression, context) {
        this.key = key;
        this.expression = expression;
        this.context = context;
    }
    get __be() {
        return true;
    }
    create(target) {
        const vm = target.$au?.viewModel;
        if (vm) {
            if (this.key in vm) {
                return new ToTargetPropBinding(this.key, vm, this.expression, this.context.get(IObserverLocator));
            }
        }
        return new ToTargetPropBinding(this.key, target, this.expression, this.context.get(IObserverLocator));
        // throw new Error("Method not implemented.");
    }
}
class TwoWayPropBindingExpression {
    constructor(key, expressions, context) {
        this.key = key;
        this.expressions = expressions;
        this.context = context;
    }
    get __be() {
        return true;
    }
    create(target) {
        return new TwoWayPropBinding(this.key, target, this.expressions, this.context.get(IObserverLocator));
    }
}
class ToTargetPropBinding {
    constructor(key, target, expression, oLocator) {
        this.key = key;
        this.target = target;
        this.expression = expression;
        this.oLocator = oLocator;
    }
    bind(scope) {
        const watcher = new ComputedWatcher(scope.source, this.oLocator, this.expression, (newValue) => {
            this.target[this.key] = newValue;
        }, true);
        watcher.$bind();
        this.target[this.key] = this.expression(scope.source, scope, scope);
    }
    unbind() {
        throw new NotImplementedError();
    }
}
class TwoWayPropBinding {
    constructor(key, target, exprs, oLocator) {
        this.key = key;
        this.target = target;
        this.exprs = exprs;
        this.oLocator = oLocator;
    }
    bind(scope) {
        const targetObsever = this.oLocator.getObserver(this.target, this.key);
        targetObsever.setValue(this.exprs[0](scope.source, scope, scope), 0, this.target, this.key);
        targetObsever.subscribe({
            handleChange: (newValue) => {
                this.exprs[1](newValue, scope.source, null, scope);
            }
        });
        const watcher = new ComputedWatcher(scope.source, this.oLocator, this.exprs[0], (newValue) => {
            if (this.target[this.key] !== newValue) {
                this.target[this.key] = newValue;
            }
        }, true);
        watcher.$bind();
    }
    unbind() {
        throw new NotImplementedError();
    }
}

class CustomAttributeBindingExpression {
    constructor(context, Type, expressions) {
        this.context = context;
        this.Type = Type;
        this.expressions = expressions;
    }
    get __be() {
        return true;
    }
    create(target) {
        const container = this.context.createChild();
        container.register(Registration.instance(INode, target), Registration.instance(Element, target), Registration.instance(HTMLElement, target));
        const attrVm = container.invoke(this.Type);
        const attrController = Controller.forCustomAttribute(null, this.context, attrVm, target, 0);
        return new CustomAttributeBinding(attrController, this.expressions, this.context.get(IObserverLocator$1));
    }
}
class CustomAttributeBinding {
    constructor(controller, expressions, oLocator) {
        this.controller = controller;
        this.expressions = expressions;
        this.oLocator = oLocator;
        this.watchers = [];
    }
    bind(scope) {
        const source = scope.source;
        const { controller, controller: { viewModel }, expressions } = this;
        controller.activate(controller, null, 2 /* fromBind */, Scope.create(source));
        // lol
        // (viewModel as any).bind?.(scope);
        if (typeof expressions === 'function') {
            const observer = this.oLocator.getObserver(viewModel, 'value');
            const watcher = new ComputedWatcher(source, this.oLocator, expressions, (newValue) => { observer.setValue(newValue, 0); }, true);
            observer.setValue(expressions(source, scope, scope), 0);
            watcher.$bind();
            this.watchers.push(watcher);
        }
        else if (expressions instanceof Array) {
            throw new NotImplementedError('CA two way binding');
        }
        else {
            for (const prop in expressions) {
                const expression = expressions[prop];
                if (expression instanceof Array) {
                    throw new NotImplementedError('CA two way binding');
                }
                if (typeof expression !== 'function') {
                    throw new NotImplementedError('Only lambda supported for CA binding');
                }
                const observer = this.oLocator.getAccessor(viewModel, prop);
                const watcher = new ComputedWatcher(source, this.oLocator, expression, (newValue) => { observer.setValue(newValue, 0); }, true);
                observer.setValue(expression(source, scope, scope), 0);
                watcher.$bind();
                this.watchers.push(watcher);
            }
        }
    }
    unbind() {
        throw new NotImplementedError();
    }
}

class StyleBindingExpression {
    constructor(context, expressions) {
        this.context = context;
        this.expressions = expressions;
    }
    get __be() { return true; }
    create(target) {
        return new StyleBinding(target, this.expressions, this.context.get(IObserverLocator));
    }
}
class StyleBinding {
    constructor(el, expressions, oLocator) {
        this.el = el;
        this.expressions = expressions;
        this.oLocator = oLocator;
    }
    bind(scope) {
        const source = scope.source;
        const { expressions, el } = this;
        for (const prop in expressions) {
            const expression = expressions[prop];
            const watcher = new ComputedWatcher(source, this.oLocator, expression, (newValue) => { el.style[prop] = newValue; }, true);
            el.style[prop] = expression(scope.source, scope, scope);
            watcher.$bind();
        }
    }
    unbind() {
    }
}

function isExpression(v) {
    return v?.__te === true;
}
function isBindingExpression(v) {
    return v?.__be === true;
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
            return new CompiledTemplateNode(node.type, node.attrs === null
                ? []
                : Object
                    .entries(node.attrs)
                    .map(([key, value]) => {
                    const _isSyntheticKey = isSyntheticKey(key);
                    if (!_isSyntheticKey) {
                        const customAttr = context.find(CustomAttribute, key);
                        if (customAttr) {
                            const expressions = {};
                            if (value == null) {
                                throw new Error('Expression cannot be null');
                            }
                            switch (typeof value) {
                                case 'object': {
                                    if (isExpression(value)) {
                                        // todo:
                                        // this is not right, value prop isn't correct
                                        expressions['value'] = value.compile(node, key, context);
                                    }
                                    else if (!(value instanceof Array)) {
                                        // validate the usage a bit
                                        // value is IMultiTemplateExpression
                                        for (const prop in value) {
                                            const v = value[prop];
                                            if (isExpression(v)) {
                                                expressions[prop] = v.compile(node, prop, context);
                                                continue;
                                            }
                                            if (typeof v === 'function'
                                                || (v instanceof Array && (typeof v[0] === 'function' || typeof v[1] === 'function'))) {
                                                expressions[prop] = v;
                                            }
                                            else {
                                                throw new Error('Invalid CA binding usage');
                                            }
                                        }
                                    }
                                }
                            }
                            return new CustomAttributeBindingExpression(context, customAttr.Type, expressions);
                        }
                    }
                    switch (key) {
                        case 'style':
                            return new StyleBindingExpression(context, value);
                    }
                    switch (typeof value) {
                        case 'object': {
                            if (value === null) {
                                throw new Error('Expression cannot be null');
                            }
                            if (isExpression(value)) {
                                return value.compile(node, _isSyntheticKey ? null : key, context);
                            }
                            else if (value instanceof Array) {
                                if (_isSyntheticKey) {
                                    throw new Error('Array syntax cannot be used without target prop');
                                }
                                const [toView, fromView] = value;
                                if (typeof toView !== 'function' && typeof fromView !== 'function') {
                                    throw new Error('Binding must be at least have 1 direction');
                                }
                                if (toView && fromView) {
                                    return new TwoWayPropBindingExpression(key, value, context);
                                }
                                // todo: from view & to view only compilation
                            }
                            else {
                                return new MultiPropBindingExpression(Object.entries(value).reduce((obj, [key2, value2]) => {
                                    if (isExpression(value2)) {
                                        value2 = value2.compile(node, _isSyntheticKey ? null : key2, context);
                                    }
                                    else if (typeof value2 === 'function') {
                                        value2 = new PropBindingExpression(key2, value2, context);
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
                            return new PropBindingExpression(key, value, context);
                        }
                    }
                    // todo: special character in attr name mapping
                    // click.trigger=
                    // prop.bind=
                    // prop.to-view
                    // prop.from-view
                    // prop.attr
                    // @click=${x => x}
                    // :prop=${x => x}
                    // .bool=${x => x}
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
        function renderNode(n, parent) {
            // todo:
            // if n.type === 'function'
            //  get custom element resource
            //  get custom element name
            // if n.type === 'string'
            //  get custom element resource
            //  if no, then proceed all binding
            // todo:
            // if n.type === 'template', handle differently
            const node = parent.appendChild(document.createElement(typeof n.type === 'string' ? n.type : n.type.name));
            n.attrs.forEach((attrOrBindingExpression) => {
                if (isBindingExpression(attrOrBindingExpression)) {
                    bindings.push(attrOrBindingExpression.create(node));
                }
                else {
                    // todo: check for bindable on the custom element prop
                    const { name, value } = attrOrBindingExpression;
                    if (/^data-|aria-|\w+:\w+/.test(name)) {
                        node.setAttribute(name, value);
                    }
                    else {
                        node[name] = value;
                    }
                }
            });
            n.children.forEach(cn => typeof cn === 'string'
                ? node.appendChild(document.createTextNode(cn))
                : renderNode(cn, node));
        }
        this.nodes.forEach(n => renderNode(n, fragment));
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
function TwoWay(toView, fromView) {
    return new TwoWayPropTemplateExpression(toView, fromView);
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

export { On, Ref, TwoWay, ViewModelRef, html };
//# sourceMappingURL=index.js.map
