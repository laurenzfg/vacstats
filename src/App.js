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
  });

  const percentage = dec => {
    return (dec * 100).toFixed(2);
  }

  return (
    <>
      <div className="App">
        <p>Am 01.01.2021 wurden in Deutschland {vacData.delta + vacData.secondVaccination.delta} Impfdosen verabreicht.
        Davon entfielen {vacData.delta} auf Erst- und {vacData.secondVaccination.delta} auf Zweitimpfungen.</p>

        <p>Über eine mindestens einmalige Impfung verfügen aktuell {vacData.vaccinated} Menschen.
        Das sind {percentage(vacData.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>In den Genuss eines vollständigen Impfschutzes kommen aktuell {vacData.secondVaccination.vaccinated} Menschen.
        Das sind {percentage(vacData.secondVaccination.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>Der Impfstoffmix aller begonnenen und abgeschlossenen Impfserien ist: {vacData.vaccination.biontech} Biontech,&nbsp;
        {vacData.vaccination.moderna} Moderna, {vacData.vaccination.astraZeneca} AstraZeneca und {vacData.secondVaccination.vaccination.janssen} Janssen.</p>
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
