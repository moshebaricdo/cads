"use client";

import { Dialog } from "@codeai/cads-react/components/Dialog";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "dialog-default-light",
      mode: "light",
      viewport: { width: 760, height: 420 },
      render: () => <Dialog type="default" surfaceOnly />,
    },
    {
      id: "dialog-icon-top-light",
      mode: "light",
      viewport: { width: 760, height: 460 },
      render: () => <Dialog type="iconTop" surfaceOnly />,
    },
    {
      id: "dialog-custom-light",
      mode: "light",
      viewport: { width: 760, height: 280 },
      render: () => (
        <Dialog type="customContent" surfaceOnly>
          <div style={{ height: 130 }} />
        </Dialog>
      ),
    },
    {
      id: "dialog-default-dark",
      mode: "dark",
      viewport: { width: 760, height: 420 },
      render: () => <Dialog type="default" surfaceOnly />,
    },
    {
      id: "dialog-primary-only-light",
      mode: "light",
      viewport: { width: 760, height: 400 },
      render: () => (
        <Dialog type="default" hasSecondaryAction={false} surfaceOnly />
      ),
    },
  ];
