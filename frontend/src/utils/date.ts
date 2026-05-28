const fmt = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDate(value?: string): string {
  if (!value) return '-';
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : fmt.format(d);
}
