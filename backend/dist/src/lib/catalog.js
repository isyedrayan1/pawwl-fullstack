import fs from "fs";
import path from "path";
import { uniqueSlug } from "./slug.js";
const supportedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const catBrandHints = [
    "bellota",
    "cuties catz",
    "kitty yums",
    "me-o",
    "mee-o",
    "matisse",
    "sheba",
    "temptation",
    "temptations",
    "whiskas",
    "let's bite active adult cat",
    "let's bite active kitten",
    "maxi cat",
];
const dogBrandHints = [
    "apro iq formula dog",
    "drools",
    "jer high",
    "orijen",
    "pedigree",
    "purepet dog",
    "smartheart",
    "tasty jerky",
];
const toPosixPath = (value) => value.split(path.sep).join("/");
export const parseCatalogCsv = (csvText) => {
    const rows = [];
    let currentRow = [];
    let currentCell = "";
    let inQuotes = false;
    for (let index = 0; index < csvText.length; index += 1) {
        const character = csvText[index];
        const nextCharacter = csvText[index + 1];
        if (character === '"') {
            if (inQuotes && nextCharacter === '"') {
                currentCell += '"';
                index += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (character === "," && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = "";
            continue;
        }
        if ((character === "\n" || character === "\r") && !inQuotes) {
            if (character === "\r" && nextCharacter === "\n") {
                continue;
            }
            if (currentCell.length > 0 || currentRow.length > 0) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = "";
            continue;
        }
        currentCell += character;
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
    }
    return rows
        .slice(1)
        .map(([name, price]) => ({
        name: String(name ?? "").trim(),
        price: Number(String(price ?? "0").replace(/[^\d.]+/g, "")) || 0,
    }))
        .filter((row) => row.name.length > 0);
};
export const discoverCatalogImages = (productsRoot, catalogId) => {
    const catalogFolder = path.resolve(productsRoot, String(catalogId));
    if (!fs.existsSync(catalogFolder))
        return [];
    const discovered = [];
    const queue = [catalogFolder];
    while (queue.length > 0) {
        const currentFolder = queue.pop();
        const entries = fs.readdirSync(currentFolder, { withFileTypes: true });
        for (const entry of entries) {
            const absolutePath = path.resolve(currentFolder, entry.name);
            if (entry.isDirectory()) {
                queue.push(absolutePath);
                continue;
            }
            const extension = path.extname(entry.name).toLowerCase();
            if (!supportedImageExtensions.has(extension))
                continue;
            const relativePath = toPosixPath(path.relative(productsRoot, absolutePath));
            discovered.push(`/products/${relativePath}`);
        }
    }
    return discovered.sort((left, right) => left.localeCompare(right));
};
export const inferAnimalType = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("cat") || lowerName.includes("kitten") || lowerName.includes("maguro") || lowerName.includes("bonito") || catBrandHints.some((hint) => lowerName.includes(hint))) {
        return "Cat";
    }
    if (lowerName.includes("dog") || lowerName.includes("puppy") || lowerName.includes("biscrok") || lowerName.includes("dentastix") || lowerName.includes("tasty jerky") || dogBrandHints.some((hint) => lowerName.includes(hint))) {
        return "Dog";
    }
    return null;
};
export const inferCategory = (name) => {
    const lowerName = name.toLowerCase();
    if (/(bowl|collar|leash|bed|harness|crate|accessor|brush|comb)/i.test(lowerName))
        return "Accessories";
    if (/(cat litter|wonder white|lavender|lavendar|baby powder|hygiene|pad|wipes|sanit|soap)/i.test(lowerName))
        return "Litter & Hygiene";
    if (/(anti hairball|hairball|supplement)/i.test(lowerName))
        return "Supplements";
    if (/(toy|ball|mouse|feather|chaser|play)/i.test(lowerName))
        return "Toys";
    if (/(treat|jerky|sticks?|biscuit|biscrok|creamy|lickable|crunchy|snack|dentastix|panna cotta|slice)/i.test(lowerName))
        return "Treats";
    if (/(pouch|tin|gravy|jelly|canned|can |chunk in gravy|wet food|medley)/i.test(lowerName))
        return "Wet Food";
    return "Dry Food";
};
const brandAliases = [
    [/^apro\b/i, "APRO"],
    [/^bellott?a\b/i, "Bellotta"],
    [/^cream(y)? treat/i, "Creamy Treat"],
    [/^crunchy\s*&\s*tender/i, "Crunchy & Tender"],
    [/^cuties catz/i, "Cuties Catz"],
    [/^drools?\b/i, "Drools"],
    [/^fm\b/i, "First Meow"],
    [/^jm\b/i, "JM"],
    [/^jer\s*high/i, "JerHigh"],
    [/^jinny\b/i, "Jinny"],
    [/^kitty yums/i, "Kitty Yums"],
    [/^lick\s*&\s*lickable/i, "Lick & Lickable"],
    [/^let'?s bite/i, "Let's Bite"],
    [/^me\s*-\s*o|^me-?\s*o|^mee?-o/i, "Me-O"],
    [/^matisse/i, "Matisse"],
    [/^maxi cat/i, "Maxi Cat"],
    [/^n\s*&\s*d/i, "N&D"],
    [/^orijen/i, "Orijen"],
    [/^panna cotta/i, "Panna Cotta"],
    [/^pedigree/i, "Pedigree"],
    [/^purepet/i, "Purepet"],
    [/^sb\b/i, "Superbone"],
    [/^sheba/i, "Sheba"],
    [/^smart\s*heart/i, "SmartHeart"],
    [/^tasty jerky/i, "Tasty Jerky"],
    [/^temptations?\b/i, "Temptations"],
    [/^whiskas/i, "Whiskas"],
    [/^wonder white/i, "Wonder White"],
];
const extractBrand = (name) => {
    const match = brandAliases.find(([pattern]) => pattern.test(name));
    if (match)
        return match[1];
    return name.split(/\s+/).slice(0, 2).join(" ").replace(/[^\w&'-]+$/g, "");
};
const extractPackSize = (name) => {
    const match = name.match(/(?:^|[-\s])(\d+(?:\.\d+)?\s?(?:kg|g|gm|tubes?|sticks?|x\d+))/i);
    return match ? match[1].replace(/\s+/g, " ").trim() : "";
};
const inferLifeStage = (name, animalType) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("kitten"))
        return "kitten";
    if (lowerName.includes("puppy"))
        return "puppy";
    if (lowerName.includes("junior"))
        return animalType === "Dog" ? "puppy" : "kitten";
    if (lowerName.includes("adult"))
        return "adult";
    return animalType === "Cat" ? "cat" : animalType === "Dog" ? "dog" : "pet";
};
const inferFlavor = (name) => {
    const flavors = [
        "chicken",
        "liver",
        "tuna",
        "salmon",
        "mackerel",
        "ocean fish",
        "seafood",
        "white fish",
        "sardine",
        "bonito",
        "crab",
        "shrimp",
        "prawn",
        "duck",
        "vegetable",
        "egg",
        "milk",
        "rice",
        "pumpkin",
        "carrot",
        "spinach",
        "cranberry",
        "blueberry",
        "strawberry",
        "peanut butter",
        "olive oil",
        "lavender",
        "baby powder",
    ];
    const lowerName = name.toLowerCase();
    const found = flavors.filter((flavor) => lowerName.includes(flavor));
    return found.length ? found.map((flavor) => flavor.replace(/\b\w/g, (letter) => letter.toUpperCase())).join(", ") : "";
};
const formatLabel = (animalType) => {
    if (animalType === "Cat")
        return "cats";
    if (animalType === "Dog")
        return "dogs";
    return "pets";
};
const formatLifeStageLabel = (lifeStage, animalType) => {
    if (lifeStage === "kitten" || lifeStage === "puppy")
        return lifeStage;
    if (lifeStage === "adult")
        return animalType === "Cat" ? "adult cats" : animalType === "Dog" ? "adult dogs" : "adult pets";
    if (animalType === "Cat")
        return "cats";
    if (animalType === "Dog")
        return "dogs";
    return "pets";
};
const buildDescription = (item) => {
    const animalLabel = formatLabel(item.animalType);
    const stageLabel = formatLifeStageLabel(item.lifeStage, item.animalType);
    const packCopy = item.packSize ? ` in a ${item.packSize} pack` : "";
    const flavorCopy = item.flavor ? ` with ${item.flavor.toLowerCase()} profile` : "";
    if (item.category === "Dry Food") {
        return `${item.name} is a ${item.brand} dry food option for ${stageLabel}${packCopy}. It is suited for everyday feeding and gives your product page a clear, scannable summary of format, life stage, and flavour${flavorCopy}. Serve it as the main meal according to the pet's age, activity level, and the feeding guide on the pack.`;
    }
    if (item.category === "Wet Food") {
        return `${item.name} is a moist ${item.brand} food serving for ${stageLabel}${packCopy}. The gravy, jelly, pouch, tin, or canned format helps add aroma and mealtime moisture, making it useful as a complete meal where labelled or as a topper alongside dry food${flavorCopy}.`;
    }
    if (item.category === "Treats") {
        return `${item.name} is a ${item.brand} treat for ${animalLabel}${packCopy}. It is intended for reward moments, training, bonding, or meal-time variety rather than replacing a balanced daily diet${flavorCopy}. Keep treats controlled and match portions to the pet's size and routine.`;
    }
    if (item.category === "Supplements") {
        return `${item.name} is a ${item.brand} support product for ${animalLabel}${packCopy}. It is best positioned as targeted care support used alongside the pet's normal diet, with serving frequency guided by the label and your veterinarian where needed.`;
    }
    if (item.category === "Litter & Hygiene") {
        return `${item.name} is a ${item.brand} hygiene product${packCopy} for day-to-day pet care. It is built for practical home use, helping keep the pet area fresher, easier to clean, and more comfortable for both pets and caregivers.`;
    }
    if (item.category === "Toys") {
        return `${item.name} is a ${item.brand} enrichment product for ${animalLabel}${packCopy}. It supports play, stimulation, and bonding when used under supervision and matched to the pet's size and play style.`;
    }
    return `${item.name} is a ${item.brand} product for ${animalLabel}${packCopy}. It is catalogued for clear browsing by animal type, category, flavour, and product format so customers can quickly decide whether it fits their pet's routine.`;
};
const buildBenefits = (category, animalType, name) => {
    const lowerName = name.toLowerCase();
    const animalLabel = animalType === "Cat" ? "cat" : animalType === "Dog" ? "dog" : "pet";
    if (lowerName.includes("dentastix")) {
        return [
            "Daily dental chew format for adult dogs",
            "Designed to support chewing action and oral-care routines",
            "Easy size-led selection for small, medium, or large dogs",
        ];
    }
    if (category === "Dry Food") {
        return [
            `Everyday dry format for ${animalLabel} feeding routines`,
            "Convenient kibble storage and portion control",
            "Supports consistent meal planning when served by label guidance",
        ];
    }
    if (category === "Wet Food") {
        return [
            "Moist texture helps add aroma and mealtime hydration",
            "Useful as a complete serving where labelled or as a dry-food topper",
            "Single-serve style supports freshness and easy portioning",
        ];
    }
    if (category === "Treats") {
        return [
            "Reward-friendly format for training and bonding",
            "Adds variety without changing the main diet",
            "Easy to portion as an occasional snack",
        ];
    }
    if (category === "Supplements") {
        return [
            "Targeted support for a specific care need",
            "Can be paired with the pet's regular diet",
            "Simple catalogue identification by pack size and use case",
        ];
    }
    if (category === "Litter & Hygiene") {
        return [
            "Helps maintain a cleaner pet-care area",
            "Suitable for routine home hygiene management",
            "Simple pack-size selection for replenishment planning",
        ];
    }
    if (category === "Toys") {
        return [
            "Encourages supervised play and enrichment",
            "Supports bonding through interactive use",
            "Easy to match with pet size and play style",
        ];
    }
    return [
        "Clear product format for quick catalogue browsing",
        "Mapped to animal type and category for filtering",
        "Ready for product-page display and admin editing",
    ];
};
const buildIngredients = (params) => {
    const flavorCopy = params.flavor ? `Flavour/profile noted from product name: ${params.flavor}. ` : "";
    const packCopy = params.packSize ? `Pack size: ${params.packSize}. ` : "";
    if (params.category === "Litter & Hygiene") {
        return `${packCopy}Product type: pet litter or hygiene care. Confirm exact material, fragrance, and disposal instructions from the physical pack before publishing final label claims.`;
    }
    if (params.category === "Toys") {
        return `${packCopy}Product type: pet toy or enrichment item. Confirm exact material, size, and safety warnings from the physical pack before publishing final material claims.`;
    }
    return `${flavorCopy}${packCopy}Exact ingredient composition should be verified from the product label. Use this field as a components summary until label-level data is captured in admin.`;
};
const buildUsage = (category, animalType, name) => {
    const lowerName = name.toLowerCase();
    const animalLabel = formatLabel(animalType);
    if (lowerName.includes("dentastix")) {
        return "Feed as a daily oral-care treat according to the dog-size guidance on the pack. Provide clean drinking water and supervise chewing.";
    }
    if (category === "Dry Food") {
        return `Serve as part of the daily diet for ${animalLabel}. Transition gradually over several days, follow the feeding table on the pack, and keep fresh water available.`;
    }
    if (category === "Wet Food") {
        return `Serve at room temperature as a meal or topper for ${animalLabel}, following the pack's feeding guide. Refrigerate unused contents where the label requires it and use promptly.`;
    }
    if (category === "Treats") {
        return `Offer only as an occasional reward for ${animalLabel}. Treats should be limited within the daily calorie allowance, with fresh water available.`;
    }
    if (category === "Supplements") {
        return `Use alongside the regular diet according to the label directions. For pets with medical conditions, confirm suitability with a veterinarian before use.`;
    }
    if (category === "Litter & Hygiene") {
        return "Use as directed on the pack. Keep the area clean, remove soiled material regularly, and store the product in a cool, dry place.";
    }
    if (category === "Toys") {
        return "Use under supervision, inspect regularly for wear, and remove the product if it becomes damaged or too small for safe play.";
    }
    return "Use according to the product label and match the item to the pet's species, size, age, and daily care routine.";
};
export const enrichCatalogItem = (params) => {
    const brand = extractBrand(params.name);
    const packSize = extractPackSize(params.name);
    const lifeStage = inferLifeStage(params.name, params.animalType);
    const flavor = inferFlavor(params.name);
    const description = buildDescription({
        name: params.name,
        brand,
        category: params.category,
        animalType: params.animalType,
        packSize,
        lifeStage,
        flavor,
    });
    const benefits = buildBenefits(params.category, params.animalType, params.name);
    const ingredients = buildIngredients({
        category: params.category,
        animalType: params.animalType,
        flavor,
        packSize,
        name: params.name,
    });
    const usage = buildUsage(params.category, params.animalType, params.name);
    return {
        brand,
        description,
        benefits,
        ingredients,
        usage,
        seoTitle: `${params.name} | Pawwl`,
        seoDescription: description.slice(0, 155),
    };
};
export const buildCatalogBackup = (params) => {
    const csvText = fs.readFileSync(params.csvPath, "utf8");
    const rows = parseCatalogCsv(csvText);
    const items = rows.map((row, index) => {
        const catalogId = 1001 + index;
        const imagePaths = discoverCatalogImages(params.productsRoot, catalogId);
        const animalType = inferAnimalType(row.name);
        const category = inferCategory(row.name);
        const status = imagePaths.length > 0 ? "published" : "draft";
        const enrichment = enrichCatalogItem({
            name: row.name,
            category,
            animalType,
        });
        return {
            catalogId,
            name: row.name,
            slug: uniqueSlug(row.name, catalogId),
            price: row.price,
            animalType,
            category,
            status,
            stock: 0,
            imagePaths,
            ...enrichment,
            sourceFolder: `products/${catalogId}`,
            sourceRow: index + 1,
        };
    });
    const animalTypes = Array.from(new Set(items.map((item) => item.animalType).filter((value) => Boolean(value))));
    const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return {
        generatedAt: new Date().toISOString(),
        sourceCsv: toPosixPath(params.csvPath),
        sourceProductsRoot: toPosixPath(params.productsRoot),
        animalTypes,
        categories,
        items,
    };
};
