/**
 * Функция для глубокой заморозки объекта
 */
export function deepFreeze(obj: Record<any, any>) {
  // Получаем список всех свойств объекта
  const propNames = Object.getOwnPropertyNames(obj);

  // Рекурсивно замораживаем каждое свойство
  for (const name of propNames) {
    const value = obj[name];
    if (value && typeof value === 'object') {
      deepFreeze(value); // Рекурсивно замораживаем вложенные объекты
    }
  }

  // Замораживаем сам объект
  return Object.freeze(obj);
}
