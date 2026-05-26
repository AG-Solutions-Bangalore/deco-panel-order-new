import jsPDF from "jspdf";
import type { ProductReportItem } from "../types";

export const formatToYMD = (date: Date | undefined) => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function downloadBlob(data: BlobPart, filename: string) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function downloadTextFile(content: string, filename: string, mimeType = "text/csv;charset=utf-8") {
  const encodedUri = encodeURI(`data:${mimeType},${content}`);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push("");
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && next === "\n") i++;
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }

  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }

  return lines.filter((line) => line.length > 0 && line.some((cell) => cell.trim() !== ""));
}

export const formatProductThickness = (product: ProductReportItem) =>
  `${product.products_thickness || ""} ${product.products_unit || ""}`.trim() || "-";

export const formatProductSize = (product: ProductReportItem) =>
  `${product.products_size1 || "-"}x${product.products_size2 || "-"}`;

export function productReportToCSV(products: ProductReportItem[]) {
  const headersList = ["Category", "Sub Category", "Brand", "Thickness", "Size", "Rate", "Status"];
  const csvRows = [headersList.join(",")];

  products.forEach((product) => {
    const row = [
      product.product_category || "",
      product.product_sub_category || "",
      product.products_brand || "",
      formatProductThickness(product),
      formatProductSize(product),
      String(product.products_rate || "0.00"),
      product.product_status || "",
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`);

    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

export function saveProductReportPDF(products: ProductReportItem[]) {
  const pdf = new jsPDF("p", "mm", "letter");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 6;
  const bottomMargin = 8;
  const titleHeight = 16;
  const headerHeight = 10;
  const rowHeight = 8.4;
  const columns = [
    { label: "Category", width: 30 },
    { label: "Sub Category", width: 42 },
    { label: "Brand", width: 40 },
    { label: "Thickness", width: 25 },
    { label: "Size", width: 20 },
    { label: "Rate", width: 21 },
    { label: "Status", width: 25 },
  ];
  const tableWidth = columns.reduce((total, column) => total + column.width, 0);
  const rowsPerPage = Math.floor((pageHeight - titleHeight - headerHeight - bottomMargin) / rowHeight);

  const fitText = (value: string, width: number) => {
    const maxWidth = width - 4;
    if (pdf.getTextWidth(value) <= maxWidth) return value;

    let clipped = value;
    while (clipped.length > 0 && pdf.getTextWidth(`${clipped}...`) > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    return clipped ? `${clipped}...` : "";
  };

  const drawTitle = () => {
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, titleHeight, "F");
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.text("Products Report", marginX + 4, 10.5);
    pdf.setDrawColor(224, 224, 224);
    pdf.setLineWidth(0.2);
    pdf.line(marginX, titleHeight, marginX + tableWidth, titleHeight);
  };

  const drawHeader = (startY: number) => {
    let x = marginX;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(224, 224, 224);
    pdf.setLineWidth(0.2);

    columns.forEach((column) => {
      pdf.text(column.label, x + 2, startY + 6.3);
      x += column.width;
    });
    pdf.line(marginX, startY + headerHeight, marginX + tableWidth, startY + headerHeight);
  };

  const drawPageChrome = () => {
    drawTitle();
    drawHeader(titleHeight);
    return titleHeight + headerHeight;
  };

  let y = drawPageChrome();
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  products.forEach((product, index) => {
    if (index > 0 && index % rowsPerPage === 0) {
      pdf.addPage();
      y = drawPageChrome();
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
    }

    const row = [
      product.product_category || "-",
      product.product_sub_category || "-",
      product.products_brand || "-",
      formatProductThickness(product),
      formatProductSize(product),
      String(product.products_rate || "0.00"),
      product.product_status || "-",
    ];

    let x = marginX;
    pdf.setTextColor(0, 0, 0);
    row.forEach((value, columnIndex) => {
      const column = columns[columnIndex];
      pdf.text(fitText(value, column.width), x + 2, y + 5.5);
      x += column.width;
    });

    pdf.setDrawColor(224, 224, 224);
    pdf.line(marginX, y + rowHeight, marginX + tableWidth, y + rowHeight);
    y += rowHeight;
  });

  pdf.save("product-report.pdf");
}
