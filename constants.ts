import type { User, MenuItem, Branch } from './types';

// --- PENGATURAN LOGO DEFAULT ---
// Ganti `null` di bawah ini dengan URL logo Anda atau string Base64 untuk menjadikannya logo default.
// Contoh URL: 'https://example.com/logo.png'
// Contoh Base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...'
export const DEFAULT_LOGO_URL: string | null = 'https://i.imgur.com/WHPgCDz.png';

export const TAX_RATE = 0.11; // PPN Indonesia

export const INITIAL_USERS: User[] = [
  { id: 1, name: 'alkil', pin: '1234', role: 'cashier' },
  { id: 2, name: 'Owner', pin: '5678', role: 'owner' },
  { id: 3, name: 'Budi Supervisor', pin: '9999', role: 'supervisor' },
];

export const INITIAL_BRANCHES: Branch[] = [
    { id: 1, name: 'Main Branch' }
];

// Helper to create price objects with a markup
const createPrices = (basePrice: number, markupPercent: number = 20) => {
    const markup = 1 + (markupPercent / 100);
    const deliveryPrice = Math.round((basePrice * markup) / 500) * 500; // Round to nearest 500
    return {
        dine_in: basePrice,
        gofood: deliveryPrice,
        grabfood: deliveryPrice,
        shopeefood: deliveryPrice,
    };
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
    // Nasi
    { id: 1, name: "Nasi Ayam Pop Corn", prices: createPrices(10000), cost: 4000, category: "Nasi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/nasi_ayam_pop_corn_10.000-84803d15-2882-4f33-b4e8-8c10de570498" },

    // Bento
    { id: 2, name: "Chicken Bento", prices: createPrices(20500), cost: 9000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_bento_20.500-2059c1c5-8422-488b-b8b7-8738fd48c269" },
    { id: 3, name: "Chicken Bento (Combo)", prices: createPrices(30000), cost: 13000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_bento_20.500-2059c1c5-8422-488b-b8b7-8738fd48c269" },
    { id: 4, name: "Chicken Teriyaki Bento", prices: createPrices(20500), cost: 9000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_teriyaki_20.500-825553b6-4ac9-4e4f-b649-74d7543a7589" },
    { id: 5, name: "Chicken Teriyaki Bento (Combo)", prices: createPrices(30000), cost: 13000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_teriyaki_20.500-825553b6-4ac9-4e4f-b649-74d7543a7589" },
    { id: 6, name: "Chicken Yakiniku Bento", prices: createPrices(20500), cost: 9000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_yakiniku_20.500-985da38c-d2c3-4d0a-99ef-8bd287b92f44" },
    { id: 7, name: "Chicken Yakiniku Bento (Combo)", prices: createPrices(30000), cost: 13000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_yakiniku_20.500-985da38c-d2c3-4d0a-99ef-8bd287b92f44" },
    { id: 8, name: "Chicken Katsu Curry Bento", prices: createPrices(25000), cost: 11000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_katsu_curry_25.000-880be0a9-25f0-4613-bc59-7bb396a8479e" },
    { id: 9, name: "Chicken Katsu Curry Bento (Combo)", prices: createPrices(32500), cost: 14000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_katsu_curry_25.000-880be0a9-25f0-4613-bc59-7bb396a8479e" },
    { id: 10, name: "Beef Yakiniku Bento", prices: createPrices(25000), cost: 12000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_yakiniku_25.000-96f30e9d-c782-4217-a06a-ff99c4fa2e16" },
    { id: 11, name: "Beef Yakiniku Bento (Combo)", prices: createPrices(32500), cost: 15000, category: "Bento", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_yakiniku_25.000-96f30e9d-c782-4217-a06a-ff99c4fa2e16" },

    // Donburi
    { id: 12, name: "Chicken Teriyaki Donburi", prices: createPrices(23000), cost: 10000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_teriyaki_23.000-27f91040-27f5-412f-98c5-9b2f694e22e9" },
    { id: 13, name: "Chicken Teriyaki Donburi (Combo)", prices: createPrices(30000), cost: 13000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_teriyaki_23.000-27f91040-27f5-412f-98c5-9b2f694e22e9" },
    { id: 14, name: "Chicken Yakiniku Donburi", prices: createPrices(23000), cost: 10000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_yakiniku_23.000-30ce0e61-a02b-4f9e-a8fa-77636e1c6b65" },
    { id: 15, name: "Chicken Yakiniku Donburi (Combo)", prices: createPrices(30000), cost: 13000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_yakiniku_23.000-30ce0e61-a02b-4f9e-a8fa-77636e1c6b65" },
    { id: 16, name: "Chicken Katsu Curry Donburi", prices: createPrices(27000), cost: 12000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_katsu_curry_27.000-1c0953a7-e8fd-4929-a78b-d51d115e8f49" },
    { id: 17, name: "Chicken Katsu Curry Donburi (Combo)", prices: createPrices(32750), cost: 14500, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_katsu_curry_27.000-1c0953a7-e8fd-4929-a78b-d51d115e8f49" },
    { id: 18, name: "Beef Teriyaki Donburi", prices: createPrices(27000), cost: 13000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_teriyaki_27.000-7c264299-d48e-4f7f-afbd-34d2b2ccb3a4" },
    { id: 19, name: "Beef Teriyaki Donburi (Combo)", prices: createPrices(32075), cost: 15000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_teriyaki_27.000-7c264299-d48e-4f7f-afbd-34d2b2ccb3a4" },
    { id: 20, name: "Beef Yakiniku Donburi", prices: createPrices(27000), cost: 13000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_yakiniku_27.000-d8302f37-12ed-478a-9366-a4c66046e8c7" },
    { id: 21, name: "Beef Yakiniku Donburi (Combo)", prices: createPrices(32750), cost: 15000, category: "Donburi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_yakiniku_27.000-d8302f37-12ed-478a-9366-a4c66046e8c7" },
    
    // Minuman
    { id: 22, name: "Es Kopi Susu Aren", prices: createPrices(9000), cost: 4000, category: "Minuman", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_kopi_susu_arem_9.000-0e194ac5-5735-4428-a37f-cfc73792ac4f" },
    { id: 23, name: "Es Kopi Coconut", prices: createPrices(9000), cost: 4000, category: "Minuman", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_kopi_coconut_9.000-98cc0060-6ffb-4b2a-8c70-7b24cf48f886" },
    { id: 24, name: "Matcha", prices: createPrices(9000), cost: 4000, category: "Minuman", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/matcha_9.000-760777e4-d567-4229-87c2-3cf7d512a86c" },
    { id: 25, name: "Es Coklat", prices: createPrices(9000), cost: 4000, category: "Minuman", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_coklat_9.000-0ff92667-27e1-4328-8d07-6f8510ff48a6" },
    { id: 26, name: "Taro", prices: createPrices(9000), cost: 4000, category: "Minuman", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/taro_9.000-bb65f5a2-c430-4e5c-8ca8-72782782e342" },
    { id: 27, name: "Red Velvet", prices: createPrices(9000), cost: 4000, category: "Minuman", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/red_velvet_9.000-580bb4c9-b7b2-4d56-a36c-2f95c104e14f" },

    // Tea Series
    { id: 28, name: "Teh Manis Original", prices: createPrices(5000), cost: 2000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/teh_manis_original_5.000-61f21f1d-c475-4039-ba8e-d90c950a58ad" },
    { id: 29, name: "Es Teh Tarik", prices: createPrices(9000), cost: 4000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_teh_tarik_9.000-756ef24a-71bd-4370-98a4-0994f31c28c8" },
    { id: 30, name: "Es Teh Lychee", prices: createPrices(9000), cost: 4000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_teh_lychee_9.000-2d93e18a-6379-450f-90e8-0b61676662e5" },
    { id: 31, name: "Es Teh Blackcurrant", prices: createPrices(9000), cost: 4000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_teh_blackcurrant_9.000-8b4b7c6c-a4ec-42de-8d34-7548b6c00224" },
    { id: 32, name: "Es Teh Kiwi", prices: createPrices(9000), cost: 4000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_teh_kiwi_9.000-4b898118-2e38-4b21-a3f1-285b0d00f727" },
    { id: 33, name: "Es Teh Strawberry", prices: createPrices(9000), cost: 4000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_teh_strawberry_9.000-f1d17482-1678-43d9-a7a3-e23a4128537b" },
    { id: 34, name: "Es Teh Mango", prices: createPrices(9000), cost: 4000, category: "Tea Series", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/es_teh_mango_9.000-ca228789-f597-404c-8302-6e2c310b89cd" },
    
    // Burger & Hot Dog
    { id: 35, name: "Chicken Burger", prices: createPrices(14000), cost: 6000, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/chicken_burger_14.000-6927d25e-0443-4315-9d58-9c17abf2f61e" },
    { id: 36, name: "Cheese Chicken Burger", prices: createPrices(18500), cost: 8000, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/cheese_chicken_burger_18.500-0e7aa696-2246-4c4f-96a9-f56557ca7df9" },
    { id: 37, name: "Beef Burger", prices: createPrices(18500), cost: 8500, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/beef_burger_18.500-3490715e-5b29-4c2d-8692-0b31e9a7e67a" },
    { id: 38, name: "Cheese Burger", prices: createPrices(21500), cost: 10000, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/cheese_burger_21.500-d470be31-7b0b-47e9-a868-b3d9200bdf19" },
    { id: 39, name: "Noba Burger", prices: createPrices(23500), cost: 11000, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/noba_burger_23.500-4f51e51b-2525-4b0d-b847-b3f9ff3a0515" },
    { id: 40, name: "Jumbo Hot Dog", prices: createPrices(14000), cost: 6000, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/jumbo_hot_dog_14.000-3a5f782c-49fd-42ab-b472-7fc75e927513" },
    { id: 41, name: "Jumbo Hot Dog (Combo)", prices: createPrices(25000), cost: 11000, category: "Burger & Hot Dog", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/jumbo_hot_dog_14.000-3a5f782c-49fd-42ab-b472-7fc75e927513" },

    // Sushi
    { id: 42, name: "Crabstick Maki (8pcs)", prices: createPrices(20500), cost: 9000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_crabstick_maki_8pcs_20.500-47b2b627-2c90-48e0-a430-68da0f9464e8" },
    { id: 43, name: "Salmon Tempura Maki (8pcs)", prices: createPrices(45500), cost: 20000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_salmon_tempura_maki_8pcs_45.500-75d31f9d-7f99-4d6f-9977-96a84c8a29a1" },
    { id: 44, name: "Californian Roll (8pcs)", prices: createPrices(40500), cost: 18000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_californian_roll_8pcs_40.500-353842c1-6b2c-486a-8b06-fc20489956d3" },
    { id: 45, name: "Avocado Roll (8pcs)", prices: createPrices(40500), cost: 18000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_avocado_roll_8pcs_40.500-117565c5-4422-4467-88eb-11c5fdf68f07" },
    { id: 46, name: "Salmon Cheese Roll (8pcs)", prices: createPrices(45500), cost: 21000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_salmon_cheese_roll_8pcs_45.500-0e19483c-628d-4235-86d3-2f2c8d249f32" },
    { id: 47, name: "Noba Sushi Platter (16pcs)", prices: createPrices(72725), cost: 32000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_noba_sushi_platter_16_pcs_72.725-39d10e05-24d4-4638-b4b1-e2211c4620f3" },
    { id: 48, name: "Ebi Tempura Maki (8pcs)", prices: createPrices(40500), cost: 18000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_ebi_tempura_maki_8pcs_40.500-a40051cf-4fa0-4299-a9a3-5c74291f08bd" },
    { id: 49, name: "Pandura Roll (8pcs)", prices: createPrices(30500), cost: 13000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pandura_roll_8pcs_30.500-188e6a17-38ae-4f93-b67f-2b5d0c754d58" },
    { id: 50, name: "Salmon Maki (8pcs)", prices: createPrices(42500), cost: 20000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_salmon_maki_8pcs_42.500-d861d8be-2495-46f9-aa8b-4b143bb0490b" },
    { id: 51, name: "Beef Floss Roll (8pcs)", prices: createPrices(20500), cost: 9000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_beef_floss_roll_8pcs_20.500-4d564bb7-320c-43f1-b99b-4dfa4428059e" },
    { id: 52, name: "Kani Mentai Crab Roll (8pcs)", prices: createPrices(30000), cost: 13500, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_kani_mentai_crab_roll_8pcs_30.000-85f2662c-6872-4e42-a56d-e0691e84d284" },
    { id: 53, name: "Beef Teriyaki Roll (8pcs)", prices: createPrices(35500), cost: 16000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_beef_teriyaki_roll_8pcs_35.500-b30a133d-c146-4074-9543-c0d60c41dafd" },
    { id: 54, name: "Chicken Teriyaki Roll (8pcs)", prices: createPrices(30500), cost: 13000, category: "Sushi", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_chicken_teriyaki_roll_8pcs_30.500-f9ab40c2-5954-46c5-afc7-5e6c38217036" },

    // Sushi Pemula
    { id: 55, name: "Sushi Rock n Roll (5pcs)", prices: createPrices(15000), cost: 6500, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_sushi_rock_n_roll_5pcs_15.000-3490b4fe-c172-4cf0-af5a-efc983d5a570" },
    { id: 56, name: "Kani Spicy Roll (5pcs)", prices: createPrices(15000), cost: 6500, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_kani_spicy_roll_5pcs_15.000-e7f1395b-017e-4122-83b5-f485741f2382" },
    { id: 57, name: "Crabstick Tempura (5pcs)", prices: createPrices(15000), cost: 6500, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_crabstick_tempura_15.000-b8d44c80-928d-44a7-961f-2f883d65b161" },
    { id: 58, name: "Beef Floss Roll (5pcs)", prices: createPrices(15000), cost: 7000, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_beef_floss_roll_5pcs_15.000-0e1045aa-7132-4757-aa50-71cd19c4d2d6" },
    { id: 59, name: "Crab Cheese Roll (5pcs)", prices: createPrices(15000), cost: 7000, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_crab_cheese_roll_5pcs_15.000-b30960d7-2f74-42b7-a3ed-286a012a970d" },
    { id: 60, name: "Chicken Floss Roll (5pcs)", prices: createPrices(15000), cost: 6500, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_chicken_floss_roll_5pcs_15.000-4b2e88a3-2fc9-4171-aa3b-55173167b5e4" },
    { id: 61, name: "Smoked Beef Roll (5pcs)", prices: createPrices(15000), cost: 7000, category: "Sushi Pemula", imageUrl: "https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/sushi_pemula_smoked_beef_roll_5pcs_15.000-0d35d911-c9fe-4467-a2f0-e46271c66708" },
];