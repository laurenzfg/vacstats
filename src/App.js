import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const apiEndpoint = "https://api.vacstats.laurenzfg.com/vaccinations"

function App() {
  const [lu, setLu] = useState(new Date(0)); // Last Update

  const [vacData, setVacData] = useState({
      administeredVaccinations: 0,
      vaccinated: 0, // at least first vaccination
      vaccination: { // vaccination series according to first jab
        biontech: 0,
        moderna: 0,
        astraZeneca: 0,
        janssen: 0,
        curevac: 0
      },
      delta: 0, // first vaccinations yesterday
      quote: 0, // percentage vaccinated at least one
      secondVaccination: {
        vaccinated: 0, // fully vaccinated; everybody who had two doses or one janssen
        delta: 0, // seccond jabs + janssen jabs yesterday
        quote: 0, // percentage fully vaccination
      }
  });

  useEffect(() => {
    // Update the document title using the browser API
    axios.get(apiEndpoint)
    .then((response) => {
        const apiData = response.data.data;
        
        // Interesting Quirk: RKI / API does not count Janssen as a first dose, they count it second dose ONLY
        // Thus do get "at least started vaccination series" in our sense, we need to add "started series" in their sense,
        // which is first shots of two dose vaccines, to the one-shot janssen vaccinations!

        setVacData({
          administeredVaccinations: apiData.administeredVaccinations,
          vaccinated: apiData.vaccinated + apiData.secondVaccination.vaccination.janssen,
          vaccination: {
            biontech: apiData.vaccination.biontech,
            moderna: apiData.vaccination.moderna,
            astraZeneca: apiData.vaccination.astraZeneca,
            janssen: apiData.secondVaccination.vaccination.janssen,
            curevac: 0
          },
          delta: apiData.delta,
          quote: apiData.quote,
          secondVaccination: {
            vaccinated: apiData.secondVaccination.vaccinated,
            delta: apiData.secondVaccination.delta,
            quote: apiData.secondVaccination.quote,
          }
        });

        let lastUp = new Date(response.data.meta.lastUpdate);
        lastUp.setTime(lastUp.getTime()-(24*60*60*1000));
        setLu(lastUp);
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
        <p>Am {lu.toLocaleDateString()} wurden in Deutschland {fancynum(vacData.delta + vacData.secondVaccination.delta)} Impfdosen verabreicht.
        Davon entfielen {fancynum(vacData.delta)} auf Erst- und {fancynum(vacData.secondVaccination.delta)} auf Zweitimpfungen.</p>

        <p>Über eine mindestens einmalige Impfung verfügen aktuell {fancynum(vacData.vaccinated)} Menschen.
        Das sind {percentage(vacData.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>In den Genuss eines vollständigen Impfschutzes kommen aktuell {fancynum(vacData.secondVaccination.vaccinated)} Menschen.
        Das sind {percentage(vacData.secondVaccination.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>Die Impfserien bzw. One-Shot-Impfungen wurden jeweils mit folgenden Impfstoffen begonnen: {fancynum(vacData.vaccination.biontech)} Biontech,&nbsp;
        {fancynum(vacData.vaccination.moderna)} Moderna, {fancynum(vacData.vaccination.astraZeneca)} AstraZeneca und {fancynum(vacData.vaccination.janssen)} Janssen.</p>
        <p>Insgesamt wurden mittlerweile {fancynum(vacData.administeredVaccinations)} Dosen verabreicht.</p>
      </div>
      <div className="info">
        <div className="onesignal-customlink-container"></div>
      </div>
      <footer>
        <p>Engineered with ❤️ in Aachen.</p>
      </footer>
    </>
  );
}

export default App;
