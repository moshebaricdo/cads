"use client";

import { Pagination } from "@codeai/cads-react/components/Pagination";
import { TablePagination } from "@codeai/cads-react/components/TablePagination";
import { type FixtureCase } from "./shared";

export const cases: FixtureCase[] = [
  {
    id: "pagination-page-large-light",
    mode: "light",
    state: "default",
    viewport: { width: 520, height: 80 },
    render: () => (
      <Pagination
        size="large"
        count={10}
        page={4}
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        aria-label="Pagination"
      />
    ),
  },
    {
      id: "pagination-page-medium-light",
      mode: "light",
      state: "default",
      viewport: { width: 520, height: 80 },
      render: () => (
        <Pagination
          size="medium"
          count={10}
          page={4}
          showFirstButton
          showLastButton
          aria-label="Pagination"
        />
      ),
    },
    {
      id: "pagination-page-small-light",
      mode: "light",
      state: "default",
      viewport: { width: 420, height: 64 },
      render: () => (
        <Pagination
          size="small"
          count={10}
          page={4}
          aria-label="Pagination"
        />
      ),
    },
    {
      id: "pagination-page-xs-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 56 },
      render: () => (
        <Pagination
          size="extraSmall"
          count={10}
          page={4}
          aria-label="Pagination"
        />
      ),
    },
    {
      id: "pagination-page-medium-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 520, height: 80 },
      render: () => (
        <Pagination
          size="medium"
          count={10}
          page={4}
          aria-label="Pagination"
        />
      ),
    },
    {
      id: "pagination-page-no-first-last-light",
      mode: "light",
      state: "default",
      viewport: { width: 440, height: 80 },
      render: () => (
        <Pagination
          size="medium"
          count={10}
          page={4}
          showFirstButton={false}
          showLastButton={false}
          aria-label="Pagination"
        />
      ),
    },
    {
      id: "pagination-page-medium-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 520, height: 80 },
      render: () => (
        <Pagination
          size="medium"
          count={10}
          page={4}
          disabled
          showFirstButton
          showLastButton
          aria-label="Pagination"
        />
      ),
    },
    {
      id: "tablepagination-large-light",
    mode: "light",
    state: "default",
    viewport: { width: 560, height: 80 },
    render: () => (
      <TablePagination
        size="large"
        count={100}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        aria-label="Table pagination"
      />
    ),
  },
  {
    id: "tablepagination-medium-light",
    mode: "light",
    state: "default",
    viewport: { width: 500, height: 72 },
    render: () => (
      <TablePagination
        size="medium"
        count={100}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        aria-label="Table pagination"
      />
    ),
  },
  {
    id: "tablepagination-small-light",
    mode: "light",
    state: "default",
    viewport: { width: 400, height: 64 },
    render: () => (
      <TablePagination
        size="small"
        count={100}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        aria-label="Table pagination"
      />
    ),
  },
  {
    id: "tablepagination-xs-light",
    mode: "light",
    state: "default",
    viewport: { width: 360, height: 56 },
    render: () => (
      <TablePagination
        size="extraSmall"
        count={100}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        aria-label="Table pagination"
      />
    ),
  },
  {
    id: "tablepagination-medium-dark",
    mode: "dark",
    state: "default",
    viewport: { width: 500, height: 72 },
    render: () => (
      <TablePagination
        size="medium"
        count={100}
        page={1}
        rowsPerPage={10}
        onPageChange={() => {}}
        aria-label="Table pagination"
      />
    ),
  },
];
