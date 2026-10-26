import { formatReportCell } from "../utils/report-utils";

interface ReportMobileCardsProps {
  headers: string[];
  rows: string[][];
  startIndex: number;
}

function isAmountCell(value: string) {
  return value.includes("₹") || /^\d+\.\d{2}$/.test(value);
}

export function ReportMobileCards({
  headers,
  rows,
  startIndex,
}: ReportMobileCardsProps) {
  return (
    <div className="flex flex-col gap-3 p-3">
      {rows.map((row, rowIndex) => {
        const titleHeader = headers[0] || "Record";
        const titleValue = formatReportCell(titleHeader, row[0] || "");

        return (
          <div
            key={rowIndex}
            className="rounded-xl border border-border/60 bg-background/50 p-3"
          >
            <div className="mb-2 flex items-start justify-between gap-3 border-b border-border/40 pb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                Record #{startIndex + rowIndex + 1}
              </span>
              <div className="flex min-w-0 flex-col items-end text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  {titleHeader}
                </span>
                <span className="text-xs font-bold text-text break-words">
                  {titleValue}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {row.map((cell, cellIndex) => {
                if (cellIndex === 0) return null;

                const header = headers[cellIndex] || `Field ${cellIndex + 1}`;
                const displayValue = formatReportCell(header, cell);

                return (
                  <div
                    key={cellIndex}
                    className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-3"
                  >
                    <span className="text-[9px] font-bold uppercase leading-relaxed tracking-wide text-text-muted break-words">
                      {header}
                    </span>
                    <span
                      className={`text-right text-[11px] leading-relaxed break-words ${
                        isAmountCell(cell)
                          ? "font-mono font-bold text-text"
                          : "font-semibold text-text"
                      }`}
                    >
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
