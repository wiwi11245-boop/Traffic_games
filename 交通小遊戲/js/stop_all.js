// 🛠️ 修正版 stop_all.js：修正 ID 搜尋為 stopCountdownImg，支援 4 秒判定與 321.webp 單次播放

function renderStopScene(container, onSceneComplete) {
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
                0% { transform: translateX(-200px); }
                30%, 100% { transform: translateX(205px); }
            }
            @keyframes blueCarStopStageTransform {
                0% { transform: translateX(-350px); }
                30%, 100% { transform: translateX(50px); }
            }

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

            @keyframes redCarSuccessDriveTransform { 0% { transform: translateX(205px); } 100% { transform: translateX(1100px); } }
            @keyframes blueCarSuccessDriveTransform { 0% { transform: translateX(50px); } 100% { transform: translateX(945px); } }
            @keyframes car3BackFade { 0%, 38% { opacity: 1; } 40%, 100% { opacity: 0; } }
            @keyframes car3SidesFade { 0%, 48% { opacity: 1; } 56%, 100% { opacity: 0; } }
            @keyframes car5FadeIn { 0%, 50% { opacity: 0; } 60%, 100% { opacity: 1; } }

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
            }
            .stop-fail-bomb.active-play { animation: bombEffectFadeStop 5s ease-out forwards; }
            .stop-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInStop 7s ease-out forwards;
            }
            @keyframes redCarSlowdownFailure { 0% { transform: translateX(205px); } 46%, 100% { transform: translateX(505px); } }
            @keyframes blueCarCrashEvent { 0% { transform: translateX(50px); } 46%, 100% { transform: translateX(390px); } }
            @keyframes bombEffectFadeStop { 0% { opacity: 1; transform: scale(1.2); } 60%, 100% { opacity: 0; transform: scale(0.8); } }
            @keyframes bannerFadeInStop { 0%, 50% { opacity: 0; } 65%, 100% { opacity: 1; } }
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

    function handleGestureOrKey(action) {
        if (isJudgmentActive && action === 'STOP / SLOW DOWN') {
            console.log("🎯 [緩停關卡] 收到影像辨識成功指令：STOP / SLOW DOWN !");
            hasCorrectInput = true;
        }
    }
    function onGestureEvent(e) { handleGestureOrKey(e.detail); }
    function onKeyDownEvent(e) { if (e.key === 'ArrowDown') handleGestureOrKey('STOP / SLOW DOWN'); }

    window.addEventListener('gestureDetected', onGestureEvent);
    window.addEventListener('keydown', onKeyDownEvent);

    setTimeout(() => {
        // 🛠️ 修正問題點：改搜尋 stopCountdownImg 關鍵字
        const countdownImg = document.getElementById('stopCountdownImg');
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
                console.log("[緩停關卡] 🎉 通關成功！");
                renderInternalStopSuccess(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 6000);
            } else {
                console.log("[緩停關卡] ❌ 辨識失敗！");
                renderInternalStopFail(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(false); }, 7000);
            }
        }, 4000);
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
        <img id="stopFailBomb" class="stop-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.png" class="stop-fail-banner" alt="遊戲失敗標題">
    `;

    setTimeout(() => {
        const bombImg = document.getElementById('stopFailBomb');
        if (bombImg) {
            bombImg.src = 'images/BOMB.webp?t=' + Date.now();
            bombImg.classList.add('active-play');
        }
    }, 2000);
}