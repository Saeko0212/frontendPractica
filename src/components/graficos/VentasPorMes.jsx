import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart, { plugins, scales } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';


const VentasPorMes = ({ meses, totales_por_mes }) => {
    const data={
        labels: meses,
        datasets: [
            {
                label: 'ventas(C$)',
                data: totales_por_mes,
                 backgroundColor: 'rgba(190, 192, 75, 0.2)',
      borderColor: 'rgb(192, 124, 75)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y:{
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cordobas (C$)',
                },
            },
            x:{
                title: {
                    display: true,
                    text: 'Meses',
                },
            },
        },
    };

return ( 
    <Card style={{height: "100%"}}>
        <Card.Body>
            <Card.Title>VentasPorMes</Card.Title>
            <div style={{ height: "100%", position: "relative"}}>
                <Bar data={data}options={options}/>
            </div>
        </Card.Body>
    </Card>
);
};
export default VentasPorMes;