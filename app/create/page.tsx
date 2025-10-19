import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img
                src="/logo-horizontale.png?v=2"
                alt="NFLIX.io Logo"
                className="h-12 w-auto"
              />
              <span className="px-2 py-1 text-xs font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                BETA
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#genres" className="text-gray-300 hover:text-white transition-colors">Genres</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">Comment ça marche</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Tarifs</a>
              <Link href="/create">
                <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold hover:scale-105 transition-transform">
                  Commencer
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-purple-500/30 bg-purple-500/8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm text-purple-300">🎬 Système de genres cinématographiques disponible</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              From Script to Screen
            </span>
            <br />
            <span className="text-white">in 60 Minutes</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Transformez vos idées en vidéos cinématographiques avec l&apos;IA. <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-semibold">10 genres narratifs</span>, génération intelligente, montage automatique.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/create">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                Créer ma première vidéo
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-purple-500/50 rounded-full font-bold text-lg backdrop-blur-sm hover:bg-purple-500/10 transition-colors">
              Voir la démo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10', label: 'Genres disponibles', icon: '🎬' },
              { number: '60', label: 'Minutes max', icon: '⏱️' },
              { number: '100+', label: 'Films en base', icon: '🎥' },
              { number: '99%', label: 'Satisfaction', icon: '⭐' }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-400">
              De l&apos;idée à la vidéo finale en 4 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choisissez votre genre', desc: 'Sélectionnez parmi 10 genres narratifs (Action, Romance, Sci-Fi...)', icon: '🎭' },
              { step: '02', title: 'Décrivez votre histoire', desc: 'Entrez votre idée - notre IA comprend et structure', icon: '✍️' },
              { step: '03', title: 'L\'IA crée le script et les scènes', desc: 'Génération intelligente avec respect des codes du genre', icon: '🤖' },
              { step: '04', title: 'Téléchargez votre vidéo', desc: 'Recevez votre film monté en 60 minutes', icon: '🎬' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-sm font-mono text-purple-400 mb-2">ÉTAPE {item.step}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section id="genres" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              10 Genres Disponibles
            </h2>
            <p className="text-xl text-gray-400">
              Chaque genre avec ses codes narratifs, son rythme et son style visuel
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Action', icon: '💥', color: 'from-red-500 to-orange-500' },
              { name: 'Romance', icon: '💕', color: 'from-pink-500 to-rose-500' },
              { name: 'Sci-Fi', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
              { name: 'Fantasy', icon: '🧙', color: 'from-purple-500 to-violet-500' },
              { name: 'Thriller', icon: '🔪', color: 'from-gray-600 to-slate-700' },
              { name: 'Horror', icon: '👻', color: 'from-gray-800 to-black' },
              { name: 'Comedy', icon: '😂', color: 'from-yellow-500 to-amber-500' },
              { name: 'Drama', icon: '🎭', color: 'from-indigo-500 to-blue-600' },
              { name: 'Documentary', icon: '📹', color: 'from-green-600 to-teal-600' },
              { name: 'Animation', icon: '🎨', color: 'from-fuchsia-500 to-pink-600' }
            ].map((genre, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-gradient-to-br ${genre.color} hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="text-5xl mb-3">{genre.icon}</div>
                <div className="text-lg font-bold text-white">{genre.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-gray-400">
              Du script DIY au montage premium tout-en-un
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Script Studio',
                price: '2,99€',
                desc: 'Vous montez vous-même',
                features: ['✅ Scénario professionnel', '✅ Genre sélectionné', '✅ Prompts optimisés Sora/Veo', '✅ Export PDF + JSON', '❌ Pas de montage'],
                cta: 'Commencer',
                tier: 'script_studio'
              },
              {
                name: 'Full Production',
                price: '9,99€',
                desc: 'On monte pour vous',
                popular: true,
                features: ['✅ Tout du Script Studio', '✅ Montage adapté au genre', '✅ Transitions cohérentes', '✅ Color grading (LUTs)', '✅ Exports 16:9 + 9:16'],
                cta: 'Commencer',
                tier: 'full_production'
              },
              {
                name: 'Premium',
                price: '24,99€',
                desc: 'Service ultra-premium',
                features: ['✅ Tout du Full Production', '✅ Voix-off IA réaliste', '✅ Musique genre-matched', '✅ SRT multi-langues', '✅ Livraison 48h'],
                cta: 'Commencer',
                tier: 'premium'
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border ${
                  plan.popular
                    ? 'border-purple-500 bg-gradient-to-b from-purple-500/10 to-transparent scale-105'
                    : 'border-white/10 bg-black/40'
                } backdrop-blur-sm relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-bold">
                    ⭐ POPULAIRE
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.desc}</p>
                <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {plan.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="text-sm text-gray-300">{feature}</li>
                  ))}
                </ul>
                <Link href={`/create?tier=${plan.tier}`}>
                  <button className={`w-full py-3 rounded-full font-bold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105'
                      : 'border-2 border-purple-500/50 hover:bg-purple-500/10'
                  } transition-transform`}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Questions Fréquentes
          </h2>
          <div className="space-y-4">
            {[
              { q: "C'est quoi NFLIX.io ?", a: "Une plateforme qui transforme vos idées en vidéos cinématographiques avec IA, en respectant les codes narratifs de chaque genre." },
              { q: "Combien de temps ça prend ?", a: "Maximum 60 minutes de la commande à la livraison pour le tier Full Production." },
              { q: "Comment choisir le bon genre ?", a: "Réfléchissez au ton de votre histoire : Action (rapide, dynamique), Romance (doux, émotionnel), Sci-Fi (futuriste), etc." },
              { q: "Je peux modifier après ?", a: "Oui ! 1 révision incluse en Full Production, 2 en Premium." },
              { q: "Quels formats de vidéo ?", a: "16:9 (YouTube) + 9:16 (TikTok/Reels) en Full Production. 1:1 et 4:5 en Premium." }
            ].map((faq, i) => (
              <details key={i} className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <summary className="font-bold cursor-pointer text-lg">{faq.q}</summary>
                <p className="mt-4 text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Prêt à créer votre premier film ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez les créateurs qui transforment leurs idées en vidéos professionnelles
          </p>
          <Link href="/create">
            <button className="px-12 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-xl hover:scale-105 transition-transform">
              Commencer maintenant →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo-horizontale.png?v=2" alt="NFLIX.io" className="h-10 w-auto mb-4" />
              <p className="text-sm text-gray-400">From Script to Screen in 60 Minutes</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#genres">Genres</a></li>
                <li><a href="#pricing">Tarifs</a></li>
                <li><a href="#">Exemples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">CGU</a></li>
                <li><a href="#">Confidentialité</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            © 2025 NFLIX.io - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  )
}
