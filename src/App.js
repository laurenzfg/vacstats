import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import InfoTextComponent from './InfoTextComponent';
import ChartComponent from './ChartComponent';
import FooterComponent from './FooterComponent';

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
      delta: 0, // first jabs + J&J yesterday
      quote: 0, // percentage vaccinated at least one
      secondVaccination: {
        vaccinated: 0, // fully vaccinated; everybody who had two doses or one janssen
        delta: 0, // seccond jabs + janssen jabs yesterday
        quote: 0, // percentage fully vaccination
      },
      firstVacs: 0, // first jabs of two dose vacs and J&J Vacs
      secondVacs: 0, // second jabs of two dose vacs only
  });

  useEffect(() => {
    axios.get(apiEndpoint)
    .then((response) => {
        const apiData = response.data.data;

        setVacData(vacData => {
          return {
            ...vacData,
            administeredVaccinations: apiData.administeredVaccinations,
            vaccinated: apiData.vaccinated,
            vaccination: {
              biontech: apiData.vaccination.biontech,
              moderna: apiData.vaccination.moderna,
              astraZeneca: apiData.vaccination.astraZeneca,
              janssen: apiData.vaccination.janssen,
              curevac: 0,
            },
            delta: apiData.delta,
            quote: apiData.quote,
            secondVaccination: {
              vaccinated: apiData.secondVaccination.vaccinated,
              delta: apiData.secondVaccination.delta,
              quote: apiData.secondVaccination.quote,
            }
          }
        });

        let lastUp = new Date(response.data.meta.lastUpdate);
        lastUp.setTime(lastUp.getTime()-(24*60*60*1000));
        setLu(lastUp);
    }, (error) => {
        console.log(error);
    });

    axios.get(apiEndpoint + "/history/7")
    .then((response) => {
        try {
          const apiData = response.data.data;

          const historySize = apiData.history.length;
          const lastVacData = apiData.history[historySize-1];

          console.log(apiData);
          console.log(lastVacData);

          if (typeof lastVacData === 'undefined')
            throw new Error("Undef History");

          setVacData(vacData => {
            return {
              ...vacData,
              firstVacs: lastVacData.firstVaccination,
              secondVacs: lastVacData.secondVaccination,
            }
          });
        } catch (error) {
          console.log("error in fetching history endpoint");
        }
    }, (error) => {
        console.log(error);
    });

  }, []); // [] ensures once only

  return (
    <>

      <div className="TextualInfo">
        <InfoTextComponent lu={lu} vacData={vacData} />    
      </div>

      { lu > 0 &&
        <ChartComponent vacData={vacData} />
      }
  
      <div id="pushSubscribe">
        <div className="onesignal-customlink-container"></div>
      </div>
      <FooterComponent />
    </>
  );
}

export default App;
