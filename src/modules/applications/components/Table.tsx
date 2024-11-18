import React, { useState } from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { ApplicationData, TableProps } from '../utils/Types';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

const Table: React.FC<TableProps> = ({ data }) => {

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (id: string) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedRows(updatedSelection);
  };

  const columns: ColumnDef<ApplicationData>[] = [
    {
      id: "select",
      header: () => (
        <input
          type='checkbox'
          className='w-4 h-4'
          onChange={(e) => {
            const isChecked = e.target.checked;
            const newSelection = new Set<string>();
            if (isChecked) {
              data.forEach(row => newSelection.add(row.id));
            }
            setSelectedRows(newSelection);
          }}
          checked={selectedRows.size === data.length && data.length > 0}
        />
      ),
      cell:(info) => (
        <input
          type="checkbox"
          checked={selectedRows.has(info.row.original.id)}
          onChange={() => handleCheckboxChange(info.row.original.id)}
        />
      )
    },

    {accessorKey: "id", header: "Application ID"},
    {accessorKey: "dateApplied", header: "Date Applied"},
    {accessorKey: "beautician", header: "Beautician"},
    {accessorKey: "services", header: "Services"},
    {accessorKey: "location", header: "Location"},
    {
      accessorKey: "contact",
      header: "Contact",
      cell: (info) => (
        <div className='flex items-center gap-3'>
          <FaPhoneAlt /> <span>{info.getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey:"status",
      header: "Status",
      cell:(info) => {
        const status = info.getValue() as ApplicationData["status"];
        const statusStyles: Record<ApplicationData["status"], string> = {
          PENDING: "bg-white text-gray-500 border border-gray-200 rounded-full",
          "IN REVIEW": "bg-blue-200 text-blue-800 border border-gray-200 rounded-full",
          REJECTED: "bg-white text-red-500 border border-red-500 rounded-full"
        };
        return (
          <span className={`px-5 py-2 rounded-full text-sm font-medium s ${statusStyles[status]}`}>{status}</span>
        );
      }
    },
    {
      id:"actions",
      header: "",
      cell: () => (
        <button
          className='p-2 hover:bg-inherit rounded-full'
          aria-label='More Options'
        >
          <MoreVertical className='w-6 h-6 text-gray-500' />
        </button>
      )
    }
  ];

  const table = useReactTable<ApplicationData> ({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="table-auto w-full border-collapse bg-white">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 text-left text-sm font-medium"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
