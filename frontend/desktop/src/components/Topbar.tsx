import { useTranslation } from 'react-i18next';

export function Topbar() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    // Se la lingua è inglese, passa all'italiano, altrimenti passa all'inglese
    const newLang = i18n.language === 'en' ? 'it' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="topbar">
      <div className="topbar-logo">App-<span>Unto</span></div>
      
      {/* Bottone per cambiare lingua posizionato a destra */}
      <button 
        className="btn btn-secondary" 
        style={{ marginLeft: "auto", padding: "4px 8px", fontSize: "12px" }}
        onClick={toggleLanguage}
      >
        {i18n.language === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
      </button>
    </div>
  );
}