const axios = require("axios");
const mongoose = require("mongoose");
const GardeningInput = require("../models/GardeningInput");

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

const openRouterHeaders = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
};

if (process.env.OPENROUTER_SITE_URL) {
  openRouterHeaders["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
}

if (process.env.OPENROUTER_APP_NAME) {
  openRouterHeaders["X-Title"] = process.env.OPENROUTER_APP_NAME;
}

const fallbackCropCatalog = [
  {
    name: "Spinach",
    climates: ["cool", "moderate"],
    soils: ["loamy", "sandy", "alluvial"],
    water: ["low", "moderate"],
    sunlight: ["4", "6", "8"],
    spaces: ["balcony", "terrace", "backyard", "windowsill"],
    budget: ["low", "medium"],
    description: "Fast-growing leafy vegetable ideal for containers and raised beds.",
    steps: [
      "Use a pot with drainage holes and nutrient-rich soil.",
      "Sow seeds 1 cm deep and keep soil lightly moist.",
      "Place where it gets morning sun or partial shade.",
      "Thin seedlings after sprouting for healthy growth.",
      "Harvest leaves in 30-40 days for continuous yield.",
    ],
  },
  {
    name: "Tomato",
    climates: ["hot", "moderate"],
    soils: ["loamy", "alluvial"],
    water: ["moderate", "high"],
    sunlight: ["6", "8", "10"],
    spaces: ["balcony", "terrace", "backyard"],
    budget: ["medium", "high"],
    description: "A productive warm-season crop perfect for terrace or balcony grow bags.",
    steps: [
      "Start with healthy seedlings in large containers.",
      "Add compost-rich soil and a support stake.",
      "Keep in full sun for at least 6 hours daily.",
      "Water deeply when topsoil feels dry.",
      "Feed every 2 weeks and prune side shoots lightly.",
    ],
  },
  {
    name: "Chili",
    climates: ["hot", "moderate"],
    soils: ["loamy", "sandy", "alluvial"],
    water: ["low", "moderate"],
    sunlight: ["6", "8", "10"],
    spaces: ["balcony", "terrace", "backyard"],
    budget: ["low", "medium"],
    description: "Compact and high-yielding crop suitable for small urban spaces.",
    steps: [
      "Use 10-12 inch pots with well-drained soil.",
      "Transplant seedlings carefully and mulch surface.",
      "Provide full sun and good airflow.",
      "Water regularly but avoid waterlogging.",
      "Harvest mature chilies every few days.",
    ],
  },
  {
    name: "Lettuce",
    climates: ["cool", "moderate"],
    soils: ["loamy", "sandy"],
    water: ["moderate", "high"],
    sunlight: ["4", "6"],
    spaces: ["balcony", "terrace", "windowsill"],
    budget: ["low", "medium"],
    description: "Quick and easy salad crop for cooler or partially shaded areas.",
    steps: [
      "Fill shallow trays with fine, fertile soil.",
      "Broadcast seeds lightly and cover with thin soil layer.",
      "Keep soil evenly moist and cool.",
      "Give partial sun, especially in warm afternoons.",
      "Harvest outer leaves as needed for repeat growth.",
    ],
  },
  {
    name: "Mint",
    climates: ["hot", "moderate", "cool"],
    soils: ["loamy", "alluvial"],
    water: ["moderate", "high"],
    sunlight: ["4", "6"],
    spaces: ["balcony", "terrace", "windowsill", "backyard"],
    budget: ["low"],
    description: "Low-maintenance herb that grows rapidly in pots.",
    steps: [
      "Plant cuttings in moist, compost-rich potting mix.",
      "Keep in bright area with partial sunlight.",
      "Water frequently to keep soil damp.",
      "Pinch tips regularly to promote bushy growth.",
      "Harvest fresh leaves weekly once established.",
    ],
  },
  {
    name: "Coriander",
    climates: ["cool", "moderate"],
    soils: ["loamy", "sandy", "alluvial"],
    water: ["low", "moderate"],
    sunlight: ["4", "6"],
    spaces: ["balcony", "terrace", "windowsill", "backyard"],
    budget: ["low"],
    description: "A fast kitchen herb suitable for seasonal container gardening.",
    steps: [
      "Crush seeds lightly before sowing for faster germination.",
      "Use wide containers with loose soil.",
      "Keep in 4-6 hours of sunlight.",
      "Water lightly and avoid overwatering.",
      "Harvest leaves in 25-35 days.",
    ],
  },
  {
    name: "Radish",
    climates: ["cool", "moderate"],
    soils: ["sandy", "loamy"],
    water: ["moderate"],
    sunlight: ["4", "6", "8"],
    spaces: ["balcony", "terrace", "backyard"],
    budget: ["low", "medium"],
    description: "Short-duration root crop that performs well in grow bags.",
    steps: [
      "Sow seeds directly in deep loose soil.",
      "Maintain spacing for proper root formation.",
      "Ensure regular moisture and direct sunlight.",
      "Thin seedlings if overcrowded.",
      "Harvest in 25-40 days depending on variety.",
    ],
  },
  {
    name: "Fenugreek",
    climates: ["cool", "moderate"],
    soils: ["loamy", "alluvial", "sandy"],
    water: ["low", "moderate"],
    sunlight: ["4", "6"],
    spaces: ["balcony", "terrace", "windowsill"],
    budget: ["low"],
    description: "Nutritious leafy crop that grows quickly in small containers.",
    steps: [
      "Soak seeds overnight and sow densely in trays.",
      "Use fertile soil and keep lightly moist.",
      "Provide 4-6 hours of sunlight.",
      "Trim leaves once plants are 10-15 cm tall.",
      "Resow every two weeks for continuous supply.",
    ],
  },
];

const WIKIMEDIA_COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

const cropQueryAliases = {
  peas: "pea",
  radishes: "radish",
  chilis: "chili",
  chillies: "chili",
  cilantro: "coriander",
  methi: "fenugreek",
};

const cropImageCache = new Map();

const normalizeCropName = (cropName) =>
  String(cropName || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getImageUrlFromCommons = async (searchQuery) => {
  const response = await axios.get(WIKIMEDIA_COMMONS_API, {
    params: {
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: searchQuery,
      gsrnamespace: 6,
      gsrlimit: 8,
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: 1200,
      origin: "*",
    },
    timeout: 10000,
  });

  const pages = Object.values(response?.data?.query?.pages || {});
  const firstWithImage = pages.find((page) => Array.isArray(page?.imageinfo) && page.imageinfo[0]);

  return firstWithImage?.imageinfo?.[0]?.thumburl || firstWithImage?.imageinfo?.[0]?.url || null;
};

const getImageUrlFromWikipedia = async (cropTitle) => {
  const response = await axios.get(WIKIPEDIA_API, {
    params: {
      action: "query",
      format: "json",
      redirects: 1,
      prop: "pageimages",
      piprop: "thumbnail",
      pithumbsize: 1200,
      titles: cropTitle,
      origin: "*",
    },
    timeout: 10000,
  });

  const pages = Object.values(response?.data?.query?.pages || {});
  const firstWithThumb = pages.find((page) => page?.thumbnail?.source);

  return firstWithThumb?.thumbnail?.source || null;
};

const resolveCropImage = async (cropName) => {
  const normalized = normalizeCropName(cropName);
  if (!normalized) {
    return null;
  }

  if (cropImageCache.has(normalized)) {
    return cropImageCache.get(normalized);
  }

  const words = normalized.split(" ").filter(Boolean);
  const baseWord = words[0] || normalized;
  const alias = cropQueryAliases[baseWord] || baseWord;
  const titleCaseAlias = alias.charAt(0).toUpperCase() + alias.slice(1);

  const queries = [
    `${alias} plant`,
    `${alias} vegetable`,
    alias,
  ];

  let imageUrl = null;

  try {
    imageUrl = await getImageUrlFromWikipedia(titleCaseAlias);
  } catch (error) {
    imageUrl = null;
  }

  if (!imageUrl) {
    for (const query of queries) {
      try {
        imageUrl = await getImageUrlFromCommons(query);
        if (imageUrl) {
          break;
        }
      } catch (error) {
        imageUrl = null;
      }
    }
  }

  cropImageCache.set(normalized, imageUrl);
  return imageUrl;
};

const pickFallbackCrops = ({ climate, soil, waterAvailability, spaceType, sunlightHours, budget }) => {
  const normalized = {
    climate: String(climate || "").toLowerCase(),
    soil: String(soil || "").toLowerCase(),
    water: String(waterAvailability || "").toLowerCase(),
    space: String(spaceType || "").toLowerCase(),
    sunlight: String(sunlightHours || ""),
    budget: String(budget || "").toLowerCase(),
  };

  const scored = fallbackCropCatalog.map((crop) => {
    let score = 0;
    if (crop.climates.includes(normalized.climate)) score += 2;
    if (crop.soils.includes(normalized.soil)) score += 2;
    if (crop.water.includes(normalized.water)) score += 1;
    if (crop.spaces.includes(normalized.space)) score += 1;
    if (crop.sunlight.includes(normalized.sunlight)) score += 1;
    if (crop.budget.includes(normalized.budget)) score += 1;

    return { ...crop, score };
  });

  const best = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((crop) => ({
      name: crop.name,
      description: crop.description,
      steps: crop.steps,
    }));

  return best;
};

const parseCropsFromAI = (content) => {
  const cleaned = String(content || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid AI response format");
  }

  return parsed.map((crop) => ({
    name: crop?.name || "Crop",
    description: crop?.description || "Suitable crop for your conditions.",
    steps: Array.isArray(crop?.steps) ? crop.steps.slice(0, 5) : [],
  }));
};

exports.generateCrops = async (req, res) => {
  try {
    const {
      climate,
      temperature,
      soil,
      budget,
      waterAvailability,
      spaceType,
      sunlightHours,
    } = req.body;

    const userId = req.header("x-user-id");

    // Save user input only when userId is a valid ObjectId.
    if (mongoose.Types.ObjectId.isValid(userId)) {
      await GardeningInput.create({
        userId,
        climate,
        temperature,
        soil,
        budget,
        waterAvailability,
        spaceType,
        sunlightHours,
      });
    }

    const prompt = `
Return ONLY valid JSON.
Suggest 4 crops suitable for:
Climate: ${climate}
Temperature: ${temperature}°C
Soil: ${soil}
Budget: ₹${budget}
Water Availability: ${waterAvailability}
Space: ${spaceType}
Sunlight: ${sunlightHours} hours

Format:
[
 {
   "name": "",
   "description": "",
   "steps": ["", "", "", "", ""]
 }
]
`;

    let crops;

    if (OPENROUTER_API_KEY) {
      try {
        const aiResponse = await axios.post(
          `${OPENROUTER_BASE_URL}/chat/completions`,
          {
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
          },
          {
            headers: openRouterHeaders,
            timeout: 25000,
          }
        );

        crops = parseCropsFromAI(aiResponse.data?.choices?.[0]?.message?.content);
      } catch (providerError) {
        crops = pickFallbackCrops({
          climate,
          soil,
          waterAvailability,
          spaceType,
          sunlightHours,
          budget,
        });
      }
    } else {
      crops = pickFallbackCrops({
        climate,
        soil,
        waterAvailability,
        spaceType,
        sunlightHours,
        budget,
      });
    }

    const cropsWithImages = await Promise.all(
      crops.map(async (crop) => {
        const liveImage = await resolveCropImage(crop.name);

        return {
          ...crop,
          image: liveImage || crop.image || null,
        };
      })
    );

    res.json({ crops: cropsWithImages });

  } catch (error) {
    const isTimeout = error?.code === "ECONNABORTED";
    const providerMessage = error?.response?.data?.error?.message || error?.message;

    res.status(500).json({
      error: isTimeout
        ? "AI service timed out. Please try again."
        : providerMessage || "Crop generation failed",
    });
  }
};