'use client';

import Link from 'next/link';

export default function CreatePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
      color: 'white',
      padding: '40px',
      fontFamily: 'system-ui'
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: '60px' }}>
        <Link 
          href="/" 
          style={{
            color: '#ef4444',
            fontSize: '24px',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          ← Retour à l'accueil
        </Link>
      </div>

      {/* CONTENU */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        
        {/* TITRE */}
        <h1 style={{
          fontSize: '60px',
          fontWeight: 'bold',
          marginBottom: '40px',
          background: 'linear-gradient(to right, #a855f7, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ✅ ÇA MARCHE !
        </h1>

        {/* MESSAGE */}
        <p style={{
          fontSize: '28px',
          color: '#9ca3af',
          marginBottom: '60px'
        }}>
          Si tu vois cette page, les liens fonctionnent parfaitement ! 🎉
        </p>

        {/* BOX */}
        <div style={{
          background: '#1f2937',
          borderRadius: '20px',
          padding: '60px',
          border: '2px solid #10b981'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#10b981'
          }}>
            🎬 Page de création
          </h2>
          <p style={{
            color: '#d1d5db',
            fontSize: '20px'
          }}>
            Ici apparaîtra bientôt le formulaire complet avec les genres, le brief, etc.
          </p>
        </div>

        {/* BOUTON RETOUR */}
        <div style={{ marginTop: '60px' }}>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '20px 40px',
              background: 'linear-gradient(to right, #9333ea, #06b6d4)',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '20px',
              textDecoration: 'none',
              color: 'white'
            }}
          >
            Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}
