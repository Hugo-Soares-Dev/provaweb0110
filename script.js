// Arquivo de configuração e processamento dos partidos

const PARTIDOS = {
    "91": "PDisney",
    "92": "PMarvel",
    "93": "PDC",
    "94": "PMauricio"
};
const registroCandidaturas = [];
let candidatos = [];
let candidatosPDisney = [];
let partidoAtual = null;

async function carregarCandidatos(nomePartido) {
    try {
        const response = await fetch('candidatos.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dados = await response.json();
        candidatos = Array.isArray(dados[nomePartido]) ? dados[nomePartido] : [];
        candidatosPDisney = candidatos;
        const lista = document.getElementById("lstCandidatos");
        lista.innerHTML = "";
        candidatosPDisney.forEach(candidato => {
            const option = document.createElement("option");

            option.value = candidato.nome;
            option.textContent = candidato.nome;

            lista.appendChild(option);
            
        });
    } catch (error) {
        console.error("Erro ao carregar candidatos:", error);
        exibirMensagem("Não foi possível carregar os candidatos. Use o Live Server.", true);
    }
}

function validarNumeroCandidato(numero) {
    const cargo = document.getElementById("lstCargos").value;
    const tamanhos = {
        "Presidente": 2,
        "Governador(a)": 2,
        "Senador(a)": 3,
        "Deputado(a) Federal": 4,
        "Deputado(a) Estadual": 5
    };
    const tamanhoEsperado = tamanhos[cargo];

    if (!/^\d+$/.test(numero)) {
        return "O número deve conter apenas dígitos.";
    }
    if (!partidoAtual || !numero.startsWith(partidoAtual.codigo)) {
        return `O número deve começar com ${partidoAtual ? partidoAtual.codigo : "o código do partido"}.`;
    }
    if (numero.length !== tamanhoEsperado) {
        return `Para ${cargo}, o número deve ter ${tamanhoEsperado} dígitos.`;
    }
    return "";
}

function exibirMensagem(mensagem, erro = false) {
    const feedback = document.getElementById("msgFeedbackAcao");
    feedback.textContent = mensagem;
    feedback.className = erro ? "erro" : "sucesso";
}

function processarPartido() {
    const numeroPartido = document.getElementById("txtNumeroPartido").value.trim();
    const mensagem = document.getElementById("msgErroPartido");
    const nomePartido = document.getElementById("lblNomePartido");

    const nomeSelecionado = PARTIDOS[numeroPartido];
    if (!nomeSelecionado) {
        mensagem.textContent = "Código inválido. Use 91, 92, 93 ou 94.";
        nomePartido.textContent = "---";
        partidoAtual = null;
        candidatos = [];
        candidatosPDisney = [];
        document.getElementById("lstCandidatos").innerHTML = "";
        return;
    }

    if (partidoAtual && partidoAtual.codigo !== numeroPartido) {
        registroCandidaturas.length = 0;
        atualizarListaRegistrados();
    }

    partidoAtual = { codigo: numeroPartido, nome: nomeSelecionado };
    mensagem.textContent = "";
    nomePartido.textContent = nomeSelecionado;
    carregarCandidatos(nomeSelecionado);
}

function selecionarCandidato() {
    const nomeSelecionado = document.getElementById("lstCandidatos").value;
    const candidatoSelecionado = candidatosPDisney.find(
        candidato => candidato.nome === nomeSelecionado
    );

    if (!candidatoSelecionado) {
        document.getElementById("painelCandidato").style.display = "none";
        return;
    }

    document.getElementById("infoNome").textContent = candidatoSelecionado.nome;
    document.getElementById("infoCargo").textContent = document.getElementById("lstCargos").value;
    document.getElementById("infoNumero").textContent = "-";
    document.getElementById("infoFoto").src = candidatoSelecionado.foto;
    document.getElementById("painelCandidato").style.display = "block";
}

function registrarCandidatura() {
    const nome = document.getElementById("lstCandidatos").value;
    const cargo = document.getElementById("lstCargos").value;
    const numero = document.getElementById("txtNumeroCandidato").value.trim();
    const candidato = candidatosPDisney.find(item => item.nome === nome);

    if (!candidato || !cargo || !numero) {
        exibirMensagem("Preencha candidato, cargo e número.", true);
        return;
    }

    const erroNumero = validarNumeroCandidato(numero);
    if (erroNumero) {
        document.getElementById("msgErroNumero").textContent = erroNumero;
        exibirMensagem("Número de candidato inválido.", true);
        return;
    }

    if (registroCandidaturas.some(item => item.nome === nome)) {
        exibirMensagem("Esse candidato já foi indicado para um cargo.", true);
        return;
    }

    const limites = {
        "Presidente": 1,
        "Governador(a)": 1,
        "Senador(a)": 2
    };
    const quantidadeNoCargo = registroCandidaturas.filter(item => item.cargo === cargo).length;
    if (limites[cargo] && quantidadeNoCargo >= limites[cargo]) {
        exibirMensagem(`O cargo ${cargo} já atingiu o limite de vagas.`, true);
        return;
    }

    registroCandidaturas.push({
        nome: candidato.nome,
        numero,
        foto: candidato.foto,
        cargo
    });
    document.getElementById("msgErroNumero").textContent = "";
    atualizarListaRegistrados();
    selecionarCandidato();
    document.getElementById("infoNumero").textContent = numero;
    exibirMensagem("Candidatura registrada com sucesso.");
}

function atualizarListaRegistrados() {
    const lista = document.getElementById("listaRegistrados");
    lista.innerHTML = "";

    registroCandidaturas.forEach(candidatura => {
        const item = document.createElement("li");
        item.textContent = `${candidatura.nome} - ${candidatura.cargo} - nº ${candidatura.numero}`;
        lista.appendChild(item);
    });
}

function gravarEEnviarTSE() {
    if (!partidoAtual || registroCandidaturas.length === 0) {
        exibirMensagem("Registre pelo menos uma candidatura antes de enviar.", true);
        return;
    }

    const arquivo = JSON.stringify(registroCandidaturas, null, 2);
    const blob = new Blob([arquivo], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${partidoAtual.nome}.json`;
    link.click();
    URL.revokeObjectURL(url);
    exibirMensagem(`Arquivo ${partidoAtual.nome}.json gerado com sucesso.`);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lstCandidatos").innerHTML = "";
});