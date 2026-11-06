export interface Review {
  id: string;
  adopterName: string;
  location: string;
  catName: string;
  breed: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatarChar: string;
}

export const REVIEWS_DATA: Review[] = [
  {
    id: "rev-1",
    adopterName: "Emily & David Carter",
    location: "Austin, Texas",
    catName: "Norman (Ragdoll)",
    breed: "ragdoll",
    rating: 5,
    date: "2 weeks ago",
    title: "Norman has completely stolen our hearts!",
    comment: "Adopting through Crush & Cuddles was the smoothest, most reassuring pet adoption experience of our lives. Norman arrived healthy, litter-trained, and literally began purring on my lap within ten minutes of entering our living room. The health dossier and starter kit were incredible!",
    verified: true,
    avatarChar: "E"
  },
  {
    id: "rev-2",
    adopterName: "Marcus Sterling",
    location: "Denver, Colorado",
    catName: "Bear (Bengal)",
    breed: "bengali",
    rating: 5,
    date: "1 month ago",
    title: "Incredible energy, health, and intelligence",
    comment: "I was looking for a confident, energetic companion to hike on a harness with me. Bear is everything I dreamed of! His coat glitters like spun copper, he plays fetch endlessly, and he sleeps right on my shoulder every night. Crush & Cuddles genuinely cares about matching the right cat to your lifestyle.",
    verified: true,
    avatarChar: "M"
  },
  {
    id: "rev-3",
    adopterName: "Sophia Rodriguez",
    location: "Seattle, Washington",
    catName: "Jackie (Siberian)",
    breed: "siberiano",
    rating: 5,
    date: "3 weeks ago",
    title: "Zero allergies for my husband! A true miracle",
    comment: "My husband is notoriously allergic to cats, but we fell in love with Siberians. After speaking with the Crush & Cuddles feline health team and reviewing their genetic and coat testing, we adopted Jackie. My husband hasn't sneezed once! She is the sweetest, fluffiest cuddle companion.",
    verified: true,
    avatarChar: "S"
  },
  {
    id: "rev-4",
    adopterName: "Dr. James Henderson",
    location: "Boston, Massachusetts",
    catName: "Teddy (British Shorthair)",
    breed: "british-shorthair",
    rating: 5,
    date: "1 month ago",
    title: "The calmest, most dignified boy in the world",
    comment: "Teddy has brought so much serenity into my quiet home office. He sits peacefully next to my monitor during telehealth consultations and purrs like a soft engine. The veterinary documents, microchip registration, and 1-year warranty provided immense peace of mind.",
    verified: true,
    avatarChar: "J"
  },
  {
    id: "rev-5",
    adopterName: "Hannah & Liam Bennett",
    location: "San Diego, California",
    catName: "Oscar (Sphynx)",
    breed: "sphynx",
    rating: 5,
    date: "2 months ago",
    title: "A living hot water bottle full of love",
    comment: "Oscar is our little alien prince! He is the warmest, most affectionate little guy we've ever met. He loves his hand-knit sweaters and sleeps under the sheets like a human baby. Thank you Crush & Cuddles for socializing him so beautifully!",
    verified: true,
    avatarChar: "H"
  },
  {
    id: "rev-6",
    adopterName: "Chloe Davenport",
    location: "Chicago, Illinois",
    catName: "Lion (Maine Coon)",
    breed: "maine-coon",
    rating: 5,
    date: "3 months ago",
    title: "A true gentle giant with the sweetest chirp",
    comment: "Lion is now 5 months old and already majestic! Despite his impressive paws and lion-like mane, his demeanor is so tender with our golden retriever. They nap together every single afternoon in the bay window. 10/10 recommendation!",
    verified: true,
    avatarChar: "C"
  }
];

export interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQ[] = [
  {
    category: "Adoption Process",
    question: "What is included in the Crush & Cuddles adoption package?",
    answer: "Every kitten and cat adopted through Crush & Cuddles includes: complete core vaccinations (FVRCP + Rabies), multiple preventative deworming treatments, ISO-standard microchip with lifetime free registration, FeLV/FIV blood panel testing (negative certified), 1-Year Congenital & Genetic Written Health Warranty, 30 days of complimentary pet medical insurance, starter nutrition pack (Royal Canin / Hill's), familiar scent blanket, favorite toys, and lifetime behavior guidance from our team."
  },
  {
    category: "Health & Guarantee",
    question: "How does the 1-Year Genetic Health Warranty work?",
    answer: "We stand behind the robust health of our cats with an ironclad written 1-Year Congenital & Genetic Health Guarantee. If your licensed veterinarian diagnoses any life-threatening hereditary disorder within the first 12 months, we provide full support, medical coverage reimbursement, or a healthy replacement companion. All parent cats undergo rigorous DNA genetic panels (including HCM, PKD, SMA, and PRA)."
  },
  {
    category: "Adoption Process",
    question: "How do I apply to adopt a kitten?",
    answer: "Step 1: Browse our available adoptable cats and click 'Apply to Adopt' on your favorite's profile. Step 2: Complete our 3-minute online lifestyle application. Step 3: Our adoption coordinator schedules a friendly 15-minute virtual video call or in-person visit so you can see your kitten playing in real-time. Step 4: Once approved, reserve your kitten and schedule home delivery or sanctuary pickup!"
  },
  {
    category: "Transportation",
    question: "Do you offer safe nationwide transportation or delivery?",
    answer: "Yes! We offer three convenient adoption collection options: (1) In-person pickup at our adoption sanctuary, (2) White-glove in-cabin Pet Courier Flight Nanny delivery directly into your hands at your nearest airport, and (3) Climate-controlled direct ground courier delivery to your front doorstep. We never cargo-ship unattended animals."
  },
  {
    category: "Allergies",
    question: "Which cat breeds are best for allergy sufferers?",
    answer: "Our Siberian Forest Cats are naturally hypoallergenic because they genetically produce markedly lower quantities of the Fel d 1 protein in their saliva and dander. Our Bengals and Russian Blues also produce significantly less dander and have unique tight pelts with minimal shedding. We are happy to provide fur allergen swatch tests before adoption!"
  },
  {
    category: "Care & Transition",
    question: "What should I prepare for my kitten's first 48 hours at home?",
    answer: "Set up a quiet 'sanctuary room' (like a cozy spare bedroom or bathroom) with their litter box, food and water bowls spaced away from the litter, a scratching post, and their sent blanket provided by us. Let them explore this safe space for 24-48 hours before gradually introducing them to the rest of your home and resident pets."
  }
];
