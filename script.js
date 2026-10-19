let tarefas = [];

window.onload = function() {
    const tarefasSalvas = localStorage.getItem('kanban_tarefas');
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
        renderizarTarefas();
    }
}

function abrirModal() {
    document.getElementById('modal-tarefa').classList.add('active');
    document.getElementById('modal-titulo').innerText = "Criar Nova Tarefa";
    document.getElementById('form-tarefa').reset();
    document.getElementById('tarefa-id').value = "";
}

function fecharModal() {
    document.getElementById('modal-tarefa').classList.remove('active');
}

function salvarTarefa(event) {
    event.preventDefault();

    const id = document.getElementById('tarefa-id').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const prioridade = document.getElementById('prioridade').value;

    if (id) {
        const indice = tarefas.findIndex(t => t.id == id);
        if (indice !== -1) {
            tarefas[indice].titulo = titulo;
            tarefas[indice].descricao = descricao;
            tarefas[indice].prioridade = prioridade;
        }
    } else {
        const novaTarefa = {
            id: Date.now(),
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade,
            coluna: 'a-fazer'
        };
        tarefas.push(novaTarefa);
    }

    salvarNoLocalStorage();
    renderizarTarefas();
    fecharModal();
}

function renderizarTarefas() {
    document.getElementById('container-a-fazer').innerHTML = '';
    document.getElementById('container-em-progresso').innerHTML = '';
    document.getElementById('container-concluido').innerHTML = '';

    tarefas.forEach(tarefa => {
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.setAttribute('draggable', 'true');
        card.setAttribute('ondragstart', `iniciarArrasto(event, ${tarefa.id})`);
        card.setAttribute('id', `tarefa-${tarefa.id}`);

        card.innerHTML = `
            <h3>${tarefa.titulo}</h3>
            <p>${tarefa.descricao || 'Sem descrição...'}</p>
            <span class="badge ${tarefa.prioridade}">${tarefa.prioridade}</span>
            <div class="card-actions">
                <button class="btn-edit" onclick="editarTarefa(${tarefa.id})">✏️ Editar</button>
                <button class="btn-delete" onclick="deletarTarefa(${tarefa.id})">❌ Deletar</button>
            </div>
        `;

        if (tarefa.coluna === 'a-fazer') {
            document.getElementById('container-a-fazer').appendChild(card);
        } else if (tarefa.coluna === 'em-progresso') {
            document.getElementById('container-em-progresso').appendChild(card);
        } else if (tarefa.coluna === 'concluido') {
            document.getElementById('container-concluido').appendChild(card);
        }
    });
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id == id);
    if (tarefa) {
        abrirModal();
        document.getElementById('modal-titulo').innerText = "Editar Tarefa";
        document.getElementById('tarefa-id').value = tarefa.id;
        document.getElementById('titulo').value = tarefa.titulo;
        document.getElementById('descricao').value = tarefa.descricao;
        document.getElementById('prioridade').value = tarefa.prioridade;
    }
}

function deletarTarefa(id) {
    if (confirm("Tem certeza que deseja excluir esta tarefa empresarial?")) {
        tarefas = tarefas.filter(t => t.id != id);
        salvarNoLocalStorage();
        renderizarTarefas();
    }
}

function salvarNoLocalStorage() {
    localStorage.setItem('kanban_tarefas', JSON.stringify(tarefas));
}

function iniciarArrasto(event, id) {
    event.dataTransfer.setData('text/plain', id);
}

function permitirSoltar(event) {
    event.preventDefault();
}

function soltarTarefa(event, nomeColuna) {
    event.preventDefault();
    const idTarefa = event.dataTransfer.getData('text/plain');
    
    const tarefa = tarefas.find(t => t.id == idTarefa);
    if (tarefa) {
        tarefa.coluna = nomeColuna;
        salvarNoLocalStorage();
        renderizarTarefas();
    }
}
