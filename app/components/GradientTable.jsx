import { useAsyncValue } from "@remix-run/react";

export default function GradientTable({ columns, rows, gradient_key }) {
  rows.sort((a, b) => {
    return a > b[gradient_key] ? -1 : 1;
  });

  const gradient_percent = rows[0][gradient_key];

  const final = rows.map((row) => {
    return {
      ...row,
      gradient_percent: (
        (Number(row[gradient_key]) / Number(gradient_percent)) *
        100
      ).toFixed(2),
    };
  });

  return (
    <div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            {columns.map((col, idx) => {
              let styles =
                idx === 0
                  ? "py-6 pl-3 text-left font-semibold"
                  : "text-right font-semibold";

              if (idx === columns.length - 1) {
                styles = styles + " pr-3 w-40";
              }

              return (
                <th className={styles} key={col.key}>
                  {col.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {final.map((row, idx) => {
            let styles =
              idx === 0 ? "m-2 border-t border-gummy" : "border-t border-gummy";

            if (idx === final.length - 1) {
              styles = styles + " border-b";
            }
            return (
              <tr
                style={{
                  background: `linear-gradient(to right, #D0F3FE ${row.gradient_percent}%, #ffffff ${row.gradient_percent}%)`,
                }}
                className={styles}
                key={row.key}
              >
                {columns.map((col, idx) => {
                  let styles = idx === 0 ? "p-3" : "text-right";

                  if (idx === columns.length - 1) {
                    styles = styles + " pr-3";
                  }

                  return (
                    <td className={styles} key={col.key + "_" + row.key}>
                      {row[col.row_key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
