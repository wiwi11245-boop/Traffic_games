// 🛠️ 修正版 overtake_all.js：修正 ID 搜尋為 overtakeCountdownImg，支援 4 秒判定與 321.webp 單次播放

function renderOvertakeScene(container, onSceneComplete) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    if (!document.getElementById('css-scene-overtake-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-overtake-combined';
        style.textContent = `
            .scene-overtake-bg {
                position: absolute; top: 0; left: 0; width: 3000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgTransform 5s linear infinite; will-change: transform;
            }
            @keyframes scrollBgTransform { 0% { transform: translateX(0px); } 100% { transform: translateX(-1000px); } }
            .overtake-sun { position: absolute; top: -62px; left: 98px; width: 172px; height: auto; z-index: 2; pointer-events: none; }
            .overtake-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }
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
            @keyframes angryCarEnterStageTransform { 0% { transform: translateX(-350px); } 30%, 100% { transform: translateX(150px); } }
            @keyframes redCarEnterStageTransform { 0% { transform: translateX(-200px); } 30%, 100% { transform: translateX(315px); } }

            .scene-overtake-success-bg {
                position: absolute; top: 0; left: 0; width: 3000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgOvertakeSuccess 5s linear infinite; will-change: transform;
            }
            @keyframes scrollBgOvertakeSuccess { 0% { transform: translateX(0px); } 100% { transform: translateX(-1000px); } }
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
            .overtake-success-opposite-car {
                position: absolute; width: 160px; height: auto; bottom: 60px; left: 0;
                transform: translateX(1100px) scaleX(-1); z-index: 4; will-change: transform;
                animation: oppositeCarPassFastTransform 7s linear forwards;
            }
            @keyframes angryCarSuccessOvertakeTransform { 0%, 35% { transform: translateX(150px); } 100% { transform: translateX(1200px); } }
            @keyframes redCarKeepDrivingTransform { 0%, 100% { transform: translateX(315px); } }
            @keyframes oppositeCarPassFastTransform { 0% { opacity: 0.1; transform: translateX(1100px) scaleX(-1); } 35%, 100% { opacity: 0.1; transform: translateX(-300px) scaleX(-1); } }

            .scene-overtake-fail-bg {
                position: absolute; top: 0; left: 0; width: 3000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgOvertakeCrash 7s linear forwards; will-change: transform;
            }
            @keyframes scrollBgOvertakeCrash { 0% { transform: translateX(0px); } 45%, 100% { transform: translateX(-900px); } }
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
            @keyframes angryCarOvertakeCrashTransform { 0% { transform: translateX(150px); } 46%, 100% { transform: translateX(280px); } }
            @keyframes redCarOvertakeFailTransform { 0%, 100% { transform: translateX(315px); } }
            @keyframes oppositeCarCrashTransform { 0% { opacity: 0.1; transform: translateX(1100px) scaleX(-1); } 45.1%, 100% { opacity: 1; transform: translateX(440px) scaleX(-1); } }
            @keyframes bombEffectFadeOvertake { 0%, 44.9% { opacity: 0; } 45% { opacity: 1; } 80.1%, 100% { opacity: 0; } }
            @keyframes bannerFadeInOvertake { 0%, 60% { opacity: 0; } 75%, 100% { opacity: 1; } }
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

    function handleGestureOrKey(action) {
        if (isJudgmentActive && action === 'OVERTAKE ALLOWED') {
            console.log("🎯 [超車關卡] 收到影像辨識成功指令：OVERTAKE ALLOWED !");
            hasCorrectInput = true;
        }
    }

    function onGestureEvent(e) { handleGestureOrKey(e.detail); }
    function onKeyDownEvent(e) { if (e.key === ' ' || e.code === 'Space') handleGestureOrKey('OVERTAKE ALLOWED'); }

    window.addEventListener('gestureDetected', onGestureEvent);
    window.addEventListener('keydown', onKeyDownEvent);

    setTimeout(() => {
        // 🛠️ 修正問題點：改搜尋 overtakeCountdownImg 關鍵字
        const countdownImg = document.getElementById('overtakeCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();

            // 動畫播完單次 (2.8 秒) 後自動隱藏，避免重複循環
            setTimeout(() => {
                if (countdownImg) countdownImg.style.display = 'none';
            }, 2800);
        }

        isJudgmentActive = true;

        // 判定保持 4000ms (4 秒)
        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('gestureDetected', onGestureEvent);
            window.removeEventListener('keydown', onKeyDownEvent);
            if (countdownImg) countdownImg.style.display = 'none';

            if (hasCorrectInput) {
                console.log("[超車關卡] 🎉 通關成功！");
                renderInternalOvertakeSuccess(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 7000);
            } else {
                console.log("[超車關卡] ❌ 辨識失敗！");
                renderInternalOvertakeFail(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(false); }, 7000);
            }
        }, 4000);
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