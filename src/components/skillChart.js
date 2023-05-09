import { PieChart } from "react-minimal-pie-chart";
import { getRandomColor } from '../utility/color';

function SkillChart({rawData}) {
    let data = [
        { title: "Fuck", value: 25, color: getRandomColor() },
        { title: "Cats", value: 35, color: getRandomColor() },
        { title: "Birds", value: 20, color: getRandomColor() },
        { title: "Fish", value: 10, color: getRandomColor() },
        { title: "Other", value: 10, color: getRandomColor() },
    ]

    if(typeof rawData !== 'undefined' && Array.isArray(rawData)) {
        data = []

        let total = rawData.reduce((a, c) => {
            return a + c.amount
        },0)
    
        for(let i = 0; i < rawData.length; i++) {
            let d = rawData[i]
            let p = (d.amount/total)*100
            let l = d.name
            let c = getRandomColor()
    
            data.push({title:l,value: p, color: c})
        }
    }

    return (
        <div id="skillChart">
            <h3 id="skillChartL">Skills chart</h3>
            <PieChart
                className='skillPiechart'
                data={data}
                lineWidth={20}
                paddingAngle={3}
                radius={40}
                viewBoxSize={[300, 300]}
                center={[70, 60]}
                label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value.toFixed(2)}%`}
                labelPosition={105}
                labelStyle={{ fontSize: '0.2em' }}
            />
        </div>
    )

}

export default SkillChart;