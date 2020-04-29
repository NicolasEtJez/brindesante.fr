import React, { useState, useContext } from "react";
import Style from "./Recherche.module.css";
import { ListeFichesContext } from "../Context/ListeFichesContext";
import NombreDeResultat from "../Components/Recherche/NombreDeResultat";
import FicheM from "../Components/FicheM/FicheM";

function Recherche() {
  const [texteRecherche, setTexteRecherche] = useState("");
  const contexte = useContext(ListeFichesContext);
  const fiches = contexte.fiches;
  const [resultats, setResultats] = useState([]);

  //NIE au debut on affiche tout
  useState(() => {
    setResultats([...fiches]);
  }, []);

  //NIE fonction de suppression des accents
  const enleveAccents = (texte) => {
    let texteSansAccent = texte.replace(/[èéêë]/gi, "e");
    texteSansAccent = texteSansAccent.replace(/[àâä]/gi, "a");
    return texteSansAccent;
  };

  //NIE recherche des fiches
  const rechercheFiches = (texteDeRecherche) => {
    //NIE je fais une copie du tableau des fiches
    const tempArray = [...fiches];
    //NIE regex de recherche
    var regexRecherche = texteDeRecherche;

    if (regexRecherche) {
      regexRecherche = texteDeRecherche.trim();
      regexRecherche = regexRecherche.replace(/ /gi, "|");
      regexRecherche = new RegExp(regexRecherche, "i");
    }
    const resArray = tempArray.filter((fiche) => {
      //NIE gestion des accents
      const titre = enleveAccents(fiche.titre);
      const description = enleveAccents(fiche.description);

      if (
        titre.toUpperCase().match(regexRecherche) ||
        description.toLowerCase().match(regexRecherche)
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    setResultats(resArray);
  };

  const submitFormulaire = (event) => {
    //NIE
    event.preventDefault();
  };

  const updateTexteRecherche = (event) => {
    setTexteRecherche(event.target.value);

    console.log(event.target.value);
    rechercheFiches(event.target.value);
  };

  return (
    <div className={Style.PageRecherche}>
      <h1>Recherche</h1>
      <form onSubmit={submitFormulaire} className={Style.formulaire}>
        <input
          className={Style.ChampRecherche}
          name="ChampRecherche"
          id="ChampRecherche"
          type="text"
          placeholder="ex: Fièvre, boutons ..."
          value={texteRecherche}
          onChange={updateTexteRecherche}
        />
      </form>
      <div className={Style.NbResultats}>
        <NombreDeResultat
          nbResultats={resultats.length}
          unResultat="fiche trouvée"
          plusieursResultat="fiches trouvées"
        />
      </div>
      <div className={Style.Liste}>
        {resultats.map((fiche) => (
          <div className={Style.Resultat} key={fiche._id}>
            <FicheM
              titre={fiche.titre}
              fiche_id={fiche._id}
              key={fiche._id}
              description={fiche.description}
              date_modif={fiche.date_modif}
              texteRecherche={texteRecherche}
              image_url={fiche.image_url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Recherche;