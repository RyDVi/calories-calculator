/**
 * Нормализация пути
 */
export function normalizePath(path: string) {
  return path.replace(/\/+/g, '/'); // Заменяем несколько слешей на один
}

/**
 * Нормализует текущий url. Например, если в приложение вошёл под множество слешей.
 */
export function normalizeCurrentUrl() {
  // Получаем текущий путь
  const currentPath = window.location.pathname;

  // Нормализуем путь
  const normalizedPath = normalizePath(currentPath);

  // Если текущий путь отличается от нормализованного, выполняем редирект
  if (currentPath !== normalizedPath) {
    const newUrl =
      normalizedPath + window.location.search + window.location.hash;
    window.location.replace(newUrl); // Используем replace, чтобы избежать добавления записи в историю
  }
}

/**
 * Проверяет, является ли URL абсолютным.
 * @param  url - URL для проверки. По умолчанию пустая строка.
 * @returns  Возвращает true, если URL абсолютный, иначе false.
 */
export function isAbsoluteUrl(url: string = ''): boolean {
  return /^(?:[a-zA-Z][a-zA-Z\d+\-.]*):\/\//.test(url);
}

/**
 * Обезопасование uri. Только подпути
 */
export function safeUri(uri: string): string {
  if (uri.startsWith('/')) {
    return uri;
  }
  return '';
}
