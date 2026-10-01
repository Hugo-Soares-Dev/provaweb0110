// Arquivo de configuração e processamento do Partido ____

let candidatos = [];
let candidatosPDisney = [];
async function carregarCandidatos() {
    // TODO: Consultar o arquivo 'candidatos.json'
    // TODO: Obter os registros associados ao seu partido
    // TODO: Adicionar os campos de 'cargo' e 'numero' para cada um dos candidatos
    // TODO: Armazenar no array 'candidatos'
    try {
        const response = await fetch('candidatos.json');
        const dados = await response.json();
        candidatos = dados.PDisney;
        candidatosPDisney = candidatos;
        const lista = document.getElementById("lstCandidatos");
        lista.innerHTML = "";
        candidatosPDisney.forEach(candidato => {
            const option = document.createElement("option");

            option.value = candidato.nome;
            option.textContent = candidato.nome;

            lista.appendChild(option);
            
        });
    }catch (error) {
         // console.error exibe o erro no console de desenvolvedor do navegador.
                console.error("erro ao carregar", error);

                // alert mostra uma mensagem simples para a pessoa que está usando a página.
                alert("Não foi possível carregar o arquivo");
    }
}
carregarCandidatos();

function validarNumeroCandidato(numero) {
    // TODO: Implementar as regras de validação para a numeração do candidato
}