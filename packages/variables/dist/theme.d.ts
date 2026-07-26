import * as _mui_material_styles from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';
export { c as controlHeights, e as elevation, m as motion, s as shape, a as spacing, t as typography, z as zIndex } from './nonColorVariables-BquPjLSN.js';

/**
 * Base theme options. Light/dark visual switching is driven by the `.dark` class
 * on an ancestor (CSS variables), matching the Lab2 / CADS runtime convention.
 */
/**
 * Prefer CSS font variables over the resolved stack string so CssBaseline /
 * MUI typography honor consumer overrides (e.g. docs next/font → --font-geist-sans).
 * Bare `'Geist'` in the stack does not match next/font’s hashed family name; the
 * browser then falls through to Noto script fonts that ship ASCII digits/`()`/`/`
 * without Latin letters (notably Noto Sans Kannada), mixing faces in one paragraph.
 */
declare const cadsThemeOptions: ThemeOptions;
declare function createCadsTheme(overrides?: ThemeOptions): _mui_material_styles.Theme;

export { cadsThemeOptions, createCadsTheme };
