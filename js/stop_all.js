// 🛠️ 完整動態整合版 stop_all.js：精確對齊 3080ms 追撞時間軸、BOMB 動圖完整播放、成功/失敗全音效整合

function renderStopScene(container, onSceneComplete) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    // 🎵 音效物件宣告與音量設定
    const sfxCountdown = new Audio('sound_effect/tiktok.mp3');
    sfxCountdown.volume = 0.15; // 15% 音量

    const sfxSuccess = new Audio('sound_effect/success.mp3');
    sfxSuccess.volume = 0.20; // 20% 音量

    const sfxSuccessEvent = new Audio('sound_effect/event&begin.mp3');
    sfxSuccessEvent.volume = 0.05; // 5% 音量 (與 success 同時播放)

    const sfxLoss = new Audio('sound_effect/loss.mp3');
    sfxLoss.volume = 0.35; // 失敗音效

    if (!document.getElementById('css-scene-stop-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-stop-combined';
        style.textContent = `
            .scene-stop-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/停止場景.webp');
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

            /* --- 上半段：紅車與藍車登場進場 --- */
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

            /* 🛠️ 成功下半段：CAR3/CAR4/CAR3_BACK 動畫先動 (0%~48%)，隨後輪到 CAR 與 CAR2 (35%~100%) 起步 */
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

            /* 紅車：0%~35% 在緩停位置抖動靠邊，35% 後等事件車處理完才起步駛離 */
            @keyframes redCarSuccessDriveTransform {
                0% { transform: translateX(205px) translateY(0px); }
                35% { transform: translateX(470px) translateY(0px); }
                35.1% { transform: translateX(470px) translateY(-3px); }
                40%, 60% { transform: translateX(470px) translateY(0px); }
                100% { transform: translateX(1100px) translateY(0px); }
            }

            /* 藍車：0%~35% 位移靠緊，35% 後與紅車同步起步 */
            @keyframes blueCarSuccessDriveTransform {
                0% { transform: translateX(50px) translateY(0px); }
                35% { transform: translateX(315px) translateY(0px); }
                35.1% { transform: translateX(315px) translateY(-3px); }
                40%, 60% { transform: translateX(315px) translateY(0px); }
                100% { transform: translateX(945px) translateY(0px); }
            }

            /* CAR3、CAR4、CAR3_BACK 先行淡出與開走動畫 */
            @keyframes car3BackFade { 0%, 38% { opacity: 1; } 40%, 100% { opacity: 0; } }
            @keyframes car3SidesFade { 0%, 48% { opacity: 1; } 56%, 100% { opacity: 0; } }
            @keyframes car5FadeIn { 0%, 50% { opacity: 0; } 60%, 100% { opacity: 1; } }

            /* 🛠️ 失敗下半段：7s 週期，44% 處發生追撞 */
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
                position: absolute; width: 150px; height: 180px; left: 485px; bottom: 25px;
                z-index: 6; pointer-events: none; opacity: 0;
            }
            .stop-fail-bomb.active-play {
                animation: bombEffectFadeStop 1.5s ease-out forwards;
            }
            .stop-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInStop 7s ease-out forwards;
            }

            @keyframes redCarSlowdownFailure {
                0% { transform: translateX(205px) translateY(0px); }
                40% { transform: translateX(500px) translateY(0px); }
                44% { transform: translateX(505px) rotate(0deg); }
                45% { transform: translateX(505px) rotate(-10deg); }
                46%, 100% { transform: translateX(505px) rotate(0deg); }
            }

            @keyframes blueCarCrashEvent {
                0% { transform: translateX(50px) translateY(0px); }
                44% { transform: translateX(410px) translateY(0px); }
                44.5% { transform: translateX(390px) rotate(0deg); }
                45% { transform: translateX(390px) rotate(-10deg); }
                46%, 100% { transform: translateX(390px) rotate(0deg); }
            }

            /* 🛠️ 修正後的爆炸動畫：觸發時 0% 立即顯現，完整播放動圖影格，最後平滑淡出 */
            @keyframes bombEffectFadeStop {
                0% { opacity: 1; transform: scale(0.6) rotate(0deg); }
                20% { opacity: 1; transform: scale(1.2) translate(-3px, 2px) rotate(-4deg); }
                50% { opacity: 1; transform: scale(1.1) translate(2px, -2px) rotate(3deg); }
                80% { opacity: 1; transform: scale(1.0) translate(0, 0) rotate(0deg); }
                100% { opacity: 0; transform: scale(0.8) translateY(10px); }
            }

            @keyframes bannerFadeInStop {
                0%, 45% { opacity: 0; transform: translate(-50%, -15px) scale(0.8); }
                52% { opacity: 1; transform: translate(-50%, 0) scale(1); }
                100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
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
            <img src="images/CAR3.webp" class="car3-side" alt="CAR3">
            <img src="images/CAR4.webp" class="car3-side2" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="CAR3_BACK">
        </div>
        <img src="images/house.webp" class="top-house house-1" alt="房屋A">
        <img src="images/house.webp" class="top-house house-2" alt="房屋B">
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
        const countdownImg = document.getElementById('stopCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();

            // 🎵 播放 tiktok.mp3 倒數音效 (15% 音量)
            sfxCountdown.currentTime = 0;
            sfxCountdown.play().catch(err => console.warn("tiktok 音效播放受阻:", err));

            setTimeout(() => {
                if (countdownImg) countdownImg.style.display = 'none';
            }, 2800);
        }

        isJudgmentActive = true;

        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('gestureDetected', onGestureEvent);
            window.removeEventListener('keydown', onKeyDownEvent);
            if (countdownImg) countdownImg.style.display = 'none';

            if (hasCorrectInput) {
                console.log("[緩停關卡] 🎉 通關成功！");
                
                // 🎵 1. 即刻播放通關音效 success.mp3 (20%)
                sfxSuccess.currentTime = 0;
                sfxSuccess.play().catch(err => console.warn("success 音效播放受阻:", err));

                // 🎵 2. 等待緩停結束起步 (6s 的 60% = 3600ms) 後，再播放 event&begin.mp3
                setTimeout(() => {
                    sfxSuccessEvent.currentTime = 0;
                    sfxSuccessEvent.play().catch(err => console.warn("event&begin 音效播放受阻:", err));
                }, 3400);

                renderInternalStopSuccess(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 6000);
            } else {
                console.log("[緩停關卡] ❌ 辨識失敗！");
                // 🎵 播放失敗音效
                sfxLoss.currentTime = 0;
                sfxLoss.play().catch(err => console.warn("loss 音效播放受阻:", err));

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
            <img src="images/CAR3.webp" class="car3-side" style="animation: car3SidesFade 6s linear forwards;" alt="CAR3">
            <img src="images/CAR4.webp" class="car3-side2" style="animation: car3SidesFade 6s linear forwards;" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" style="animation: car3BackFade 6s linear forwards;" alt="CAR3_BACK">
        </div>
        <img src="images/CAR5.webp" class="car5-parked" alt="CAR5">
        <img src="images/house.webp" class="top-house house-1" alt="房屋A">
        <img src="images/house.webp" class="top-house house-2" alt="房屋B">
    `;
}

function renderInternalStopFail(container) {
    container.innerHTML = `
        <div class="scene-stop-bg"></div>
        <img src="images/sun.webp" class="stop-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-fail-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.webp" class="car3-side" alt="CAR3">
            <img src="images/CAR4.webp" class="car3-side2" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="CAR3_BACK">
        </div>
        <img src="images/house.webp" class="top-house house-1" alt="房屋A">
        <img src="images/house.webp" class="top-house house-2" alt="房屋B">
        <img id="stopFailBomb" class="stop-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.webp" class="stop-fail-banner" alt="遊戲失敗標題">
    `;

    // 🎵 宣告爆炸音效 (20% 音量)
    const sfxCrash = new Audio('sound_effect/crash.mp3');
    sfxCrash.volume = 0.20;

    // 🎯 精確對齊時間點：7000ms * 44% = 3080ms 撞擊瞬間
    const CRASH_TRIGGER_TIME = 2300;

    setTimeout(() => {
        const bombImg = document.getElementById('stopFailBomb');
        if (bombImg) {
            bombImg.src = 'images/BOMB.webp?t=' + Date.now();
            bombImg.classList.add('active-play');

            // 🎵 BOMB.webp 出現時同步從頭 (0秒) 播放 crash.mp3
            sfxCrash.currentTime = 0;
            sfxCrash.play().catch(err => console.warn("crash 音效播放受阻:", err));
        }
    }, CRASH_TRIGGER_TIME);
}