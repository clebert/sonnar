import {NodeSet} from './node-set';
import {Literal, Primitive} from './primitive';

/* Node Set Functions *********************************************************/

/** number last() */
export function fn(functionName: 'last'): Primitive;

/** number position() */
export function fn(functionName: 'position'): Primitive;

/** number count(node-set) */
export function fn(functionName: 'count', arg: NodeSet): Primitive;

/** node-set id(object) */
export function fn(functionName: 'id', arg: Literal | Primitive): NodeSet;

/** string local-name(node-set?) */
export function fn(functionName: 'local-name', arg?: NodeSet): Primitive;

/** string namespace-uri(node-set?) */
export function fn(functionName: 'namespace-uri', arg?: NodeSet): Primitive;

/** string name(node-set?) */
export function fn(functionName: 'name', arg?: NodeSet): Primitive;

/* String Functions ***********************************************************/

/** string string(object?) */
export function fn(
  functionName: 'string',
  arg?: Literal | Primitive
): Primitive;

/** string concat(string, string, string*) */
export function fn(
  functionName: 'concat',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  ...otherArgs: (Literal | Primitive)[]
): Primitive;

/** boolean starts-with(string, string) */
export function fn(
  functionName: 'starts-with',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;

/** boolean contains(string, string) */
export function fn(
  functionName: 'contains',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;

/** string substring-before(string, string) */
export function fn(
  functionName: 'substring-before',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;

/** string substring-after(string, string) */
export function fn(
  functionName: 'substring-after',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;

/** string substring(string, number, number?) */
export function fn(
  functionName: 'substring',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  arg3?: Literal | Primitive
): Primitive;

/** number string-length(string?) */
export function fn(
  functionName: 'string-length',
  arg?: Literal | Primitive
): Primitive;

/** string normalize-space(string?) */
export function fn(
  functionName: 'normalize-space',
  arg?: Literal | Primitive
): Primitive;

/** string translate(string, string, string) */
export function fn(
  functionName: 'translate',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  arg3: Literal | Primitive
): Primitive;

/* Boolean Functions **********************************************************/

/** boolean boolean(object) */
export function fn(
  functionName: 'boolean',
  arg: Literal | Primitive
): Primitive;

/** boolean not(boolean) */
export function fn(functionName: 'not', arg: Literal | Primitive): Primitive;

/** boolean lang(string) */
export function fn(functionName: 'lang', arg: Literal | Primitive): Primitive;

/* Number Functions ***********************************************************/

/** number number(object?) */
export function fn(
  functionName: 'number',
  arg?: Literal | Primitive
): Primitive;

/** number sum(node-set) */
export function fn(functionName: 'sum', arg: NodeSet): Primitive;

/** number floor(number) */
export function fn(functionName: 'floor', arg: Literal | Primitive): Primitive;

/** number ceiling(number) */
export function fn(
  functionName: 'ceiling',
  arg: Literal | Primitive
): Primitive;

/** number round(number) */
export function fn(functionName: 'round', arg: Literal | Primitive): Primitive;

/******************************************************************************/

export function fn(
  functionName: string,
  ...args: (Literal | Primitive | undefined)[]
): Primitive {
  const expression = `${functionName}(${args
    .filter((arg) => arg !== undefined)
    .map((arg) => Primitive.literal(arg!).expression)
    .join(', ')})`;

  return functionName === 'id'
    ? new NodeSet(expression)
    : new Primitive(expression);
}
