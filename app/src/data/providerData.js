export const PROVIDERS = [
  {
    id: "rajkumari-beauty",
    slug: "rajkumari-beauty",
    name: "Rajkumari Beauty & Aesthetics",
    title: "Master Hair & Skin Specialist",
    rating: "4.9",
    reviewCount: "120+",
    location: "Home Services • Bhubaneswar & Surrounding Areas",
    description: "Bespoke, high-end beauty and bridal care delivered to your doorstep.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    coverUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200",
    tags: ["Hair Care", "Facials & Skin", "Bridal Makeup", "Home Visit"],
    categories: ["Beauty", "Hair", "Skin", "Nails", "Makeup", "Wellness"],
    serviceCount: 30,
    storefrontRoute: "/storefront/rajkumari-beauty"
  }
];

export function getProviderBySlug(slug) {
  return PROVIDERS.find(p => p.slug === slug || p.id === slug) || PROVIDERS[0];
}

export const RAJKUMARI_PROVIDER_DATA = {
  provider: {
    id: "provider_001",
    displayName: "Rajkumari Beauty & Aesthetics",
    professionalTitle: "Master Hair & Skin Specialist",
    yearsOfExperience: "15+ Years Experience",
    locationTag: "Home Services • Bhubaneswar & Surrounding Areas",
    tagline: "Bespoke, high-end beauty and bridal care delivered to your doorstep.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    rating: "4.9",
    reviewCount: "120+",
    whatsappNumber: "919000000000"
  },
  serviceCategories: [
    {
      id: "hair-care",
      categoryName: "HAIR CARE & ADVANCED TREATMENTS",
      services: [
        {
          id: "s1",
          name: "Keratin Smoothing Treatment",
          description: "Deep conditioning, anti-frizz, and hair alignment using premium salon-grade formulas.",
          duration: "120 mins",
          inSalonPrice: 2200,
          homePrice: 2500,
          imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s2",
          name: "Custom Hair Spa & Blow Dry",
          description: "Nourishing scalp massage, steam treatment, and professional blow-dry styling.",
          duration: "60 mins",
          inSalonPrice: 1000,
          homePrice: 1200,
          imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s3",
          name: "Hair Cutting & Precision Styling",
          description: "Customized haircut according to face structure finished with blow-dry styling.",
          duration: "45 mins",
          inSalonPrice: 600,
          homePrice: 800,
          imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s4",
          name: "Hair Color & Global Balayage",
          description: "Global hair coloring, roots touchup, or multi-dimensional gloss highlights.",
          duration: "90 mins",
          inSalonPrice: 2800,
          homePrice: 3200,
          imageUrl: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s5",
          name: "Smoothing & Hair Rebonding",
          description: "Permanent sleek straight hair transformation with protein seal guard.",
          duration: "180 mins",
          inSalonPrice: 3500,
          homePrice: 4000,
          imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s6",
          name: "Botox & Bluetox Treatment",
          description: "Deep fiber reconstruction for damaged hair delivering extreme softness & mirror shine.",
          duration: "150 mins",
          inSalonPrice: 3800,
          homePrice: 4500,
          imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s7",
          name: "Nanoplastia Hair Treatment",
          description: "Formaldehyde-free vegan straight therapy infused with amino acids & essential oils.",
          duration: "150 mins",
          inSalonPrice: 4200,
          homePrice: 4800,
          imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s8",
          name: "Dandruff & Anti-Hairfall Therapy",
          description: "Targeted scalp detox peel and intensive anti-hairfall serum micro-infusion.",
          duration: "60 mins",
          inSalonPrice: 1400,
          homePrice: 1600,
          imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s9",
          name: "Hair Regrowth Scalp Treatment",
          description: "High-frequency stimulation & peptide therapy to activate dormant hair follicles.",
          duration: "75 mins",
          inSalonPrice: 1800,
          homePrice: 2200,
          imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400"
        }
      ]
    },
    {
      id: "skincare-facials",
      categoryName: "SKINCARE & ADVANCED FACIALS",
      services: [
        {
          id: "s10",
          name: "Custom Organic Glow Facial",
          description: "Hydrating herbal treatment tailored to your skin type for a radiant, refreshed complexion.",
          duration: "60 mins",
          inSalonPrice: 1500,
          homePrice: 1800,
          imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s11",
          name: "Deep Pore Cleanser & Clean Up",
          description: "Steam extraction, scrub exfoliation, and pore refining clay pack.",
          duration: "45 mins",
          inSalonPrice: 800,
          homePrice: 1000,
          imageUrl: "https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s12",
          name: "Hydrafacial & Oxygen Infusion",
          description: "Medical hydro-dermabrasion with pure hyaluronic acid infusion for instant glass skin.",
          duration: "75 mins",
          inSalonPrice: 2500,
          homePrice: 3000,
          imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s13",
          name: "Carbon Facial (Hollywood Glow)",
          description: "Liquid carbon laser treatment tightening skin pores and reducing hyperpigmentation.",
          duration: "60 mins",
          inSalonPrice: 2800,
          homePrice: 3200,
          imageUrl: "https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s14",
          name: "Micro Needling & Collagen Boost",
          description: "Dermal micro-channeling activating natural skin repair, reducing acne scars & fine lines.",
          duration: "75 mins",
          inSalonPrice: 3000,
          homePrice: 3500,
          imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s15",
          name: "Advanced Chemical Peel Treatment",
          description: "AHA/BHA botanical acid peel resurfacing skin texture and evening out skin tone.",
          duration: "45 mins",
          inSalonPrice: 1800,
          homePrice: 2200,
          imageUrl: "https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s16",
          name: "Anti-Aging & Sculpting Ritual",
          description: "Firming peptide therapy with micro-current facial lifting & Gua Sha sculpting.",
          duration: "75 mins",
          inSalonPrice: 2400,
          homePrice: 2800,
          imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s17",
          name: "Pimple & Active Acne Treatment",
          description: "Salicylic treatment neutralizing acne bacteria, calming inflammation & redness.",
          duration: "60 mins",
          inSalonPrice: 1400,
          homePrice: 1600,
          imageUrl: "https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s18",
          name: "Open Pore Tightening Treatment",
          description: "Cold therapy & pore minimizing mask tightening enlarged pores & controlling sebum.",
          duration: "50 mins",
          inSalonPrice: 1300,
          homePrice: 1500,
          imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
        }
      ]
    },
    {
      id: "body-manicure-pedicure",
      categoryName: "HANDS, FEET & BODY CARE",
      services: [
        {
          id: "s19",
          name: "Luxury Spa Pedicure",
          description: "Exfoliating foot soak, callus removal, scrub, massage, and nail care.",
          duration: "60 mins",
          inSalonPrice: 900,
          homePrice: 1100,
          imageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s20",
          name: "Signature Spa Manicure",
          description: "Nail shaping, cuticle therapy, hand scrub, and moisturizing hand massage.",
          duration: "45 mins",
          inSalonPrice: 700,
          homePrice: 900,
          imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s21",
          name: "Full Body Polish & Exfoliation",
          description: "Aromatic botanical scrub removing dead skin cells followed by deep body moisturization.",
          duration: "75 mins",
          inSalonPrice: 2200,
          homePrice: 2600,
          imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s22",
          name: "Full Body Bleach & De-Tan",
          description: "Gentle skin brightening bleach and tan removal pack for smooth even body tone.",
          duration: "60 mins",
          inSalonPrice: 1400,
          homePrice: 1700,
          imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s23",
          name: "Face Bleach & Instant Brightening",
          description: "Mild herbal face bleach lightning facial hair and boosting skin radiance.",
          duration: "30 mins",
          inSalonPrice: 400,
          homePrice: 500,
          imageUrl: "https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s24",
          name: "Relaxing Full Body Massage",
          description: "Therapeutic Swedish or aromatherapy oil massage relieving muscle stress & fatigue.",
          duration: "60 mins",
          inSalonPrice: 2000,
          homePrice: 2400,
          imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400"
        }
      ]
    },
    {
      id: "waxing-threading",
      categoryName: "WAXING, THREADING & PMU",
      services: [
        {
          id: "s25",
          name: "Full Body Waxing (Normal / RICA / Chocolate)",
          description: "Smooth hair removal using choice of Gentle Normal, Liposoluble RICA, or Chocolate wax.",
          duration: "60 mins",
          inSalonPrice: 1200,
          homePrice: 1500,
          imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s26",
          name: "Threading (Eyebrow, Upper Lip & Full Face)",
          description: "Precise organic cotton thread shaping for eyebrows and facial hair removal.",
          duration: "20 mins",
          inSalonPrice: 150,
          homePrice: 250,
          imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s27",
          name: "Permanent Eyebrow Microblading (PMU)",
          description: "Semi-permanent hair-stroke eyebrow shading for perfectly shaped brows lasting up to 2 years.",
          duration: "120 mins",
          inSalonPrice: 4500,
          homePrice: 5000,
          imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400"
        }
      ]
    },
    {
      id: "wedding-bridal-makeup",
      categoryName: "WEDDING & BRIDAL MAKEUP",
      services: [
        {
          id: "s28",
          name: "Luxury HD / Airbrush Bridal Makeup",
          description: "Complete bridal makeover including HD/Airbrush makeup, hair styling, saree/lehenga draping & false lashes.",
          duration: "180 mins",
          inSalonPrice: 8500,
          homePrice: 10000,
          imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s29",
          name: "Engagement & Reception Glam Makeup",
          description: "Long-lasting radiant makeup, elegant hair updo or curls, and outfit draping.",
          duration: "120 mins",
          inSalonPrice: 4500,
          homePrice: 5500,
          imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: "s30",
          name: "Pre-Bridal Beauty Glow Package",
          description: "Comprehensive multi-day skin prep: facial, body scrub, body bleach, waxing, pedicure & manicure.",
          duration: "240 mins",
          inSalonPrice: 6500,
          homePrice: 7500,
          imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400"
        }
      ]
    }
  ]
};
