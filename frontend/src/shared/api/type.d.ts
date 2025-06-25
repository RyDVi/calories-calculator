/**
 * Тип, представляющий все примитивные типы в TypeScript.
 *
 * Включает строки, числа, булевы значения, символы, большие числа, `null` и `undefined`.
 */
export type Primitives =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;

// /**
//  * Утилитарный тип для исключения `never` из объекта.
//  *
//  * @template T - Исходный тип объекта.
//  * @remarks
//  * Этот тип создает новый объектный тип, в котором из исходного типа удаляются все свойства,
//  * значения которых равны `never`. Это достигается с помощью условного типа в `keyof` и `as`.
//  */
// export type RemoveNever<T> = {
//   [K in keyof T as T[K] extends never ? never : K]: T[K];
// };

// /**
//  * Тип для фильтрации свойств объекта по типам.
//  *
//  * @template Instance - Тип объекта, из которого будут отфильтрованы свойства.
//  * @template AvailableTypes - Типы, которые считаются допустимыми для включения.
//  * По умолчанию используется `Primitives`, что включает все примитивные типы.
//  *
//  * @remarks
//  * Этот тип создает новый объектный тип, в котором только те свойства исходного объекта,
//  * значения которых являются примитивными типами (или типами из `AvailableTypes`), сохраняются.
//  * Свойства, значения которых не являются примитивами, заменяются на `never`, а затем все `never`
//  * свойства удаляются с помощью `RemoveNever`.
//  *
//  * TODO: почему-то не воспринимаются нормально в сторах утилитарные типы Partial и RemoveNever, только написав напрямую работает
//  */
// export type ExtractFilters<
//   Instance extends Record<any, any>,
//   AvailableTypes = Primitives,
// > = {
//   [P in keyof Instance as Instance[P] extends never
//     ? never
//     : P]?: Instance[P] extends AvailableTypes ? Instance[P] : never;
// };
