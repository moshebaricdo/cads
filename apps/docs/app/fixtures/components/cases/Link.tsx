"use client";

import { Link } from "@codeai/cads-react/components/Link";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "link-large-primary-default-external-light",
      mode: "light",
      state: "default",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="large" type="primary" isExternal>
          Link
        </Link>
      ),
    },
    {
      id: "link-medium-primary-hover-light",
      mode: "light",
      state: "hover",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="medium" type="primary" isExternal>
          Link
        </Link>
      ),
    },
    {
      id: "link-small-primary-focus-light",
      mode: "light",
      state: "focus",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="small" type="primary" isExternal>
          Link
        </Link>
      ),
    },
    {
      id: "link-xs-secondary-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="extraSmall" type="secondary" isExternal>
          Link
        </Link>
      ),
    },
    {
      id: "link-xxs-primary-default-noicon-light",
      mode: "light",
      state: "default",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="extraExtraSmall" type="primary" isExternal={false}>
          Link
        </Link>
      ),
    },
    {
      id: "link-large-primary-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="large" type="primary" isExternal disabled>
          Link
        </Link>
      ),
    },
    {
      id: "link-medium-primary-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 240, height: 80 },
      render: () => (
        <Link href="#link" size="medium" type="primary" isExternal>
          Link
        </Link>
      ),
    },
  ];
