// 🛠️ 完整動態版 overtake_all.js：整合 success+event&begin 同步播放、補回 BOMB 延遲動態載入+crash.mp3(20%)

function renderOvertakeScene(container, onSceneComplete) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    // 🎵 音效宣告
    const sfxCountdown = new Audio('sound_effect/tiktok.mp3');
    sfxCountdown.volume = 0.15; // 15% 音量
    
    const sfxTrumpet = new Audio('sound_effect/Trumpet.mp3');
    sfxTrumpet.volume = 0.30; // 30% 音量

    const sfxSuccess = new Audio('sound_effect/success.mp3');
    sfxSuccess.volume = 0.20; // 20% 音量

    const sfxSuccessEvent = new Audio('sound_effect/event&begin.mp3');
    sfxSuccessEvent.volume = 0.05; // 5% 音量 (與 success 同時播放)

    const sfxLoss = new Audio('sound_effect/loss.mp3');
    sfxLoss.volume = 0.35; // 失敗音效

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

            /* 🛠️ 上半段：完整保留帶有顛簸抖動細節的車輛進場動畫 */
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

            /* 成功下半段背景與車輛動畫 */
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
            @keyframes oppositeCarPassFastTransform {
                0% { opacity: 0.1; transform: translateX(1100px) scaleX(-1) translateY(0px); }
                10% { opacity: 1; transform: translateX(600px) scaleX(-1) translateY(-2px); }
                35%, 100% { opacity: 0.1; transform: translateX(-300px) scaleX(-1) translateY(0px); }
            }

            /* 失敗下半段背景與撞車動畫 */
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
            /* 🛠️ BOMB 預設透明，等 3150ms 注入 active-play 播放 */
            .overtake-fail-bomb {
                position: absolute; width: 180px; height: 180px; left: 370px; bottom: 65px;
                z-index: 6; pointer-events: none; opacity: 0;
            }
            .overtake-fail-bomb.active-play {
                animation: bombEffectFadeOvertake 3.85s ease-out forwards;
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
                50%, 100% { opacity: 1; transform: translateX(460px) scaleX(-1) rotate(0deg); }
            }
            /* 🛠️ 從 0 影格開始顯現的爆炸動畫 */
            @keyframes bombEffectFadeOvertake {
                0% { opacity: 1; transform: scale(1.2) rotate(-4deg); }
                15% { transform: scale(1.15) rotate(4deg); }
                25% { transform: scale(1.1) rotate(-2deg); }
                35% { opacity: 1; transform: scale(1) rotate(0deg); }
                60% { opacity: 0; transform: scale(0.8); }
                60.1%, 100% { opacity: 0; }
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
        const countdownImg = document.getElementById('overtakeCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();

            // 🎵 播放 tiktok.mp3 倒數音效 (15% 音量)
            sfxCountdown.currentTime = 0;
            sfxCountdown.play().catch(err => console.warn("tiktok 音效播放受阻:", err));
            
            // 🎵 播放 trumpet.mp3 倒數音效 (30% 音量)
            sfxTrumpet.currentTime = 0;
            sfxTrumpet.play().catch(err => console.warn("trumpet 音效播放受阻:", err));

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
                console.log("[超車關卡] 🎉 通關成功！");
                // 🎵 同步播放 success.mp3 (20%) 與 event&begin.mp3 (5%)
                sfxSuccess.currentTime = 0;
                sfxSuccess.play().catch(err => console.warn("success 音效播放受阻:", err));
                sfxSuccessEvent.currentTime = 0;
                sfxSuccessEvent.play().catch(err => console.warn("event&begin 音效播放受阻:", err));

                renderInternalOvertakeSuccess(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 7000);
            } else {
                console.log("[超車關卡] ❌ 辨識失敗！");
                // 🎵 播放失敗音效
                sfxLoss.currentTime = 0;
                sfxLoss.play().catch(err => console.warn("loss 音效播放受阻:", err));

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
        <img id="overtakeFailBomb" class="overtake-fail-bomb" alt="爆炸特效">
        <img src="images/遊戲失敗.png" class="overtake-fail-banner" alt="遊戲失敗標題">
    `;

    // 🎵 宣告爆炸音效 (20% 音量)
    const sfxCrash = new Audio('sound_effect/crash.mp3');
    sfxCrash.volume = 0.20;

    // 🛠️ 補回：在 3150ms（7 秒動畫的 45% 撞擊時刻）動態給予 src 並播放 crash.mp3
    setTimeout(() => {
        const bombImg = document.getElementById('overtakeFailBomb');
        if (bombImg) {
            bombImg.src = 'images/BOMB.webp?t=' + Date.now();
            bombImg.classList.add('active-play');

            // 🎵 BOMB.webp 出現時同步播放 crash.mp3
            sfxCrash.currentTime = 0;
            sfxCrash.play().catch(err => console.warn("crash 音效播放受阻:", err));
        }
    }, 3150); // 3150ms = 7000ms * 45%
}