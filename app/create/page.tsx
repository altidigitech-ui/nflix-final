"use client";

import { useState } from "react";

const GENRES = [
  { id: "action", name: "Action", icon: "💥", color: "from-red-600 to-orange-600" },
  { id: "romance", name: "Romance", icon: "💕", color: "from-pink-600 to-rose-600" },
  { id: "sci-fi", name: "Sci-Fi", icon: "🚀", color: "from-blue-600 to-cyan-600" },
  { id: "fantasy", name: "Fantasy", icon: "🧙", color: "from-purple-600 to-pink-600" },
  { id: "thriller", name: "Thriller", icon: "🔪", color: "from-gray-700 to-gray-900" },
  { id: "horror", name: "Horror", icon: "👻", color: "from-red-900 to-black" },
  { id: "comedy", name: "Comedy", icon: "😂", color: "from-yellow-600 to-orange-600" },
  { id: "drama", name: "Drama", icon: "🎭", color: "from-indigo-600 to-purple-600" },
  { id: "documentary", name: "Documentary", icon: "📹", color: "from-green-600 to-teal-600" },
  { id: "experimental", name: "Experimental", icon: "🎨", color: "from-fuchsia-600 to-purple-600" },
];

const TIERS = [
  {
    id: "script_studio",
    name: "Script Studio",
    price: "29€",
    description: "Scénario + Prompts",
    features: ["Scénario structuré", "Découpage scènes", "Prompts Sora/Veo/Runway"],
  },
  {
    id: "full_production",
    name: "Full Production",
    price: "99€",
    description: "Scénario + Vidéo montée",
    features: ["Tout Script Studio", "Montage automatique", "Transitions & LUT", "Export HD"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "199€",
    description: "Tout inclus + Support",
    features: ["Tout Full Production", "Révisions illimitées", "Support 24/7", "Export 4K"],
  },
];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [formData, setFormData] = useState({
    duration: 60,
    brief: "",
    culturalRefs: "",
    email: "",
  });

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
    setStep(2);
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Envoyer au webhook n8n
    const payload = {
      genre: selectedGenre,
      tier: selectedTier,
      duration: formData.duration,
      brief: formData.brief,
      cultural_references: formData.culturalRefs.split(",").map((ref) => ref.trim()),
      email: formData.email,
    };

    console.log("Payload à envoyer:", payload);
    
    // Temporaire: afficher un message de succès
    alert("Formulaire prêt ! (Connexion n8n à configurer)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo-horizontale.png" alt="NFLIX.io" className="h-12 w-auto" />
            </a>
            <a
              href="/"
              className="text-gray-300 hover:text-white transition flex items-center gap-2"
            >
              ← Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-purple-400" : "text-gray-600"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 1 ? "bg-purple-600" : "bg-gray-700"
                  }`}
                >
                  1
                </div>
                <span className="hidden sm:inline font-medium">Genre</span>
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? "bg-purple-600" : "bg-gray-700"}`}></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-purple-400" : "text-gray-600"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 2 ? "bg-purple-600" : "bg-gray-700"
                  }`}
                >
                  2
                </div>
                <span className="hidden sm:inline font-medium">Brief</span>
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? "bg-purple-600" : "bg-gray-700"}`}></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-purple-400" : "text-gray-600"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 3 ? "bg-purple-600" : "bg-gray-700"
                  }`}
                >
                  3
                </div>
                <span className="hidden sm:inline font-medium">Offre</span>
              </div>
            </div>
          </div>

          {/* Step 1: Genre Selection */}
          {step === 1 && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Choisissez votre genre narratif
                </h1>
                <p className="text-xl text-gray-400">
                  Chaque genre a sa propre structure et son style visuel
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreSelect(genre.id)}
                    className={`relative group p-6 bg-gradient-to-br ${genre.color} rounded-2xl border border-white/10 hover:border-white/30 transition transform hover:scale-105 cursor-pointer`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">{genre.icon}</div>
                      <div className="text-white font-bold">{genre.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Brief Form */}
          {step === 2 && (
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4">
                  {GENRES.find((g) => g.id === selectedGenre) && (
                    <>
                      <span className="text-5xl">
                        {GENRES.find((g) => g.id === selectedGenre)?.icon}
                      </span>
                      <h1 className="text-4xl font-bold text-white">
                        {GENRES.find((g) => g.id === selectedGenre)?.name}
                      </h1>
                    </>
                  )}
                </div>
                <p className="text-xl text-gray-400">
                  Décrivez votre projet vidéo
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8">
                  <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                    {/* Durée */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">
                        Durée souhaitée (secondes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="15"
                        max="900"
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Entre 15 secondes et 15 minutes (900s)
                      </p>
                    </div>

                    {/* Brief */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">
                        Votre brief <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="brief"
                        value={formData.brief}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Décrivez votre vidéo... Ex: Un héros solitaire poursuit des criminels dans une ville futuriste de nuit, avec des scènes d'action explosives et une ambiance néon."
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      ></textarea>
                      <p className="text-sm text-gray-400 mt-2">
                        Minimum 10 caractères
                      </p>
                    </div>

                    {/* Références culturelles */}
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3">
                        Références culturelles (optionnel)
                      </label>
                      <input
                        type="text"
                        name="culturalRefs"
                        value={formData.culturalRefs}
                        onChange={handleInputChange}
                        placeholder="Ex: Blade Runner, The Matrix, Drive (séparés par des virgules)"
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-8">
                      <label className="block text-white font-semibold mb-3">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
                      >
                        ← Retour
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
                      >
                        Continuer →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tier Selection */}
          {step === 3 && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Choisissez votre offre
                </h1>
                <p className="text-xl text-gray-400">
                  Sélectionnez le niveau de service adapté à vos besoins
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier.id)}
                    className={`relative p-8 rounded-2xl cursor-pointer transition transform hover:scale-105 ${
                      selectedTier === tier.id
                        ? "bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-purple-500"
                        : "bg-white/5 backdrop-blur border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-full">
                        POPULAIRE
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                      <div className="text-4xl font-bold text-purple-400 mb-2">{tier.price}</div>
                      <div className="text-gray-400">{tier.description}</div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-500 text-xl">✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {selectedTier === tier.id && (
                      <div className="text-center text-purple-400 font-bold">
                        ✓ Sélectionné
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Form */}
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Récapitulatif de votre commande
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400">Genre</span>
                      <span className="text-white font-semibold flex items-center gap-2">
                        <span>{GENRES.find((g) => g.id === selectedGenre)?.icon}</span>
                        {GENRES.find((g) => g.id === selectedGenre)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400">Durée</span>
                      <span className="text-white font-semibold">{formData.duration}s</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400">Offre</span>
                      <span className="text-white font-semibold">
                        {TIERS.find((t) => t.id === selectedTier)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-white text-xl font-bold">Total</span>
                      <span className="text-purple-400 text-3xl font-bold">
                        {TIERS.find((t) => t.id === selectedTier)?.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
                    >
                      ← Retour
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedTier}
                      className={`flex-1 px-6 py-4 text-white font-bold rounded-lg transition ${
                        selectedTier
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50"
                          : "bg-gray-700 cursor-not-allowed"
                      }`}
                    >
                      {selectedTier ? "Lancer la création 🚀" : "Sélectionnez une offre"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


