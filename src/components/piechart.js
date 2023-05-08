import {getRandomColor} from '../utility/color';
import { Doughnut } from 'react-chartjs-2';

function Piechart(data) {
    let usedColors = []
    let pieData = []
    let total = data.reduce((a, c) => {
        return a + c.amount
    },0)

    for(let i = 0; i < data.length; i++) {
        let d = data[i]
        let p = (d.amount/total)
        let l = d.name+" ["+(p*100).toFixed(2)+"%]"
        let c = getRandomColor(usedColors,50)
        usedColors.push(c)

        pieData.push({value:p,color:c,label:l})
    }

    const options = {
        title: {
          display: true,
          text: 'Pie Chart',
          fontSize: 20,
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: 'black',
            fontSize: 14,
          },
        },
    };

    return (
        <div>
          <h2>Skills</h2>
          <Doughnut data={data} options={options}/>
        </div>
      );

}

export default Piechart;