function renderOvertakeScene(container) {
    if (!document.getElementById('css-scene-overtake')) {
        const style = document.createElement('style');
        style.id = 'css-scene-overtake';
        style.textContent = `
            .scene-overtake-bg {
                position: absolute; top: 0; left: 0; width: 2000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x;
                animation: scrollBgTransform 5s linear infinite; z-index: 1; will-change: transform;
            }
            @keyframes scrollBgTransform {
                0% { transform: translateX(0px); }
                100% { transform: translateX(-1000px); }
            }
            .overtake-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .overtake-angry-car {
                position: absolute; width: 255px; height: auto; bottom: 65px; left: 0;
                transform: translateX(-350px); animation: angryCarEnterStageTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                z-index: 5; will-change: transform;
            }
            .overtake-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(-200px); animation: redCarEnterStageTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                z-index: 5; will-change: transform;
            }
            @keyframes angryCarEnterStageTransform {
                0% { transform: translateX(-350px) translateY(0px); }
                30% { transform: translateX(150px) translateY(0px); }
                40% { transform: translateX(150px) translateY(-3px); }
                50% { transform: translateX(150px) translateY(0px); }
                60% { transform: translateX(150px) translateY(-3px); }
                70% { transform: translateX(150px) translateY(0px); }
                80% { transform: translateX(150px) translateY(-3px); }
                90%, 100% { transform: translateX(150px) translateY(0px); }
            }
            @keyframes redCarEnterStageTransform {
                0% { transform: translateX(-200px) translateY(0px); }
                30% { transform: translateX(315px) translateY(0px); }
                40% { transform: translateX(315px) translateY(-3px); }
                50% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                70% { transform: translateX(315px) translateY(0px); }
                80% { transform: translateX(315px) translateY(-3px); }
                90%, 100% { transform: translateX(315px) translateY(0px); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-overtake-bg"></div>
        <img src="images/sun.webp" class="overtake-sun" alt="太陽">
        <img src="images/ANGRY_CAR.webp" class="overtake-angry-car" alt="怒氣後車">
        <img src="images/CAR.webp" class="overtake-player-car" alt="紅車主角">
    `;
}