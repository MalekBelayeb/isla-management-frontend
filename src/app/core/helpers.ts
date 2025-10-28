export function checkObjectIsSocietyType(object: object) {
  return (
    Object.prototype.hasOwnProperty.call(object, 'societyLat') &&
    Object.prototype.hasOwnProperty.call(object, 'societyLng')
  );
}

export function getKeyFromValue(
  object: Record<string, string>,
  value: string,
): string | undefined {
  return (Object.keys(object) as Array<keyof typeof object>).find(
    (key) => object[key] === value,
  );
}

export function translateDaysOfWeek(day: string) {
  return {
    MONDAY: 'Lundi',
    TUESDAY: 'Mardi',
    WEDNESDAY: 'Mercredi',
    THURSDAY: 'Jeudi',
    FRIDAY: 'Vendredi',
    SATURDAY: 'Samedi',
    SUNDAY: 'Dimanche',
  }[day];
}
