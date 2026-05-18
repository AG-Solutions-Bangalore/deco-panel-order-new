"use client";

import React, { useEffect } from "react";
import { useQuotationViewDetail } from "../hooks/use-quotes";
import { Layers } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function QuotePrintPage({ quoteId }: { quoteId: string }) {
  const { data: quoteData, isLoading } = useQuotationViewDetail(quoteId);

  // Automatically trigger printer utility once loaded in page
  useEffect(() => {
    if (quoteData) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [quoteData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner className="size-8 text-primary animate-spin" />
        <p className="text-xs text-text-muted font-bold animate-pulse">Preparing document for print...</p>
      </div>
    );
  }

  if (!quoteData || !quoteData.quotation) {
    return (
      <div className="p-8 text-center font-bold text-rose-500">
        Quotation details could not be found or retrieved.
      </div>
    );
  }

  const q = quoteData.quotation;
  const items = quoteData.quotationSub || [];
  const totalAmount = Number(quoteData.quotationSubSum) || 0;

  return (
    <div className="p-6 bg-white text-black font-sans w-full max-w-4xl mx-auto print:p-0">
      {/* Top Header Panel */}
      <div className="flex justify-between items-start border-b border-black/20 pb-4 mb-6">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-black/60">Client / Customer</h2>
          <h1 className="text-lg font-black text-black mt-0.5">{q.full_name}</h1>
        </div>
        
        <div className="flex gap-10 text-right">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-black/60">Quote Number</h2>
            <span className="text-sm font-bold text-black mt-0.5 block">#{q.quotation_no}</span>
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-black/60">Proposal Date</h2>
            <span className="text-sm font-bold text-black mt-0.5 block">{q.quotation_date}</span>
          </div>
        </div>
      </div>

      {/* Items Details Table */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black/10 pb-1.5 flex items-center gap-1.5">
          <Layers className="size-3.5" />
          <span>Proposed Items</span>
        </h3>
        
        <table className="w-full text-left border-collapse text-[11px] leading-relaxed">
          <thead>
            <tr className="border-b border-black/20 font-bold uppercase tracking-wide text-black/80">
              <th className="py-2 px-2 text-left">Item Details</th>
              <th className="py-2 px-2 text-center">Dimensions</th>
              <th className="py-2 px-2 text-right">Quantity</th>
              <th className="py-2 px-2 text-right">Rate</th>
              <th className="py-2 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const rate = Number(item.quotation_sub_rate) || 0;
              const amount = Number(item.quotation_sub_amount) || (Number(item.quotation_sub_quantity) || 0) * rate;
              const size1 = Number(item.quotation_sub_size1) || 0;
              const size2 = Number(item.quotation_sub_size2) || 0;

              return (
                <tr key={idx} className="border-b border-black/10">
                  <td className="py-2.5 px-2">
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {item.quotation_sub_thickness ? `${item.quotation_sub_thickness}MM — ` : ""}
                        {item.product_category || ""} {item.product_sub_category || ""}
                      </span>
                      <span className="text-[10px] text-black/60 mt-0.5">
                        Brand: {item.quotation_sub_brand || "N/A"} {item.quotation_sub_design_no ? `| Design: ${item.quotation_sub_design_no}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {size1 > 1 && size2 > 1 ? `${size1} x ${size2}` : "—"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-medium">
                    {item.quotation_sub_quantity} {item.quotation_sub_unit || "PCS"}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    ₹{rate.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold">
                    ₹{amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            
            <tr className="border-t border-black/25 font-bold">
              <td className="py-3 px-2">Total Proposal Valuation</td>
              <td colSpan={4} className="py-3 px-2 text-right text-base font-black">
                ₹{totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Address grids */}
      {(q.quotation_delivery || q.quotation_shipping || q.quotation_remarks) && (
        <div className="grid grid-cols-2 gap-4 mt-6 border-t border-black/10 pt-4 text-[10px] leading-relaxed">
          {q.quotation_delivery && (
            <div className="flex flex-col gap-1 border border-black/15 p-2 rounded">
              <span className="font-bold uppercase tracking-wider text-black/75">Delivery Address</span>
              <p className="whitespace-pre-wrap">{q.quotation_delivery}</p>
            </div>
          )}

          {q.quotation_shipping && (
            <div className="flex flex-col gap-1 border border-black/15 p-2 rounded">
              <span className="font-bold uppercase tracking-wider text-black/75">Billing Address</span>
              <p className="whitespace-pre-wrap">{q.quotation_shipping}</p>
            </div>
          )}

          {q.quotation_remarks && (
            <div className="col-span-2 flex flex-col gap-0.5 border border-black/10 p-2 rounded mt-1">
              <span className="font-bold uppercase tracking-wider text-black/75">Remarks</span>
              <p className="whitespace-pre-wrap">{q.quotation_remarks}</p>
            </div>
          )}
        </div>
      )}

      {/* Print isolation styles */}
      <style jsx global>{`
        @media print {
          /* Hide all app navigation, headers, footers, sidebars and buttons */
          aside, nav, header, button, footer, .print-hidden {
            display: none !important;
          }
          body, html {
            background-color: white !important;
            background-image: none !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A5 landscape;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
