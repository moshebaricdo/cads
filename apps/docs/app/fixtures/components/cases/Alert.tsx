"use client";

import { Alert } from "@codeai/cads-react/components/Alert";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "alert-large-brand-light",
      mode: "light",
      viewport: { width: 560, height: 120 },
      render: () => (
        <Alert
          size="large"
          sentiment="brand"
          hasIcon
          hasAction
          isDismissible
        >
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-medium-success-light",
      mode: "light",
      viewport: { width: 560, height: 100 },
      render: () => (
        <Alert
          size="medium"
          sentiment="success"
          hasIcon
          hasAction
          actionLabel="Button"
          isDismissible
        >
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-small-error-light",
      mode: "light",
      viewport: { width: 560, height: 90 },
      render: () => (
        <Alert size="small" sentiment="error" hasIcon hasAction isDismissible>
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-xs-warning-light",
      mode: "light",
      viewport: { width: 560, height: 80 },
      render: () => (
        <Alert
          size="extraSmall"
          sentiment="warning"
          hasIcon
          hasAction
          isDismissible
        >
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-large-info-light",
      mode: "light",
      viewport: { width: 560, height: 100 },
      render: () => (
        <Alert size="large" sentiment="info" hasIcon>
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-medium-pink-light",
      mode: "light",
      viewport: { width: 560, height: 100 },
      render: () => (
        <Alert size="medium" sentiment="pink" hasIcon hasAction>
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-medium-neutral-light",
      mode: "light",
      viewport: { width: 560, height: 100 },
      render: () => (
        <Alert
          size="medium"
          sentiment="neutral"
          hasIcon
          hasAction
          isDismissible
        >
          This is an alert.
        </Alert>
      ),
    },
    {
      id: "alert-large-brand-dark",
      mode: "dark",
      viewport: { width: 560, height: 120 },
      render: () => (
        <Alert
          size="large"
          sentiment="brand"
          hasIcon
          hasAction
          isDismissible
        >
          This is an alert.
        </Alert>
      ),
    },
  ];
