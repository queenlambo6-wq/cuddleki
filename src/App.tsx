import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  X, 
  ChevronDown, 
  Star, 
  HelpCircle, 
  FileText, 
  Send, 
  Gift, 
  Calendar,
  Check,
  Award,
  Filter,
  SlidersHorizontal,
  Home,
  MessageCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { CATS_DATA, Cat } from './data/cats';
import { BREEDS_GUIDE, BreedGuide } from './data/breeds';
import { REVIEWS_DATA, FAQS_DATA, Review } from './data/reviews';

type NavTab = 'available' | 'breeds' | 'process' | 'guarantee' | 'matchmaker' | 'reviews' | 'calculator' | 'faq' | 'contact';
type ThemeMode = 'rose-plum' | 'honey-amber' | 'midnight-lavender';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('available');
  const [theme, setTheme] = useState<ThemeMode>('rose-plum');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedTrait, setSelectedTrait] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'fee-asc' | 'youngest' | 'name'>('recommended');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cc_favorites');
      return saved ? JSON.parse(saved) : ['CC-101', 'CC-103'];
    } catch {
      return ['CC-101', 'CC-103'];
    }
  });

  // Modals & Drawers
  const [activeCatModal, setActiveCatModal] = useState<Cat | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [applicationCat, setApplicationCat] = useState<Cat | null>(null);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appRefCode, setAppRefCode] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS_DATA);
  const [newReviewModalOpen, setNewReviewModalOpen] = useState(false);

  // Matchmaker state
  const [quizAnswers, setQuizAnswers] = useState({
    environment: 'quiet',
    energy: 'cuddler',
    grooming: 'low',
    allergies: 'yes'
  });
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Application Form State
  const [appFormData, setAppFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cityState: '',
    housingType: 'House (Own)',
    hasOtherPets: 'Yes, friendly dog/cat',
    childrenInHome: 'Yes, older kids (6+)',
    catExperience: 'Experienced cat parent',
    timeAloneDaily: '2 to 4 hours',
    vetNamePhone: 'Oakwood Vet Clinic - Dr. Taylor (555-0192)',
    message: ''
  });

  // Review Form State
  const [reviewFormData, setReviewFormData] = useState({
    name: '',
    location: '',
    catName: '',
    breed: 'ragdoll',
    rating: 5,
    title: '',
    comment: ''
  });

  // Apply theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'rose-plum' ? '' : theme);
  }, [theme]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('cc_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (catId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // Filtered Cats
  const filteredCats = useMemo(() => {
    return CATS_DATA.filter(cat => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchBreed = cat.breed.toLowerCase().includes(q);
        const matchColor = cat.color.toLowerCase().includes(q);
        const matchTag = cat.personality.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchBreed && !matchColor && !matchTag) return false;
      }
      // Breed
      if (selectedBreed !== 'all' && cat.breedSlug !== selectedBreed) {
        return false;
      }
      // Gender
      if (selectedGender !== 'all' && cat.gender !== selectedGender) {
        return false;
      }
      // Trait filter
      if (selectedTrait === 'hypoallergenic' && !cat.hypoallergenic) return false;
      if (selectedTrait === 'kid-friendly' && !cat.kidFriendly) return false;
      if (selectedTrait === 'snuggler' && cat.cuddleScore < 5) return false;
      if (selectedTrait === 'playful' && cat.energyScore < 4) return false;

      // Favorites
      if (favoritesOnly && !favorites.includes(cat.id)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'fee-asc') return a.adoptionFee - b.adoptionFee;
      if (sortBy === 'youngest') {
        const getWeeks = (c: Cat) => parseInt(c.age) || 12;
        return getWeeks(a) - getWeeks(b);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // recommended
    });
  }, [searchQuery, selectedBreed, selectedGender, selectedTrait, sortBy, favoritesOnly, favorites]);

  // Open Application for specific cat
  const handleOpenApply = (cat?: Cat) => {
    setApplicationCat(cat || null);
    setAppSubmitted(false);
    setApplicationModalOpen(true);
  };

  // Submit Application
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `CC-APP-${Math.floor(1000 + Math.random() * 9000)}`;
    setAppRefCode(code);
    setAppSubmitted(true);
  };

  // Submit Review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormData.name || !reviewFormData.comment) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      adopterName: reviewFormData.name,
      location: reviewFormData.location || 'United States',
      catName: reviewFormData.catName || 'Adopted Kitten',
      breed: reviewFormData.breed,
      rating: reviewFormData.rating,
      date: 'Just now',
      title: reviewFormData.title || 'In love with our new family member!',
      comment: reviewFormData.comment,
      verified: true,
      avatarChar: reviewFormData.name.charAt(0).toUpperCase()
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewModalOpen(false);
    setReviewFormData({
      name: '',
      location: '',
      catName: '',
      breed: 'ragdoll',
      rating: 5,
      title: '',
      comment: ''
    });
  };

  // Quiz Recommendations
  const matchmakerRecommendations = useMemo(() => {
    return CATS_DATA.map(cat => {
      let score = 70;
      if (quizAnswers.allergies === 'yes' && cat.hypoallergenic) score += 25;
      if (quizAnswers.energy === 'cuddler' && cat.cuddleScore === 5) score += 20;
      if (quizAnswers.energy === 'playful' && cat.energyScore >= 4) score += 20;
      if (quizAnswers.grooming === 'low' && cat.groomingScore <= 2) score += 15;
      if (quizAnswers.grooming === 'fluffy' && cat.groomingScore >= 3) score += 15;
      if (quizAnswers.environment === 'family' && cat.kidFriendly) score += 15;
      const finalScore = Math.min(99, Math.max(78, score));
      return { cat, matchScore: finalScore };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  }, [quizAnswers]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      
      {/* 1. TOP ANNOUNCEMENT BAR & PALETTE PICKER */}
      <div className="bg-[#381A2D] text-[#FDE8EE] text-xs sm:text-sm py-2.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E11D48] text-white">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to Crush & Cuddles
            </span>
            <span className="hidden md:inline">Where Every Purr Finds Its Forever Home • 1-Year Genetic Health Warranty</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Color Scheme Switcher */}
            <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full border border-white/10">
              <span className="text-[#FBCFE8] font-medium hidden lg:inline">Palette:</span>
              <button 
                onClick={() => setTheme('rose-plum')}
                className={`px-2 py-0.5 rounded-full transition-all text-xs font-semibold ${theme === 'rose-plum' ? 'bg-[#E11D48] text-white' : 'text-stone-300 hover:text-white'}`}
                title="Rose & Velvet Plum Scheme"
              >
                🌸 Rose Plum
              </button>
              <button 
                onClick={() => setTheme('honey-amber')}
                className={`px-2 py-0.5 rounded-full transition-all text-xs font-semibold ${theme === 'honey-amber' ? 'bg-[#D97706] text-white' : 'text-stone-300 hover:text-white'}`}
                title="Honey Amber Scheme"
              >
                🍯 Amber
              </button>
              <button 
                onClick={() => setTheme('midnight-lavender')}
                className={`px-2 py-0.5 rounded-full transition-all text-xs font-semibold ${theme === 'midnight-lavender' ? 'bg-[#DB2777] text-white' : 'text-stone-300 hover:text-white'}`}
                title="Midnight Lavender Scheme"
              >
                ✨ Lavender
              </button>
            </div>

            <a 
              href="tel:18004927877" 
              className="flex items-center gap-1 text-[#FDE8EE] hover:text-white font-semibold transition"
            >
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>(800) 492-PURR</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & BRAND NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DFD3] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => { setCurrentTab('available'); setFavoritesOnly(false); }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#381A2D] to-[#E11D48] flex items-center justify-center text-white shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
            </div>
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight text-[#381A2D] leading-none">
                Crush & <span className="text-[#E11D48]">Cuddles</span>
              </div>
              <div className="text-[11px] tracking-wider uppercase font-semibold text-stone-500 mt-1">
                Cats & Kittens Adoption
              </div>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-stone-700">
            <button 
              onClick={() => { setCurrentTab('available'); setFavoritesOnly(false); }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${currentTab === 'available' && !favoritesOnly ? 'bg-rose-50 text-[#E11D48] font-bold shadow-xs' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              <span>Adoptable Cats</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                {CATS_DATA.length}
              </span>
            </button>

            <button 
              onClick={() => setCurrentTab('breeds')}
              className={`px-3 py-2 rounded-xl transition-all ${currentTab === 'breeds' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              Breeds Guide
            </button>

            <button 
              onClick={() => setCurrentTab('process')}
              className={`px-3 py-2 rounded-xl transition-all ${currentTab === 'process' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              Adoption Process
            </button>

            <button 
              onClick={() => setCurrentTab('guarantee')}
              className={`px-3 py-2 rounded-xl transition-all ${currentTab === 'guarantee' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              Health Guarantee
            </button>

            <button 
              onClick={() => setCurrentTab('matchmaker')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${currentTab === 'matchmaker' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Matchmaker Quiz</span>
            </button>

            <button 
              onClick={() => setCurrentTab('reviews')}
              className={`px-3 py-2 rounded-xl transition-all ${currentTab === 'reviews' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              Happy Tails
            </button>

            <button 
              onClick={() => setCurrentTab('faq')}
              className={`px-3 py-2 rounded-xl transition-all ${currentTab === 'faq' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'hover:bg-stone-100 hover:text-stone-900'}`}
            >
              FAQ & Care
            </button>
          </nav>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <button 
              onClick={() => {
                setCurrentTab('available');
                setFavoritesOnly(!favoritesOnly);
              }}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${favoritesOnly ? 'bg-rose-600 border-rose-600 text-white shadow-sm' : 'border-stone-200 bg-white hover:bg-rose-50 text-stone-700'}`}
              title="Saved / Favorited Cats"
            >
              <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-white text-white' : 'text-[#E11D48]'}`} />
              <span className="text-xs font-bold">{favorites.length}</span>
            </button>

            {/* Apply to Adopt Main Button */}
            <button 
              onClick={() => handleOpenApply()}
              className="bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-rose-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Apply to Adopt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="lg:hidden overflow-x-auto flex items-center gap-2 px-4 py-2 bg-stone-50 border-t border-stone-200 text-xs font-semibold whitespace-nowrap scrollbar-none">
          <button 
            onClick={() => { setCurrentTab('available'); setFavoritesOnly(false); }}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'available' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            Cats ({CATS_DATA.length})
          </button>
          <button 
            onClick={() => setCurrentTab('breeds')}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'breeds' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            Breeds
          </button>
          <button 
            onClick={() => setCurrentTab('matchmaker')}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'matchmaker' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            Quiz 🐾
          </button>
          <button 
            onClick={() => setCurrentTab('process')}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'process' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            Process
          </button>
          <button 
            onClick={() => setCurrentTab('guarantee')}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'guarantee' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            Health Guarantee
          </button>
          <button 
            onClick={() => setCurrentTab('reviews')}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'reviews' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            Happy Tails
          </button>
          <button 
            onClick={() => setCurrentTab('faq')}
            className={`px-3 py-1.5 rounded-lg ${currentTab === 'faq' ? 'bg-rose-600 text-white' : 'text-stone-700 bg-white'}`}
          >
            FAQ
          </button>
        </div>
      </header>

      {/* 3. MAIN CONTENT BODY */}
      <main className="flex-1">

        {/* ===================== TAB: ADOPTABLE CATS (CATALOGUE & HERO) ===================== */}
        {currentTab === 'available' && (
          <div>
            {/* HERO BANNER */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#381A2D] via-[#4D273D] to-[#381A2D] text-white py-16 sm:py-24 px-4 sm:px-6">
              {/* Background decorative cuddle glow */}
              <div className="absolute top-0 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Hero Text */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium text-rose-200">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Ethical, Loving Feline Adoption Sanctuary</span>
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    Find Your Heart's <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200">
                      Purr-fect Cuddle Match
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-rose-100/90 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                    At <strong>Crush & Cuddles</strong>, we raise and rehome deeply socialized, healthy pedigree kittens and rescue cats into vetted, adoring forever homes. All companions arrive fully vaccinated, microchipped, and protected by our 1-Year Genetic Health Warranty.
                  </p>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-medium text-stone-200">
                    <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>1-Year Genetic Health Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                      <span>Full Core Shots & Microchip</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <Heart className="w-5 h-5 text-pink-400 shrink-0" />
                      <span>Hand-Raised In Home</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>Starter Kit & Pet Insurance</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start pt-4">
                    <a 
                      href="#cat-catalogue"
                      className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-rose-950/40 flex items-center gap-2"
                    >
                      <span>Explore {CATS_DATA.length} Available Kittens</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => setCurrentTab('matchmaker')}
                      className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Take Matchmaker Quiz</span>
                    </button>
                  </div>
                </div>

                {/* Hero Featured Kittens Carousel / Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-sm sm:max-w-md">
                    
                    {/* Glowing highlight frame */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-stone-900 group">
                      <img 
                        src="/img/gatitos/norman.jpg" 
                        alt="Norman the Ragdoll" 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 rounded-full bg-rose-600 text-xs font-bold tracking-wide">
                            Ragdoll • 11 Weeks
                          </span>
                          <span className="text-amber-300 font-bold font-serif text-xl">$550 Adoption Fee</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold">Norman the Snuggle Bear</h3>
                        <p className="text-xs text-stone-200 line-clamp-2 mt-1">
                          Ultra-gentle floppy cuddler who purrs the moment you pick him up. Tested, vaccinated, and microchipped.
                        </p>
                        <div className="mt-3 pt-3 border-t border-white/20 flex gap-2">
                          <button 
                            onClick={() => setActiveCatModal(CATS_DATA[0])}
                            className="flex-1 bg-white text-stone-900 hover:bg-rose-50 font-bold py-2 px-3 rounded-lg text-xs transition"
                          >
                            Meet Norman
                          </button>
                          <button 
                            onClick={() => handleOpenApply(CATS_DATA[0])}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition"
                          >
                            Apply to Adopt
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Floating mini badge */}
                    <div className="absolute -bottom-4 -left-4 bg-white text-stone-900 p-3.5 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">350+ Happy Adoptions</div>
                        <div className="text-[11px] text-stone-500">Across 48 States & Canada</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* CATALOGUE FILTERS & GRID */}
            <section id="cat-catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24">
              
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                    <span>Meet Our Adoptable Companions</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D]">
                    {favoritesOnly ? 'Your Saved Favorites' : 'Cats & Kittens Ready for Love'}
                  </h2>
                  <p className="text-stone-600 text-sm mt-1">
                    Showing <strong className="text-stone-900">{filteredCats.length}</strong> available feline friends looking for their forever families.
                  </p>
                </div>

                {favoritesOnly && (
                  <button 
                    onClick={() => setFavoritesOnly(false)}
                    className="text-xs font-bold text-rose-700 underline hover:text-rose-900 self-start md:self-auto"
                  >
                    ← Back to all available cats
                  </button>
                )}
              </div>

              {/* FILTER CONTROLS BAR */}
              <div className="bg-white rounded-2xl p-5 border border-[#E8DFD3] shadow-xs mb-8 space-y-4">
                
                {/* Search Bar + Quick Sort */}
                <div className="grid sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Search by cat name, breed (e.g. Ragdoll, Bengal), or trait..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="sm:col-span-4 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
                    <span className="text-xs font-semibold text-stone-600 shrink-0">Sort:</span>
                    <select 
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-medium bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="recommended">Recommended & Featured</option>
                      <option value="youngest">Youngest Kittens First</option>
                      <option value="fee-asc">Adoption Fee (Low to High)</option>
                      <option value="name">Name (A – Z)</option>
                    </select>
                  </div>
                </div>

                {/* Breed Chips */}
                <div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Filter by Breed:</span>
                    {selectedBreed !== 'all' && (
                      <button onClick={() => setSelectedBreed('all')} className="text-rose-600 hover:underline">
                        Reset Breed
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { id: 'all', label: 'All Breeds' },
                      { id: 'ragdoll', label: 'Ragdoll' },
                      { id: 'maine-coon', label: 'Maine Coon' },
                      { id: 'bengali', label: 'Bengal' },
                      { id: 'british-shorthair', label: 'British Shorthair' },
                      { id: 'siberiano', label: 'Siberian' },
                      { id: 'persa', label: 'Persian' },
                      { id: 'sphynx', label: 'Sphynx' },
                      { id: 'azul-ruso', label: 'Russian Blue' },
                      { id: 'siames', label: 'Siamese' }
                    ].map(b => (
                      <button 
                        key={b.id}
                        onClick={() => setSelectedBreed(b.id)}
                        className={`px-3 py-1.5 rounded-full transition-all font-medium ${selectedBreed === b.id ? 'bg-[#381A2D] text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Filters: Gender & Personality Trait */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  
                  {/* Gender Chips */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-500">Gender:</span>
                    <div className="inline-flex rounded-lg border border-stone-200 bg-stone-50 p-0.5">
                      <button 
                        onClick={() => setSelectedGender('all')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${selectedGender === 'all' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600 hover:text-stone-900'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setSelectedGender('Female')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${selectedGender === 'Female' ? 'bg-pink-100 text-pink-800' : 'text-stone-600 hover:text-stone-900'}`}
                      >
                        ♀ Females
                      </button>
                      <button 
                        onClick={() => setSelectedGender('Male')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${selectedGender === 'Male' ? 'bg-blue-100 text-blue-800' : 'text-stone-600 hover:text-stone-900'}`}
                      >
                        ♂ Males
                      </button>
                    </div>
                  </div>

                  {/* Special Trait filter */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-500">Personality & Coat:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        onClick={() => setSelectedTrait(selectedTrait === 'snuggler' ? 'all' : 'snuggler')}
                        className={`px-2.5 py-1 rounded-full border transition font-medium ${selectedTrait === 'snuggler' ? 'bg-rose-100 border-rose-300 text-rose-800' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                      >
                        💖 Top Snuggler
                      </button>
                      <button 
                        onClick={() => setSelectedTrait(selectedTrait === 'hypoallergenic' ? 'all' : 'hypoallergenic')}
                        className={`px-2.5 py-1 rounded-full border transition font-medium ${selectedTrait === 'hypoallergenic' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                      >
                        🌿 Hypoallergenic
                      </button>
                      <button 
                        onClick={() => setSelectedTrait(selectedTrait === 'kid-friendly' ? 'all' : 'kid-friendly')}
                        className={`px-2.5 py-1 rounded-full border transition font-medium ${selectedTrait === 'kid-friendly' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                      >
                        👶 Kid-Friendly
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* CATS GRID */}
              {filteredCats.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">No companions match these criteria</h3>
                  <p className="text-stone-500 text-sm">
                    Try adjusting your filters or resetting your search to see all {CATS_DATA.length} available kittens.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBreed('all');
                      setSelectedGender('all');
                      setSelectedTrait('all');
                      setFavoritesOnly(false);
                    }}
                    className="bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCats.map(cat => {
                    const isFav = favorites.includes(cat.id);
                    return (
                      <article 
                        key={cat.id}
                        className="bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                      >
                        {/* Image Frame */}
                        <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => setActiveCatModal(cat)}>
                          <img 
                            src={cat.image} 
                            alt={`${cat.name} the ${cat.breed}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#381A2D]/90 text-white backdrop-blur-xs">
                              {cat.breed}
                            </span>
                            {cat.hypoallergenic && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                                Hypoallergenic
                              </span>
                            )}
                          </div>

                          {/* Favorite Heart Button */}
                          <button 
                            onClick={(e) => toggleFavorite(cat.id, e)}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-rose-600 transition shadow-sm"
                            aria-label="Add to favorites"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                          </button>

                          {/* Quick Bottom Overlay on hover */}
                          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                            <span>Click to view medical passport & bio</span>
                            <span className="font-bold underline">Profile →</span>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            {/* Top row: Name & Price */}
                            <div className="flex items-baseline justify-between">
                              <h3 className="font-serif text-xl font-bold text-[#381A2D] group-hover:text-rose-600 transition-colors">
                                {cat.name}
                              </h3>
                              <span className="text-base font-bold text-amber-700 font-serif">
                                ${cat.adoptionFee}
                              </span>
                            </div>

                            {/* Sub-meta: age, gender, color */}
                            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                              <span>{cat.age}</span>
                              <span>•</span>
                              <span className={`font-semibold ${cat.gender === 'Female' ? 'text-pink-600' : 'text-blue-600'}`}>
                                {cat.gender === 'Female' ? '♀ Female' : '♂ Male'}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{cat.color}</span>
                            </div>

                            {/* Cuddle Rating */}
                            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-stone-600">
                              <span className="font-medium text-[11px] text-stone-500">Cuddle Level:</span>
                              <div className="flex text-rose-500">
                                {[...Array(5)].map((_, i) => (
                                  <Heart 
                                    key={i} 
                                    className={`w-3 h-3 ${i < cat.cuddleScore ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Personality Chips */}
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {cat.personality.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                            <button 
                              onClick={() => setActiveCatModal(cat)}
                              className="flex-1 text-xs font-bold py-2 px-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition text-center"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => handleOpenApply(cat)}
                              className="flex-1 text-xs font-bold py-2 px-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white transition text-center shadow-xs"
                            >
                              Apply
                            </button>
                          </div>

                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

            </section>

            {/* TRUST BANNER SECTION */}
            <section className="bg-white border-y border-[#E8DFD3] py-16 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The Crush & Cuddles Promise</span>
                  <h2 className="font-serif text-3xl font-bold text-[#381A2D] mt-1">
                    What Sets Our Adoption Sanctuary Apart?
                  </h2>
                  <p className="text-stone-600 text-sm mt-2">
                    Every feline in our sanctuary is raised in a cage-free, loving home environment surrounded by everyday sounds, children, and affectionate human touch.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">1-Year Health Guarantee</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Written legal guarantee against congenital and hereditary health disorders, backed by complete genetic parentage panels.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Complete Veterinary Care</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Up to date on all core vaccinations (FVRCP + Rabies), FeLV/FIV tested negative, comprehensive deworming, and microchipped.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Hand-Socialized In Home</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Handled gently from day one. They arrive litter trained, acclimated to vacuum sounds, dogs, and family chaos.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                      <Gift className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Complete Starter Bundle</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Includes 30 days of medical insurance, transition nutrition pack, familiar scent blanket, favorite toys, and lifetime behavior support.
                    </p>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* ===================== TAB: BREEDS GUIDE ===================== */}
        {currentTab === 'breeds' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Breed Encyclopedia</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D] mt-1">
                Explore Our Featured Feline Breeds
              </h1>
              <p className="text-stone-600 text-sm mt-2">
                Every breed has a unique character, coat requirement, and personality charm. Learn which feline soulmate fits your home and heart best.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BREEDS_GUIDE.map(breed => (
                <div key={breed.id} className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD3] shadow-xs flex flex-col">
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img 
                      src={breed.bannerImage} 
                      alt={breed.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-300">{breed.origin}</span>
                      <h2 className="font-serif text-2xl font-bold">{breed.name}</h2>
                      <p className="text-xs text-stone-200 italic">{breed.tagline}</p>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {breed.description}
                    </p>

                    <div className="space-y-2 text-xs border-y border-stone-100 py-3">
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Average Size:</span>
                        <span className="font-semibold text-stone-900">{breed.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Coat Maintenance:</span>
                        <span className="font-semibold text-stone-900">{breed.coatCare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Allergy Rating:</span>
                        <span className="font-semibold text-emerald-700">{breed.hypoallergenicRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Lifespan:</span>
                        <span className="font-semibold text-stone-900">{breed.lifeExpectancy}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Ideal For:</div>
                      <div className="flex flex-wrap gap-1">
                        {breed.idealFor.map((item, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedBreed(breed.id);
                        setCurrentTab('available');
                      }}
                      className="w-full bg-[#381A2D] hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
                    >
                      View Available {breed.name}s →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: MATCHMAKER QUIZ ===================== */}
        {currentTab === 'matchmaker' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <Sparkles className="w-3.5 h-3.5" /> 60-Second Matchmaker
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D] mt-2">
                Find Your Purr-fect Match
              </h1>
              <p className="text-stone-600 text-sm mt-1">
                Answer 4 quick lifestyle questions to discover which available kitten or breed is your most compatible match!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD3] shadow-sm space-y-8">
              
              {/* Question 1 */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-3">
                  1. What does your home environment look like?
                </label>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'quiet', title: 'Quiet & Calm', desc: 'Serene apartment or calm home with peaceful routine.' },
                    { id: 'active', title: 'Playful & Active', desc: 'Lots of movement, room to run and climb cat trees.' },
                    { id: 'family', title: 'Family with Children', desc: 'Kids who love playing and gentle furry companionship.' },
                    { id: 'pets', title: 'Multi-Pet Household', desc: 'Resident friendly dogs or other cats looking for a sibling.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setQuizAnswers({ ...quizAnswers, environment: opt.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${quizAnswers.environment === opt.id ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20' : 'border-stone-200 hover:bg-stone-50'}`}
                    >
                      <div className="font-bold text-stone-900">{opt.title}</div>
                      <div className="text-stone-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-3">
                  2. What type of feline personality melts your heart?
                </label>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'cuddler', title: 'The Velvet Lap Snuggler', desc: 'Floppy, affectionate, follows you everywhere and loves being carried.' },
                    { id: 'playful', title: 'The Clever Acrobat', desc: 'Plays fetch, loves teaser wands, energetic miniature house panther.' },
                    { id: 'chatterbox', title: 'The Vocal Communicator', desc: 'Loves having chats, chirping at birds, and telling you about their day.' },
                    { id: 'independent', title: 'The Polite Royal Companion', desc: 'Quiet, dignified, loves sitting beside you without being overly needy.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setQuizAnswers({ ...quizAnswers, energy: opt.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${quizAnswers.energy === opt.id ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20' : 'border-stone-200 hover:bg-stone-50'}`}
                    >
                      <div className="font-bold text-stone-900">{opt.title}</div>
                      <div className="text-stone-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-3">
                  3. How do you feel about coat grooming and shedding?
                </label>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'low', title: 'Low Maintenance', desc: 'Short hair, minimal brushing required.' },
                    { id: 'fluffy', title: 'Love Big Fluffy Coats', desc: 'Enjoy weekly brushing and grooming bonding.' },
                    { id: 'hairless', title: 'No Hair Shedding', desc: 'Sweater lovers, suede skin (Sphynx).' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setQuizAnswers({ ...quizAnswers, grooming: opt.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${quizAnswers.grooming === opt.id ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20' : 'border-stone-200 hover:bg-stone-50'}`}
                    >
                      <div className="font-bold text-stone-900">{opt.title}</div>
                      <div className="text-stone-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-3">
                  4. Does anyone in your home experience cat allergies?
                </label>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'yes', title: 'Yes (Need Hypoallergenic)', desc: 'Prioritize Siberian, Bengal, Sphynx, or Russian Blue with lower Fel d 1.' },
                    { id: 'no', title: 'No Allergies', desc: 'Open to all beautiful cat coats and breeds.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setQuizAnswers({ ...quizAnswers, allergies: opt.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${quizAnswers.allergies === opt.id ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20' : 'border-stone-200 hover:bg-stone-50'}`}
                    >
                      <div className="font-bold text-stone-900">{opt.title}</div>
                      <div className="text-stone-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Button */}
              <div className="pt-4 text-center">
                <button 
                  onClick={() => setQuizSubmitted(true)}
                  className="bg-gradient-to-r from-[#E11D48] to-[#381A2D] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg transition-all hover:scale-102"
                >
                  Calculate My Purr-fect Matches ✨
                </button>
              </div>

              {/* Matchmaker Results Display */}
              {quizSubmitted && (
                <div className="mt-8 pt-8 border-t border-stone-200">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Your Top Compatible Companions</span>
                    <h3 className="font-serif text-2xl font-bold text-[#381A2D]">
                      We Found {matchmakerRecommendations.length} Highly Recommended Matches!
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {matchmakerRecommendations.map(({ cat, matchScore }) => (
                      <div 
                        key={cat.id} 
                        className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white transition flex gap-4 items-center"
                      >
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif font-bold text-stone-900 truncate">{cat.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              {matchScore}% Match
                            </span>
                          </div>
                          <div className="text-xs text-stone-500">{cat.breed} • {cat.age}</div>
                          <p className="text-[11px] text-stone-600 line-clamp-1 mt-1">{cat.bio}</p>
                          <div className="mt-2 flex gap-2">
                            <button 
                              onClick={() => setActiveCatModal(cat)}
                              className="text-xs font-bold text-rose-600 hover:underline"
                            >
                              View Profile
                            </button>
                            <span className="text-stone-300">•</span>
                            <button 
                              onClick={() => handleOpenApply(cat)}
                              className="text-xs font-bold text-stone-800 hover:text-stone-950"
                            >
                              Apply to Adopt
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ===================== TAB: ADOPTION PROCESS ===================== */}
        {currentTab === 'process' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Transparent & Caring Journey</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D] mt-1">
                How Our Adoption Process Works
              </h1>
              <p className="text-stone-600 text-sm mt-2">
                We believe in a gentle, thorough, and supportive journey to ensure lifelong happiness for both you and your new furry family member.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Explore & Submit Your Application",
                  desc: "Browse our adoptable kittens, choose your favorite companion (or let us recommend one based on your home vibe), and submit our simple 3-minute adoption questionnaire.",
                  details: ["No application fee required", "Reviews within 24 business hours", "Pre-reservation available"]
                },
                {
                  step: "02",
                  title: "Virtual Video Meet or Sanctuary Visit",
                  desc: "We schedule an intimate 15-minute video call or sanctuary visit where you see your chosen cat playing, purring, and interacting with their toys in real-time.",
                  details: ["See real personality & temperament", "Ask our feline behaviorist any questions", "Meet parent lineage"]
                },
                {
                  step: "03",
                  title: "Health Check & Reservation Lock",
                  desc: "Our licensed veterinarian conducts a final head-to-tail wellness examination, completes their health certificate, and prepares your legal 1-Year Genetic Health Warranty.",
                  details: ["Complete microchip registration into your name", "Official veterinary health passport", "Complimentary 30-day medical insurance"]
                },
                {
                  step: "04",
                  title: "Welcome Home Day & Lifetime Guidance",
                  desc: "Pick up your baby in person at our sanctuary, or welcome them via our white-glove Pet Courier Flight Nanny right into your arms at your nearest airport or front door.",
                  details: ["Starter transition food pack & scented blanket", "Feline transition guide for the first 48 hours", "Lifetime 24/7 adopter advice hotline"]
                }
              ].map((s, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs grid sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-2 text-center sm:text-left">
                    <span className="font-serif text-5xl font-bold text-rose-200">
                      {s.step}
                    </span>
                  </div>
                  <div className="sm:col-span-6 space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#381A2D]">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="sm:col-span-4 bg-stone-50 rounded-2xl p-4 border border-stone-100 text-xs space-y-1.5 text-stone-700">
                    {s.details.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => handleOpenApply()}
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg transition"
              >
                Begin Your Adoption Application Now →
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: HEALTH GUARANTEE ===================== */}
        {currentTab === 'guarantee' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Written Certified Warranty</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D] mt-1">
                The Crush & Cuddles Health Guarantee
              </h1>
              <p className="text-stone-600 text-sm mt-2">
                We take immense pride in the robust health, genetics, and socialization of every cat in our care.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD3] shadow-sm space-y-8">
              
              <div className="border-b border-stone-200 pb-6">
                <h3 className="font-serif text-xl font-bold text-[#381A2D] mb-3">1. One-Year Congenital & Genetic Warranty</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Every kitten is protected by a <strong>1-Year Written Health Guarantee</strong> against fatal hereditary defects (including Hypertrophic Cardiomyopathy - HCM, Polycystic Kidney Disease - PKD, Spinal Muscular Atrophy - SMA, and Progressive Retinal Atrophy - PRA). In the unlikely event a genetic condition is diagnosed by a licensed vet, we provide full support, medical coverage assistance, or a replacement companion.
                </p>
              </div>

              <div className="border-b border-stone-200 pb-6">
                <h3 className="font-serif text-xl font-bold text-[#381A2D] mb-3">2. Up-To-Date Core Vaccinations & Deworming</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Your kitten arrives with their official medical passport documenting:
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 mt-3 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>FVRCP Core Shot (Rhinotracheitis, Calicivirus, Panleukopenia)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Preventative multi-spectrum deworming treatments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>FeLV / FIV negative blood test documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Flea & mite preventative applied prior to departure</span>
                  </li>
                </ul>
              </div>

              <div className="border-b border-stone-200 pb-6">
                <h3 className="font-serif text-xl font-bold text-[#381A2D] mb-3">3. Microchip with Free Lifetime Registration</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Every cat is implanted with an ISO-standard international microchip. We handle the registration in your name with zero annual fees so your pet is permanently protected from day one.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#381A2D] mb-3">4. Lifetime Return & Support Policy (No Cat Left Behind)</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  If at any point during your cat’s life you face unexpected hardship, illness, or housing changes and can no longer care for your feline, Crush & Cuddles will always take the cat back or assist in a loving rehome. No cat adopted from us will ever enter a shelter.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-emerald-700" />
                  <div>
                    <div className="font-bold text-sm text-emerald-950">Complimentary 30-Day Pet Medical Insurance</div>
                    <div className="text-xs text-emerald-800">Activated automatically upon adoption with zero waiting period.</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenApply()}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                >
                  Adopt with Confidence
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB: HAPPY TAILS (REVIEWS) ===================== */}
        {currentTab === 'reviews' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Real Adopter Stories</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D] mt-1">
                  Happy Tails & Reviews
                </h1>
                <p className="text-stone-600 text-sm mt-1">
                  Over 350+ loving families have found their soul companions through Crush & Cuddles.
                </p>
              </div>

              <button 
                onClick={() => setNewReviewModalOpen(true)}
                className="bg-[#381A2D] hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Share Your Happy Tail</span>
              </button>
            </div>

            {/* Rating Summary Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-serif font-bold text-[#381A2D]">4.9</div>
                <div>
                  <div className="flex text-amber-400 text-lg">
                    {'★★★★★'}
                  </div>
                  <div className="text-xs text-stone-500 font-semibold mt-0.5">Based on 350+ Verified Adoptions</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-stone-700 w-full md:w-auto">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
                  <div className="font-bold text-stone-900 text-base">100%</div>
                  <div className="text-stone-500 text-[11px]">Health Satisfaction</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
                  <div className="font-bold text-stone-900 text-base">48</div>
                  <div className="text-stone-500 text-[11px]">States Delivered</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
                  <div className="font-bold text-stone-900 text-base">100%</div>
                  <div className="text-stone-500 text-[11px]">Home Socialized</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
                  <div className="font-bold text-stone-900 text-base">24/7</div>
                  <div className="text-stone-500 text-[11px]">Lifelong Support</div>
                </div>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsList.map(rev => (
                <article key={rev.id} className="bg-white rounded-2xl p-6 border border-[#E8DFD3] shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-amber-400 text-sm">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <span className="text-[11px] text-stone-400">{rev.date}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Adoption</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                      "{rev.title}"
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm shrink-0">
                      {rev.avatarChar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">{rev.adopterName}</div>
                      <div className="text-[11px] text-stone-500 truncate">{rev.location} • {rev.catName}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: FAQ & CARE ===================== */}
        {currentTab === 'faq' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Got Questions?</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#381A2D] mt-1">
                Frequently Asked Questions
              </h1>
              <p className="text-stone-600 text-sm mt-2">
                Everything you need to know about adoption policies, transportation, kitten proofing, and the health guarantee.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS_DATA.map((faq, idx) => (
                <details key={idx} className="group bg-white rounded-2xl border border-[#E8DFD3] p-5 shadow-xs transition open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-serif font-bold text-stone-900 text-base list-none">
                    <span className="pr-4">{faq.question}</span>
                    <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-open:rotate-180 transition-transform">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="mt-3 pt-3 border-t border-stone-100 text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            {/* Support contact card */}
            <div className="mt-12 bg-gradient-to-r from-stone-900 to-[#381A2D] rounded-3xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl font-bold">Still have a question?</h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">Our feline placement coordinators are always happy to chat with you.</p>
              </div>
              <div className="flex gap-3">
                <a 
                  href="mailto:adoption@crushandcuddles.com" 
                  className="bg-white text-stone-900 hover:bg-rose-50 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  Email Us
                </a>
                <a 
                  href="tel:18004927877" 
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  Call Us Directly
                </a>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-[#381A2D] text-[#EFE7DC] pt-16 pb-12 border-t border-[#4D273D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Crush & <span className="text-rose-400">Cuddles</span>
              </span>
            </div>
            <p className="text-xs text-rose-100/80 leading-relaxed max-w-sm">
              An ethical, loving feline sanctuary and rehoming collective. Dedicated to breeding and raising healthy, affectionate pedigree kittens and cats in authentic family environments.
            </p>
            <div className="text-xs text-stone-300 space-y-1">
              <div>📍 Main Adoption Sanctuary: 1204 Feline Haven Way, Austin, TX</div>
              <div>📞 Helpline: (800) 492-PURR • (800) 492-7877</div>
              <div>✉️ Inquiries: hello@crushandcuddles.org</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm">Explore</h4>
            <ul className="space-y-2 text-xs text-rose-100/70">
              <li><button onClick={() => { setCurrentTab('available'); setFavoritesOnly(false); }} className="hover:text-white">Adoptable Cats ({CATS_DATA.length})</button></li>
              <li><button onClick={() => setCurrentTab('breeds')} className="hover:text-white">Breeds Encyclopedia</button></li>
              <li><button onClick={() => setCurrentTab('matchmaker')} className="hover:text-white">Purr Matchmaker Quiz</button></li>
              <li><button onClick={() => setCurrentTab('reviews')} className="hover:text-white">Adoption Testimonials</button></li>
            </ul>
          </div>

          {/* Adoption & Health */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm">Adoption & Health</h4>
            <ul className="space-y-2 text-xs text-rose-100/70">
              <li><button onClick={() => setCurrentTab('process')} className="hover:text-white">4-Step Adoption Guide</button></li>
              <li><button onClick={() => setCurrentTab('guarantee')} className="hover:text-white">1-Year Genetic Warranty</button></li>
              <li><button onClick={() => setCurrentTab('guarantee')} className="hover:text-white">Core Vaccines & Microchip</button></li>
              <li><button onClick={() => setCurrentTab('faq')} className="hover:text-white">Kitten Proofing & Care</button></li>
            </ul>
          </div>

          {/* Visiting & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm">Sanctuary Hours</h4>
            <div className="text-xs text-rose-100/70 space-y-1.5">
              <div>Monday – Friday: 9am – 7pm EST</div>
              <div>Saturday: 10am – 6pm EST</div>
              <div>Sunday: 12pm – 5pm EST</div>
              <div className="pt-2 text-amber-300 font-semibold">
                ✈️ Nationwide Flight Courier Delivery Available 7 Days a Week
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} Crush & Cuddles Cats Adoption. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Ethical Care Verified</span>
            <span>•</span>
            <span>Microchipped with ISO Standards</span>
            <span>•</span>
            <span>Indoor-Only Adoption Promise</span>
          </div>
        </div>
      </footer>

      {/* ===================== MODAL: CAT DETAIL PROFILE ===================== */}
      {activeCatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => setActiveCatModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative aspect-16/10 overflow-hidden bg-stone-900">
              <img 
                src={activeCatModal.image} 
                alt={activeCatModal.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E11D48] text-white">
                    {activeCatModal.breed}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs">
                    {activeCatModal.age}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs">
                    {activeCatModal.gender}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-3xl font-bold">{activeCatModal.name}</h3>
                  <span className="font-serif text-2xl font-bold text-amber-300">
                    ${activeCatModal.adoptionFee}
                  </span>
                </div>
                <div className="text-xs text-stone-300 mt-1">ID: {activeCatModal.id} • Color: {activeCatModal.color}</div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              
              {/* Bio Narrative */}
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Personality & Story</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {activeCatModal.bio}
                </p>
              </div>

              {/* Temperament Gauges */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Temperament & Traits</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1 font-medium">
                      <span>Affection & Cuddle Level</span>
                      <span className="text-rose-600 font-bold">{activeCatModal.cuddleScore}/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(activeCatModal.cuddleScore / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-medium">
                      <span>Energy & Playfulness</span>
                      <span className="text-amber-600 font-bold">{activeCatModal.energyScore}/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(activeCatModal.energyScore / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-medium">
                      <span>Grooming Needs</span>
                      <span className="text-stone-700 font-bold">{activeCatModal.groomingScore}/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-stone-500 rounded-full" style={{ width: `${(activeCatModal.groomingScore / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-medium">
                      <span>Vocal / Chatty Level</span>
                      <span className="text-purple-600 font-bold">{activeCatModal.vocalScore}/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(activeCatModal.vocalScore / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical & Health Passport */}
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Medical Passport & Certifications</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {activeCatModal.healthChecks.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What is included in fee */}
              <div className="text-xs text-stone-500 bg-stone-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-stone-800">What is included in the ${activeCatModal.adoptionFee} fee?</span>
                <p>
                  Includes full veterinary inspection, all core vaccines, microchip registration into your name, 1-Year Genetic Health Warranty, starter transition nutrition pack, and 30 days of complimentary pet insurance.
                </p>
              </div>

            </div>

            {/* Modal Footer CTAs */}
            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
              <button 
                onClick={() => toggleFavorite(activeCatModal.id)}
                className="flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-rose-600 px-4 py-2.5 rounded-xl border border-stone-200 bg-white"
              >
                <Heart className={`w-4 h-4 ${favorites.includes(activeCatModal.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{favorites.includes(activeCatModal.id) ? 'Saved to Favorites' : 'Add to Favorites'}</span>
              </button>

              <button 
                onClick={() => {
                  const cat = activeCatModal;
                  setActiveCatModal(null);
                  handleOpenApply(cat);
                }}
                className="flex-1 bg-gradient-to-r from-[#E11D48] to-[#381A2D] hover:from-[#BE123C] hover:to-black text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Apply to Adopt {activeCatModal.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================== MODAL: ADOPTION APPLICATION WIZARD ===================== */}
      {applicationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-8 animate-in fade-in duration-200">
            
            <button 
              onClick={() => setApplicationModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {appSubmitted ? (
              /* Success Screen */
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-stone-900">Application Received!</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for opening your heart to a feline companion! Our adoption coordinator will review your application and reach out within 24 business hours to schedule your virtual meet & match.
                </p>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 max-w-xs mx-auto">
                  <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Your Application Reference:</div>
                  <div className="font-mono text-xl font-bold text-rose-700 mt-1">{appRefCode}</div>
                  {applicationCat && (
                    <div className="text-xs text-stone-700 mt-1">Requested Cat: <strong>{applicationCat.name}</strong> ({applicationCat.breed})</div>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setApplicationModalOpen(false)}
                    className="bg-[#381A2D] text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                  >
                    Back to Adoptable Cats
                  </button>
                  <a 
                    href={`https://wa.me/18004927877?text=Hello%20Crush%20and%20Cuddles!%20I%20just%20submitted%20adoption%20application%20${appRefCode}%20for%20${applicationCat ? applicationCat.name : 'a%20kitten'}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleApplicationSubmit} className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Adoption Questionnaire</span>
                  <h3 className="font-serif text-2xl font-bold text-[#381A2D]">
                    {applicationCat ? `Apply for ${applicationCat.name}` : 'Crush & Cuddles Adoption Application'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Help us get to know you and your home. There are no tricky questions—we just love finding the perfect match!
                  </p>
                </div>

                {applicationCat && (
                  <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs">
                    <img src={applicationCat.image} alt={applicationCat.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-stone-900">{applicationCat.name} • {applicationCat.breed}</div>
                      <div className="text-stone-500">{applicationCat.color} • ${applicationCat.adoptionFee} fee</div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Jane Doe" 
                        value={appFormData.fullName}
                        onChange={e => setAppFormData({...appFormData, fullName: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="(555) 000-1234" 
                        value={appFormData.phone}
                        onChange={e => setAppFormData({...appFormData, phone: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500" 
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="jane@example.com" 
                        value={appFormData.email}
                        onChange={e => setAppFormData({...appFormData, email: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">City & State *</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Austin, TX" 
                        value={appFormData.cityState}
                        onChange={e => setAppFormData({...appFormData, cityState: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500" 
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Housing Type</label>
                      <select 
                        value={appFormData.housingType}
                        onChange={e => setAppFormData({...appFormData, housingType: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50"
                      >
                        <option>Single Family House (Own)</option>
                        <option>Townhome / Condo</option>
                        <option>Apartment (Pet-Friendly)</option>
                        <option>Renting (Landlord Approved)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Resident Pets</label>
                      <select 
                        value={appFormData.hasOtherPets}
                        onChange={e => setAppFormData({...appFormData, hasOtherPets: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50"
                      >
                        <option>No current pets</option>
                        <option>Yes, friendly dog(s)</option>
                        <option>Yes, other cat(s)</option>
                        <option>Both dog & cat</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Veterinary Clinic / Reference</label>
                    <input 
                      type="text" 
                      placeholder="Name of your vet clinic and phone (or 'First time pet parent')" 
                      value={appFormData.vetNamePhone}
                      onChange={e => setAppFormData({...appFormData, vetNamePhone: e.target.value})}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Tell us a little about your routine & why this cat?</label>
                    <textarea 
                      rows={2}
                      placeholder="What draws you to this kitten? How many hours are you typically home?"
                      value={appFormData.message}
                      onChange={e => setAppFormData({...appFormData, message: e.target.value})}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md"
                  >
                    Submit Adoption Application →
                  </button>
                  <p className="text-[11px] text-stone-400 text-center mt-2">
                    🔒 No payment needed to apply. Your information is confidential and protected.
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ===================== MODAL: SUBMIT NEW REVIEW ===================== */}
      {newReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
            <button 
              onClick={() => setNewReviewModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#381A2D] mb-1">Share Your Happy Tail</h3>
            <p className="text-xs text-stone-500 mb-4">Tell future adopters about your journey with Crush & Cuddles!</p>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                <input 
                  required
                  type="text" 
                  placeholder="Sarah & Alex"
                  value={reviewFormData.name}
                  onChange={e => setReviewFormData({...reviewFormData, name: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City, State</label>
                  <input 
                    type="text" 
                    placeholder="Dallas, TX"
                    value={reviewFormData.location}
                    onChange={e => setReviewFormData({...reviewFormData, location: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Cat's Name</label>
                  <input 
                    type="text" 
                    placeholder="Norman"
                    value={reviewFormData.catName}
                    onChange={e => setReviewFormData({...reviewFormData, catName: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[5, 4, 3].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewFormData({...reviewFormData, rating: n})}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${reviewFormData.rating === n ? 'bg-amber-100 border-amber-400 text-amber-900' : 'border-stone-200'}`}
                    >
                      {n} Stars ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Review Headline</label>
                <input 
                  type="text" 
                  placeholder="The best decision we ever made!"
                  value={reviewFormData.title}
                  onChange={e => setReviewFormData({...reviewFormData, title: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Story & Experience *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="How is your cat doing? How was the adoption & delivery experience?"
                  value={reviewFormData.comment}
                  onChange={e => setReviewFormData({...reviewFormData, comment: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold py-2.5 rounded-xl text-xs transition mt-2"
              >
                Publish Happy Tail 🐾
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
