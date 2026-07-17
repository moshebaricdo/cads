import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type SegmentedButtonSize = ControlSize;
interface SegmentedButtonOption {
    value: string;
    label: ReactNode;
    iconName?: FaIconName;
    endIconName?: FaIconName;
    disabled?: boolean;
}
interface SegmentedButtonProps {
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: SegmentedButtonSize;
    /** Currently selected value (exclusive). */
    value?: string;
    /** Uncontrolled default. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    options: SegmentedButtonOption[];
    disabled?: boolean;
    /** Square icon-only segments (Figma `iconOnly`). */
    iconOnly?: boolean;
    "aria-label"?: string;
    className?: string;
}
/**
 * CADS Segmented Button Group — mutually exclusive connected segments.
 * Building blocks map to Figma Segmented Button Block; consumers use this group.
 *
 * Spec: page `587:1268`, Group set `8027:2099` (key `bf599e1bc1d1e651be6aab5bf90ac6a7c26dcfd1`),
 * Block set `8000:4554` (key `d8dbdc672ccdc6755ae409e31e5517571424384e`).
 */
declare const SegmentedButton: react.ForwardRefExoticComponent<SegmentedButtonProps & react.RefAttributes<HTMLDivElement>>;

export { SegmentedButton, type SegmentedButtonOption, type SegmentedButtonProps, type SegmentedButtonSize };
