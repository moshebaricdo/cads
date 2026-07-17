"use client";

import { Modal } from "@codeai/cads-react/components/Modal";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "modal-default-light",
      mode: "light",
      viewport: { width: 840, height: 420 },
      render: () => <Modal type="default" surfaceOnly />,
    },
    {
      id: "modal-vertical-light",
      mode: "light",
      viewport: { width: 840, height: 560 },
      render: () => <Modal type="verticalImage" surfaceOnly />,
    },
    {
      id: "modal-horizontal-light",
      mode: "light",
      viewport: { width: 840, height: 480 },
      render: () => <Modal type="horizontalImage" surfaceOnly />,
    },
    {
      id: "modal-default-dark",
      mode: "dark",
      viewport: { width: 840, height: 420 },
      render: () => <Modal type="default" surfaceOnly />,
    },
    {
      id: "modal-primary-only-light",
      mode: "light",
      viewport: { width: 840, height: 400 },
      render: () => (
        <Modal type="default" hasSecondaryAction={false} surfaceOnly />
      ),
    },
  ];
