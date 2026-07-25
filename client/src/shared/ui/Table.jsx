export function Table({ headers = [], children, className = "" }) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-lg border border-border-color bg-bg-secondary ${className}`}
    >
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-color bg-bg-tertiary/50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color text-text-primary">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`hover:bg-bg-tertiary/30 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td
      className={`px-6 py-4 align-middle text-sm text-text-secondary ${className}`}
    >
      {children}
    </td>
  );
}
