// 🛠️ 整合版 stop.js：包含緩停上半段、321.webp 倒數 (800px, top: 20%)、以及紅藍雙車完全等速位移對齊

function renderStopScene(container) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    if (!document.getElementById('css-scene-stop-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-stop-combined';
        style.textContent = `
            .scene-stop-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/停止場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .stop-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .top-house {
                position: absolute; width: 110px; height: auto; bottom: -10px;
                z-index: 8; pointer-events: none;
            }
            .house-1 { left: 730px; }
            .house-2 { left: 880px; }

            .stop-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }

            /* --- 上半段：紅車與藍車距離校正 --- */
            .stop-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(-200px); z-index: 5; will-change: transform;
                animation: redCarStopStageTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .stop-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(-350px); z-index: 5; will-change: transform;
                animation: blueCarStopStageTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .car3-event-group {
                position: absolute; width: 110px; height: auto; left: 740px; bottom: 70px;
                z-index: 3; opacity: 1;
            }
            .car3-event-group img { position: absolute; height: auto; bottom: 0; }
            .car3-side { width: 100%; left: -90px; }
            .car3-side2 { width: 100%; left: 30px; }
            .car3-back { width: 95px; left: 130px; }

            @keyframes redCarStopStageTransform {
                0% { transform: translateX(-200px) translateY(0px); }
                30% { transform: translateX(205px) translateY(0px); }
                40% { transform: translateX(205px) translateY(-3px); }
                50% { transform: translateX(205px) translateY(0px); }
                60% { transform: translateX(205px) translateY(-3px); }
                70%, 100% { transform: translateX(205px) translateY(0px); }
            }
            @keyframes blueCarStopStageTransform {
                0% { transform: translateX(-350px) translateY(0px); }
                30% { transform: translateX(50px) translateY(0px); }
                40% { transform: translateX(50px) translateY(-3px); }
                50% { transform: translateX(50px) translateY(0px); }
                60% { transform: translateX(50px) translateY(-3px); }
                70%, 100% { transform: translateX(50px) translateY(0px); }
            }

            /* 🛠️ 成功下半段：紅車與藍車等速平行位移對齊 */
            .stop-success-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(205px); z-index: 5; will-change: transform;
                animation: redCarSuccessDriveTransform 6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .stop-success-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(50px); z-index: 5; will-change: transform;
                animation: blueCarSuccessDriveTransform 6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .car5-parked {
                position: absolute; width: 110px; height: auto; left: 790px; bottom: 140px;
                z-index: 4; opacity: 0; pointer-events: none;
                animation: car5FadeIn 6s linear forwards;
            }

            /* 🛠️ 紅車：從 205px 位移 265px 至 470px，隨後起步衝出 */
            @keyframes redCarSuccessDriveTransform {
                0% { transform: translateX(205px) translateY(0px); }
                35% { transform: translateX(470px) translateY(0px); }
                35.1% { transform: translateX(470px) translateY(-3px); }
                40%, 60% { transform: translateX(470px) translateY(0px); }
                100% { transform: translateX(1100px) translateY(0px); }
            }

            /* 🛠️ 藍車等速校正：從 50px 位移 265px 至 315px，保持與紅車完全同等速度與距離！ */
            @keyframes blueCarSuccessDriveTransform {
                0% { transform: translateX(50px) translateY(0px); }
                35% { transform: translateX(315px) translateY(0px); }
                35.1% { transform: translateX(315px) translateY(-3px); }
                40%, 60% { transform: translateX(315px) translateY(0px); }
                100% { transform: translateX(945px) translateY(0px); }
            }

            @keyframes car3BackFade { 0%, 38% { opacity: 1; } 40%, 100% { opacity: 0; } }
            @keyframes car3SidesFade { 0%, 48% { opacity: 1; } 56%, 100% { opacity: 0; } }
            @keyframes car5FadeIn { 0%, 50% { opacity: 0; } 60%, 100% { opacity: 1; } }

            /* --- 失敗下半段 --- */
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
        <div class="scene-stop-bg"></div>
        <img src="images/sun.webp" class="stop-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.png" class="car3-side" alt="CAR3">
            <img src="images/CAR4.png" class="car3-side2" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="CAR3_BACK">
        </div>
        <img src="images/house.png" class="top-house house-1" alt="房屋A">
        <img src="images/house.png" class="top-house house-2" alt="房屋B">
        <img src="images/321.webp" id="stopCountdownImg" class="stop-countdown-overlay" alt="321倒數">
    `;

    function handleKeyDown(e) {
        if (isJudgmentActive && (e.key === 'ArrowDown' || e.code === 'ArrowDown')) {
            console.log("[手勢判定] 收到正確輸入：ArrowDown (緩停) !");
            hasCorrectInput = true;
        }
    }

    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
        const countdownImg = document.getElementById('stopCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();
        }

        isJudgmentActive = true;
        console.log("[緩停判定開始] 請在 2 秒內按下 ArrowDown 方向鍵！");

        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('keydown', handleKeyDown);
            if (countdownImg) countdownImg.style.display = 'none';

            if (hasCorrectInput) {
                console.log("[緩停判定結果] 🎉 成功！");
                renderInternalStopSuccess(container);
            } else {
                console.log("[緩停判定結果] ❌ 失敗！切換至追撞場景...");
                renderInternalStopFail(container);
            }
        }, 2000);

    }, 500);
}

function renderInternalStopSuccess(container) {
    container.innerHTML = `
        <div class="scene-stop-bg"></div>
        <img src="images/sun.webp" class="stop-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-success-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-success-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.png" class="car3-side" style="animation: car3SidesFade 6s linear forwards;" alt="CAR3">
            <img src="images/CAR4.png" class="car3-side2" style="animation: car3SidesFade 6s linear forwards;" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" style="animation: car3BackFade 6s linear forwards;" alt="CAR3_BACK">
        </div>
        <img src="images/CAR5.png" class="car5-parked" alt="CAR5">
        <img src="images/house.png" class="top-house house-1" alt="房屋A">
        <img src="images/house.png" class="top-house house-2" alt="房屋B">
    `;
}

function renderInternalStopFail(container) {
    container.innerHTML = `
        <div class="scene-stop-bg"></div>
        <img src="images/sun.webp" class="stop-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-fail-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.png" class="car3-side" alt="CAR3">
            <img src="images/CAR4.png" class="car3-side2" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="CAR3_BACK">
        </div>
        <img src="images/house.png" class="top-house house-1" alt="房屋A">
        <img src="images/house.png" class="top-house house-2" alt="房屋B">
        <img src="images/BOMB.webp" class="stop-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.png" class="stop-fail-banner" alt="遊戲失敗標題">
    `;
}