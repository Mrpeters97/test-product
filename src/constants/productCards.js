// Product form schema
export const PROVIDER_OPTIONS = [
  { value: 'samsung', label: 'Samsung' },
  { value: 'apple', label: 'Apple' },
  { value: 'garmin', label: 'Garmin' },
  { value: 'other', label: 'Other' },
]

export const PRODUCT_CARDS = [
  {
    id: 'mpc-identifier',
    title: '',
    hideTitle: true,
    fields: [
      {
        key: 'mpcIdentifier',
        label: 'MPC identifier',
        required: false,
        type: 'text',
        readonly: true,
        placeholder: '',
        differsOn: 'variant',
      },
    ],
  },
  {
    id: 'product-information',
    title: 'Product information',
    fields: [
      {
        key: 'variantName',
        label: 'Variant name',
        required: true,
        type: 'text',
        differsOn: 'variant-channel-language',
        placeholder: 'Unique variant name',
      },
      {
        key: 'brand',
        label: 'Brand',
        required: true,
        type: 'select',
        options: PROVIDER_OPTIONS,
        placeholder: 'Select brand',
      },
      {
        key: 'ean',
        label: 'EAN',
        required: true,
        type: 'text-array',
        differsOn: 'variant',
        placeholder: 'Unique EAN',
      },
    ],
  },
  {
    id: 'product-specifications',
    title: 'Product specifications',
    fields: [
      {
        key: 'returnOldProductFree',
        label: 'Return old product for free',
        required: false,
        type: 'radio-tiles',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        differsOn: null,
      },
      {
        key: 'suitableForGender',
        label: 'Suitable for gender',
        required: false,
        type: 'multiselect',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'unisex', label: 'Unisex' },
        ],
        placeholder: 'Select options',
        differsOn: null,
      },
      {
        key: 'recommendedRetailPrice',
        label: 'Recommended retail price',
        required: false,
        type: 'price',
        placeholder: 'Type amount',
        differsOn: 'variant-channel',
      },
      {
        key: 'pros',
        label: "Pro's",
        required: false,
        type: 'text-array',
        placeholder: 'Unique pro',
        differsOn: 'variant-channel-language',
      },
      {
        key: 'cons',
        label: "Con's",
        required: false,
        type: 'text-array',
        placeholder: 'Unique con',
        differsOn: 'variant-channel-language',
      },
    ],
  },
  {
    id: 'product-description',
    title: 'Product description',
    fields: [
      {
        key: 'productDescription',
        label: 'Product description',
        required: false,
        type: 'rich-text',
        placeholder: 'Unique product description',
        differsOn: 'variant-channel-language',
      },
    ],
  },
  {
    id: 'general-features',
    title: 'General Features',
    fields: [
      {
        key: 'boxContents',
        label: 'Box contents',
        required: false,
        type: 'multiselect',
        options: [
          { value: 'quick_start_guide', label: 'Quick start guide' },
          { value: 'warranty_information', label: 'Warranty information' },
          { value: 'carrying_case_pouch', label: 'Carrying case/pouch' },
          { value: 'cleaning_tool', label: 'Cleaning tool' },
          { value: 'charging_dock', label: 'Charging dock' },
          { value: 'usb_a_power_adapter', label: 'USB-A power adapter' },
          { value: 'usb_c_power_adapter', label: 'USB-C power adapter' },
          { value: 'audio_adapter', label: '3.5mm audio adapter' },
          { value: 'usb_charging_cable', label: 'USB charging cable' },
        ],
        placeholder: 'Select options',
      },
      {
        key: 'builtInMicrophone',
        label: 'Built-in microphone',
        required: false,
        type: 'radio-tiles',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        differsOn: null,
      },
    ],
  },
  {
    id: 'images-media',
    title: 'Images and Media',
    fields: [
      {
        key: 'productImages',
        label: 'Images',
        required: false,
        type: 'text-array',
        placeholder: 'Unique product image',
        differsOn: 'variant',
      },
      {
        key: 'videoReviews',
        label: 'Video reviews',
        required: false,
        type: 'text-array',
        placeholder: 'Unique video review',
        differsOn: 'variant-channel-language',
      },
    ],
  },
]

export const DIFF_LABELS = {
  'variant-channel-language': 'This attributes differs on variant, channel, and language',
  'variant-channel': 'This attribute differs on variant and channel',
  'variant-language': 'This attribute differs on variant and language',
  'variant': 'This attribute differs on variant',
  'channel': 'This attribute differs on channel',
  'channel-local': 'This attribute differs on channel and is local',
}
