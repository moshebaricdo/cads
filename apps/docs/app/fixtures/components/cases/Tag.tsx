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
      render: () => (
        <Tag
          size="large"
          color="neutral"
          label="Tag"
          startIconName="face-smile"
        />
      ),
    },
    {
      id: "tag-medium-brand-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Tag
          size="medium"
          color="brand"
          label="Tag"
          startIconName="face-smile"
        />
      ),
    },
    {
      id: "tag-small-success-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Tag
          size="small"
          color="success"
          label="Tag"
          startIconName="face-smile"
        />
      ),
    },
    {
      id: "tag-large-pink-light",
      mode: "light",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Tag
          size="large"
          color="pink"
          label="Tag"
          startIconName="face-smile"
          isDismissible
        />
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
          startIconName="face-smile"
          isDismissible
        />
      ),
    },
    {
      id: "tag-large-error-light",
      mode: "light",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Tag
          size="large"
          color="error"
          label="Tag"
          startIconName="face-smile"
          endIconName="face-smile"
        />
      ),
    },
    {
      id: "tag-medium-warning-light",
      mode: "light",
      viewport: { width: 200, height: 80 },
      render: () => <Tag size="medium" color="warning" label="Tag" />,
    },
    {
      id: "tag-large-info-dark",
      mode: "dark",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Tag
          size="large"
          color="info"
          label="Tag"
          startIconName="face-smile"
        />
      ),
    },
  ];
