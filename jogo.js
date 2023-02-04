const jogo = {}
const sprites = new Image();
sprites.src = './sprites.png';
const som_punch = new Audio();
som_punch.src = './sounds/punch.wav'

let animation_frame = 0;

const canvas = document.querySelector('#game-canvas');
const contexto = canvas.getContext('2d');


function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 35,
        altura: 25,
        x: 10,
        y: 50,
        pulo: 4.6,
        movimento: [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
            { spriteX: 0, spriteY: 26, },
        ],
        pula() {
            flappyBird.velocidade = -flappyBird.pulo;
        },
        desenha() {
            contexto.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        },
        gravidade: 0.25,
        velocidade: 0,
        frameAtual: 0,
        atualizaFrame() {
            if ((animation_frame % 10) === 0) {
                flappyBird.frameAtual = flappyBird.frameAtual + 1
                flappyBird.frameAtual = flappyBird.frameAtual % flappyBird.movimento.length
                flappyBird.spriteX = flappyBird.movimento[flappyBird.frameAtual].spriteX;
                flappyBird.spriteY = flappyBird.movimento[flappyBird.frameAtual].spriteY;
            }
        },
        atualiza() {
            if (fazColisao()) {
                som_punch.play();
                telaAtiva = telaGameOver;
                return;
            }
            flappyBird.velocidade += flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
            flappyBird.atualizaFrame();
        }
    }
    return flappyBird
}

function criaChao() {
    const chao = {
        spriteX: 1,
        spriteY: 613,
        largura: 223,
        altura: 109,
        x: 0,
        y: canvas.height - 109,
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x + chao.largura, chao.y,
                chao.largura, chao.altura,
            )
        },
        atualiza() {
            chao.x = chao.x - 2;
            chao.x = chao.x % (chao.largura / 2)
        }
    }
    return chao
}

function criaPlanoDeFundo() {
    const PlanoDeFundo = {
        spriteX: 390.5,
        spriteY: 0,
        largura: 275.5,
        altura: 206,
        x: 0,
        y: canvas.height - 227,
        desenha() {
            contexto.drawImage(
                sprites,
                PlanoDeFundo.spriteX, PlanoDeFundo.spriteY,
                PlanoDeFundo.largura, PlanoDeFundo.altura,
                PlanoDeFundo.x, PlanoDeFundo.y,
                PlanoDeFundo.largura, PlanoDeFundo.altura,
            );
            contexto.drawImage(
                sprites,
                PlanoDeFundo.spriteX, PlanoDeFundo.spriteY,
                PlanoDeFundo.largura, PlanoDeFundo.altura,
                PlanoDeFundo.x + PlanoDeFundo.largura, PlanoDeFundo.y,
                PlanoDeFundo.largura, PlanoDeFundo.altura,
            );
            contexto.drawImage(
                sprites,
                PlanoDeFundo.spriteX, PlanoDeFundo.spriteY,
                PlanoDeFundo.largura, PlanoDeFundo.altura,
                PlanoDeFundo.x + PlanoDeFundo.largura * 2, PlanoDeFundo.y,
                PlanoDeFundo.largura, PlanoDeFundo.altura,
            );

        },
        atualiza() {
            PlanoDeFundo.x = PlanoDeFundo.x - 0.5;
            if (PlanoDeFundo.x == -PlanoDeFundo.largura) {
                PlanoDeFundo.x = 0
            }
        }
    }
    return PlanoDeFundo
}
const telainicial = {
    spriteX: 130,
    spriteY: 0,
    largura: 188,
    altura: 152,
    x: 70,
    y: 70,
    desenha() {
        contexto.drawImage(
            sprites,
            telainicial.spriteX, telainicial.spriteY,
            telainicial.largura, telainicial.altura,
            telainicial.x, telainicial.y,
            telainicial.largura, telainicial.altura,
        );
    }
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        ceu: {
            spriteX: 52,
            spriteY: 169,
            x: 200,
            y: -170,
        },
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        pares: [],
        espacamentoEntreCanos: 80,
        desenha() {
            const espacamentoEntreCanos = 80;
            for (i = 0; i < canos.pares.length; i++) {
                canos.ceu.x = canos.pares[i].x;
                canos.ceu.y = canos.pares[i].y;
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canos.ceu.x, canos.ceu.y,
                    canos.largura, canos.altura,
                )
                const canoChaoX = canos.ceu.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + canos.ceu.y
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )
            }
        },
        atualiza() {
            canos.ceu.x = canos.ceu.x - 2;
            const passou100Frames = (animation_frame % 100 === 0);
            if (passou100Frames) {
                const novoPar = {
                    x: canvas.clientWidth,
                    y: -150 * (Math.random() + 1)
                }
                canos.pares.push(novoPar);
            }
            for (i = 0; i < canos.pares.length; i++) {
                const par = canos.pares[i];
                par.x = par.x - 2;
                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
                if (fazColisaoObstaculo(par)) {
                    som_punch.play();
                    telaAtiva = telaGameOver;
                    return;
                }
            }
        }
    }
    return canos
}

function criaPlacar() {
    const placar = {
        pontos: 0,
        desenha() {
            contexto.font = '25px "VT323"';
            contexto.textAlign = 'left';
            contexto.fillStyle = 'white';
            contexto.fillText('Pontuação: ' + placar.pontos, 25, 35);
        },
        atualiza() {
            const intervaloDeFrames = 20;
            const passouOIntervalo = animation_frame % intervaloDeFrames === 0;
            if (passouOIntervalo) {
                placar.pontos = placar.pontos + 1;
            }
        }
    }
    return placar
}
const gameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: 50,
    y: 70,
    desenha() {
        contexto.drawImage(
            sprites,
            gameOver.spriteX, gameOver.spriteY,
            gameOver.largura, gameOver.altura,
            gameOver.x, gameOver.y,
            gameOver.largura, gameOver.altura
        )
    }
}
const ceu = {
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.clientWidth, canvas.height)
    }
}

const TelaInicio = {
    desenha() {
        ceu.desenha();
        jogo.PlanoDeFundo.desenha();
        jogo.chao.desenha();
        jogo.flappyBird.desenha();
        telainicial.desenha();
    },
    click() {
        telaAtiva = TelaJogo;
    }
}
const TelaJogo = {
    desenha() {
        ceu.desenha();
        jogo.PlanoDeFundo.desenha();
        jogo.flappyBird.desenha();
        jogo.flappyBird.atualiza();
        jogo.canos.desenha();
        jogo.canos.atualiza();
        jogo.chao.desenha();
        jogo.chao.atualiza();
        jogo.PlanoDeFundo.atualiza();
        jogo.placar.desenha();
        jogo.placar.atualiza();
    },
    click() {
        jogo.flappyBird.pula();
    }
}
const telaGameOver = {
    desenha() {
        gameOver.desenha();
    },
    click() {
        inicializar();
        telaAtiva = TelaJogo

    }
}
var telaAtiva = TelaInicio




function mudaTelaAtiva() {
    telaAtiva.click();
}

function fazColisao() {
    if (jogo.flappyBird.y < jogo.chao.y - 30) {
        return false
    } else {
        return true
    }
}

function fazColisaoObstaculo(par) {
    if (jogo.flappyBird.x >= par.x) {
        const alturaCabecaFlappy = jogo.flappyBird.y;
        const alturaPeFlappy = jogo.flappyBird.y + jogo.flappyBird.altura;
        const bocaCanoCeuY = par.y + jogo.canos.altura;
        const bocaCanoChaoY = par.y + jogo.canos.altura + jogo.canos.espacamentoEntreCanos;
        if (alturaCabecaFlappy <= bocaCanoCeuY) {
            return true
        }
        if (alturaPeFlappy >= bocaCanoChaoY) {
            return true
        }
    }
    return false;
}

function inicializar() {
    jogo.flappyBird = criaFlappyBird();
    jogo.PlanoDeFundo = criaPlanoDeFundo();
    jogo.chao = criaChao();
    jogo.canos = criaCanos();
    jogo.placar = criaPlacar()
}
window.addEventListener("click", mudaTelaAtiva)

function loop() {
    telaAtiva.desenha();
    requestAnimationFrame(loop);
    animation_frame = animation_frame + 1
}
inicializar();
loop();