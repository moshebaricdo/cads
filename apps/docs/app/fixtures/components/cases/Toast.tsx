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
        <Toast sentiment="primary" hasIcon hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-success-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="success" hasIcon hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-error-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="error" hasIcon hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-warning-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="warning" hasIcon isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-info-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="info" hasIcon hasAction isDismissible={false}>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-pink-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="pink" hasIcon hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-neutral-light",
      mode: "light",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="neutral" hasIcon hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
    {
      id: "toast-primary-dark",
      mode: "dark",
      viewport: { width: 360, height: 100 },
      render: () => (
        <Toast sentiment="primary" hasIcon hasAction isDismissible>
          This is a toast.
        </Toast>
      ),
    },
  ];
