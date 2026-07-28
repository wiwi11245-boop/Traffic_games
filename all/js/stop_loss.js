function renderStopFailScene(container) {
    if (!document.getElementById('css-scene-stop-fail')) {
        const style = document.createElement('style');
        style.id = 'css-scene-stop-fail';
        style.textContent = `
            .scene-stop-fail-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/停止場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .stop-fail-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .top-house {
                position: absolute; width: 110px; height: auto; bottom: -10px;
                z-index: 8; pointer-events: none;
            }
            .house-1 { left: 730px; }
            .house-2 { left: 880px; }

            .stop-fail-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(205px); z-index: 5; will-change: transform;
                animation: redCarSlowdownFailure 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .stop-fail-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(50px); z-index: 5; will-change: transform;
                animation: blueCarCrashEvent 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .car3-event-group {
                position: absolute; width: 110px; height: auto; left: 740px; bottom: 70px;
                z-index: 3; opacity: 1;
            }
            .car3-event-group img { position: absolute; height: auto; bottom: 0; }
            .car3-side { width: 100%; left: -90px; }
            .car3-side2 { width: 100%; left: 30px; }
            .car3-back { width: 95px; left: 130px; }

            .stop-fail-bomb {
                position: absolute; width: 150px; height: 180px; left: 470px; bottom: 35px;
                z-index: 6; pointer-events: none; opacity: 0;
                animation: bombEffectFadeStop 7s ease-out forwards;
            }
            .stop-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInStop 7s ease-out forwards;
            }

            @keyframes redCarSlowdownFailure {
                0% { transform: translateX(205px) translateY(0px); }
                45% { transform: translateX(500px) translateY(0px); }
                45.1% { transform: translateX(505px) rotate(0deg); }
                45.5% { transform: translateX(505px) rotate(-10deg); }
                46%, 100% { transform: translateX(505px) rotate(0deg); }
            }

            @keyframes blueCarCrashEvent {
                0% { transform: translateX(50px) translateY(0px); }
                45% { transform: translateX(400px) translateY(0px); }
                45.1% { transform: translateX(390px) rotate(0deg); }
                45.5% { transform: translateX(390px) rotate(-10deg); }
                46%, 100% { transform: translateX(390px) rotate(0deg); }
            }

            @keyframes bombEffectFadeStop {
                0%, 39.9% { opacity: 0; transform: scale(0.5); }
                40% { opacity: 1; transform: scale(1.2) translate(-3px, 2px) rotate(-4deg); }
                51.5% { transform: scale(1.15) translate(3px, -2px) rotate(4deg); }
                53% { transform: scale(1.1) translate(-2px, 1px) rotate(-2deg); }
                54.5% { transform: scale(1.05) translate(1px, -1px) rotate(1deg); }
                55% { opacity: 1; transform: scale(1) rotate(0deg); }
                65% { opacity: 0; transform: scale(0.8) translateY(10px); }
                65.1%, 100% { opacity: 0; }
            }

            @keyframes bannerFadeInStop {
                0%, 50% { opacity: 0; transform: translate(-50%, -15px) scale(0.8); }
                51% { opacity: 0.1; transform: translate(-50%, 0) scale(1); }
                65%, 100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-stop-fail-bg"></div>
        <img src="images/sun.webp" class="stop-fail-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-fail-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.png" class="car3-side" alt="迴轉車側身">
            <img src="images/CAR4.png" class="car3-side2" alt="迴轉車側身">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="迴轉車後視">
        </div>
        <img src="images/house.png" class="top-house house-1" alt="房屋A">
        <img src="images/house.png" class="top-house house-2" alt="房屋B">
        <img src="images/BOMB.webp" class="stop-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.png" class="stop-fail-banner" alt="遊戲失敗標題">
    `;
}