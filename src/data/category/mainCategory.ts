export const mainCategory = [
    {
        name: "Furniture",
        categoryId: "furnitures",
        level: 1,
        levelTwoCategory: [
            {
                "name": "Storage & Organization",
                "categoryId": "storage-organization",
                "parentCategoryId": "furnitures",
                "level": 2,
            },
            {
                "name": "Sofas",
                "categoryId": "sofas",
                "parentCategoryId": "furnitures",
                "level": 2,
            },
            {
                "name": "Beds",
                "categoryId": "beds",
                "parentCategoryId": "furnitures",
                "level": 2,
            },
            {
                "name": "Tables",
                "categoryId": "tables",
                "parentCategoryId": "furnitures",
                "level": 2,
            },
            {
                "name": "Chairs",
                "categoryId": "chairs",
                "parentCategoryId": "furnitures",
                "level": 2,
            },

        ]

    },
    {
        name: "Rugs",
        categoryId: "rugs",
        level: 1,
        levelTwoCategory: [
            {
                "name": "Rugs",
                "categoryId": "rugs_lv2",
                "parentCategoryId": "rugs",
                "level": 2,
            }
        ]
    },
    {
        name: "Lighting",
        categoryId: "lighting",
        level: 1,
        levelTwoCategory: [
            {
                "name": "Lighting",
                "categoryId": "lighting_lv2",
                "parentCategoryId": "lighting",
                "level": 2,
            }
        ]
    },
    {
        name: "Outdoor & Garden",
        categoryId: "outdoor-garden",
        level: 1,
        levelTwoCategory: [
            {
                "name": "Outdoor & Garden",
                "categoryId": "outdoor-garden-lv2",
                "parentCategoryId": "outdoor-garden",
                "level": 2,
            }
        ]
    }
];