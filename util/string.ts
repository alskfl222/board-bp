export function toDateString(createdAt: string) {
  const date = new Date(createdAt);
  return `${date.getFullYear()}. ${(date.getMonth() + 1).toString()}. ${date
    .getDate()
    .toString()}. ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
