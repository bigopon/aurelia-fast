import { TemplateNode, CreateElement, TemplateValue } from "./interfaces";
import { Template } from "./template";

const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;

export /*#__PURE__*/function html<
  TSource,
  TContext = any,
  TValues extends TemplateValue<TSource, TContext>[] = TemplateValue<TSource, TContext>[]
>(strings: TemplateStringsArray, ...values: TValues) {
  return new Template((build as any).call(createNode, strings, ...values));
}

function createNode(type: string | Function, attrs: Record<string, any>, ...children: (TemplateNode | string)[]) {
  return new TemplateNode(type, attrs, children);
}

const build = function(this: CreateElement, statics: TemplateStringsArray): TemplateNode[] {
  const fields = arguments as unknown as [TemplateStringsArray, ...unknown[]];
  const h = this;
  const attrsSyntheticAttrCountMap = new WeakMap<object, number>();
  const getSyntheticCount = (attrs: object) => {
    const currentCount = (attrsSyntheticAttrCountMap.get(attrs) ?? 0) + 1;
    attrsSyntheticAttrCountMap.set(attrs, currentCount);
    return currentCount - 1;
  }

  let mode: number | any[] = MODE_TEXT;
  let buffer = '';
  let quote = '';
  let current: any[] = [0];
  let char: string;
  let propName: string;

  const commit = (field?: number) => {
    if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))) {
      current.push(field ? fields[field] : buffer);
    }
    else if (mode === MODE_TAGNAME && (field || buffer)) {
      current[1] = field ? fields[field] : buffer;
      mode = MODE_WHITESPACE;
    }
    else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
      current[2] = Object.assign(current[2] ??= {}, fields[field]);
    }
    else if (mode === MODE_WHITESPACE && buffer && !field) {
      (current[2] ??= {})[buffer] = true;
    }
    else if (mode === MODE_WHITESPACE && !buffer && field) {
      (current[2] ??= {})[`a__${getSyntheticCount(current[2])}`] = fields[field];
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
      else if (!mode) {
        // Ignore everything until the tag ends
      }
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
        (current = current[0]).push(h.apply(null, (mode as any).slice(1)));
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