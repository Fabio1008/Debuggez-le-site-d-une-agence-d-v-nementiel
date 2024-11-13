import { useEffect, useState,Fragment } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isManual, setIsManual] = useState(false); // Nouveau state pour suivre l'interaction manuelle
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );
 
  const nextCard = () => {
// La condition vérifie si byDateDesc est défini avant d'exécuter nextCard
    if (byDateDesc && !isManual) {
     const timer = setTimeout(
        // length - 1 après l'affichage de la dernière image, l'index sera ramené à 0
        () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
        5000
      );
      return timer;  // il renvoie l'ID du timeout depuis la fonction nextCard
    }
    return null;  // Ajoutez un retour par défaut si byDateDesc n'est pas défini
  };

 // Utilisation d'un useEffect pour détecter l'appui sur la touche espace
 useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      setIsManual((prevIsManual) => !prevIsManual); // Alterne entre pause et reprise
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);

  useEffect(() => {
    const timer = nextCard(); // Démarre la fonction qui change les cartes
    return () => clearTimeout(timer); // Nettoie le timeout quand le composant se démonte
  }, [index, byDateDesc, isManual]); // Ajout index, byDateDesc et isManual comme dépendances pour s'assurer que nextCard n'est appelée que lorsque c'est nécessaireet pas de façon continuelle.
   // Cette fonction est appelée lorsque l'utilisateur clique sur un bouton radio
  const handleRadioChange = (radioIdx) => {
    setIsManual(true); // Indique que l'utilisateur est en interaction manuelle
    setIndex(radioIdx); // Met immédiatement à jour l'index
    setTimeout(() => setIsManual(false), ); 
  };
  if (!byDateDesc) return null;
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        // ajout d'une key unique au composant Fragment
        <Fragment key={event.title}>
          <div 
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                // ajout d'un key unique 
                  key={_.date} 
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  onChange={() => handleRadioChange(radioIdx)} // Change d'index quand un bouton est sélectionné
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Slider;
