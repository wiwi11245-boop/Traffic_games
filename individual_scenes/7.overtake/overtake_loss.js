function renderOvertakeFailScene(container) {
    if (!document.getElementById('css-scene-overtake-fail')) {
        const style = document.createElement('style');
        style.id = 'css-scene-overtake-fail';
        style.textContent = `
            .scene-overtake-fail-bg {
                position: absolute; top: 0; left: 0; width: 2000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgOvertakeCrash 7s linear forwards; will-change: transform;
            }
            @keyframes scrollBgOvertakeCrash {
                0% { transform: translateX(0px); }
                45%, 100% { transform: translateX(-900px); }
            }

            .overtake-fail-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .overtake-fail-angry-car {
                position: absolute; width: 255px; height: auto; bottom: 65px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: angryCarOvertakeCrashTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .overtake-fail-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarOvertakeFailTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .overtake-fail-opposite-car {
                position: absolute; width: 160px; height: auto; bottom: 60px; left: 0;
                transform: translateX(1100px) scaleX(-1); z-index: 4; will-change: transform;
                animation: oppositeCarCrashTransform 7s linear forwards;
            }
            .overtake-fail-bomb {
                position: absolute; width: 180px; height: 180px; left: 350px; bottom: 65px;
                z-index: 6; pointer-events: none; opacity: 0;
                animation: bombEffectFadeOvertake 7s ease-out forwards;
            }
            .overtake-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInOvertake 7s ease-out forwards;
            }

            @keyframes angryCarOvertakeCrashTransform {
                0% { transform: translateX(150px) translateY(0px) rotate(0deg); }
                30% { transform: translateX(150px) translateY(-40px) rotate(0deg); }
                45% { transform: translateX(280px) translateY(-40px) rotate(-5deg); }
                45.1% { transform: translateX(280px) translateY(-40px) rotate(5deg); }
                46%, 100% { transform: translateX(280px) translateY(-40px) rotate(0deg); }
            }

            @keyframes redCarOvertakeFailTransform {
                0%, 30% { transform: translateX(315px) translateY(0px); }
                40% { transform: translateX(315px) translateY(-3px); }
                50% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                70%, 100% { transform: translateX(315px) translateY(0px); }
            }

            @keyframes oppositeCarCrashTransform {
                0% { opacity: 0.1; transform: translateX(1100px) scaleX(-1) translateY(0px); }
                30% { opacity: 1; transform: translateX(700px) scaleX(-1) translateY(-2px); }
                45% { opacity: 1; transform: translateX(440px) scaleX(-1) rotate(5deg); }
                45.1%, 100% { opacity: 1; transform: translateX(440px) scaleX(-1) rotate(0deg); }
            }

            @keyframes bombEffectFadeOvertake {
                0%, 44.9% { opacity: 0; transform: scale(0.5); }
                45% { opacity: 1; transform: scale(1.2) rotate(-4deg); }
                50% { transform: scale(1.15) rotate(4deg); }
                55% { transform: scale(1.1) rotate(-2deg); }
                60% { opacity: 1; transform: scale(1) rotate(0deg); }
                80% { opacity: 0; transform: scale(0.8); }
                80.1%, 100% { opacity: 0; }
            }

            @keyframes bannerFadeInOvertake {
                0%, 60% { opacity: 0; transform: translate(-50%, -15px) scale(0.9); }
                75%, 100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-overtake-fail-bg"></div>
        <img src="images/sun.webp" class="overtake-fail-sun" alt="太陽">
        <img src="images/ANGRY_CAR.webp" class="overtake-fail-angry-car" alt="怒氣後車">
        <img src="images/CAR.webp" class="overtake-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="overtake-fail-opposite-car" alt="對向車">
        <img src="images/BOMB.webp" class="overtake-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.png" class="overtake-fail-banner" alt="遊戲失敗標題">
    `;
}