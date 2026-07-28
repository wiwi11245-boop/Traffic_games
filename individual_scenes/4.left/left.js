function renderLeftScene(container) {
    if (!document.getElementById('css-scene-left')) {
        const style = document.createElement('style');
        style.id = 'css-scene-left';
        style.textContent = `
            /* 1. 背景圖層：明確指定 z-index: 1 最底層 */
            .scene-left-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/左轉場景.png');
                background-size: 100% 100%; background-repeat: no-repeat;
                z-index: 1;
            }
            /* 2. 裝飾物件：z-index: 2 */
            .left-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .left-flower {
                position: absolute; width: 130px; height: auto;
                z-index: 2; pointer-events: none;
            }
            /* 3. 車輛物件：明確提升至 z-index: 5，絕不被背景蓋住！ */
            .left-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(-200px); z-index: 5; will-change: transform;
                animation: redCarLeftStage 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .left-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(-350px); z-index: 5; will-change: transform;
                animation: blueCarLeftStage 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            @keyframes redCarLeftStage {
                0% { transform: translateX(-200px) translateY(0px); }
                30% { transform: translateX(315px) translateY(0px); }
                40% { transform: translateX(315px) translateY(-3px); }
                50% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                70% { transform: translateX(315px) translateY(0px); }
                80% { transform: translateX(315px) translateY(-3px); }
                90%, 100% { transform: translateX(315px) translateY(0px); }
            }
            @keyframes blueCarLeftStage {
                0% { transform: translateX(-350px) translateY(0px); }
                30% { transform: translateX(150px) translateY(0px); }
                40% { transform: translateX(150px) translateY(-3px); }
                50% { transform: translateX(150px) translateY(0px); }
                60% { transform: translateX(150px) translateY(-3px); }
                70% { transform: translateX(150px) translateY(0px); }
                80% { transform: translateX(150px) translateY(-3px); }
                90%, 100% { transform: translateX(150px) translateY(0px); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 30px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 380px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="right: 130px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/CAR.webp" class="left-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="left-blue-car" alt="藍車事件">
    `;
}