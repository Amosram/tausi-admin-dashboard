import { toast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

export const exportSelectedRows = <TData,>(
  selectedRows: TData[],
  columns: ColumnDef<TData>[]
) => {
  if (selectedRows.length === 0) {
    toast({
      title: "No rows selected",
      description: "Please select rows to export",
      variant: "destructive",
    });
    return;
  }

  const headers = columns.map((column) => column.header).join(",");
  const csvContent = [
    headers,
    ...selectedRows.map((row) =>
      columns
        .map(
          (column) =>
            // @ts-expect-error - dynamic access of row properties
            row[column.accessorKey || column.id]
        )
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "selected_professionals.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printSelectedRows = <TData,>(
  selectedRows: any[],
  columns: ColumnDef<TData>[],
  flexRender: (cell: any, context: any) => any
) => {
  if (selectedRows.length === 0) {
    toast({
      title: "No rows selected",
      description: "Please select rows to print",
      variant: "destructive",
    });
    return;
  }

  const printWindow = window.open("", "", "height=500, width=500");
  if (!printWindow) return;

  printWindow.document.write("<html><head><title>Selected Professionals</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(`
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  `);
  printWindow.document.write("</style></head><body>");
  printWindow.document.write("<table><thead><tr>");

  columns.forEach((column) => {
    printWindow.document.write(`<th>${column.header}</th>`);
  });

  printWindow.document.write("</tr></thead><tbody>");

  selectedRows.forEach((row: any) => {
    printWindow.document.write("<tr>");
    row.getVisibleCells().forEach((cell: any) => {
      printWindow.document.write(
        `<td>${flexRender(cell.column.columnDef.cell, cell.getContext())}</td>`
      );
    });
    printWindow.document.write("</tr>");
  });

  printWindow.document.write("</tbody></table>");
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
};

export const shareSelectedRows = <TData,>(selectedRows: TData[]) => {
  if (selectedRows.length === 0) {
    toast({
      title: "No rows selected",
      description: "Please select rows to share",
      variant: "destructive",
    });
    return;
  }

  const shareContent = JSON.stringify(selectedRows, null, 2);

  if (navigator.share) {
    navigator
      .share({
        title: "Selected Professionals",
        text: shareContent,
      })
      .catch(console.error);
  } else {
    navigator.clipboard
      .writeText(shareContent)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Selected professionals have been copied to clipboard",
        });
      })
      .catch((err) => {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy selected professionals",
          variant: "destructive",
        });
      });
  }
};
