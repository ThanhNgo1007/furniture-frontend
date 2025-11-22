// web_fe/src/data/navigation.ts

export const navigation = [
  {
    key: 'navbar.furniture', // Key trong file en.json / vi.json
    categoryId: 'furnitures',
    isDropdown: false
  },
  {
    key: 'navbar.rugs',
    categoryId: 'rugs',
    isDropdown: false
  },
  {
    key: 'navbar.lighting',
    categoryId: 'lighting',
    isDropdown: false
  },
  {
    key: 'navbar.outdoor',
    categoryId: 'outdoor-garden',
    isDropdown: false
  },
  {
    key: 'navbar.support', // Gom "Seller's Guide" và "How It Works"
    categoryId: 'support',
    isDropdown: true,
    subItems: [
      { key: 'navbar.guides', categoryId: 'guides' },
      { key: 'navbar.works', categoryId: 'informations' }
    ]
  }
];