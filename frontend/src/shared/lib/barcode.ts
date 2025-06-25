export const removeSpaces = (text: string) => text.replace(/\s*/g, '');

export function isValidEAN(ean: string): boolean {
  const length = removeSpaces(ean).length;

  if (length !== 8 && length !== 13 && length !== 14) {
    return false; // EAN-8, EAN-13 и EAN-14 имеют фиксированные длины
  }

  // Преобразуем строку в массив чисел
  const digits = ean.split('').map(Number);

  // Последняя цифра - это контрольная цифра
  const checkDigit = digits.pop()!;

  // Рассчитываем сумму произведений
  const sum = digits.reduce((acc, digit, index) => {
    let weight: number;
    if (length === 8) {
      // Для EAN-8: нечётные позиции * 3, чётные * 1
      weight = index % 2 === 0 ? 3 : 1;
    } else {
      // Чётные позиции умножаем на 3, нечётные - на 1
      weight = index % 2 === 0 ? 1 : 3;
    }
    return acc + digit * weight;
  }, 0);

  // Вычисляем контрольное число
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  // Сравниваем с контрольной цифрой
  return calculatedCheckDigit === checkDigit;
}
/**
 * Выдаёт, может ли введенныё текст быть штрих-кодом
 */
export const isBarCodeText = (text: string) => /\d+/.test(removeSpaces(text));
