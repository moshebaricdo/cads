/**
 * Baked CADS text-style catalog (published style keys + font metrics from the
 * CADS Figma library). Metrics let the plugin skip importStyleByKeyAsync at
 * load time — apply still imports styles lazily when remapping.
 *
 * Regenerate keys via `node scripts/fetch-text-styles.mjs` (REST; preserves
 * existing values by key). Refresh values from the open CADS file via Figma
 * MCP / plugin capture.
 *
 * GENERATED FILE — do not hand-edit style entries.
 * Last harvest: 2026-08-04 via Figma MCP (live from the open CADS file).
 */
export interface BakedTextStyle {
  key: string;
  name: string;
  /** Font metrics for matching/display. When present, load skips style import. */
  values?: Record<string, string>;
}

export const CADS_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";

export const bakedFetchedAt: string | null = "2026-08-05T02:27:00.370Z";

export const bakedTextStyles: BakedTextStyle[] = [
  {
    "key": "936275bca7e31fcfad3aba20d6dcacb1e84a39d0",
    "name": "Heading/H1/Bold",
    "values": {
      "family": "Space Grotesk",
      "weight": "Bold",
      "size": "48",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "52px"
    }
  },
  {
    "key": "36e0a0364f9c0864b207ab218fed4d70faa77805",
    "name": "Heading/H1/Regular",
    "values": {
      "family": "Space Grotesk",
      "weight": "Regular",
      "size": "48",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "52px"
    }
  },
  {
    "key": "eeb8780a5f3b4e44b1d476dab09a923f74e8b85a",
    "name": "Heading/H1/Semi Bold",
    "values": {
      "family": "Space Grotesk",
      "weight": "SemiBold",
      "size": "48",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "52px"
    }
  },
  {
    "key": "ee4a41c8ef2f03dc6fa1fb90fdd9c6c053983e3e",
    "name": "Heading/H2/Bold",
    "values": {
      "family": "Space Grotesk",
      "weight": "Bold",
      "size": "38",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "40px"
    }
  },
  {
    "key": "a29cc53643fd93332025892ae7e5b633977a18a0",
    "name": "Heading/H2/Regular",
    "values": {
      "family": "Space Grotesk",
      "weight": "Regular",
      "size": "38",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "40px"
    }
  },
  {
    "key": "4859ddaef7ab555451a01831fc85be40e955e12f",
    "name": "Heading/H2/Semi Bold",
    "values": {
      "family": "Space Grotesk",
      "weight": "SemiBold",
      "size": "38",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "40px"
    }
  },
  {
    "key": "91de6a70a40e86cb439b8053b4ab3ef19c2d9282",
    "name": "Heading/H3/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "28",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "36px"
    }
  },
  {
    "key": "e513f6907d4000066d236547be3396042aa91e0d",
    "name": "Heading/H3/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "28",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "36px"
    }
  },
  {
    "key": "aa56723a3e2910f2d17040c823d1742dd35d312a",
    "name": "Heading/H3/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "28",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "36px"
    }
  },
  {
    "key": "354aff496e2178600cb77ac80680f47e03b459fc",
    "name": "Heading/H4/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "24",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "32px"
    }
  },
  {
    "key": "9a38933ce643083080aec0de36c48805151ee56f",
    "name": "Heading/H4/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "24",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "32px"
    }
  },
  {
    "key": "e3379936dabc9f7ecb3ec78a0f293cb1b9b667c0",
    "name": "Heading/H4/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "24",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "32px"
    }
  },
  {
    "key": "25457cea42ad27b27257a9df323afbec5e7287f7",
    "name": "Heading/H5/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "22",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "30px"
    }
  },
  {
    "key": "9b2f63202457c8cf0e0fc54b17f6780c36815ddb",
    "name": "Heading/H5/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "22",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "30px"
    }
  },
  {
    "key": "509bc8bc8825196715b7494d188a0ff36c7a09fe",
    "name": "Heading/H5/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "22",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "30px"
    }
  },
  {
    "key": "742f9cb42298d3ff17411016f56aea4586b6e9f6",
    "name": "Heading/H6/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "20",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "5bab8fa17cbbdb8c7691b35b149f7d0606072ccc",
    "name": "Heading/H6/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "20",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "c750a284d17da1e7717eaf3492a2697fc6060d47",
    "name": "Heading/H6/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "20",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "d24f45b078c7b991bb846d53f5aac5e8736b0470",
    "name": "Body/Body 1/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "01088fd0d3bb6d67baf9deec532326c3d93563f1",
    "name": "Body/Body 1/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "bd41dcde8355282c93c91e3cab2c02d3d92790d9",
    "name": "Body/Body 1/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "52364c4caf5b56d26b269538cf8446981a8b63aa",
    "name": "Body/Body 2/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "710f3598e4bad0482f28fc1d16098dc7c2f21760",
    "name": "Body/Body 2/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "e001af2a0bdaf201dedd5dd568ba920e3d189c27",
    "name": "Body/Body 2/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "616ebf11fc8918de70450eea30afd6a61a3ca822",
    "name": "Body/Body 3/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "e5518262333dab367830a5a016af98f330963e02",
    "name": "Body/Body 3/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "71da1c2a8606f1e3e2e9f5961aa3eec6f1b02601",
    "name": "Body/Body 3/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "bd980d39eb7c9e2e7efd776fe6399027669f65b9",
    "name": "Body/Body 4/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "d1b1e768bb3b7c02901ec3420f2027a880107617",
    "name": "Body/Body 4/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "4ba37196725defc9d706ac74682ed276b1beff33",
    "name": "Body/Body 4/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "03d228e7a51cd6be106a7ea841b14e9c1dbac101",
    "name": "Body/Body 5/Bold",
    "values": {
      "family": "Geist",
      "weight": "Bold",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "c003c38c50e105d4b5cf9880a6d394bb38054979",
    "name": "Body/Body 5/Regular",
    "values": {
      "family": "Geist",
      "weight": "Regular",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "7237176ce7f48a12615b2121cd64f4af4a82ea29",
    "name": "Body/Body 5/Semi Bold",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "975152cd057fa073f9c6477c148c63aa24a1b30d",
    "name": "Overline/Overline 1",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "14",
      "textCase": "UPPER",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "2040e6bce25742ecba0d5793a3ef057175e2f87a",
    "name": "Overline/Overline 2",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "12",
      "textCase": "UPPER",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "5b770b696b963399ffb7eab39ec31c29845ec870",
    "name": "Overline/Overline 3",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "10",
      "textCase": "UPPER",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "6d900fefb3dcfbe6cf7f3a59f13ea0372d223eb9",
    "name": "Link/Link 1",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "UNDERLINE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "0fd1876852152c84a4c877ecbba3d6d2d84a3f72",
    "name": "Link/Link 2",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "UNDERLINE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "bf84c7488010bf79e185b4b20570cfec19c3e85f",
    "name": "Link/Link 3",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "UNDERLINE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "c02a248fa1df7d283036b4455c2bd927c0f2a827",
    "name": "Link/Link 4",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "UNDERLINE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "beb95c9d77ba0d60e4bf4460fccf29ef07df2766",
    "name": "Link/Link 5",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "UNDERLINE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "fe2c80bbc480ade00a6f96b78eb9bab9a6e99d0a",
    "name": "Label/Label 1",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "4ab9224934eb0971c2d8f3ee6e3afa96884350cc",
    "name": "Label/Label 2",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "a10cfc3a7f9fd8a5d48d542ce15f1731178a2b96",
    "name": "Label/Label 3",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "abeb47e031721ba87b6f02dacb97cf134d6ec679",
    "name": "Label/Label 4",
    "values": {
      "family": "Geist",
      "weight": "SemiBold",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "ac4881d7168dda5130f0b32986b5825d67e9dede",
    "name": "Mono/Mono 1/Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "Bold",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "73fb0fcdf6523657b059a6a817fd9bd9738afdac",
    "name": "Mono/Mono 1/Regular",
    "values": {
      "family": "Google Sans Code",
      "weight": "Regular",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "a22bc52ca9cb217d46632f0adb45014e49aa741b",
    "name": "Mono/Mono 1/Semi Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "SemiBold",
      "size": "18",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "28px"
    }
  },
  {
    "key": "2a0c58da534f6729be26b1ab3aa9292953ab1a3d",
    "name": "Mono/Mono 2/Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "Bold",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "70f524e3583cd925a4f568867ce45b518ee6554e",
    "name": "Mono/Mono 2/Regular",
    "values": {
      "family": "Google Sans Code",
      "weight": "Regular",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "33179c970fb0137403651d4337a9ce6ac145c6a9",
    "name": "Mono/Mono 2/Semi Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "SemiBold",
      "size": "16",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "24px"
    }
  },
  {
    "key": "2c41ba0c03e7ff8276da8bbe0708470fd4060a19",
    "name": "Mono/Mono 3/Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "Bold",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "f70b9597f25d6788360e55f7f8a92b3ac86d5a04",
    "name": "Mono/Mono 3/Regular",
    "values": {
      "family": "Google Sans Code",
      "weight": "Regular",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "f812668bf29f513096ba7b2aea6c18b5dc53bf7b",
    "name": "Mono/Mono 3/Semi Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "SemiBold",
      "size": "14",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "22px"
    }
  },
  {
    "key": "5aecda1875c7deb6d23419745912b0544d66a12a",
    "name": "Mono/Mono 4/Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "Bold",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "fd118029c9d5a04d0edd96b8a5620397ea2a76c8",
    "name": "Mono/Mono 4/Regular",
    "values": {
      "family": "Google Sans Code",
      "weight": "Regular",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "699bbc87b7931f42cee5a83677270242e4c45b3e",
    "name": "Mono/Mono 4/Semi Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "SemiBold",
      "size": "12",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "18px"
    }
  },
  {
    "key": "dd8525c07de2f6943c82b6aa35d98e32d47de6c5",
    "name": "Mono/Mono 5/Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "Bold",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "873b38e48e5381d9b5656e5b6e948f3d97a6f63c",
    "name": "Mono/Mono 5/Regular",
    "values": {
      "family": "Google Sans Code",
      "weight": "Regular",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  },
  {
    "key": "c3dc3744760afef7dc1abb6d8b82eae7f5392eca",
    "name": "Mono/Mono 5/Semi Bold",
    "values": {
      "family": "Google Sans Code",
      "weight": "SemiBold",
      "size": "10",
      "textCase": "ORIGINAL",
      "textDecoration": "NONE",
      "lineHeight": "16px"
    }
  }
];
