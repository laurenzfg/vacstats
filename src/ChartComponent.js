import PieChart from './SimplePieChart'

export default function ChartComponent(props) {

    const { vacData } = props;

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
    const popuColors = ['#99d594', '#ccb85a', '#FC8D59'];
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

    return (
      <div className="charts">
        <PieChart data={makeVaccineChart()} colors={vacMakeColors} />
        <PieChart data={makePopuChart()} colors={popuColors} />
        <PieChart data={makefirstsecChart()} colors={firstsecColors} />
      </div>
    );
}