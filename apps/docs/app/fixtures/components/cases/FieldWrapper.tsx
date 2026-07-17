"use client";

import { FieldWrapper } from "@codeai/cads-react/components/FieldWrapper";
import { TextInput } from "@codeai/cads-react/components/TextInput";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "field-wrapper-large-default-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="large"
          sentiment="default"
          label="Field label"
          helperText="Helper text"
          showHelper
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-medium-success-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="medium"
          sentiment="success"
          label="Field label"
          helperText="Helper text"
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-small-warning-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="small"
          sentiment="warning"
          label="Field label"
          helperText="Helper text"
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-xs-error-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="extraSmall"
          sentiment="error"
          label="Field label"
          helperText="Helper text"
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-large-default-dark",
      mode: "dark",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="large"
          sentiment="default"
          label="Field label"
          helperText="Helper text"
          showHelper
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
  ];
