function renderLeftFailScene(container) {
    // 1. 動態注入左轉失敗專屬 CSS (包含 GPU 硬體加速與圖層校正)
    if (!document.getElementById('css-scene-left-fail')) {
        const style = document.createElement('style');
        style.id = 'css-scene-left-fail';
        style.textContent = `
            .scene-left-fail-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/左轉場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .left-fail-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .left-fail-flower {
                position: absolute; width: 130px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .left-fail-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarLeftFailTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .left-fail-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: blueCarLeftFailTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .left-fail-bomb {
                position: absolute; width: 150px; height: 180px; left: 640px; bottom: 15px;
                z-index: 6; pointer-events: none; opacity: 0;
                animation: bombEffectLeftFail 7s ease-out forwards;
            }
            .left-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInLeftFail 7s ease-out forwards;
            }

            @keyframes redCarLeftFailTransform {
                0% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(650px) translateY(0px); }
                60.1% { transform: translateX(660px) translate(2px, 1px) rotate(0deg); }
                61.2% { transform: translateX(660px) translate(0px, 0px) rotate(-10deg); }
                62.3%, 100% { transform: translateX(660px) translate(0px, 0px) rotate(0deg); }
            }

            @keyframes blueCarLeftFailTransform {
                0% { transform: translateX(150px) translateY(0px); }
                60% { transform: translateX(560px) translateY(0px); }
                60.1% { transform: translateX(550px) translate(-2px, 1px) rotate(0deg); }
                61.2% { transform: translateX(550px) translate(0px, 0px) rotate(-10deg); }
                62.3%, 100% { transform: translateX(550px) translate(0px, 0px) rotate(0deg); }
            }

            @keyframes bombEffectLeftFail {
                0%, 40% { opacity: 0; transform: scale(0.5); }
                40.1% { opacity: 1; transform: scale(1.2) translate(-3px, 2px) rotate(-4deg); }
                61.5% { transform: scale(1.15) translate(3px, -2px) rotate(4deg); }
                63% { transform: scale(1.1) translate(-2px, 1px) rotate(-2deg); }
                64.5% { transform: scale(1.05) translate(1px, -1px) rotate(1deg); }
                65% { opacity: 1; transform: scale(1) translate(0px, 0px) rotate(0deg); }
                75% { opacity: 0; transform: scale(0.8) translate(0, 10px) rotate(0deg); }
                75.1%, 100% { opacity: 0; }
            }

            @keyframes bannerFadeInLeftFail {
                0%, 44% { opacity: 0; transform: translate(-50%, -15px) scale(0.8); }
                45% { opacity: 0.1; transform: translate(-50%, 0) scale(1); }
                50% { opacity: 0.3; transform: translate(-50%, 0) scale(1); }
                55% { opacity: 0.5; transform: translate(-50%, 0) scale(1); }
                60% { opacity: 0.7; transform: translate(-50%, 0) scale(1); }
                100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. 渲染 DOM
    container.innerHTML = `
        <div class="scene-left-fail-bg"></div>
        <img src="images/sun.webp" class="left-fail-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-fail-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-fail-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-fail-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/BOMB.webp" class="left-fail-bomb" alt="爆炸特效">
        <img src="images/CAR.webp" class="left-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="left-fail-blue-car" alt="藍車追撞">
        <img src="images/遊戲失敗.png" class="left-fail-banner" alt="遊戲失敗標題">
    `;
}