"use client";

import { NotificationBanner } from "@codeai/cads-react/components/NotificationBanner";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "banner-brand-none-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="brand"
          fillStyle="none"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-brand-color-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="brand"
          fillStyle="color"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-success-color-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="success"
          fillStyle="color"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-error-none-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="error"
          fillStyle="none"
          isDismissible
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-warning-color-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="warning"
          fillStyle="color"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-info-none-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="info"
          fillStyle="none"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-pink-color-light",
      mode: "light",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="pink"
          fillStyle="color"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
    {
      id: "banner-neutral-color-dark",
      mode: "dark",
      viewport: { width: 860, height: 120 },
      render: () => (
        <NotificationBanner
          sentiment="neutral"
          fillStyle="color"
          title="This is a title"
          description="This is additional descriptive text."
        />
      ),
    },
  ];
