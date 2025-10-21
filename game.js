document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO PLAYER DE MÚSICA ---
    const playlist = [
        'musicas/musica1.mp3', // Verifique nomes e pasta
        'musicas/musica2.mp3',
        'musicas/musica3.ogg'
    ];
    let currentTrackIndex = 0;

    const audioPlayer = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    function loadTrack(trackIndex) {
        if (playlist.length === 0) {
            console.warn("Playlist vazia...");
            playPauseBtn.disabled = true; prevBtn.disabled = true; nextBtn.disabled = true;
            return;
        }
        currentTrackIndex = (trackIndex + playlist.length) % playlist.length;
        audioPlayer.src = playlist[currentTrackIndex];
        audioPlayer.load();
        console.log("Carregando música:", playlist[currentTrackIndex]);
    }
    function playMusic() {
        if (playlist.length === 0 || !audioPlayer.src) return;
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                playPauseBtn.textContent = '⏸️'; playPauseBtn.title = 'Pausar';
            }).catch(error => {
                console.log("Autoplay bloqueado...");
                playPauseBtn.textContent = '▶️'; playPauseBtn.title = 'Tocar';
            });
        }
    }
    function pauseMusic() {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️'; playPauseBtn.title = 'Tocar';
    }
    function togglePlayPause() { if (audioPlayer.paused) { playMusic(); } else { pauseMusic(); } }
    function playNext() { loadTrack(currentTrackIndex + 1); playMusic(); }
    function playPrev() { loadTrack(currentTrackIndex - 1); playMusic(); }


    // --- MODO DESENVOLVEDOR ---
    let isDevMode = false;
    const devNextLevelBtn = document.getElementById('dev-next-level');
    function checkDevMode() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dev') === 'true') { isDevMode = true; devNextLevelBtn.classList.remove('hidden'); console.log("Modo Dev Ativado."); }
    }
    function devSkipLevel() {
        if (!isDevMode) return;
        const level = levels[currentLevel];
        if (level && level.solution) { codeEditor.value = level.solution; runCode(); }
        else { console.warn(`[Modo Dev] Solução não encontrada para o nível ${currentLevel + 1}.`); }
    }

    // --- DEFINIÇÃO DOS NÍVEIS ---
    const levels = [
        // (Missões 1-16 são idênticas ao código anterior)
        // ... (Cole as missões 1-16 da resposta anterior aqui) ...
        {
            title: "Missão 1: Despertar (print)",
            description: "Comandante! Caí. Estou no modo de emergência. Use 'print(\"Bit, acorde!\")' para me reativar.",
            starterCode: "# Use o comando print() para acordar o Bit\n",
            solution: "print(\"Bit, acorde!\")",
            check: (output, helpers) => {
                if (output.trim() === "Bit, acorde!") {
                    helpers.robotSpeak("Sistema... online!");
                    helpers.robotWakeUp();
                    setTimeout(() => { helpers.showSuccess("Bit ativado!"); helpers.loadNextLevel(); }, 2000);
                    return true;
                }
                helpers.robotSpeak("ZZzzz... comando inválido..."); helpers.showError("Bit não acordou."); return false;
            }
        },
        {
            title: "Missão 2: Carga (Aritmética)",
            description: "Energia em 10%! A estação tem 90 unidades. Some 10 + 90 para calcular o total. Imprima o resultado.",
            starterCode: "# Imprima o resultado de 10 + 90\n",
            solution: "print(10 + 90)",
            check: (output, helpers) => {
                if (output.trim() === "100") {
                    helpers.robotSpeak("Indo para a estação...");
                    helpers.robotMoveTo('power');
                    setTimeout(() => { helpers.updateEnergyBar(100); helpers.robotSpeak("Energia em 100%!"); }, 1800);
                    setTimeout(() => { helpers.robotSpeak("Retornando..."); helpers.robotMoveTo('start'); }, 3300);
                    setTimeout(() => { helpers.showSuccess("Bateria carregada!"); helpers.loadNextLevel(); }, 5000);
                    return true;
                }
                helpers.robotSpeak("Cálculo incorreto."); helpers.showError("Não recebi o valor 100."); return false;
            }
        },
        {
            title: "Missão 3: Planeta (Variáveis)",
            description: "Onde estou? Meu scanner diz 'Vórtice'. Armazene o nome 'Vórtice' em uma variável 'planeta'. Imprima a variável.",
            starterCode: "# Crie a variável planeta com o valor \"Vórtice\"\nplaneta = \"\"\n\n# Imprima a variável\n",
            solution: "planeta = \"Vórtice\"\n\nprint(planeta)\n",
            check: (output, helpers) => {
                if (output.trim() === "Vórtice") {
                    helpers.robotSpeak("Planeta Vórtice... anotado.");
                    setTimeout(() => { helpers.showSuccess("Localização armazenada!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Não li o nome."); helpers.showError("Verifique a variável e o print."); return false;
            }
        },
        {
            title: "Missão 4: Mapa (if/else)",
            description: "O console do foguete! A senha é '1234'. Se a senha for 1234, imprima 'Mapa Ativo'. Senão, imprima 'Acesso Negado'.",
            starterCode: "senha = 1234\n\nif senha == 1234:\n  # Imprima 'Mapa Ativo'\n  pass\nelse:\n  # Imprima 'Acesso Negado'\n  pass\n",
            solution: "senha = 1234\n\nif senha == 1234:\n  print(\"Mapa Ativo\")\nelse:\n  print(\"Acesso Negado\")\n",
            check: (output, helpers) => {
                if (output.trim() === "Mapa Ativo") {
                    helpers.robotSpeak("Consegui! O mapa mostra 3 peças. Inventário online!");
                    helpers.showInventory();
                    setTimeout(() => { helpers.showSuccess("Mapa desbloqueado!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Bip! Bop! Senha errada."); helpers.showError("O console não desbloqueou."); return false;
            }
        },
        {
            title: "Missão 5: O Motor (⚙️) - (for loop)",
            description: "Peça 1: O Motor (⚙️) está na caverna. Escaneie 3 vezes usando 'for i in range(3)'. Imprima 'Escaneando...' em cada vez.",
            starterCode: "# Use 'for i in range(3):'\n",
            solution: "for i in range(3):\n  print(\"Escaneando...\")\n",
            check: (output, helpers) => {
                const lines = output.trim().split('\n');
                if (lines.length === 3 && lines.every(line => line === "Escaneando...")) {
                    helpers.robotSpeak("Sinal forte! É lá mesmo.");
                    helpers.robotMoveTo('cave');
                    setTimeout(() => { helpers.robotSpeak("Achei o Motor! (⚙️)"); helpers.collectRocketPart('part-motor', '#marker-motor'); }, 2000);
                    setTimeout(() => { helpers.robotMoveTo('rocket'); }, 3500);
                    setTimeout(() => { helpers.robotSpeak("Instalando Motor!"); helpers.buildRocketPart('motor'); }, 5500);
                    setTimeout(() => { helpers.robotMoveTo('start'); }, 7000);
                    setTimeout(() => { helpers.showSuccess("Peça instalada!"); helpers.loadNextLevel(); }, 8800);
                    return true;
                }
                helpers.robotSpeak("Scan falhou."); helpers.showError("Preciso de 3 'Escaneando...'."); return false;
            }
        },
        {
            title: "Missão 6: O Tanque (⛽) - (list)",
            description: "Peça 2: O Tanque (⛽) está no pântano. O caminho seguro é ['pedra', 'pedra', 'tronco']. Crie uma lista 'caminho' com esses 3 textos e imprima a lista.",
            starterCode: "# Crie a lista 'caminho'\ncaminho = []\n\nprint(caminho)\n",
            solution: "caminho = [\"pedra\", \"pedra\", \"tronco\"]\n\nprint(caminho)\n",
            check: (output, helpers) => {
                if (output.trim().includes("['pedra', 'pedra', 'tronco']")) {
                    helpers.robotSpeak("Lista de caminho criada!");
                    setTimeout(() => { helpers.showSuccess("Caminho definido!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Lista errada."); helpers.showError("Verifique os itens da lista 'caminho'."); return false;
            }
        },
        {
            title: "Missão 7: O Tanque (⛽) - (list index)",
            description: "Preciso do primeiro passo (índice 0). Imprima o primeiro item da sua lista 'caminho'.",
            starterCode: "caminho = [\"pedra\", \"pedra\", \"tronco\"]\n\n# Imprima o item de índice 0\n",
            solution: "caminho = [\"pedra\", \"pedra\", \"tronco\"]\n\nprint(caminho[0])\n",
            check: (output, helpers) => {
                if (output.trim() === "pedra") {
                    helpers.robotSpeak("Entendido: 'pedra'. Atravessando...");
                    helpers.robotMoveTo('swamp');
                    setTimeout(() => { helpers.robotSpeak("Consegui! Peguei o Tanque! (⛽)"); helpers.collectRocketPart('part-tanque', '#marker-tanque'); }, 2000);
                    setTimeout(() => { helpers.robotMoveTo('rocket'); }, 3500);
                    setTimeout(() => { helpers.robotSpeak("Instalando Tanque!"); helpers.buildRocketPart('tanque'); }, 5500);
                    setTimeout(() => { helpers.robotMoveTo('start'); }, 7000);
                    setTimeout(() => { helpers.showSuccess("Peça instalada!"); helpers.loadNextLevel(); }, 8800);
                    return true;
                }
                helpers.robotSpeak("Índice errado."); helpers.showError("Use 'caminho[0]' para pegar o item."); return false;
            }
        },
        {
            title: "Missão 8: O Tanque (⛽) - (list append)",
            description: "Espere! Falta um passo! Adicione 'terra_firme' ao FINAL da sua lista 'caminho' usando .append(). Imprima a lista completa.",
            starterCode: "caminho = [\"pedra\", \"pedra\", \"tronco\"]\n\n# Use caminho.append(...) aqui\n\n\nprint(caminho)\n",
            solution: "caminho = [\"pedra\", \"pedra\", \"tronco\"]\n\ncaminho.append(\"terra_firme\")\n\nprint(caminho)\n",
            check: (output, helpers) => {
                if (output.trim().includes("'terra_firme']")) {
                    helpers.robotSpeak("Ufa! Agora o caminho está completo.");
                    setTimeout(() => { helpers.showSuccess("Lista atualizada!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Não adicionei."); helpers.showError("Use caminho.append(\"terra_firme\")."); return false;
            }
        },
        {
            title: "Missão 9: O Bico (🔺) - (def)",
            description: "Peça 3: O Bico (🔺) está no penhasco. Defina uma função 'pular()' que imprima 'Preparando pulo!'.",
            starterCode: "# Defina a função pular\ndef pular():\n  # Imprima 'Preparando pulo!'\n  pass\n\n# Chame a função para testar\npular()\n",
            solution: "def pular():\n  print(\"Preparando pulo!\")\n\n# Chame a função para testar\npular()\n",
            check: (output, helpers) => {
                if (output.trim() === "Preparando pulo!") {
                    helpers.robotSpeak("Função 'pular' compilada!");
                    setTimeout(() => { helpers.showSuccess("Função pronta!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Função não definida."); helpers.showError("Defina e chame a função 'pular'."); return false;
            }
        },
        {
            title: "Missão 10: O Bico (🔺) - (return)",
            description: "Preciso de 50 de energia para pular. Crie a função 'calcular_forca()' que RETORNA (return) o número 50. Imprima o resultado da função.",
            starterCode: "def calcular_forca():\n  # Retorne o número 50\n  pass\n\n# Imprima o resultado da função\n",
            solution: "def calcular_forca():\n  return 50\n\nprint(calcular_forca())\n",
            check: (output, helpers) => {
                if (output.trim() === "50") {
                    helpers.robotSpeak("Força do pulo: 50. Iniciando!");
                    helpers.robotMoveTo('cliff');
                    setTimeout(() => { helpers.robotJump(); }, 1600);
                    setTimeout(() => { helpers.robotSpeak("Peguei o Bico! (🔺)"); helpers.collectRocketPart('part-bico', '#marker-bico'); }, 2700);
                    setTimeout(() => { helpers.robotMoveTo('rocket'); }, 4000);
                    setTimeout(() => { helpers.robotSpeak("Instalando Bico!"); helpers.buildRocketPart('bico'); }, 5800);
                    setTimeout(() => { helpers.robotMoveTo('start'); }, 7000);
                    setTimeout(() => { helpers.showSuccess("Peça instalada! Foguete completo!"); helpers.loadNextLevel(); }, 8800);
                    return true;
                }
                helpers.robotSpeak("Não recebi a força."); helpers.showError("Use 'return 50' e 'print()'."); return false;
            }
        },
        {
            title: "Missão 11: Combustível (dict)",
            description: "Foguete montado! Achei 'Fóton'. Crie um dicionário 'combustivel' com a chave 'litros' e o valor 100. Imprima o dicionário.",
            starterCode: "# Crie o dicionário 'combustivel'\ncombustivel = {}\n\nprint(combustivel)\n",
            solution: "combustivel = {\"litros\": 100}\n\nprint(combustivel)\n",
            check: (output, helpers) => {
                if (output.trim().includes("'litros': 100")) {
                    helpers.robotSpeak("Dicionário de combustível criado.");
                    setTimeout(() => { helpers.showSuccess("Mineral processado!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Dicionário incompleto."); helpers.showError("Crie a chave 'litros' com o valor 100."); return false;
            }
        },
        {
            title: "Missão 12: Combustível (dict access)",
            description: "Quanto combustível temos? Imprima o valor da chave 'litros' do seu dicionário 'combustivel'.",
            starterCode: "combustivel = {\"litros\": 100}\n\n# Imprima o valor da chave 'litros'\n",
            solution: "combustivel = {\"litros\": 100}\n\nprint(combustivel[\"litros\"])\n",
            check: (output, helpers) => {
                if (output.trim() === "100") {
                    helpers.robotSpeak("100 litros! Abastecendo...");
                    helpers.robotMoveTo('rocket');
                    setTimeout(() => { helpers.fuelRocket(true); }, 2000);
                    setTimeout(() => { helpers.robotSpeak("Foguete abastecido!"); }, 3500);
                    setTimeout(() => { helpers.showSuccess("Pronto para decolar!"); helpers.loadNextLevel(); }, 5000);
                    return true;
                }
                helpers.robotSpeak("Leitura errada."); helpers.showError("Use 'combustivel[\"litros\"]'."); return false;
            }
        },
        {
            title: "Missão 13: Checagem (dict update)",
            description: "Sistemas... OK. Adicione uma nova chave 'status' com o valor 'Pronto' ao dicionário. Imprima o dicionário.",
            starterCode: "combustivel = {\"litros\": 100}\n\n# Adicione a chave 'status' com o valor 'Pronto'\n\n\nprint(combustivel)\n",
            solution: "combustivel = {\"litros\": 100}\n\ncombustivel[\"status\"] = \"Pronto\"\n\nprint(combustivel)\n",
            check: (output, helpers) => {
                if (output.trim().includes("'status': 'Pronto'")) {
                    helpers.robotSpeak("Status: Pronto!");
                    setTimeout(() => { helpers.showSuccess("Sistemas checados!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Status não atualizado."); helpers.showError("Adicione a nova chave/valor."); return false;
            }
        },
        {
            title: "Missão 14: Verificação Final (while)",
            description: "Último teste! Use um loop 'while' para contar de 1 até 3. Imprima cada número.",
            starterCode: "contador = 1\nwhile contador <= 3:\n  # Imprima o contador\n  pass\n  # Aumente o contador (contador = contador + 1)\n  pass\n",
            solution: "contador = 1\nwhile contador <= 3:\n  print(contador)\n  contador = contador + 1\n",
            check: (output, helpers) => {
                if (output.trim() === "1\n2\n3") {
                    helpers.robotSpeak("Contagem de ignição... OK!");
                    setTimeout(() => { helpers.showSuccess("Ignição pronta!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Contagem falhou."); helpers.showError("Verifique seu loop 'while'."); return false;
            }
        },
        {
            title: "Missão 15: Erros (try/except)",
            description: "O sensor pode falhar! Use 'try/except' para imprimir 'Decolando!' (no 'try'). *Dica: 1/0 causaria um erro, mas não precisamos disso.*",
            starterCode: "try:\n  # Imprima 'Decolando!'\n  pass\nexcept:\n  print(\"Falha no sensor!\")\n",
            solution: "try:\n  print(\"Decolando!\")\nexcept:\n  print(\"Falha no sensor!\")\n",
            check: (output, helpers) => {
                if (output.trim() === "Decolando!") {
                    helpers.robotSpeak("Sistemas de segurança... OK!");
                    setTimeout(() => { helpers.showSuccess("Tratamento de erros ativo!"); helpers.loadNextLevel(); }, 2500);
                    return true;
                }
                helpers.robotSpeak("Bloco 'try' não executou."); helpers.showError("Verifique o bloco 'try'."); return false;
            }
        },
        {
            title: "Missão 16: Decolar!",
            description: "É isso! Imprima '3... 2... 1... DECOLAR!' para iniciar a decolagem!",
            starterCode: "# Imprima a contagem regressiva!\n",
            solution: "print(\"3... 2... 1... DECOLAR!\")\n",
            check: (output, helpers) => {
                if (output.trim().endsWith("DECOLAR!")) {
                    helpers.robotSpeak("Embarcando!");
                    helpers.robotMoveTo('rocket');
                    setTimeout(() => {
                        helpers.robotEmbark();
                    }, 1800);
                    setTimeout(() => {
                        helpers.robotSpeak("Voltando para casa! Obrigado!");
                        helpers.launchRocket();
                    }, 2500);
                    setTimeout(() => {
                        helpers.showSuccess("MISSÃO CUMPRIDA!");
                        helpers.showVictoryScreen();
                    }, 4000); // Tempo corrigido
                    return true;
                }
                helpers.robotSpeak("Contagem errada."); helpers.showError("Imprima a frase de decolagem."); return false;
            }
        }
    ];

    // --- 2. ESTADO DO JOGO ---
    let currentLevel = 0;

    // --- 3. REFERÊNCIAS DO DOM ---
    // (Idênticas)
    const levelTitle = document.getElementById('level-title');
    const levelDescription = document.getElementById('level-description');
    const levelHint = document.getElementById('level-hint');
    const hintBtn = document.getElementById('hint-btn');
    const codeEditor = document.getElementById('code-editor');
    const outputPre = document.getElementById('output-pre');
    const runBtn = document.getElementById('run-btn');
    const robot = document.getElementById('bit-robot');
    const robotContainer = document.getElementById('bit-robot-container');
    const speechBubble = document.getElementById('speech-bubble');
    const energyBar = document.getElementById('energy-bar');
    const rocketInventory = document.getElementById('rocket-inventory');
    const rocket = document.getElementById('rocket');
    const fuelEffect = document.getElementById('fuel-effect');
    const launchFlame = document.getElementById('launch-flame');
    const idePanel = document.getElementById('ide-panel');
    const gameWorld = document.getElementById('game-world');
    const victoryScreen = document.getElementById('victory-screen');
    const restartBtn = document.getElementById('restart-btn');
    const appHeader = document.querySelector('header');

    // --- 4. FUNÇÕES AUXILIARES DE ANIMAÇÃO (Helpers) ---
    // (Única mudança na função resetScene)

    function robotSpeak(text) {
        speechBubble.innerText = text;
        speechBubble.className = robotContainer.className; // Pega a classe de posição atual (at-cave, etc)
        speechBubble.classList.remove('hidden'); // Remove hidden para mostrar
        // Esconde após um tempo
        setTimeout(() => { speechBubble.classList.add('hidden'); }, 2800);
    }
    function setRobotState(state) { if (state === 'thinking') robot.classList.add('thinking'); else robot.classList.remove('thinking'); }
    function updateEnergyBar(value) { energyBar.style.width = `${value}%`; }
    function showSuccess(message) { outputPre.innerText = `STATUS: ${message}`; outputPre.className = "output-success"; }
    function showError(message) { outputPre.innerText = `ERRO: ${message}`; outputPre.className = "output-error"; }
    function robotWakeUp() { robot.classList.add('waking-up'); setTimeout(() => { robot.classList.remove('sleeping'); robot.classList.remove('waking-up'); }, 1000); }
    function robotMoveTo(target) { robotContainer.className = `at-${target}`; }
    function robotJump() { robot.classList.add('jumping'); setTimeout(() => { robot.classList.remove('jumping'); }, 1000); }
    function showInventory() { rocketInventory.classList.remove('hidden'); }
    function hideInventory() { rocketInventory.classList.add('hidden'); }
    function collectRocketPart(partIconId, markerSelector) {
        const partElement = document.getElementById(partIconId);
        if (partElement) partElement.classList.add('collected');
        const markerElement = document.querySelector(markerSelector);
        if (markerElement) {
            markerElement.classList.add('collected');
        } else {
            console.error("Marker not found:", markerSelector);
        }
    }
    function buildRocketPart(partName) { rocket.classList.add(`has-${partName}`); }
    function fuelRocket(isOn) { fuelEffect.style.opacity = isOn ? '1' : '0'; }
    function robotEmbark() {
        robotContainer.classList.add('embarking');
        speechBubble.classList.add('hidden');
    }
    function launchRocket() {
        rocket.classList.add('launched');
        gameWorld.classList.add('decolando');
        setTimeout(() => {
            robotContainer.classList.add('hidden');
            speechBubble.classList.add('hidden');
        }, 1500);
    }

    function resetScene() {
        robot.classList.add('sleeping');
        robotContainer.classList.remove('embarking');
        robotContainer.classList.remove('hidden');
        robotMoveTo('start');
        speechBubble.classList.add('hidden'); // CORREÇÃO: Garante que a bolha suma ao reiniciar
        updateEnergyBar(10);
        hideInventory();
        document.querySelectorAll('.part-icon').forEach(icon => icon.classList.remove('collected'));
        document.querySelectorAll('.piece-marker').forEach(marker => marker.classList.remove('collected'));
        rocket.className = '';
        fuelRocket(false);
        // launchFlame.style.opacity = '0'; // Não é mais necessário, CSS cuida
        idePanel.style.display = 'flex';
        gameWorld.classList.remove('decolando');
        victoryScreen.classList.add('hidden');
        victoryScreen.classList.remove('visible');
    }

    function loadNextLevel() {
        currentLevel++;
        loadLevel(currentLevel);
    }
    function showVictoryScreen() {
        idePanel.style.display = 'none';
        appHeader.style.display = 'none';
        gameWorld.style.display = 'none';
        victoryScreen.classList.remove('hidden');
        victoryScreen.classList.add('visible');
    }

    const visualHelpers = {
        robotSpeak, setRobotState, updateEnergyBar, showSuccess, showError,
        showInventory, collectRocketPart, buildRocketPart, robotWakeUp, robotMoveTo,
        robotJump, fuelRocket, robotEmbark, launchRocket, loadNextLevel, showVictoryScreen
    };

    // --- 5. FUNÇÕES PRINCIPAIS DO JOGO (Idênticas) ---
    // (Nenhuma mudança necessária aqui)
    function loadLevel(levelIndex) {
        if (levelIndex === 0) {
            resetScene();
            appHeader.style.display = 'flex';
            gameWorld.style.display = 'block';
        }
        if (levelIndex >= levels.length) {
            console.log("Jogo concluído.");
            return;
        }
        const level = levels[levelIndex];
        levelTitle.innerText = level.title;
        levelDescription.innerText = level.description;
        levelHint.innerText = level.hint;
        levelHint.classList.add('hidden');
        codeEditor.value = level.starterCode;
        outputPre.innerText = "";
        runBtn.disabled = false;
        devNextLevelBtn.disabled = !isDevMode;
    }
    function showHint() { levelHint.classList.remove('hidden'); }
    function builtinRead(x) { if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) throw "File not found: '" + x + "'"; return Sk.builtinFiles["files"][x]; }
    function runCode() {
        runBtn.disabled = true;
        devNextLevelBtn.disabled = true;
        const userCode = codeEditor.value;
        const level = levels[currentLevel];
        let capturedOutput = "";
        outputPre.innerText = "Processando comando...";
        outputPre.className = "";
        setRobotState('thinking');
        Sk.configure({
            output: (text) => { capturedOutput += text; },
            read: builtinRead,
            __future__: Sk.python3
        });
        Sk.misceval.asyncToPromise(() => {
            return Sk.importMainWithBody("<stdin>", false, userCode, true);
        })
            .then(
                (mod) => {
                    setRobotState('idle');
                    outputPre.innerText = capturedOutput;
                    checkSolution(capturedOutput, level);
                },
                (err) => {
                    setRobotState('idle');
                    robotSpeak("Comando quebrado!");
                    showError("Seu código tem um erro de sintaxe!\n\n" + err.toString());
                    runBtn.disabled = false;
                    devNextLevelBtn.disabled = isDevMode;
                }
            );
    }
    function checkSolution(output, level) {
        try {
            const success = level.check(output, visualHelpers);
            if (!success) {
                runBtn.disabled = false;
                devNextLevelBtn.disabled = isDevMode;
            }
        } catch (e) {
            robotSpeak("Bug no meu cérebro!");
            showError(`Erro ao verificar a solução: ${e}`);
            runBtn.disabled = false;
            devNextLevelBtn.disabled = isDevMode;
        }
    }

    // --- 6. INICIALIZAÇÃO ---
    // Listeners do Jogo
    runBtn.addEventListener('click', runCode);
    hintBtn.addEventListener('click', showHint);
    devNextLevelBtn.addEventListener('click', devSkipLevel);
    restartBtn.addEventListener('click', () => {
        currentLevel = 0;
        appHeader.style.display = 'flex';
        gameWorld.style.display = 'block';
        loadLevel(currentLevel);
        pauseMusic();
        loadTrack(0);
    });

    // Listeners da Música
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    audioPlayer.addEventListener('ended', playNext); // Loop da playlist

    // Inicialização
    checkDevMode();
    loadTrack(currentTrackIndex);
    loadLevel(currentLevel);
    // Tenta tocar a música (pode ser bloqueado)
    playMusic();
});