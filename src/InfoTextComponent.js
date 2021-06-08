export default function InfoTextComponent(props) {
    const percentage = dec => {
      return (dec * 100).toFixed(2);
    }
    
    const fancynum = number => {
      return number.toLocaleString();
    };

    const {lu, vacData} = props;

    return (
      <>
        <b>WARNUNG: Aufgrund einer Änderung des Datenformats seitens des RKI werden aktuell One-Shot-Impfungen sowohl als Erst- als auch als Zweitimpfung gezählt.
        Das bedeutet insbesondere, dass die Summe der gestern verabreichten Impfdosen zu hoch ist.</b>
        <p>Am {lu.toLocaleDateString()} wurden in Deutschland {fancynum(vacData.delta + vacData.secondVaccination.delta)} Impfdosen verabreicht.
        Davon entfielen {fancynum(vacData.delta)} auf Erst- und {fancynum(vacData.secondVaccination.delta)} auf Zweitimpfungen.</p>

        <p>Über eine mindestens einmalige Impfung verfügen aktuell {fancynum(vacData.vaccinated)} Menschen.
        Das sind {percentage(vacData.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>In den Genuss eines vollständigen Impfschutzes kommen aktuell {fancynum(vacData.secondVaccination.vaccinated)} Menschen.
        Das sind {percentage(vacData.secondVaccination.quote)} % der Einwohner:innen Deutschlands.</p>

        <p>Die Impfserien bzw. One-Shot-Impfungen wurden jeweils mit folgenden Impfstoffen begonnen: {fancynum(vacData.vaccination.biontech)} Biontech,&nbsp;
        {fancynum(vacData.vaccination.moderna)} Moderna, {fancynum(vacData.vaccination.astraZeneca)} AstraZeneca und {fancynum(vacData.vaccination.janssen)} Janssen.</p>
        <p>Insgesamt wurden mittlerweile {fancynum(vacData.administeredVaccinations)} Dosen verabreicht.</p>
      </>
    );
}
