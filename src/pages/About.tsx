//src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-4">🌍 À propos de notre projet</h2>
      <p>
        Le <strong>Classificateur de déchets IA</strong> a été conçu dans le cadre du Hackathon "IA for Good".
        Il vise à <strong>sensibiliser les citoyens au tri sélectif</strong> grâce à l’intelligence artificielle.
      </p>
      <p>
        En utilisant des modèles IA comme Gemini, notre application permet à chacun d’apprendre à trier ses déchets de façon simple, rapide et ludique.
      </p>
      <h4 className="mt-4">♻️ Nos valeurs</h4>
      <ul>
        <li>👉 Éducation écologique accessible</li>
        <li>🤖 Technologie au service de la planète</li>
        <li>🚀 Simplicité d’usage pour tous</li>
      </ul>
    </div>
  );
};

export default About;
