export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img
                src="/logo-horizontale.png"
                alt="NFLIX.io logo"
                className="h-12 w-auto"
              />
              <span className="px-2 py-1 text-xs font-bold rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/30">
                BETA
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#genres" className="text-gray-300 hover:text-white transition">
                Genres
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
                Comment ça marche
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">
                Tarifs
              </a>
              <a
                href="/create"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                Commencer
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge système de genres */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-8">
            <span className="text-2xl">🎬</span>
            <span className="text-sm text-purple-300 font-medium">
              Système de genres cinématographiques disponible
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            From Script to Screen
            <br />
            in 60 Minutes
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Transformez vos idées en vidéos cinématographiques avec l&apos;IA.{" "}
            <span className="text-purple-400 font-semibold">10 genres narratifs</span>,
            génération intelligente, montage automatique.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="/create"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105"
            >
              Créer ma première vidéo
            </a>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur text-white text-lg font-semibold rounded-full border border-white/20 hover:bg-white/20 transition"
            >
              Voir la démo
            </a>
          </div>

          {/* Video Demo (Placeholder) */}
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-gray-400">Vidéo démo à venir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Comment ça marche */}
      <div id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-400">
              4 étapes pour transformer votre idée en vidéo professionnelle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-4xl transform hover:scale-110 transition">
                💥
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                1. Choisissez votre genre
              </h3>
              <p className="text-gray-400">
                Action, Romance, Sci-Fi... 10 genres narratifs avec leurs codes cinématographiques
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-4xl transform hover:scale-110 transition">
                ✍️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                2. Décrivez votre vidéo
              </h3>
              <p className="text-gray-400">
                Brief de 2 lignes ou description détaillée, l&apos;IA s&apos;adapte
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center text-4xl transform hover:scale-110 transition">
                🤖
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                3. L&apos;IA génère le scénario
              </h3>
              <p className="text-gray-400">
                Structure narrative, découpage, prompts optimisés pour Sora/Veo/Runway
              </p>
            </div>

            {/* Étape 4 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl transform hover:scale-110 transition">
                🎬
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                4. Recevez votre vidéo montée
              </h3>
              <p className="text-gray-400">
                Montage automatique avec rythme, transitions et LUT adaptés au genre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Genres */}
      <div id="genres" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              10 Genres Cinématographiques
            </h2>
            <p className="text-xl text-gray-400">
              Chaque genre avec sa propre structure narrative et son style visuel
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "💥", name: "Action", color: "from-red-600 to-orange-600" },
              { icon: "💕", name: "Romance", color: "from-pink-600 to-rose-600" },
              { icon: "🚀", name: "Sci-Fi", color: "from-blue-600 to-cyan-600" },
              { icon: "🧙", name: "Fantasy", color: "from-purple-600 to-pink-600" },
              { icon: "🔪", name: "Thriller", color: "from-gray-700 to-gray-900" },
              { icon: "👻", name: "Horror", color: "from-red-900 to-black" },
              { icon: "😂", name: "Comedy", color: "from-yellow-600 to-orange-600" },
              { icon: "🎭", name: "Drama", color: "from-indigo-600 to-purple-600" },
              { icon: "📹", name: "Documentary", color: "from-green-600 to-teal-600" },
              { icon: "🎨", name: "Experimental", color: "from-fuchsia-600 to-purple-600" },
            ].map((genre, index) => (
              <div
                key={index}
                className={`relative group p-6 bg-gradient-to-br ${genre.color} rounded-2xl border border-white/10 hover:border-white/30 transition cursor-pointer transform hover:scale-105`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{genre.icon}</div>
                  <div className="text-white font-bold">{genre.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Pricing */}
      <div id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-400">
              Choisissez l&apos;offre adaptée à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Script Studio */}
            <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Script Studio</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2">29€</div>
                <div className="text-gray-400">par projet</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Scénario complet structuré</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Découpage scène par scène</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Prompts Sora/Veo/Runway</span>
                </li>
              </ul>
              <a
                href="/create"
                className="block w-full py-3 text-center bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
              >
                Choisir Script Studio
              </a>
            </div>

            {/* Full Production */}
            <div className="p-8 bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-full">
                POPULAIRE
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Full Production</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2">99€</div>
                <div className="text-gray-400">par projet</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Tout Script Studio +</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Montage vidéo automatique</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Transitions & LUT du genre</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Export HD prêt à publier</span>
                </li>
              </ul>
              <a
                href="/create"
                className="block w-full py-3 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                Choisir Full Production
              </a>
            </div>

            {/* Premium */}
            <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2">199€</div>
                <div className="text-gray-400">par projet</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Tout Full Production +</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Révisions illimitées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Support prioritaire 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-300">Export 4K + fichiers sources</span>
                </li>
              </ul>
              <a
                href="/create"
                className="block w-full py-3 text-center bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
              >
                Choisir Premium
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "C'est quoi NFLIX.io ?",
                a: "NFLIX.io est un SaaS qui transforme vos idées en vidéos cinématographiques professionnelles grâce à l'IA. Vous choisissez un genre narratif, décrivez votre concept, et notre système génère automatiquement le scénario et peut même monter la vidéo finale.",
              },
              {
                q: "Quelle est la différence entre les 3 tiers ?",
                a: "Script Studio vous donne le scénario + prompts pour générer vous-même les vidéos. Full Production inclut le montage automatique. Premium ajoute révisions illimitées et support 24/7.",
              },
              {
                q: "Combien de temps ça prend ?",
                a: "Le scénario est généré en 2-5 minutes. Le montage vidéo complet prend 30-60 minutes selon la complexité.",
              },
              {
                q: "Comment choisir le bon genre ?",
                a: "Chaque genre a ses codes narratifs : Action pour l'intensité, Romance pour l'émotion, Sci-Fi pour l'innovation... Notre système vous guide dans le choix en fonction de votre brief.",
              },
              {
                q: "Je peux modifier le scénario généré ?",
                a: "Avec le tier Premium, oui ! Révisions illimitées incluses. Pour les autres tiers, vous pouvez relancer une génération.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10 hover:border-white/20 transition"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <img
              src="/logo-horizontale.png"
              alt="NFLIX.io"
              className="h-8 mx-auto"
            />
          </div>
          <p className="text-gray-400 mb-4">
            From Script to Screen in 60 Minutes
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition">
              Mentions légales
            </a>
            <a href="#" className="hover:text-white transition">
              CGV
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            © 2025 NFLIX.io - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}


