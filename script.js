var PAGE_SIZE = 1000; // Número de registros por página
let currentPage = 0;
let data = [];


document.getElementById("zoomIn").addEventListener('click', function(){
    if(PAGE_SIZE > 1000){
        PAGE_SIZE -= 1000
        plotData()    
    }
    
})

document.getElementById("zoomOut").addEventListener('click', function(){
    PAGE_SIZE += 1000    
    plotData()
})

document.getElementById('labelinput').addEventListener('click', function(){
    document.getElementById('csvFileInput').click()
})

// Evento de carregamento do arquivo CSV
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                data = results.data.map(row => parseFloat(row[0])).filter(value => !isNaN(value));
                currentPage = 0;
                plotData();
            },
            error: function(error) {
                console.error("Erro ao ler o arquivo CSV:", error);
            }
        });
    }
});

// Função para plotar os dados da página atual
function plotData() {
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, data.length);
    const paginatedData = data.slice(startIndex, endIndex);

    const ctx = document.getElementById('csvChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy(); // Destruir gráfico anterior para evitar sobreposição
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: paginatedData.map((_, index) => startIndex + Math.round(((index + 1) * 19.72)/1000 * 10)/10),
            datasets: [{
                label: `EMG (Registros ${startIndex + 1} a ${endIndex})`,
                data: paginatedData,
                borderColor: 'rgba(38, 21, 133, 1)',
                borderWidth: 2,
                fill: 'rgb(255,255,255)',
                pointRadius: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'tempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'registro'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Botões de navegação
document.getElementById('nextPage').addEventListener('click', function() {
    if ((currentPage + 1) * PAGE_SIZE < data.length) {
        currentPage++;
        plotData();
    }
});

document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--;
        plotData();
    }
});
