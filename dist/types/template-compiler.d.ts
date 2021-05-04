import { TemplateValue } from "./interfaces";
export declare function html<TSource, TContext = any>(strings: TemplateStringsArray, ...values: TemplateValue<TSource, TContext>[]): any;
