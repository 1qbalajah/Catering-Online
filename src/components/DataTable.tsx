import type { ReactNode } from "react";

type DataTableProps = {
  title?: string;
  columns: string[];
  children: ReactNode;
  empty?: boolean;
  emptyText?: string;
};

export default function DataTable({ title, columns, children, empty, emptyText = "Tidak ada data." }: DataTableProps) {
  return (
    <div className="table-card data-table-card">
      {title ? <div className="table-title">{title}</div> : null}
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{empty ? <tr><td colSpan={columns.length}>{emptyText}</td></tr> : children}</tbody>
      </table>
    </div>
  );
}
