class TemplateNode {
    constructor(type, attrs, children) {
        this.type = type;
        this.attrs = attrs;
        this.children = children;
    }
}

const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;
function html(strings, ...values) {
    return build.call(createNode, strings, ...values);
}
function createNode(type, attrs, ...children) {
    return new TemplateNode(type, attrs, children);
}
const build = function (statics) {
    const fields = arguments;
    const h = this;
    let mode = MODE_TEXT;
    let buffer = '';
    let quote = '';
    let current = [0];
    let char;
    let propName;
    let syntheticCount = 0;
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
            (current[2] ?? (current[2] = {}))[`a__${syntheticCount}`] = fields[field];
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
        this.expression.call(undefined, this.target, e, this.scope);
    }
}

function On(event, handler) {
    return new OnTemplateExpression(event, handler);
}

html `
    <div ${x => x.count} ${On('click', (x, e) => x)} @click=${x => x} />
    <button ${On('click', (x, e) => x.onClick(e))} />
    <button ${On('mousedown', (x, e) => x.onMouseEnter(e))}>
    <div square=${{ color: x => x.color, bg: x => x.background }} />
`;

export { On, html };
//# sourceMappingURL=index.js.map
