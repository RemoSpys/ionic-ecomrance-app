export const productsSeed = [
  {
    id: 'cm028c-tactical-cyma',
    name: 'CM028C Tactical AK47 AEG',
    brand: 'CYMA',
    category: 'rifles',
    type: 'AEG rifle',
    price: 139.25,
    originalPrice: 159.99,
    stock: 22,
    image:
      'https://airsoftgo.ee/wp-content/uploads/2021/03/3d5401bda4d7c84ebe01493f191aae161055159f_1152191087_1.webp',
    description:
      'Tactical AK47-style AEG built from durable polymer and metal. Folding stock, RIS handguard and adjustable hop-up make it a solid all-round workhorse for both field and CQB games.',
    rating: 4.4,
    reviews: 37,
    features: [
      'AK47-style tactical AEG',
      'Polymer receiver with metal outer barrel and sights',
      'Folding stock for tight spaces and indoor games',
      '22 mm RIS rail for optics and foregrips',
      'V3 metal gearbox with adjustable hop-up',
      'Includes vertical foregrip, hi-cap magazine and sling'
    ],
    specifications: {
      platform: 'AK47 AEG',
      gearbox: 'V3 metal gearbox',
      muzzleVelocity: '≈120 m/s (0.20 g BB)',
      fireModes: 'Safe / Semi / Full-auto',
      magazineCapacity: '600 BB hi-cap',
      innerBarrelLength: '455 mm',
      length: '850–935 mm (stock extended)',
      weight: '3.3 kg'
    },
    createdAt: Date.now()
  },

  {
    id: 'sa-j20-flex-smg-black',
    name: 'SA-J20 FLEX™ SMG Black',
    brand: 'Specna Arms',
    category: 'smg',
    type: 'AEG SMG',
    price: 167.61,
    originalPrice: 189.99,
    stock: 8,
    image:
      'https://airsoftgo.ee/wp-content/uploads/2024/05/09374c5dd744993597a0708dbca1f33023548f40_SPE_01_039597_01.webp',
    description:
      'Compact PPK-20 inspired SMG replica from Specna Arms. Lightweight FLEX™ series construction with programmable ETU and quick spring change system – perfect for aggressive CQB playstyles.',
    rating: 4.6,
    reviews: 24,
    features: [
      'PPK-20 inspired compact SMG',
      'FLEX™ series reinforced polymer body with metal parts',
      'Side-folding, length-adjustable stock',
      'Optical ETU with programmable fire modes',
      'ESA2 quick spring change system',
      'Includes 2× mid-cap magazines'
    ],
    specifications: {
      platform: 'PPK-20 style SMG',
      gearbox: 'Programmable ETU AEG',
      fireModes: 'Safe / Semi / Burst / Full-auto (programmable)',
      hopUp: 'Adjustable',
      magazineType: 'Mid-cap (included x2)',
      stock: 'Folding, length-adjustable',
      recommendedBattery: '7.4V LiPo (T-plug / Deans)'
    },
    createdAt: Date.now()
  },

  {
    id: 'lwt-mk1-cqb-10-sport-grey',
    name: 'LWT MK-I CQB 10″ SPORT SE™ Grey',
    brand: 'Arcturus',
    category: 'rifles',
    type: 'AEG rifle',
    price: 170.2,
    originalPrice: 199.0,
    stock: 15,
    image:
      'https://airsoftgo.ee/wp-content/uploads/2025/06/556f1fb7c22f6fbefd41f8cd43854732fb868fd5_ACR_01_044926_01.webp',
    description:
      'Lightweight AR-style CQB rifle from Arcturus with SPORT SE™ optical ETU. Built for new and experienced players who want a reliable, responsive and modern AEG right out of the box.',
    rating: 4.8,
    reviews: 41,
    features: [
      '2024 SPORT SE™ nylon series model',
      'Hybrid V2 gearbox with optical trigger and MOSFET',
      'Quick-change spring system',
      'Progressive trigger and programmable fire modes',
      'M-LOK handguard with top rail',
      'Includes windowed 350-round AR magazine and accessories'
    ],
    specifications: {
      build: 'Polymer / Aluminum / Steel',
      gearbox: 'V2 Hybrid Optical Trigger w/ Quick Change Spring',
      gearRatio: '18:1',
      motor: '23T torque-up ferrite motor',
      magazine: '350 rd ARCTURUS AR MOD1 windowed hi-cap',
      overallLength: '729–811 mm',
      handguardLength: '255 mm (10")',
      innerBarrelLength: '280 mm (11")',
      weight: '≈2.1–2.25 kg',
      fireModes:
        'Safe / Semi / 2rd burst / 3rd burst / Binary / Full-auto (programmable)',
      battery: '7.4V or 11.1V Li-ion/LiPo (Deans, not included)'
    },
    createdAt: Date.now()
  },

  {
    id: 'sa-c17-core-black',
    name: 'SA-C17 CORE™ M4 Black',
    brand: 'Specna Arms',
    category: 'rifles',
    type: 'AEG rifle',
    price: 198.56,
    originalPrice: 219.99,
    stock: 5,
    image: 'https://airsoftgo.ee/wp-content/uploads/2022/03/1152219247_1-1.jpg',
    description:
      'M4-type airsoft rifle from the CORE™ line. Lightweight yet durable receiver with metal reinforcements, quick spring change and rotary hop-up make it a great base gun or first primary.',
    rating: 4.5,
    reviews: 29,
    features: [
      'M4-style AEG from Specna Arms CORE™ series',
      'Reinforced polymer receiver with metal parts',
      'Adjustable length stock',
      'ESA™ quick spring change system',
      'Rotary hop-up chamber for better consistency',
      'Includes hi-cap magazine and extra M90 spring'
    ],
    specifications: {
      platform: 'M4 / AR15 AEG',
      series: 'CORE™',
      gearbox: 'V2 w/ ESA™ quick spring change',
      hopUp: 'Rotary, adjustable',
      fireModes: 'Safe / Semi / Full-auto',
      magazine: 'Hi-cap (included)',
      stock: 'Adjustable length',
      powerSpring: 'Main spring + included M90 spare'
    },
    createdAt: Date.now()
  },

  {
    id: 'cm0330-combat-master-alpha-tt',
    name: 'CM0330 2011 Combat Master Alpha Full Auto GBB',
    brand: 'Taran Tactical',
    category: 'pistols',
    type: 'GBB pistol',
    price: 278.0,
    originalPrice: 299.0,
    stock: 3,
    image: 'https://airsoftgo.ee/wp-content/uploads/2025/01/122933060_1.jpg',
    description:
      'High-end 2011 style gas blowback pistol licensed by Taran Tactical. Full-metal construction, crisp trigger and selectable semi or full-auto fire make it a beast on the field.',
    rating: 4.9,
    reviews: 18,
    features: [
      'Official style Combat Master 2011 replica',
      'Full-metal slide and frame with polymer grip',
      'Semi and full-auto fire modes',
      'Strong blowback and snappy recoil',
      'Adjustable hop-up for precise tuning',
      'Aggressive slide cuts and serrations'
    ],
    specifications: {
      type: 'GBB (gas blowback) pistol',
      construction: 'Metal slide & frame, polymer grip',
      fireModes: 'Safe / Semi-auto / Full-auto',
      gas: 'Green gas recommended',
      hopUp: 'Adjustable',
      color: 'Black',
      idealRole: 'Sidearm or close-range primary for speedsoft'
    },
    createdAt: Date.now()
  },

  {
    id: 'p08-8inch-gold-we',
    name: 'P08 8" GBB Gold',
    brand: 'WE',
    category: 'pistols',
    type: 'GBB pistol',
    price: 262.55,
    originalPrice: 279.99,
    stock: 6,
    image: 'https://airsoftgo.ee/wp-content/uploads/2024/03/102292408_1-768x768.jpg',
    description:
      'Golden long-barrel P08 gas blowback pistol from WE. Heavy full-metal build, strong recoil and classic design for collectors and roleplayers who still want performance.',
    rating: 4.3,
    reviews: 12,
    features: [
      'Iconic P08 replica with 8" barrel in gold finish',
      'Full-metal construction with realistic weight',
      'Gas blowback with strong kick',
      'Adjustable hop-up',
      '15-round green-gas magazine included'
    ],
    specifications: {
      type: 'GBB (green gas) pistol',
      muzzleEnergy: '≈1.2 J',
      weight: '≈1 kg',
      magazineCapacity: '15 rounds',
      length: 'Long 8" barrel variant',
      color: 'Gold / black accents'
    },
    createdAt: Date.now()
  },

  {
    id: 'm1911-etched-full-metal-silver-we',
    name: 'M1911 Etched Full Metal GBB Silver',
    brand: 'WE',
    category: 'pistols',
    type: 'GBB pistol',
    price: 193.54,
    originalPrice: 209.99,
    stock: 9,
    image: 'https://airsoftgo.ee/wp-content/uploads/2021/12/18818.png',
    description:
      'Stylish full-metal M1911 gas pistol with engraved slide. Classic ergonomics, threaded barrel and realistic blowback make it an eye-catching but practical sidearm.',
    rating: 4.7,
    reviews: 21,
    features: [
      'Full-metal M1911 replica with detailed engravings',
      'Polymer grip panels for better traction',
      'Adjustable hop-up',
      'Functional safety',
      'Threaded outer barrel for tracers/suppressors',
      'Includes 15-round metal gas magazine'
    ],
    specifications: {
      type: 'GBB (green gas) pistol',
      muzzleEnergy: '≈1.0 J',
      length: '220 mm',
      weight: '770 g',
      innerBarrel: '115 mm',
      fireModes: 'Safe / Semi-auto'
    },
    createdAt: Date.now()
  },

  {
    id: 'mod-carrier-combo-vest-cad',
    name: 'Mod Carrier Combo Plate Carrier – CAD Camo',
    brand: 'Invader Gear',
    category: 'protection',
    type: 'Plate carrier',
    price: 166.76,
    originalPrice: 179.99,
    stock: 4,
    image: 'https://airsoftgo.ee/wp-content/uploads/2021/03/172685_1-1.png',
    description:
      'High-quality Mod Carrier Combo plate carrier from Invader Gear in Canadian CAD style camo. Packed with pouches and MOLLE space for serious loadouts.',
    rating: 4.8,
    reviews: 17,
    features: [
      'Plate carrier style tactical vest',
      'CAD digital camouflage similar to Baltic patterns',
      'MOLLE webbing on all sides',
      'Includes a full set of removable pouches',
      'Adjustable shoulder and waist straps',
      'Hydration compartment'
    ],
    specifications: {
      camoPattern: 'CAD digital',
      system: 'MOLLE compatible',
      includedPouches:
        'Double pistol mag pouch, grenade pouch, dump pouch, utility pouch, double rifle mag pouch, admin pouch, radio pouch, hydration pouch',
      size: 'Adjustable one-size (adult)',
      useCase: 'Airsoft, training'
    },
    createdAt: Date.now()
  },

  {
    id: 'ciras-maritime-vest-woodland-panther',
    name: 'CIRAS Maritime Vest – Woodland Panther',
    brand: 'GFT Tactical',
    category: 'protection',
    type: 'Plate carrier',
    price: 77.36,
    originalPrice: 89.99,
    stock: 14,
    image:
      'https://airsoftgo.ee/wp-content/uploads/2022/06/1152215278_2-768x768.jpg',
    description:
      'CIRAS style vest in Woodland Panther camo. Modular design with tons of included pouches and detachable plate slots.',
    rating: 4.2,
    reviews: 9,
    features: [
      'CIRAS-style maritime vest',
      'Woodland Panther camouflage',
      'Fully modular MOLLE setup',
      'Quick-release emergency system',
      'Multiple rifle & utility pouches'
    ],
    specifications: {
      camoPattern: 'Woodland Panther',
      system: 'CIRAS MOLLE',
      riflePouches: 'Triple M4 pouch, double M4 pouch',
      otherPouches: 'Radio, medic, ID panel, pistol mag pouches',
      plates: 'Accepts dummy plates',
      size: 'Adjustable one-size'
    },
    createdAt: Date.now()
  }
];
