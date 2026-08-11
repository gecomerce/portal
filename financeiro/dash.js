window.addEventListener('load', () => {

    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-AgllCG8-ChGKNmiFuqkpIJyexupyfOg7cFf1lLpr7tfK2ifHEa0cC3qCnABV3RENV9cMWvboXXBT/pub?gid=1255807173&single=true&output=csv";

    const myChart = echarts.init(document.getElementById('pie'));
    const myBarChartEntradas = echarts.init(document.getElementById('bar_pago'));
    const myBarChartSaidas = echarts.init(document.getElementById('bar_dev'));
    const saldoElemento = document.getElementById('saldo');
    const valorPagoElemento = document.getElementById('valor_pago');
    const valorDevidoElemento = document.getElementById('valor_devido');


    let movimentacoesBrutas = [];

    function getCorRotulo() {
        return document.body.classList.contains('dark-mode-variables') ? '#FFFFFF' : '#000000';
    }

    // ------------------ PARSER DE VALORES EM REAIS ------------------
    function parseReal(valor) {
        if (!valor) return 0;
        return parseFloat(
            valor
                .replace(/[R$\s]/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        ) || 0;
    }

    // ------------------ PIZZA ------------------
    function inicializarGraficoPizza() {
        myChart.setOption({
            color: ['#2FCF8A', '#F80800'],
            tooltip: { show: false },
            series: [{
                type: 'pie',
                radius: ['40%', '60%'],
                label: {
                    show: true,
                    position: 'outside',
                    color: getCorRotulo(),
                    formatter: params =>
                        `${params.name}: ${params.value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}`
                },
                data: []
            }]
        });
    }

    function graficoPizza(dados) {
        let totalPago = 0;
        let totalDevido = 0;

        dados.forEach(item => {
            totalPago += item.total_pago;
            totalDevido += item.total_devido;
        });

        myChart.setOption({
            series: [{
                data: [
                    { name: "Pago", value: totalPago },
                    { name: "Devido", value: totalDevido }
                ],
                label: { color: getCorRotulo() }
            }]
        });
    }

    // ------------------ BARRAS TOTAL DEVIDO ------------------

    function graficoTotalDevido(dados) {
        const agrupado = {};

        dados.forEach(item => {
            if (!agrupado[item.centro_custo]) agrupado[item.centro_custo] = 0;
            agrupado[item.centro_custo] += item.total_devido;
        });

        const ordenado = Object.entries(agrupado)
            .map(([centro, valor]) => ({ centro, valor }))
            .sort((b, a) => b.valor - a.valor);

        const labels = ordenado.map(i => i.centro);
        const valores = ordenado.map(i => i.valor);

        myBarChartEntradas.setOption({
            tooltip: { show: false },
            grid: { left: '10%', right: '20%', top: '5%', bottom: '8%' },
            xAxis: { show: false },
            yAxis: { type: 'category', data: labels, axisLabel: { color: getCorRotulo() } },
            series: [{
                type: 'bar',
                data: valores,
                itemStyle: { color: '#F80800' },
                label: {
                    show: true,
                    position: 'right',
                    formatter: p => p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    color: getCorRotulo()
                }
            }]
        });
    }

    // ------------------ BARRAS TOTAL PAGO ------------------

    function graficoTotalPago(dados) {
        const agrupado = {};

        dados.forEach(item => {
            if (!agrupado[item.centro_custo]) agrupado[item.centro_custo] = 0;
            agrupado[item.centro_custo] += item.total_pago;
        });

        const ordenado = Object.entries(agrupado)
            .map(([centro, valor]) => ({ centro, valor }))
            .sort((b, a) => b.valor - a.valor);

        const labels = ordenado.map(i => i.centro);
        const valores = ordenado.map(i => i.valor);

        myBarChartSaidas.setOption({
            tooltip: { show: false },
            grid: { left: '10%', right: '20%', top: '5%', bottom: '8%' },
            xAxis: { show: false },
            yAxis: { type: 'category', data: labels, axisLabel: { color: getCorRotulo() } },
            series: [{
                type: 'bar',
                data: valores,
                itemStyle: { color: '#2FCF8A' },
                label: {
                    show: true,
                    position: 'right',
                    formatter: p => p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    color: "#050404"
                }
            }]
        });
    }

    // ------------------ TABELA ------------------
    function filtrarDados() {
        return movimentacoesBrutas;
    }

    function atualizarTabela() {
        const dados = filtrarDados();
        const container = document.getElementById('tabela-movimentacoes');

        if (!dados.length) {
            container.innerHTML = "<p style='color:#888'>Nenhum dado encontrado.</p>";
            return;
        }

        let html = `
        <table>
            <thead>
                <tr>
                    <th>Centro de Custo</th>
                    <th>Descrição</th>
                    <th>Entrada</th>
                    <th>Parcelas Pagas</th>
                    <th>Parcelas Devidas</th>
                    <th>Valor Parcela</th>
                    <th>Total Pago</th>
                    <th>Total Devido</th>
                </tr>
            </thead>
            <tbody>
        `;

        dados.forEach(item => {
            html += `
            <tr>
                <td>${item.centro_custo}</td>
                <td>${item.descricao}</td>
                <td>${item.valor_entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${item.parcelas_pagas}</td>
                <td>${item.parcelas_devidas}</td>
                <td>${item.valor_parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${item.total_pago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${item.total_devido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    // ------------------ SALDO ------------------

    function atualizarSaldo() {
        const dados = filtrarDados();
        let totalPago = 0;
        let totalDevido = 0;

        dados.forEach(item => {
            totalPago += item.total_pago;
            totalDevido += item.total_devido;
        });

        const saldo = totalPago - totalDevido;
        saldoElemento.innerHTML = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        saldoElemento.style.color = saldo >= 0 ? "#00bbf9" : "red";
    }

    // ------------------ ATUALIZAR TOTAIS ------------------

    function atualizarTotais() {
        const dados = filtrarDados();

        let totalPago = 0;
        let totalDevido = 0;

        dados.forEach(item => {
            totalPago += item.total_pago;
            totalDevido += item.total_devido;
        });

        valorPagoElemento.innerHTML = totalPago.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        valorDevidoElemento.innerHTML = totalDevido.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // ------------------ ATUALIZAR TUDO ------------------
    function atualizarGraficos() {
        const dados = filtrarDados();

        graficoPizza(dados);
        graficoTotalDevido(dados);
        graficoTotalPago(dados);
        atualizarTabela();
        atualizarSaldo();
        atualizarTotais();
    }

    inicializarGraficoPizza();

    // ------------------ FETCH ------------------
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar planilha");
            return response.text();
        })
        .then(csvText => {

            const resultados = Papa.parse(csvText, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                transformHeader: h => h.trim().toLowerCase()
            });

            movimentacoesBrutas = resultados.data.map(row => {
                return {
                    centro_custo: row['centro de custo'],
                    descricao: row['descrição'],
                    valor_entrada: parseReal(row['valor entrada']),
                    parcelas_pagas: parseInt(row['n parcelas pagas']) || 0,
                    parcelas_devidas: parseInt(row['n parcelas devidas']) || 0,
                    valor_parcela: parseReal(row['valor parcela']),
                    total_pago: parseReal(row['total pago']),
                    total_devido: parseReal(row['total dev'])
                };
            });

            atualizarGraficos();
        })
        .catch(error => console.error(error));

});
