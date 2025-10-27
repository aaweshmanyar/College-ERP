import React from 'react';

interface TableProps<T> {
  columns: { header: string; accessor: keyof T | ((item: T) => React.ReactNode) }[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}

const Table = <T extends { id: any },>( { columns, data, renderActions }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap space-x-2">
                    {renderActions(item)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-4 text-sm text-center text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
