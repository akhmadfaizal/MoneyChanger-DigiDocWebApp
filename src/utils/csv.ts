export function toCsv(rows: string[][]): string {
  return (
    '\ufeff' +
    rows
      .map((row) =>
        row
          .map((value) => {
            const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value
            return `"${safe.replaceAll('"', '""')}"`
          })
          .join(','),
      )
      .join('\r\n')
  )
}
export function downloadCsv(filename: string, rows: string[][]) {
  const url = URL.createObjectURL(
    new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }),
  )
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
