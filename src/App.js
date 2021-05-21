import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PieChart from './SimplePieChart'

const apiEndpoint = "https://api.vacstats.laurenzfg.com/vaccinations"

function App() {
  const [showPushUnsubscribe, setShowUnsubscribe] = useState(false);

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

  // colors BioNTech, Moderna, AstraZeneca, Janssen, CureVac
  const vacMakeColors = ['#7de01f', '#0398fc', '#ffd000', '#d60000', 'd67d00'];
  const makeVaccineChart = () => {
    return (
      [
        { name: 'BioNTech', value: vacData.vaccination.biontech },
        { name: 'Moderna', value: vacData.vaccination.moderna },
        { name: 'AstraZeneca', value: vacData.vaccination.astraZeneca },
        { name: 'Janssen', value: vacData.vaccination.janssen },
        { name: 'CureVac', value: 0 },
      ]
    )
  };

  // colors vac, single vac, non vac
  const popuColors = ['#00FF08', '#EBEB34', '#EB3440'];
  const makePopuChart = () => {
    return (
      [
        { name: 'geimpft', value: vacData.secondVaccination.vaccinated },
        { name: 'offene Impfserie', value: vacData.vaccinated - vacData.secondVaccination.vaccinated },
        { name: 'ungeimpft', value: 83166711 - vacData.vaccinated }, // https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Bevoelkerungsstand/Tabellen/bevoelkerung-nichtdeutsch-laender.html
      ]
    );
  };

  // first jab (defined as Astra, Cure or Bion) OR second jab of prelisted + one-shot vacs
  const firstsecColors = ['#9DB5B2', '#47AEA5'];
  const makefirstsecChart = () => {
    return (
      [
        { name: 'Erstimpfungen', value: vacData.delta },
        { name: 'Zweitimpfungen', value: vacData.secondVaccination.delta },
      ]
    );
  }

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

  // Also read if we need to offer unsubscribe after rendering
  useEffect(() => {
    let updatePushStatus = async () => {
      let isPNE = await window.OneSignal.isPushNotificationsEnabled();
      setShowUnsubscribe(isPNE);
    };

    window.OneSignal.push(updatePushStatus);

    window.OneSignal.push(function() {
      window.OneSignal.on('subscriptionChange', updatePushStatus);
    });
  });

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
      { lu > 0 &&
        <>
          <PieChart data={makeVaccineChart()} colors={vacMakeColors} />
          <PieChart data={makePopuChart()} colors={popuColors} />
          <PieChart data={makefirstsecChart()} colors={firstsecColors} />
        </>
      }
  
      <div className="info">
        <div className="onesignal-customlink-container"></div>
      </div>
      <footer>
        <p>Engineered with ❤️ in Aachen.</p>
        { showPushUnsubscribe &&
                  <p><button href="#" className="removeConsentButton"
                  onClick={() => {window.OneSignal.push(["setSubscription", false]);alert("Wir werden Dir keine Benachrichtigungen mehr senden!");}}>
                  Zustimmung für Push-Benachrichtigungen widerrufen</button></p>
        }

      </footer>
    </>
  );
}

export default App;
