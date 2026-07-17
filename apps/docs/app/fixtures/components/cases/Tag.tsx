"use client";

import { Tag } from "@codeai/cads-react/components/Tag";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "tag-large-neutral-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => <Tag size="large" color="neutral" label="Tag" startIcon />,
    },
    {
      id: "tag-medium-brand-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => <Tag size="medium" color="brand" label="Tag" startIcon />,
    },
    {
      id: "tag-small-success-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => <Tag size="small" color="success" label="Tag" startIcon />,
    },
    {
      id: "tag-large-pink-light",
      mode: "light",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Tag size="large" color="pink" label="Tag" startIcon isDismissible />
      ),
    },
    {
      id: "tag-medium-orange-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Tag
          size="medium"
          color="orange"
          label="Tag"
          startIcon
          isDismissible
        />
      ),
    },
    {
      id: "tag-large-error-light",
      mode: "light",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Tag size="large" color="error" label="Tag" startIcon endIcon />
      ),
    },
    {
      id: "tag-medium-warning-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Tag size="medium" color="warning" label="Tag" startIcon={false} />
      ),
    },
    {
      id: "tag-large-info-dark",
      mode: "dark",
      viewport: { width: 200, height: 80 },
      render: () => <Tag size="large" color="info" label="Tag" startIcon />,
    },
  ];
