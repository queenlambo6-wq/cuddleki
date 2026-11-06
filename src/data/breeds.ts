export interface BreedGuide {
  id: string;
  name: string;
  tagline: string;
  origin: string;
  temperament: string;
  size: string;
  coatCare: string;
  hypoallergenicRating: string;
  lifeExpectancy: string;
  description: string;
  idealFor: string[];
  bannerImage: string;
  highlights: string[];
}

export const BREEDS_GUIDE: BreedGuide[] = [
  {
    id: "ragdoll",
    name: "Ragdoll",
    tagline: "The Living Plush Teddy Bear",
    origin: "California, USA",
    temperament: "Docile, gentle, deeply affectionate, floppy when held",
    size: "Large (10 – 20 lbs)",
    coatCare: "Medium maintenance: 2-3 brushings per week (low matting)",
    hypoallergenicRating: "Standard (low undercoat, minimal dander shedding)",
    lifeExpectancy: "14 – 18 years",
    description: "Ragdolls are famous worldwide for their captivating sapphire blue eyes, silky rabbit-soft semi-long coat, and their endearing tendency to go completely limp and relaxed in loving arms. They thrive in homes where they receive abundant companionship and follow their humans faithfully from room to room.",
    idealFor: ["Families with young children", "First-time cat parents", "Homes with friendly dogs", "Adopters seeking a true lap snuggler"],
    bannerImage: "/img/gatitos/norman.jpg",
    highlights: ["Mellow & exceptionally patient", "Captivating blue eyes", "Loves being cradled like an infant", "Chirpy, soft purring voice"]
  },
  {
    id: "maine-coon",
    name: "Maine Coon",
    tagline: "The Gentle Giant with a Songbird Heart",
    origin: "Maine, USA",
    temperament: "Affectionate, dog-like, intelligent, playful",
    size: "Extra Large (13 – 25 lbs)",
    coatCare: "Moderate: 2-3 weekly brushings with comb for dense ruff",
    hypoallergenicRating: "Standard (heavy double coat)",
    lifeExpectancy: "13 – 16 years",
    description: "The native longhair of North America, Maine Coons combine rugged outdoor majesty with one of the sweet, most sociable dispositions in the cat kingdom. Known as gentle giants, they love water play, fetching small toys, and conversing in delightful melodic chirps rather than loud meows.",
    idealFor: ["Active households", "Multi-pet homes", "People who love large majestic cats", "Adopters seeking an interactive buddy"],
    bannerImage: "/img/gatitos/lion.jpg",
    highlights: ["Dramatic lynx-tipped ears & bushy tail", "Melodic trills & chirps", "Water-friendly & playful nature", "Devoted family loyalty"]
  },
  {
    id: "bengal",
    name: "Bengal",
    tagline: "A Living Miniature Leopard in Your Living Room",
    origin: "United States (Asian Leopard Cat hybrid ancestry)",
    temperament: "Dynamic, athletic, inquisitive, hyper-intelligent",
    size: "Medium to Large (9 – 16 lbs)",
    coatCare: "Minimal: Quick weekly rub down (pelt-like pelt with glitter effect)",
    hypoallergenicRating: "Excellent (low grooming shedding, pelt-like hair)",
    lifeExpectancy: "13 – 17 years",
    description: "Bengals boast wild rosetted coats that glitter in natural light, reminiscent of wild big cats, yet carry sweet domesticated temperaments. They love vertical climbing spaces, playing in shallow sinks, learning tricks via clicker training, and curling tightly around your neck once their playtime is through.",
    idealFor: ["Engaged pet owners who enjoy play sessions", "Homes with cat trees and cat wheels", "Allergy-conscious individuals", "Dog lovers looking for an energetic cat"],
    bannerImage: "/img/gatitos/bear.jpg",
    highlights: ["Exotic rosetted or marbled coat", "Hypoallergenic pelt that sheds very little", "Enjoys learning fetch & leash walking", "Fascinated by moving water"]
  },
  {
    id: "british-shorthair",
    name: "British Shorthair",
    tagline: "The Dignified Teddy Bear of Serenity",
    origin: "Great Britain",
    temperament: "Calm, steadfast, easygoing, quiet companion",
    size: "Medium to Large (9 – 18 lbs)",
    coatCare: "Low: Once or twice a week brushing keeps dense coat plush",
    hypoallergenicRating: "Moderate (dense coat, standard dander)",
    lifeExpectancy: "14 – 19 years",
    description: "With their delightfully round faces, chubby cheeks, big copper-gold eyes, and compact muscular build, British Shorthairs resemble real-life teddy bears. They are undemanding, quiet, and content to lounge nearby while you work, radiating tranquil good cheer throughout the home.",
    idealFor: ["Busy professionals & remote workers", "Apartment living", "Quiet or calm households", "Families wanting a polite, dignified pet"],
    bannerImage: "/img/gatitos/teddy.jpg",
    highlights: ["Plush, dense 'crisp' coat texture", "Chubby cheeks & sweet smile", "Extremely peaceful demeanor", "Rarely meows; very polite"]
  },
  {
    id: "siberian",
    name: "Siberian Forest Cat",
    tagline: "Ancient Hypoallergenic Russian Treasure",
    origin: "Siberia, Russia",
    temperament: "Brave, loving, acrobatic, deeply human-oriented",
    size: "Large (11 – 20 lbs)",
    coatCare: "Moderate: 2 brushings weekly, seasonal molt support",
    hypoallergenicRating: "Outstanding (scientifically proven lowest Fel d 1 levels)",
    lifeExpectancy: "15 – 20 years",
    description: "Centuries old from the Russian taiga, Siberians have a weather-resistant triple coat that feels like luxury cashmere. What makes them truly special is their natural genetic mutation causing significantly reduced levels of the Fel d 1 protein in saliva and sebum, making them the #1 choice for allergic cat enthusiasts.",
    idealFor: ["Cat lovers with allergies", "Families with children and dogs", "Adopters who love big fluffy forest cats", "Playful, interactive homes"],
    bannerImage: "/img/gatitos/jackie.jpg",
    highlights: ["Naturally hypoallergenic for many allergy sufferers", "Triple-dense water-repellent coat", "Remarkable acrobatic jumpers", "Warm, dog-like greeting behavior"]
  },
  {
    id: "persian",
    name: "Persian",
    tagline: "The Epitome of Feline Elegance & Sweetness",
    origin: "Persia (modern-day Iran)",
    temperament: "Serene, sweet-natured, quiet, lap-loving",
    size: "Medium (7 – 12 lbs)",
    coatCare: "High: Daily gentle combing to keep long coat tangle-free",
    hypoallergenicRating: "Standard (requires regular coat care)",
    lifeExpectancy: "13 – 17 years",
    description: "Persians are the aristocrats of the cat world, blessed with pansy-like expressive faces, huge expressive eyes, and long flowing coats like spun silk. They prefer serene, predictable indoor environments and repay your gentle brushings with unconditional, quiet adoration.",
    idealFor: ["Adopters who enjoy grooming rituals", "Calm and peaceful households", "Quiet indoor sanctuaries", "True lap-cat lovers"],
    bannerImage: "/img/gatitos/tiago.jpg",
    highlights: ["Flowing glamour coat", "Sweet, quiet, melodious voice", "Ultimate indoor cuddler", "Unmatched gentle facial expression"]
  },
  {
    id: "sphynx",
    name: "Sphynx",
    tagline: "A Heart-Warming Living Hot Water Bottle",
    origin: "Toronto, Canada",
    temperament: "Extroverted, clownish, acrobatic, velcro-affectionate",
    size: "Medium (6 – 12 lbs)",
    coatCare: "Unique: Weekly warm sponge bath and ear care (no brushing!)",
    hypoallergenicRating: "Very good (no fur to trap floating dander or hair)",
    lifeExpectancy: "13 – 17 years",
    description: "Sphynx cats are celebrated for their suede-soft skin, oversized bat ears, lemon-shaped eyes, and exuberant, affectionate personalities. With a body temperature roughly 4 degrees warmer to the touch than furred cats, they love cuddling under blankets, wearing cute sweaters, and riding on your shoulders.",
    idealFor: ["Adopters who want constant physical contact", "Households without shedding tolerance", "Energetic, loving owners", "Sweater & cat-fashion fans"],
    bannerImage: "/img/gatitos/oscar.jpg",
    highlights: ["Velvety warm skin", "No fur shedding on furniture or clothes", "Playful, monkey-like acrobatic antics", "Sleeps right under the duvet with you"]
  },
  {
    id: "azul-ruso",
    name: "Russian Blue",
    tagline: "The Shimmering Silver-Blue Poet",
    origin: "Arkhangelsk, Russia",
    temperament: "Loyal, observant, intelligent, clean & graceful",
    size: "Medium (7 – 12 lbs)",
    coatCare: "Low: Minimal grooming; plush double coat naturally resists dirt",
    hypoallergenicRating: "High (produces less Fel d 1, minimal shedding)",
    lifeExpectancy: "15 – 20 years",
    description: "Russian Blues are renowned for their shimmering silvery coat that reflects light like liquid steel, paired with vivid emerald-green eyes and a perpetual enigmatic smile. They are polite, quiet, sensitive to routine, and form an intense, lifelong bond with their favorite family members.",
    idealFor: ["Calm homes and singles/couples", "Adopters with mild cat allergies", "Cleanliness-focused households", "Owners who appreciate subtle, refined loyalty"],
    bannerImage: "/img/gatitos/grace.jpg",
    highlights: ["Silver-tipped plush double coat", "Striking emerald green eyes", "Low dander and hypoallergenic properties", "Gentle, whisper-soft personality"]
  },
  {
    id: "siames",
    name: "Siamese",
    tagline: "The Blue-Eyed Chatterbox & Devoted Soulmate",
    origin: "Thailand (formerly Siam)",
    temperament: "Vocal, intelligent, social, deeply bonded",
    size: "Medium & Slender (6 – 12 lbs)",
    coatCare: "Very Low: Short fine coat requires almost zero grooming",
    hypoallergenicRating: "Moderate (short hair with low grooming shedding)",
    lifeExpectancy: "15 – 20 years",
    description: "Siamese cats are famously expressive, communicative, and passionate about being involved in everything you do. With their sleek color-point coats and almond-shaped sapphire eyes, they don't just purr—they hold deep, heartfelt conversations with you every single day.",
    idealFor: ["People who love conversational, social pets", "Adopters who spend substantial time at home", "Families who want an energetic playmate", "Multi-pet households with active cats or dogs"],
    bannerImage: "/img/gatitos/leo.jpg",
    highlights: ["Legendary conversationalist vocal skills", "Stunning contrast color points", "Sapphire blue almond eyes", "Dog-like attachment to their human"]
  }
];
