document.addEventListener('DOMContentLoaded', () => {

    const valor_aquisicao = document.getElementById('valor_aquisicao');
    const itbiResultado = document.getElementById('itbi_resultado');
    const qtdUnidades = document.getElementById('qtd_unidades');
    const metragem = document.getElementById('metragem_da_obra');
    const custoMetro = document.getElementById('custo_por_metro');
    const resultado = document.getElementById('custo_total_obra');
    const lucro_construtor = document.getElementById('lucro_construtor');
    const custo_obra_bruto_element = document.getElementById('custo_obra_bruto');
    const condominioInput = document.getElementById('valor_condominio');
    const aguaInput = document.getElementById('valor_agua_energia');
    const custo_do_dinheiro = document.getElementById('custo_dinheiro');
    const custo_iptu = document.getElementById('valor_iptu');
    const resultadoFinanciamento = document.getElementById('resultado_financiamento');
    const preco_bruto_terreno = document.getElementById('preco_bruto_terreno');
    const custo_obra_financiamento = document.getElementById('custo_obra_financiamento');
    const rgiResultado = document.getElementById('rgi');
    const registroResultado = document.getElementById('certidao_etc');
    const custoTotalTerrenoEl = document.getElementById('custo_total_terreno');
    const habite_se = document.getElementById('habite_se');
    const resultado_operacional = document.getElementById('resultado_operacional');
    const total_total = document.getElementById('total_total');
    const vgvInput = document.getElementById('vgv');
    const corretor = document.getElementById('corretor');
    const propaganda = document.getElementById('propaganda');
    const ibti = 0.02;
    const rgi = 0.0075;
    const percentual_construtor = 0.1;
    const porcentagem_corretor = 0.06;
    const porcentagem_propaganda = 0.01;
    const habite_se_porcentagem = 0.04;
    const percentualIPTU = 0.007;
    const percentual_lucro = document.getElementById('percentual_lucro');

    // const VGV_PADRAO = 380000;
    const VGV_PADRAO = 0;


    function obterVGV() {
        return limparValorMoeda(vgvInput.value) || VGV_PADRAO;
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function limparValorMoeda(valor) {
        if (!valor) return 0;
        return Number(valor.replace(/\D/g, '')) / 100;
    }

    function limparValorTexto(texto) {
        if (!texto) return 0;
        return Number(texto.replace(/\D/g, '')) / 100;
    }

    function calcularIPTU() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const valorIPTU = valorTerreno * percentualIPTU;
        custo_iptu.value = formatarMoeda(valorIPTU);
    }

    function obterValorITBI() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        return valorTerreno * ibti;
    }

    function obterCustoTotalObra() {
        const unidades = parseFloat(qtdUnidades.value) || 0;
        const area = parseFloat(metragem.value) || 0;
        const custo = limparValorMoeda(custoMetro.value) || 0;
        return unidades * area * custo;
    }

    function calcularRGI() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();
        const baseCalculo = valorTerreno + custoObra;
        const valorRGI = baseCalculo * rgi;
        rgiResultado.textContent = `RGI (0,75%): ${formatarMoeda(valorRGI)}`;
    }

    function calcularCertidao() {
        const valorITBI_ = obterValorITBI();
        const custo_registro = valorITBI_ * 0.13;
        registroResultado.textContent = `Certidão (13% ITBI): ${formatarMoeda(custo_registro)}`;
    }

    function calcularCustoTotalTerreno() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const itbiValor = valorTerreno * ibti;
        const rgiValor = (valorTerreno + obterCustoTotalObra()) * rgi;
        const certidoes = itbiValor * 0.13;
        const totalTerreno = itbiValor + rgiValor + certidoes;
        custoTotalTerrenoEl.textContent = `Total do Terreno: ${formatarMoeda(totalTerreno)}`;
        return totalTerreno;
    }

    function calcularCustoObra() {
        const unidades = parseFloat(qtdUnidades.value) || 0;
        const area = parseFloat(metragem.value) || 0;
        const custo = limparValorMoeda(custoMetro.value) || 0;

        const custoConstrucao = unidades * area * custo;
        const resultado_construtor = custoConstrucao * percentual_construtor;

        lucro_construtor.textContent = `Lucro do Construtor 10%: ${formatarMoeda(resultado_construtor)}`;
        resultado.textContent = `Total: ${formatarMoeda(custoConstrucao)}`;

        const condominio = limparValorMoeda(condominioInput.value) || 0;
        const agua = limparValorMoeda(aguaInput.value) || 0;
        const custododinheiro = limparValorMoeda(custo_do_dinheiro.value) || 0;

        const custoBrutoObra = custoConstrucao + condominio + agua + custododinheiro;

        custo_obra_bruto_element.textContent = `Custo Da Obra: ${formatarMoeda(custoBrutoObra)}`;

        calcularResultadoOperacional();
    }

    function CustoObraValores() {
        const condominio = limparValorMoeda(condominioInput.value) || 0;
        const agua = limparValorMoeda(aguaInput.value) || 0;
        const custo_iptu_val = limparValorMoeda(custo_iptu.value) || 0;
        const custo_dinheiro = limparValorMoeda(custo_do_dinheiro.value) || 0;
        return condominio + agua + custo_iptu_val + custo_dinheiro;
    }


    function calcularTotal() {
        const condominio = limparValorMoeda(condominioInput.value) || 0;
        const agua = limparValorMoeda(aguaInput.value) || 0;

        const iptu = limparValorMoeda(custo_iptu.value) || 0;

        const totalFinanciamento = condominio + agua + iptu;

        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();
        const somaTotal = valorTerreno + custoObra;
        const valorHabiteSe = somaTotal * habite_se_porcentagem;

        habite_se.textContent = `Habite-se (4%): ${formatarMoeda(valorHabiteSe)}`;
        resultadoFinanciamento.textContent = formatarMoeda(totalFinanciamento);
        custo_obra_financiamento.textContent = resultadoFinanciamento.textContent;

        calcularRGI();
        calcularCertidao();
        calcularCustoTotalTerreno();
        calcularResultadoOperacional();
        calcularSomaDosCards();
        calcularTotalGeral();
        CalcularCorretagem();
        calcularLucroPadeiro();
        calcularLucroBruto();
    }

    function calcularResultadoOperacional() {
        const terreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const financiamento = limparValorTexto(resultadoFinanciamento.textContent) || 0;
        const obraBruta = limparValorTexto(custo_obra_bruto_element.textContent) || 0;
        const custoDinheiro = limparValorMoeda(custo_do_dinheiro.value) || 0;

        const total = terreno + financiamento + obraBruta + custoDinheiro;
        resultado_operacional.textContent = formatarMoeda(total);
    }


    function calcularSomaDosCards() {
        const custoTerrenoValor = calcularCustoTotalTerreno();
        const obraFinanciamentoTexto = CustoObraValores();

        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();
        const somaTotal = valorTerreno + custoObra;
        const valorHabiteSe = somaTotal * habite_se_porcentagem;

        const totalFinal = custoTerrenoValor + valorHabiteSe + obraFinanciamentoTexto;

        total_total.textContent = `Custo Operacional: ${formatarMoeda(totalFinal)}`;
        custo_obra_financiamento.textContent = total_total.textContent;
    }

    function calcularTotalGeral() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = limparValorTexto(custo_obra_bruto_element.textContent) || 0;
        const custoOperacional = limparValorTexto(total_total.textContent) || 0;

        const totalFinal = valorTerreno + custoObra + custoOperacional;

        resultado_operacional.textContent = `Total Operacional: ${formatarMoeda(totalFinal)}`;
        document.getElementById('valor_quitacao').textContent = `Total Quitação ${formatarMoeda(totalFinal)}`;
    }


    function CalcularCorretagem() {
        const vgv = obterVGV();
        const corretor_valor = vgv * porcentagem_corretor;
        const propaganda_valor = vgv * porcentagem_propaganda;
        const total = corretor_valor + propaganda_valor;

        corretor.textContent = formatarMoeda(corretor_valor);
        propaganda.textContent = formatarMoeda(propaganda_valor);

        const totalCorretagemEl = document.getElementById('total_corretagem');
        totalCorretagemEl.textContent = `Total Corretagem: ${formatarMoeda(total)}`;

        document.getElementById('resultado_corretagem').textContent = totalCorretagemEl.textContent;
    }


    function calcularLucroBruto() {
        const quitacao = limparValorMoeda(document.getElementById('valor_quitacao').textContent);
        const corretagem = limparValorMoeda(document.getElementById('resultado_corretagem').textContent);
        const vgv = obterVGV();
        const imposto = (vgv - quitacao) * 0.15;


        document.getElementById('imposto_de_renda').textContent = ` Imposto de Renda: ${formatarMoeda(imposto)}`;
        const lucro = vgv - quitacao - imposto - corretagem;
        document.getElementById('lucro_liquido').textContent = `Lucro Liquido: ${formatarMoeda(lucro)}`;

        const valor_lucro = (lucro / vgv) * 100;

        document.getElementById('percentual_lucro').textContent = `Percentual Lucro: ${valor_lucro.toFixed(0)}%`;

    }

    function calcularLucroPadeiro() {
        const quitacao = limparValorMoeda(document.getElementById('valor_quitacao').textContent);
        const vgv = obterVGV();

        const lucroPadeiro = vgv - quitacao;

        document.getElementById('lucro_bruto').textContent = `Lucro do Bruto: ${formatarMoeda(lucroPadeiro)}`;
    }

    // -------------------------------------------------------------------------

    function aplicarMascaraMoeda(input) {
        input.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            let valorNumerico = Number(valor) / 100;
            e.target.value = formatarMoeda(valorNumerico);
            calcularTotal();
        });
    }

    aplicarMascaraMoeda(condominioInput);
    aplicarMascaraMoeda(aguaInput);
    aplicarMascaraMoeda(custo_do_dinheiro);
    aplicarMascaraMoeda(vgvInput);

    valor_aquisicao.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        let valorNumerico = Number(valor) / 100;
        e.target.value = formatarMoeda(valorNumerico);

        let valorITBI = valorNumerico * ibti;
        itbiResultado.textContent = `Resultado ITBI (2%): ${formatarMoeda(valorITBI)}`;

        preco_bruto_terreno.textContent = `Valor Bruto do Terreno: ${formatarMoeda(valorNumerico)}`;

        calcularIPTU();
        calcularResultadoOperacional();
        calcularTotal();
    });

    custoMetro.addEventListener('change', () => {
        calcularCustoObra();
        calcularTotal();
    });

    qtdUnidades.addEventListener('change', () => {
        calcularCustoObra();
        calcularTotal();
    });

    metragem.addEventListener('change', () => {
        calcularCustoObra();
        calcularTotal();
    });

    vgvInput.addEventListener('input', () => {
        CalcularCorretagem();
    });

    condominioInput.addEventListener('change', calcularResultadoOperacional);
    aguaInput.addEventListener('change', calcularResultadoOperacional);
    custo_obra_bruto_element.addEventListener('DOMSubtreeModified', calcularResultadoOperacional);

    preco_bruto_terreno.textContent = `Valor Bruto do Terreno: ${valor_aquisicao.value}`;
    custo_obra_financiamento.textContent = `Custo Obra e Financiamento: ${resultadoFinanciamento.textContent}`;

    calcularIPTU();
    calcularCustoObra();
    calcularTotal();
    CalcularCorretagem();
});
