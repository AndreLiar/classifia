//src/components/Classifier.tsx

import React, { useState, useEffect, useCallback } from 'react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

const MAX_REQUESTS = 30;
const COOLDOWN_MS = 10 * 1000;

const getTrashImage = (text: string): string | null => {
  const lower = text.toLowerCase();
  if (lower.includes('jaune')) return '/poubelle-jaune.png';
  if (lower.includes('verte')) return '/poubelle-verte.png';
  if (lower.includes('marron')) return '/poubelle-marron.png';
  if (lower.includes('grise')) return '/poubelle-grise.png';
  return null;
};

const SUGGESTIONS = [
  "Bouteille de shampoing",
  "Carton de pizza",
  "Canette de soda",
  "Bouteille en verre",
  "Sac plastique",
  "Pot de yaourt"
];

const Classifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [trashImage, setTrashImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCall, setLastCall] = useState<number | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [history, setHistory] = useState<{ object: string; result: string }[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [canSpeak, setCanSpeak] = useState(false);

  // Fonction utilitaire pour attendre que les voix soient disponibles
  const waitForVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      let voices = speechSynthesis.getVoices();
      if (voices.length) return resolve(voices);

      const interval = setInterval(() => {
        voices = speechSynthesis.getVoices();
        if (voices.length) {
          clearInterval(interval);
          resolve(voices);
        }
      }, 100);

      // Fallback après 2 secondes
      setTimeout(() => {
        clearInterval(interval);
        resolve(speechSynthesis.getVoices());
      }, 2000);
    });
  };

  // Fonction de lecture vocale
  const speak = async (text: string) => {
    const voices = await waitForVoices();
    const frVoice = voices.find(v => v.lang.startsWith("fr")) || voices[0];

    if (!frVoice) {
      alert("❌ Aucune voix disponible sur ce navigateur.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = frVoice;
    utterance.lang = frVoice.lang;

    speechSynthesis.cancel();
    // Un léger délai peut aider à contourner certaines restrictions
    setTimeout(() => {
      speechSynthesis.speak(utterance);
      console.log("🔊 Lecture déclenchée avec :", frVoice.name);
    }, 150);
  };

  // Fonction pour activer la synthèse vocale par un geste utilisateur
  const enableSpeech = useCallback(async () => {
    const voices = await waitForVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr')) || voices[0];
    if (!frVoice) {
      console.error("Aucune voix disponible pour la langue française.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance("Bienvenue sur ClassifIA !");
    utterance.lang = 'fr-FR';
    utterance.voice = frVoice;

    speechSynthesis.cancel();
    setTimeout(() => {
      speechSynthesis.speak(utterance);
      console.log("🔊 Lecture test réussie avec :", frVoice.name);
    }, 100);

    setCanSpeak(true);
    console.log("✅ Lecture vocale activée.");
  }, []);

  // Déclenchement de l'activation vocale dès le premier geste utilisateur
  useEffect(() => {
    const handleUserGesture = () => {
      if (!canSpeak) {
        enableSpeech();
      }
    };

    window.addEventListener("click", handleUserGesture, { once: true });
    window.addEventListener("keydown", handleUserGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
    };
  }, [canSpeak, enableSpeech]);

  // Lecture vocale automatique lorsque la réponse est générée
  // Attention : certains navigateurs bloquent l'auto lecture même si la synthèse est activée.
  useEffect(() => {
    if (response && canSpeak) {
      speak(response);
    }
  }, [response, canSpeak]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('classifia_dark', newMode.toString());
    document.body.classList.toggle('bg-dark', newMode);
    document.body.classList.toggle('text-light', newMode);
  };

  const classifyObject = async () => {
    const now = Date.now();
    if (lastCall && now - lastCall < COOLDOWN_MS) {
      alert("⏳ Attendez 10 secondes entre chaque requête.");
      return;
    }
    if (requestCount >= MAX_REQUESTS) {
      alert("🚫 Limite de 30 requêtes atteinte.");
      return;
    }

    setLoading(true);
    setLastCall(now);
    setResponse('');
    setTrashImage(null);

    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem('gemini_request_count', newCount.toString());

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Dans quelle poubelle faut-il jeter cet objet : "${input}" ? Réponds de manière claire avec le type de poubelle (ex : jaune, verte, marron...) et une explication simple.`
                }
              ]
            }
          ]
        })
      });

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const finalResponse = output || "Aucune réponse.";
      const imageUrl = getTrashImage(finalResponse);

      setResponse(finalResponse);
      setTrashImage(imageUrl);

      const newEntry = { object: input, result: finalResponse };
      const newHistory = [newEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('classifia_history', JSON.stringify(newHistory));
    } catch (error) {
      setResponse("Erreur lors de la communication avec Gemini.");
    }

    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('classifia_history');
  };

  return (
    <div className={`card p-4 shadow-sm ${darkMode ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Quel objet veux-tu jeter ?</h4>
        <button className="btn btn-sm btn-outline-secondary" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
      </div>

      {/* Bouton explicite pour débloquer la lecture vocale si nécessaire */}
      {!canSpeak && (
        <div className="mb-3">
          <button className="btn btn-warning" onClick={enableSpeech}>
            Activer la lecture vocale
          </button>
        </div>
      )}

      <div className="mb-2">
        {SUGGESTIONS.map((item, index) => (
          <button
            key={index}
            className="btn btn-outline-info btn-sm me-2 mb-2"
            onClick={() => setInput(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Ex : Bouteille de shampoing"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={classifyObject}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Analyse en cours...
          </>
        ) : 'Classer avec l’IA'}
      </button>

      {response && (
        <div className="alert alert-success mt-4 fade show">
          <strong>Résultat IA :</strong><br />{response}
          {/* Bouton pour relancer la lecture vocale, utile si l'auto lecture est bloquée */}
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => speak(response)}
          >
            🔊 Lire à voix haute
          </button>
        </div>
      )}

      {trashImage && (
        <div className="text-center mt-3 fade show">
          <img src={trashImage} alt="Poubelle" style={{ maxWidth: '200px' }} />
          <p className="mt-2 text-muted">Poubelle correspondante</p>
        </div>
      )}

      <div className="mt-3 text-muted small text-end">
        Requêtes utilisées : {requestCount} / {MAX_REQUESTS}
      </div>

      {history.length > 0 && (
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>🕓 Historique récent</h5>
            <button className="btn btn-sm btn-outline-danger" onClick={clearHistory}>
              Effacer
            </button>
          </div>
          <ul className="list-group">
            {history.map((item, i) => (
              <li key={i} className="list-group-item">
                <strong>{item.object}</strong> → {item.result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Classifier;
