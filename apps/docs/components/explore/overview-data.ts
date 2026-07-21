import {
  COMPONENT_SECTIONS,
  FOUNDATIONS_NAV,
  componentHref,
} from "@/lib/nav";

export type ExploreDirItem = {
  href: string;
  label: string;
  description: string;
  iconName: string;
};

export type ExploreDirGroup = {
  id: string;
  label: string;
  items: ExploreDirItem[];
};

export const OVERVIEW_DIR_GROUPS: ExploreDirGroup[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: FOUNDATIONS_NAV.map((item) => ({
      href: item.href,
      label: item.label,
      description: foundationBlurb(item.label),
      iconName: item.iconName,
    })),
  },
  {
    id: "components",
    label: "Components",
    items: COMPONENT_SECTIONS.map((section) => {
      const first = section.items[0];
      return {
        href: componentHref(first.exportName),
        label: section.label,
        description: `${section.items.length} components · start with ${first.label}`,
        iconName: section.iconName,
      };
    }),
  },
  {
    id: "resources",
    label: "For Agents",
    items: [
      {
        href: "/ai",
        label: "AI setup",
        description: "llms.txt, manifest, and the Claude prototyping skill",
        iconName: "font",
      },
    ],
  },
];

export const OVERVIEW_AREA_CARDS = [
  {
    id: "foundations",
    href: "/variables/color",
    label: "Foundations",
    iconName: "palette",
    description: "Color, typography, shape, and motion variables from Figma.",
    links: FOUNDATIONS_NAV.map((item) => ({
      href: item.href,
      label: item.label,
    })),
  },
  {
    id: "components",
    href: "/components/button",
    label: "Components",
    iconName: "computer-mouse-button-left",
    description: "Playgrounds and props for Actions, Inputs, Navigation, and more.",
    links: COMPONENT_SECTIONS.map((section) => ({
      href: componentHref(section.items[0].exportName),
      label: section.label,
    })),
  },
  {
    id: "agents",
    href: "/ai",
    label: "For Agents",
    iconName: "font",
    description: "How agents stay in parity with Figma via manifest and skill.",
    links: [{ href: "/ai", label: "Open AI setup" }],
  },
] as const;

function foundationBlurb(label: string): string {
  switch (label) {
    case "Color":
      return "Semantic color variables for light and dark";
    case "Typography":
      return "Heading and body scale";
    case "Shape":
      return "Spacing, radius, and layout rhythm";
    case "Motion":
      return "Duration, easing, and elevation";
    default:
      return "Design variables";
  }
}
