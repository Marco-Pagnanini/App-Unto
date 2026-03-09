import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios"; 

interface Props {
  // Aggiungiamo un terzo parametro: l'URL "pulito" da mostrare all'utente
  onLogin: (url: string, token: string, displayUrl: string) => void;
}

export function Login({ onLogin }: Props) {
  const { t, i18n } = useTranslation();
  
  // UX: Inizializza l'input leggendo l'ultimo URL salvato (se c'è), altrimenti vuoto
  const [url, setUrl] = useState(() => localStorage.getItem("appunto_display_url") || "");
  const [token, setToken] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const SCATTERED_FEATURES = [
      { id: "1", icon: "✦", iconColor: "var(--accent-warm)", title: t('login.title_1'), body: t('login.body_1'), position: { top: "15%", left: "10%" } },
      { id: "2", icon: "⬡", iconColor: "var(--accent-slate, #7a8a9e)", title: t('login.title_2'), body: t('login.body_2'), position: { bottom: "15%", right: "10%" } },
      { id: "3", icon: "◈", iconColor: "var(--accent-sage, #7a9e7e)", title: t('login.title_3'), body: t('login.body_3'), position: { top: "25%", right: "15%" } },
      { id: "4", icon: "◐", iconColor: "var(--accent-warm)", title: t('login.title_4'), body: t('login.body_4'), position: { bottom: "25%", left: "15%" } },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const displayUrl = url.trim();
    let cleanUrl = displayUrl.replace(/\/+$/, ""); // Rimuove gli slash finali

    // MAGIA 1: Se l'utente non ha messo http:// o https://, lo aggiungiamo noi!
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `http://${cleanUrl}`;
    }
    
    // MAGIA 2: Se l'utente non ha messo /api/v1, lo aggiungiamo noi!
    if (cleanUrl && !cleanUrl.endsWith("/api/v1")) {
      cleanUrl = `${cleanUrl}/api/v1`;
    }

    const cleanToken = token.trim();

    try {
      // Usiamo l'URL "riparato" per la chiamata
      const response = await axios.get(`${cleanUrl}/notes`, {
        headers: { Authorization: `Bearer ${cleanToken}` },
        timeout: 5000 
      });
      
      const isArray = Array.isArray(response.data);
      const isObjectWithArray = response.data && typeof response.data === 'object' && Array.isArray(response.data.data);
      
      if (!isArray && !isObjectWithArray) {
        throw new Error("InvalidFormat");
      }
      
      // Passiamo sia l'URL completo (per le API) sia quello digitato (per ricordarlo)
      onLogin(cleanUrl, cleanToken, displayUrl);

    } catch (err: any) {
      console.error(t('login.error_console'), err);
      
      if (err.message === "InvalidFormat") {
        setError(t('login.error_404'));
      } else if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError(t('login.error_401'));
        } else if (err.response.status === 404) {
          setError(t('login.error_404'));
        } else {
          setError(t('login.error_server') + err.response.status);
        }
      } else if (err.request) {
        setError(t('login.error_network'));
      } else {
        setError(t('login.error_generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'it' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="login-screen-modern">
      
      <div className="login-background-container">
        {SCATTERED_FEATURES.map((feature) => (
          <div key={feature.id} className="login-feature-scattered-item" style={feature.position}>
            <div className="login-feature-scattered-header">
              <span className="login-feature-scattered-icon" style={{ color: feature.iconColor }}>{feature.icon}</span>
              <div className="login-feature-scattered-title">{feature.title}</div>
            </div>
            <div className="login-feature-scattered-body">{feature.body}</div>
          </div>
        ))}
      </div>

      <div className="login-box-modern">
        <div className="login-logo">App-<span>Unto</span></div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="login-field">
            <label>{t('login.server_url')}</label>
            <input 
              className="note-title-input" 
              type="text" 
              placeholder={t('login.server_url_placeholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
              style={{ fontFamily: "var(--font-body), sans-serif", fontSize: "15px", letterSpacing: "normal" }}
            />
          </div>

          <div className="login-field">
            <label>{t('login.api_token')}</label>
            <input 
              className="note-title-input" 
              type="password" 
              placeholder={t('login.api_token_placeholder')}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              disabled={isLoading}
              style={{ fontFamily: "var(--font-body), sans-serif", fontSize: "15px", letterSpacing: "normal" }}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!url || !token || isLoading}
          >
            {isLoading ? t('login.connecting') : t('login.connect_btn')}
          </button>
        </form>
      </div>

      <button 
        className="btn btn-secondary" 
        style={{ position: "absolute", top: "20px", right: "20px", padding: "4px 8px", fontSize: "12px", zIndex: 100 }}
        onClick={toggleLanguage}
      >
        {i18n.language === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
      </button>

    </div>
  );
}