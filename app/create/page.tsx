'use client';

import Link from 'next/link';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      {/* HEADER */}
      <header className="mb-12">
        <Link href="/" className="text-red-600 hover:text-red-500 text-xl font-bold">
          ← Retour à l'accueil
        </Link>
      </header>

      {/* TITRE */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          ✅ Page Create fonctionne !
        </h1>
        <p className="text-2xl text-gray-400 mb-12">
          Si tu vois ce texte, les liens fonctionnent parfaitement. 🎉
        </p>

        {/* TEST SIMPLE */}
        <div className="bg-gray-800 rounded-2xl p-12 border-2 border-green-500">
          <h2 className="text-3xl font-bold mb-4 text-green-400">
            🎬 Formulaire de création (bientôt)
          </h2>
          <p className="text-gray-300 text-lg">
            Ici apparaîtra le formulaire avec les genres, le brief, etc.
          </p>
        </div>

        {/* BOUTON RETOUR */}
        <div className="mt-12">
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 TEST

1. **Sauvegarde** ce fichier dans `app/create/page.tsx`
2. **Rafraîchis** ton navigateur (F5)
3. **Clique** sur "Créer ma première vidéo"

**Tu dois voir :**
- Un grand titre vert "✅ Page Create fonctionne !"
- Un message de confirmation
- Un bouton retour

---

## 📸 RÉSULTAT ATTENDU

Si ça marche, tu verras :
```
URL : nflix.io/create
Page : Fond noir avec titre vert + message de succès
