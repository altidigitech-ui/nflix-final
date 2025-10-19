'use client';

import { useState } from 'react';
import Link from 'next/link';

// Composant GenreSelector intégré
const GENRES = [
  { slug: 'action', name: 'Action', icon: '💥', color: 'from-orange-400 to-red-500' },
  { slug: 'romance', name: 'Romance', icon: '💕', color: 'from-pink-400 to-rose-500' },
  { slug: 'sci-fi', name: 'Sci-Fi', icon: '🚀', color: 'from-cyan-400 to-blue-500' },
  { slug: 'fantasy', name: 'Fantasy', icon: '🧙', color: 'from-purple-400 to-indigo-500' },
  { slug: 'thriller', name: 'Thriller', icon: '🔪', color: 'from-gray-400 to-slate-600' },
  { slug: 'horror', name: 'Horror', icon: '👻', color: 'from-gray-700 to-black' },
  { slug: 'comedy', name: 'Comedy', icon: '😂', color: 'from-yellow-400 to-orange-400' },
  { slug: 'drama', name: 'Drama', icon: '🎭', color: 'from-blue-400 to-purple-500' },
  { slug: 'documentary', name: 'Documentary', icon: '📹', color: 'from-teal-400 to-green-500' },
  { slug: 'experimental', name: 'Experimental', icon: '🎨', color: 'from-pink-500 to-purple-600' }
];

const TIERS = [
  {
    id: 'script_studio',
    name: 'Script Studio',
    subtitle: 'Vous montez vous-même',
    basePrice: 2.99,
    features: [
      'Scénario professionnel structuré',
      'Genre sélectionné adapté',
      'Prompts optimisés Sora/Veo/Runway',
      'Détection références culturelles',
      'Export PDF + JSON',
      'Guide technique'
    ],
    badge: null
  },
  {
    id: 'full_production',
    name: 'Full Production',
    subtitle: 'On monte pour vous',
    basePrice: 9.99,
    features: [
      'TOUT du Script Studio',
      'Montage automatique genre-aware',
      'Rythme adapté au genre',
      'Color grading (LUTs) par genre',
      'Transitions cohérentes',
      'Sound design basique',
      'Exports 16:9 + 9:16',
      '1 révision incluse',
      'Livraison 3-5 jours'
    ],
    badge: '⭐ POPULAIRE'
  },
  {
    id: 'premium',
    name: 'Premium Production',
    subtitle: 'Service ultra-premium',
    basePrice: 24.99,
    features: [
      'TOUT du Full Production',
      'Voix-off IA ultra-réaliste',
      'Musique sous licence par genre',
      'SRT multi-langues (FR+EN)',
      'Effets VFX avancés',
      'Color grading personnalisé',
      'Miniature YouTube custom',
      '2 révisions incluses',
      'Livraison express 48h',
      'Support prioritaire 2h'
    ],
    badge: '🌟 PRO'
  }
];

const DURATIONS = [
  { seconds: 30, label: '30s', multiplier: 1, recommended: false },
  { seconds: 60, label: '1 min', multiplier: 1.5, recommended: true },
  { seconds: 120, label: '2 min', multiplier: 2, recommended: false },
  { seconds: 180, label: '3 min', multiplier: 2.5, recommended: false },
  { seconds: 300, label: '5 min', multiplier: 3.5, recommended: false }
];

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [brief, setBrief] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedTier, setSelectedTier] = useState('full_production');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePrice = () => {
    const tier = TIERS.find(t => t.id === selectedTier);
    const duration = DURATIONS.find(d => d.seconds === selectedDuration);
    if (!tier || !duration) return '0.00';
    return (tier.basePrice * duration.multiplier).toFixed(2);
  };

  const canGoToNextStep = () => {
    if (currentStep === 1) return selectedGenre !== null;
    if (currentStep === 2) return brief.length >= 20;
    if (currentStep === 3) return true;
    if (currentStep === 4) return true;
    return false;
  };

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('Veuillez entrer un email valide');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Remplacer par l'URL de votre webhook n8n
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '/api/create-project';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: selectedGenre,
          tier: selectedTier,
          duration: selectedDuration,
          brief: brief,
          email: email,
          price: calculatePrice(),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Rediriger vers page de confirmation ou paiement
        alert('✅ Projet créé avec succès ! Vous allez recevoir un email de confirmation.');
        // TODO: Rediriger vers Stripe Checkout ou page de confirmation
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Erreur lors de la création du projet. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            NFLIX
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/genres" className="text-gray-300 hover:text-white transition-colors">
              Genres
            </Link>
            <Link href="/tarifs" className="text-gray-300 hover:text-white transition-colors">
              Tarifs
            </Link>
            <span className="text-white font-bold">
              {calculatePrice()}€
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/10 text-gray-400'}
                `}>
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 5 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${currentStep > step ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/10'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <span>Genre</span>
            <span>Brief</span>
            <span>Durée</span>
            <span>Formule</span>
            <span>Email</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ÉTAPE 1 : Genre */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Choisissez votre genre 🎬
              </h1>
              <p className="text-xl text-gray-300">
                Chaque genre a ses propres codes narratifs et visuels
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {GENRES.map((genre) => (
                <button
                  key={genre.slug}
                  onClick={() => setSelectedGenre(genre.slug)}
                  className={`
                    group relative p-6 rounded-2xl transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    ${selectedGenre === genre.slug
                      ? `bg-gradient-to-br ${genre.color} shadow-2xl shadow-purple-500/50`
                      : 'bg-white/10 backdrop-blur-xl hover:bg-white/20'
                    }
                  `}
                >
                  {selectedGenre === genre.slug && (
                    <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                      ✓
                    </div>
                  )}
                  <div className="text-5xl mb-3 text-center group-hover:scale-110 transition-transform">
                    {genre.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">
                    {genre.name}
                  </h3>
                </button>
              ))}
            </div>

            {selectedGenre && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
                >
                  Continuer →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 2 : Brief */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Décrivez votre vidéo ✍️
              </h1>
              <p className="text-xl text-gray-300">
                Plus vous êtes précis, meilleur sera le résultat
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={`Exemple pour ${GENRES.find(g => g.slug === selectedGenre)?.name} :\n\n"Course-poursuite explosive dans une ville futuriste entre un héros et des robots. Ambiance Matrix avec néons bleus. Le héros doit sauver son amie kidnappée. Scène finale : combat épique sur un gratte-ciel."`}
                className="w-full h-64 bg-white/5 text-white placeholder-gray-400 p-6 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
                required
              />
              <div className="mt-4 flex items-center justify-between">
                <p className={`text-sm ${brief.length >= 20 ? 'text-green-400' : 'text-gray-400'}`}>
                  {brief.length} caractères {brief.length >= 20 ? '✓' : '(minimum 20)'}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={brief.length < 20}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Durée */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Choisissez la durée ⏱️
              </h1>
              <p className="text-xl text-gray-300">
                La durée influence le prix final
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {DURATIONS.map((duration) => (
                <button
                  key={duration.seconds}
                  onClick={() => setSelectedDuration(duration.seconds)}
                  className={`
                    relative p-8 rounded-2xl transition-all duration-300
                    hover:scale-105
                    ${selectedDuration === duration.seconds
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500 shadow-2xl shadow-purple-500/50'
                      : 'bg-white/10 backdrop-blur-xl hover:bg-white/20'
                    }
                  `}
                >
                  {duration.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Recommandé
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white mb-2">
                    {duration.label}
                  </div>
                  <div className="text-sm text-gray-300">
                    × {duration.multiplier}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all"
              >
                ← Retour
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Tier */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Choisissez votre formule 🎯
              </h1>
              <p className="text-xl text-gray-300">
                Du script DIY au montage premium tout-en-un
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`
                    relative p-6 rounded-2xl transition-all text-left
                    hover:scale-105
                    ${selectedTier === tier.id
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500 shadow-2xl shadow-purple-500/50'
                      : 'bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20'
                    }
                  `}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {tier.badge}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {tier.subtitle}
                  </p>
                  <div className="text-4xl font-bold text-white mb-6">
                    {(tier.basePrice * (DURATIONS.find(d => d.seconds === selectedDuration)?.multiplier || 1)).toFixed(2)}€
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-white flex items-start">
                        <span className="text-green-400 mr-2 flex-shrink-0">✓</span>
                        <span className="opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all"
              >
                ← Retour
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Email & Paiement */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Dernière étape 🎉
              </h1>
              <p className="text-xl text-gray-300">
                Entrez votre email pour recevoir votre vidéo
              </p>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Récapitulatif</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-gray-300">Genre</span>
                  <span className="text-white font-bold">
                    {GENRES.find(g => g.slug === selectedGenre)?.icon} {GENRES.find(g => g.slug === selectedGenre)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-gray-300">Durée</span>
                  <span className="text-white font-bold">
                    {DURATIONS.find(d => d.seconds === selectedDuration)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-gray-300">Formule</span>
                  <span className="text-white font-bold">
                    {TIERS.find(t => t.id === selectedTier)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-white">Prix total</span>
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    {calculatePrice()}€
                  </span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <label className="block text-lg font-bold text-white mb-4">
                Votre email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-white/5 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
                required
              />
              <p className="text-sm text-gray-400 mt-3">
                Vous recevrez votre scénario et/ou vidéo par email
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all"
              >
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !email}
                className="px-12 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-xl rounded-full hover:scale-105 transition-all shadow-2xl shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Création...' : `Créer ma vidéo ${calculatePrice()}€ →`}
              </button>
            </div>

            {/* Garanties */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                ✓ Livraison 3-5 jours • ✓ Révision incluse • ✓ Garantie satisfait ou remboursé 14 jours
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
