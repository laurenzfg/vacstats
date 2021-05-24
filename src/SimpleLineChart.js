// Draft to render the history of vaccinations
// currently not used!

import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ScatterChart } from 'recharts';

export default function SimplePieChart () {

  const [lu, setLu] = useState(new Date(0)); // Last Update
  
  const [hisData, setHisData] = useState([
    {
      "date": "2020-12-27T00:00:00.000Z",
      "firstVaccination": 24073,
      "secondVaccination": 0,
      "vaccinated": 24073
    },
  ]);

  useEffect(() => {
    // Update the document title using the browser API
    axios.get(apiEndpoint)
    .then((response) => {
        const apiData = response.data.data.history;
        
        // Interesting Quirk: RKI / API does not count Janssen as a first dose, they count it second dose ONLY
        // Thus do get "at least started vaccination series" in our sense, we need to add "started series" in their sense,
        // which is first shots of two dose vaccines, to the one-shot janssen vaccinations!

        setHisData(apiData);

        let lastUp = new Date(response.data.meta.lastUpdate);
        lastUp.setTime(lastUp.getTime()-(24*60*60*1000));
        setLu(lastUp);
    }, (error) => {
        console.log(error);
    })
  }, []); // [] ensures once only

  const apiEndpoint = "https://api.vacstats.laurenzfg.com/vaccinations/history"

  if (lu > 0) {
    return (
      <ScatterChart
      width={500}
      height={300}
      data={hisData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Scatter type="monotone" dataKey="firstVaccination" stroke="red" dot={false} />
        <Scatter type="monotone" dataKey="secondVaccination" stroke="#82ca9d" dot={false} />
      </ScatterChart>
      );
  } else {
    return (<></>);
  }

}