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
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold hover:scale-105 transition-transform">
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm text-purple-300">🚀 Système de genres cinématographiques disponible</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              From Script to Screen
            </span>
            <br />
            <span className="text-white">in 60 Minutes</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Transformez vos idées en vidéos cinématographiques avec l'IA.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold"> 10 genres narratifs</span>,
            génération intelligente, montage automatique.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/50">
              Créer ma première vidéo
            </button>
            <button className="px-8 py-4 border-2 border-purple-500/50 rounded-full font-bold text-lg backdrop-blur-sm hover:bg-purple-500/10 transition-all">
              Voir la démo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10', label: 'Genres disponibles', icon: '🎬' },
              { number: '60', label: 'Minutes max', icon: '⚡' },
              { number: '100+', label: 'Films en base', icon: '🎥' },
              { number: '99%', label: 'Satisfaction', icon: '⭐' }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-1">
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
              De l'idée à la vidéo finale en 4 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choisissez votre genre', desc: 'Sélectionnez parmi 10 genres narratifs', icon: '🎭' },
              { step: '02', title: 'Décrivez votre histoire', desc: 'Entrez votre idée en quelques phrases', icon: '✍️' },
              { step: '03', title: 'IA génère le scénario', desc: 'L\'IA crée le script et les scènes', icon: '🤖' },
              { step: '04', title: 'Téléchargez votre vidéo', desc: 'Recevez votre film en 60 minutes', icon: '🎬' }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                <div className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold text-purple-400 mb-2">ÉTAPE {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
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
              Choisissez votre genre
            </h2>
            <p className="text-xl text-gray-400">
              Chaque genre possède sa propre structure narrative et style visuel
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { icon: '💥', name: 'Action', desc: 'Rythme effréné' },
              { icon: '💕', name: 'Romance', desc: 'Émotions tendres' },
              { icon: '🚀', name: 'Sci-Fi', desc: 'Futuriste' },
              { icon: '🧙', name: 'Fantasy', desc: 'Épique' },
              { icon: '🔪', name: 'Thriller', desc: 'Suspense' },
              { icon: '👻', name: 'Horror', desc: 'Épouvante' },
              { icon: '😂', name: 'Comedy', desc: 'Fun' },
              { icon: '🎭', name: 'Drama', desc: 'Émotionnel' },
              { icon: '📹', name: 'Documentary', desc: 'Informatif' },
              { icon: '🎨', name: 'Animation', desc: 'Créatif' }
            ].map((genre, i) => (
              <button
                key={i}
                className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:scale-105 hover:border-purple-500/50 transition-all group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{genre.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{genre.name}</h3>
                <p className="text-sm text-gray-400">{genre.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Tarifs transparents
            </h2>
            <p className="text-xl text-gray-400">
              Choisissez l'offre qui vous convient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: 'Starter', 
                price: '29€', 
                period: '/mois',
                features: ['5 vidéos/mois', '720p HD', '3 genres', 'Support email'],
                popular: false
              },
              { 
                name: 'Pro', 
                price: '79€', 
                period: '/mois',
                features: ['20 vidéos/mois', '1080p Full HD', '10 genres', 'Support prioritaire', 'API access'],
                popular: true
              },
              { 
                name: 'Enterprise', 
                price: 'Sur mesure', 
                period: '',
                features: ['Illimité', '4K Ultra HD', 'Tous genres', 'Support dédié', 'Personnalisation'],
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-bold">
                    POPULAIRE
                  </div>
                )}
                <div className={`p-8 rounded-2xl border ${plan.popular ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-cyan-900/20' : 'border-white/10 bg-black/40'} backdrop-blur-xl h-full flex flex-col`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <span className="text-purple-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-full font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105 shadow-lg shadow-purple-500/50' : 'border-2 border-purple-500/50 hover:bg-purple-500/10'}`}>
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <img 
                src="/logo-horizontale.png?v=2" 
                alt="NFLIX.io Logo" 
                className="h-12 w-auto mb-4"
              />
              <p className="text-gray-400 mb-4">From Script to Screen in 60 Minutes</p>
              <p className="text-sm text-gray-500">Créez des vidéos cinématographiques professionnelles avec l'IA</p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#genres" className="hover:text-white transition-colors">Genres</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            © 2025 NFLIX.io. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}