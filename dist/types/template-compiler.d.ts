import { TemplateValue } from "./interfaces";
import { Template } from "./template";
export declare function html<TSource, TContext = any, TValues extends TemplateValue<TSource, TContext>[] = TemplateValue<TSource, TContext>[]>(strings: TemplateStringsArray, ...values: TValues): Template;
