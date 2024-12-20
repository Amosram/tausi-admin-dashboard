import { flexRender, Table } from "@tanstack/react-table";

const TableHeader = ({ table }: { table: Table<any> }) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id} className="border-b border-gray-200">
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input id="checkbox-all" type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
              <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
            </div>
          </th>
          {headerGroup.headers.map(header => (
            <th scope="col"
              key={header.id}
              className="py-3 min-w-36">
              <div className='flex space-x-3 items-center'>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                <span>
                  {header.column.getIsSorted() ===  'asc' ?
                    <svg className="w-5 h-5 text-gray-400" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path></svg> :
                    <svg className="w-5 h-5 text-gray-400" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                  }
                </span>
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
    // <thead className="text-xs border-b  w-full text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //   {table.getHeaderGroups().map((headerGroup) => (
    //     <tr key={headerGroup.id}>
    //       {headerGroup.headers.map((header) => (
    //         <th
    //           key={header.id}
    //           colSpan={header.colSpan}
    //           scope="col"
    //           className="px-6 py-3 text-sm"
    //         >
    //           {header.isPlaceholder ? null : (
    //             <div
    //               className={
    //                 header.column.getCanSort()
    //                   ? "cursor-pointer select-none flex items-center gap-1"
    //                   : ""
    //               }
    //               onClick={header.column.getToggleSortingHandler()}
    //               title={
    //                 header.column.getCanSort()
    //                   ? header.column.getNextSortingOrder() === "asc"
    //                     ? "Sort ascending"
    //                     : header.column.getNextSortingOrder() === "desc"
    //                       ? "Sort descending"
    //                       : "Clear sort"
    //                   : undefined
    //               }
    //             >
    //               {flexRender(
    //                 header.column.columnDef.header,
    //                 header.getContext()
    //               )}
    //               {{
    //                 asc: (
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     fill="#374151"
    //                     viewBox="0 0 24 24"
    //                     strokeWidth={1.5}
    //                     stroke="currentColor"
    //                     className="size-4"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       d="m4.5 15.75 7.5-7.5 7.5 7.5"
    //                     />
    //                   </svg>
    //                 ),
    //                 desc: (
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     fill="#374151"
    //                     viewBox="0 0 24 24"
    //                     strokeWidth={1.5}
    //                     stroke="currentColor"
    //                     className="size-4"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       d="m19.5 8.25-7.5 7.5-7.5-7.5"
    //                     />
    //                   </svg>
    //                 ),
    //               }[header.column.getIsSorted() as string] ?? null}
    //             </div>
    //           )}
    //         </th>
    //       ))}
    //     </tr>
    //   ))}
    // </thead>
   

  );
};

export default TableHeader;