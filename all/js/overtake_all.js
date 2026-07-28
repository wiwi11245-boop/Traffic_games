// 🛠️ 整合版 overtake.js：包含超車上半段、321.webp 倒數 (800px, top: 20%)、對向車加速錯開、背景無縫無破圖滾動

function renderOvertakeScene(container) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    if (!document.getElementById('css-scene-overtake-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-overtake-combined';
        style.textContent = `
            /* 基礎上半段背景 */
            .scene-overtake-bg {
                position: absolute; top: 0; left: 0; width: 3000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgTransform 5s linear infinite; will-change: transform;
            }
            @keyframes scrollBgTransform {
                0% { transform: translateX(0px); }
                100% { transform: translateX(-1000px); }
            }
            .overtake-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }

            /* 倒數 Overlay 樣式 */
            .overtake-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }

            /* --- 上半段 --- */
            .angry-car {
                position: absolute; width: 255px; height: auto; bottom: 65px; left: 0;
                transform: translateX(-350px); z-index: 5; will-change: transform;
                animation: angryCarEnterStageTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .overtake-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(-200px); z-index: 5; will-change: transform;
                animation: redCarEnterStageTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
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

            /* 🛠️ 成功下半段背景：3000px 超長寬度，平移 -1000px 絕不破圖 */
            .scene-overtake-success-bg {
                position: absolute; top: 0; left: 0; width: 3000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgOvertakeSuccess 5s linear infinite; will-change: transform;
            }
            @keyframes scrollBgOvertakeSuccess {
                0% { transform: translateX(0px); }
                100% { transform: translateX(-1000px); }
            }
            .overtake-success-angry-car {
                position: absolute; width: 255px; height: auto; bottom: 65px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: angryCarSuccessOvertakeTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .overtake-success-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarKeepDrivingTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            /* 🛠️ 對向藍車：加速駛離時間軸，前 35% 快速通過，完全與黑車超車錯開 */
            .overtake-success-opposite-car {
                position: absolute; width: 160px; height: auto; bottom: 60px; left: 0;
                transform: translateX(1100px) scaleX(-1); z-index: 4; will-change: transform;
                animation: oppositeCarPassFastTransform 7s linear forwards;
            }

            @keyframes angryCarSuccessOvertakeTransform {
                0%, 35% { transform: translateX(150px) translateY(0px) rotate(0deg); }
                45% { transform: translateX(150px) translateY(-40px) rotate(-3deg); }
                65% { transform: translateX(450px) translateY(-40px) rotate(0deg); }
                75% { transform: translateX(450px) translateY(0px) rotate(3deg); }
                100% { transform: translateX(1200px) translateY(0px) rotate(0deg); }
            }

            @keyframes redCarKeepDrivingTransform {
                0%, 100% { transform: translateX(315px) translateY(0px); }
                20% { transform: translateX(315px) translateY(-3px); }
                40% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                80% { transform: translateX(315px) translateY(0px); }
            }

            /* 🛠️ 加速版對向車時間軸：0% ~ 35% 瞬間拉走 */
            @keyframes oppositeCarPassFastTransform {
                0% { opacity: 0.1; transform: translateX(1100px) scaleX(-1) translateY(0px); }
                10% { opacity: 1; transform: translateX(600px) scaleX(-1) translateY(-2px); }
                35%, 100% { opacity: 0.1; transform: translateX(-300px) scaleX(-1) translateY(0px); }
            }

            /* --- 失敗下半段 --- */
            .scene-overtake-fail-bg {
                position: absolute; top: 0; left: 0; width: 3000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgOvertakeCrash 7s linear forwards; will-change: transform;
            }
            @keyframes scrollBgOvertakeCrash {
                0% { transform: translateX(0px); }
                45%, 100% { transform: translateX(-900px); }
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
        <div class="scene-overtake-bg"></div>
        <img src="images/sun.webp" class="overtake-sun" alt="太陽">
        <img src="images/ANGRY_CAR.webp" class="angry-car" alt="怒氣後車">
        <img src="images/CAR.webp" class="overtake-player-car" alt="紅車主角">
        <img src="images/321.webp" id="overtakeCountdownImg" class="overtake-countdown-overlay" alt="321倒數">
    `;

    function handleKeyDown(e) {
        if (isJudgmentActive && (e.key === ' ' || e.code === 'Space')) {
            console.log("[手勢判定] 收到正確輸入：Space (空白鍵/允讓超車) !");
            hasCorrectInput = true;
        }
    }

    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
        const countdownImg = document.getElementById('overtakeCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();
        }

        isJudgmentActive = true;
        console.log("[超車判定開始] 請在 2 秒內按下 Space 空白鍵！");

        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('keydown', handleKeyDown);
            if (countdownImg) countdownImg.style.display = 'none';

            if (hasCorrectInput) {
                console.log("[超車判定結果] 🎉 成功！");
                renderInternalOvertakeSuccess(container);
            } else {
                console.log("[超車判定結果] ❌ 失敗！切換至對向相撞場景...");
                renderInternalOvertakeFail(container);
            }
        }, 2000);

    }, 500);
}

function renderInternalOvertakeSuccess(container) {
    container.innerHTML = `
        <div class="scene-overtake-success-bg"></div>
        <img src="images/sun.webp" class="overtake-sun" alt="太陽">
        <img src="images/ANGRY_CAR.webp" class="overtake-success-angry-car" alt="怒氣後車">
        <img src="images/CAR.webp" class="overtake-success-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="overtake-success-opposite-car" alt="對向來車">
    `;
}

function renderInternalOvertakeFail(container) {
    container.innerHTML = `
        <div class="scene-overtake-fail-bg"></div>
        <img src="images/sun.webp" class="overtake-sun" alt="太陽">
        <img src="images/ANGRY_CAR.webp" class="overtake-fail-angry-car" alt="怒氣後車">
        <img src="images/CAR.webp" class="overtake-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="overtake-fail-opposite-car" alt="對向車">
        <img src="images/BOMB.webp" class="overtake-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.png" class="overtake-fail-banner" alt="遊戲失敗標題">
    `;
}