'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
interface Genre {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

interface Tier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface Duration {
  seconds: number;
  label: string;
  price: {
    script: string;
    full: string;
    premium: string;
  };
}

// ============================================
// DONNÉES DES GENRES
// ============================================
const GENRES: Genre[] = [
  { slug: 'action', name: 'Action', icon: '💥', color: 'from-orange-400 to-red-500' },
  { slug: 'romance', name: 'Romance', icon: '💕', color: 'from-pink-400 to-rose-500' },
  { slug: 'sci-fi', name: 'Sci-Fi', icon: '🚀', color: 'from-cyan-400 to-blue-500' },
  { slug: 'fantasy', name: 'Fantasy', icon: '🧙', color: 'from-purple-400 to-indigo-500' },
  { slug: 'thriller', name: 'Thriller', icon: '🔪', color: 'from-gray-400 to-slate-600' },
  { slug: 'horror', name: 'Horror', icon: '👻', color: 'from-gray-700 to-black' },
  { slug: 'comedy', name: 'Comedy', icon: '😂', color: 'from-yellow-400 to-orange-400' },
  { slug: 'drama', name: 'Drama', icon: '🎭', color: 'from-blue-400 to-purple-500' },
  { slug: 'documentary', name: 'Documentary', icon: '📹', color: 'from-teal-400 to-green-500' },
  { slug: 'experimental', name: 'Experimental', icon: '🎨', color: 'from-pink-500 to-purple-600' },
];

// ============================================
// TIERS DE SERVICE
// ============================================
const TIERS: Tier[] = [
  {
    id: 'script_studio',
    name: 'Script Studio',
    price: '2,99€',
    description: 'Scénario + Prompts (vous montez)',
    features: ['Scénario pro', 'Prompts optimisés', 'Export PDF + JSON']
  },
  {
    id: 'full_production',
    name: 'Full Production ⭐',
    price: '9,99€',
    description: 'Montage automatique inclus',
    features: ['Tout Script Studio +', 'Montage genre-aware', 'Transitions + LUT', 'Export HD'],
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium 🌟',
    price: '24,99€',
    description: 'Service ultra-premium',
    features: ['Tout Full Production +', 'Voix-off IA', 'Musique licensed', 'VFX avancés', 'Livraison 48h']
  },
];

// ============================================
// DURÉES DISPONIBLES
// ============================================
const DURATIONS: Duration[] = [
  { seconds: 15, label: '15 secondes', price: { script: 'Gratuit', full: '2,99€', premium: '14,99€' } },
  { seconds: 30, label: '30 secondes', price: { script: '1,99€', full: '5,99€', premium: '14,99€' } },
  { seconds: 60, label: '1 minute', price: { script: '2,99€', full: '9,99€', premium: '24,99€' } },
  { seconds: 90, label: '1min 30s', price: { script: '4,99€', full: '14,99€', premium: '44,99€' } },
  { seconds: 120, label: '2 minutes', price: { script: '4,99€', full: '19,99€', premium: '44,99€' } },
  { seconds: 180, label: '3 minutes', price: { script: '6,99€', full: '27,99€', premium: '59,99€' } },
  { seconds: 300, label: '5 minutes', price: { script: '9,99€', full: '44,99€', premium: '89,99€' } },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function CreatePage() {
  const searchParams = useSearchParams();
  
  // États du formulaire
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTier, setSelectedTier] = useState('full_production');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [brief, setBrief] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pré-remplir le tier depuis l'URL
  useEffect(() => {
    const tierFromUrl = searchParams.get('tier');
    if (tierFromUrl && TIERS.find(t => t.id === tierFromUrl)) {
      setSelectedTier(tierFromUrl);
    }
  }, [searchParams]);

  // Calculer le prix actuel
  const getCurrentPrice = (): string => {
    const duration = DURATIONS.find(d => d.seconds === selectedDuration);
    if (!duration) return 'N/A';
    
    if (selectedTier === 'script_studio') return duration.price.script;
    if (selectedTier === 'full_production') return duration.price.full;
    if (selectedTier === 'premium') return duration.price.premium;
    return 'N/A';
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedGenre) {
      newErrors.genre = 'Veuillez sélectionner un genre';
    }
    
    if (!brief || brief.length < 20) {
      newErrors.brief = 'Le brief doit contenir au moins 20 caractères';
    }
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        genre: selectedGenre,
        tier: selectedTier,
        duration: selectedDuration,
        brief: brief,
        email: email,
        created_at: new Date().toISOString(),
      };
      
      console.log('Payload à envoyer:', payload);
      
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Vidéo en cours de création ! Vous recevrez un email à ' + email);
      
      // Reset du formulaire
      setSelectedGenre('');
      setBrief('');
      setEmail('');
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition">
            NFLIX.io
          </Link>
          <Link 
            href="/"
            className="text-gray-400 hover:text-white transition"
          >
            ← Retour
          </Link>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* TITRE */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Créez votre vidéo IA 🎬
            </h1>
            <p className="text-xl text-gray-400">
              Sélectionnez un genre, décrivez votre idée, et laissez l&apos;IA faire le reste
            </p>
          </div>

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* ÉTAPE 1 : GENRE */}
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                Choisissez votre genre
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {GENRES.map((genre) => (
                  <button
                    key={genre.slug}
                    type="button"
                    onClick={() => setSelectedGenre(genre.slug)}
                    className={`
                      p-6 rounded-xl border-2 transition-all duration-300 
                      ${selectedGenre === genre.slug 
                        ? `bg-gradient-to-br ${genre.color} border-white scale-105 shadow-xl` 
                        : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:scale-105'
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">{genre.icon}</div>
                    <div className="font-semibold text-sm">{genre.name}</div>
                  </button>
                ))}
              </div>
              
              {errors.genre && (
                <p className="text-red-400 text-sm mt-2">⚠️ {errors.genre}</p>
              )}
            </section>

            {/* ÉTAPE 2 : TIER */}
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                Choisissez votre formule
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id)}
                    className={`
                      p-6 rounded-xl border-2 transition-all text-left
                      ${selectedTier === tier.id 
                        ? 'bg-red-600 border-white scale-105 shadow-xl' 
                        : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:scale-105'
                      }
                      ${tier.recommended ? 'ring-2 ring-yellow-400' : ''}
                    `}
                  >
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-300 mb-3">{tier.description}</p>
                    <ul className="space-y-1 text-sm mb-4">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </section>

            {/* ÉTAPE 3 : DURÉE */}
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                Durée de votre vidéo
              </h2>
              
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              >
                {DURATIONS.map((dur) => (
                  <option key={dur.seconds} value={dur.seconds}>
                    {dur.label}
                  </option>
                ))}
              </select>
            </section>

            {/* ÉTAPE 4 : BRIEF */}
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                Décrivez votre idée
              </h2>
              
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Exemple : Une course-poursuite explosive dans une ville cyberpunk avec des néons bleus et des drones qui poursuivent le héros..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none min-h-[150px] resize-y"
                maxLength={1000}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {brief.length}/1000 caractères
                </span>
                {errors.brief && (
                  <p className="text-red-400 text-sm">⚠️ {errors.brief}</p>
                )}
              </div>
            </section>

            {/* ÉTAPE 5 : EMAIL */}
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
                Votre email
              </h2>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              />
              
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">⚠️ {errors.email}</p>
              )}
              
              <p className="text-sm text-gray-400 mt-2">
                Nous vous enverrons votre vidéo à cette adresse
              </p>
            </section>

            {/* RÉCAPITULATIF & SUBMIT */}
            <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 border-2 border-red-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Prix total</h3>
                  <p className="text-4xl font-black">{getCurrentPrice()}</p>
                  <p className="text-sm text-red-100 mt-1">
                    {selectedGenre 
                      ? GENRES.find(g => g.slug === selectedGenre)?.name 
                      : 'Aucun genre sélectionné'
                    } • {DURATIONS.find(d => d.seconds === selectedDuration)?.label}
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-red-600 hover:bg-gray-100 px-12 py-5 rounded-xl font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer ma vidéo 🚀
                    </>
                  )}
                </button>
              </div>
            </section>

          </form>

          {/* GARANTIE */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              ✅ Garantie satisfait ou remboursé 14 jours
              <br />
              🔒 Paiement sécurisé • 🎬 Livraison rapide
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
