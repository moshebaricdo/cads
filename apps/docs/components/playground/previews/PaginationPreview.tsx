"use client";

import { useEffect, useState } from "react";
import { Pagination } from "@codeai/cads-react/components/Pagination";
import { TablePagination } from "@codeai/cads-react/components/TablePagination";

export default function PaginationPreview({
  values: v,
}: {
  values: Record<string, unknown>;
}) {
  const demoType = String(v.demoType ?? "page");
  const size = (v.size as "large" | "medium" | "small" | "extraSmall") ?? "medium";
  const disabled = Boolean(v.disabled);
  const count = Number(v.count ?? (demoType === "table" ? 100 : 5));
  const playgroundPage = Number(
    v.page ?? (demoType === "table" ? 1 : 3),
  );

  const [page, setPage] = useState(playgroundPage);
  const [rowsPerPage, setRowsPerPage] = useState(
    Number(v.rowsPerPage ?? 10),
  );

  useEffect(() => {
    setPage(playgroundPage);
  }, [playgroundPage, demoType, count]);

  useEffect(() => {
    setRowsPerPage(Number(v.rowsPerPage ?? 10));
  }, [v.rowsPerPage]);

  if (demoType === "table") {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TablePagination
          size={size}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={
            (v.labelRowsPerPage as string) ?? "Rows per page"
          }
          disabled={disabled}
          aria-label={(v["aria-label"] as string) || "Table pagination"}
          onPageChange={(_event, next) => setPage(next)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Pagination
        size={size}
        count={count}
        page={page}
        layout={
          (v.layout as "auto" | "segmented" | "compact" | undefined) ?? "auto"
        }
        showFirstButton={Boolean(v.showFirstButton)}
        showLastButton={Boolean(v.showLastButton)}
        siblingCount={Number(v.siblingCount ?? 1)}
        boundaryCount={Number(v.boundaryCount ?? 1)}
        disabled={disabled}
        aria-label={(v["aria-label"] as string) || "Pagination"}
        onChange={(_event, next) => setPage(next)}
      />
    </div>
  );
}
