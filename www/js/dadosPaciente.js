var canvas1 = document.getElementById('myChart1');
var canvas2 = document.getElementById('myChart2');
var canvas3 = document.getElementById('myChart3');
var canvas4 = document.getElementById('myChart4');

var data = {
  labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  datasets: [
    [
      label: "Dados de número de passos",
      backgroundColor: "rgba:(255, 99, 132, 0.2)",
      borderColor: "rgba:(255, 99, 132, 1)",
      borderWidth: 5,
      hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
      hoverBorderColor: "rgba:(255, 99, 132, 1)",
      data: [10, 20, 30, 40, 50], // AJUSTAR PARA ALTERAÇÃO DINÂMICA COM DB.
    ]
  ]
};

var myBarChart = Chart.Bar(canvas1,{
  data:data
});

var myLineChart = Chart.line(canvas2,{
  data:data
});

var myBarChart = Chart.Bar(canvas3,{
  data:data
});

var myBarChart = Chart.Bar(canvas4,{
  data:data
});