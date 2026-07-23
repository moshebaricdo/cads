"use client";

import { Toast } from "@codeai/cads-react/components/Toast";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "toast-primary-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="primary" hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-success-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="success" hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-error-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="error" hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-warning-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="warning" isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-info-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="info" hasAction isDismissible={false}>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-pink-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="pink" hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-neutral-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="neutral" hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-primary-dark",
      mode: "dark",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="primary" hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
  ];
