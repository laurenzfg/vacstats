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
        <p>Vacstats is not updated anymore. Please refer to another source</p>
      </>
    );
}
