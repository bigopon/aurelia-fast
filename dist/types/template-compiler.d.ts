import { TemplateValue } from "./interfaces";
import { Template } from "./template";
export declare function html<TSource, TContext = any>(strings: TemplateStringsArray, ...values: TemplateValue<TSource, TContext>[]): Template;
