import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const apiEndpoint = "https://api.vacstats.laurenzfg.com/vaccinations"

function App() {
  const [vacData, setVacData] = useState({
      administeredVaccinations: 0,
      vaccinated: 0,
      vaccination: {
        biontech: 0,
        moderna: 0,
        astraZeneca: 0,
      },
      delta: 0,
      quote: 0,
      secondVaccination: {
        vaccinated: 0,
        vaccination: {
          biontech: 0,
          moderna: 0,
          astraZeneca: 0,
          janssen: 0,
        },
        delta: 0,
        quote: 0,
      },
      indication: {
        age: null,
        job: null,
        medical: null,
        nursingHome: null,
        secondVaccination: {
          age: null,
          job: null,
          medical: null,
          nursingHome: null,
        },
      },
      states: {},
  });

  useEffect(() => {
    // Update the document title using the browser API
    axios.get(apiEndpoint)
    .then((response) => {
      setVacData(response.data.data);
    }, (error) => {
      console.log(error);
    })
  }, []); // [] ensures once only

  const percentage = dec => {
    return (dec * 100).toFixed(2);
  }

  const fancynum = number => {
    return number.toLocaleString();
  };

  return (
    <>
      <div className="App">
        <p>Am 01.01.2021 wurden in Deutschland {fancynum(vacData.delta + vacData.secondVaccination.delta)} Impfdosen verabreicht.
        Davon entfielen {fancynum(vacData.delta)} auf Erst- und {fancynum(vacData.secondVaccination.delta)} auf Zweitimpfungen.</p>

        <p>Über eine mindestens einmalige Impfung verfügen aktuell {fancynum(vacData.vaccinated)} Menschen.
        Das sind {percentage(vacData.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>In den Genuss eines vollständigen Impfschutzes kommen aktuell {fancynum(vacData.secondVaccination.vaccinated)} Menschen.
        Das sind {percentage(vacData.secondVaccination.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>Der Impfstoffmix aller begonnenen und abgeschlossenen Impfserien ist: {fancynum(vacData.vaccination.biontech)} Biontech,&nbsp;
        {fancynum(vacData.vaccination.moderna)} Moderna, {fancynum(vacData.vaccination.astraZeneca)} AstraZeneca und {fancynum(vacData.secondVaccination.vaccination.janssen)} Janssen.</p>
      </div>
      <div className="info">
        <p>
          Wenn Du die neuen Impfdaten auch nicht erwarten kannst, kannst du mit der
          Glocke Push-Nachrichten abonnieren. Wir senden Dir dann innert 30 Minuten nach
          Veröffentlichung durch das RKI eine Push Nachricht zu.
          Leider können wir diesen Service auf Apple-Geräten nicht bieten.
        </p>
      </div>
      <footer>
        <p>Engineered with ❤️ in Aachen.</p>
      </footer>
    </>
  );
}

export default App;
