import { ColumnDef } from "@tanstack/react-table";

export const printSelectedRows = (
  selectedRows: any[],
  columns: ColumnDef<any>[],
  flexRender: any
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Print Selected Rows</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${columns
    .map(
      (column) =>
        `<th>${column.header?.toString() || column.id}</th>`
    )
    .join('')}
            </tr>
          </thead>
          <tbody>
            ${selectedRows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${row.getValue(column.id)}</td>`)
          .join('')}</tr>`
    )
    .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

export const shareSelectedRows = (selectedRows: any[]) => {
  // Implement sharing functionality based on your requirements
  // This is just a basic example
  const data = JSON.stringify(selectedRows, null, 2);
  if (navigator.share) {
    navigator.share({
      title: 'Selected Rows',
      text: data,
    }).catch(console.error);
  } else {
    // Fallback - perhaps copy to clipboard
    navigator.clipboard.writeText(data).then(() => {
      alert('Data copied to clipboard!');
    });
  }
};

export const exportSelectedRows = (
  selectedRows: any[],
  columns: ColumnDef<any>[]
) => {
  const headers = columns.map((column) => column.header?.toString() || column.id);
  const csvContent = [
    headers.join(','),
    ...selectedRows.map((row) =>
      columns
        .map((column) => {
          const value = row[column.id as keyof typeof row];
          return typeof value === 'string' ? `"${value}"` : value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'exported_rows.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};