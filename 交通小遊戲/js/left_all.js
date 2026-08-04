// 🛠️ 升級版 left_all.js：判定時間 4000ms，且 321.webp 倒數動畫強制單次播放

function renderLeftScene(container, onSceneComplete) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    if (!document.getElementById('css-scene-left-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-left-combined';
        style.textContent = `
            .scene-left-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/左轉場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .left-sun { position: absolute; top: -62px; left: 98px; width: 172px; height: auto; z-index: 2; pointer-events: none; }
            .left-flower { position: absolute; width: 130px; height: auto; z-index: 2; pointer-events: none; }
            .left-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }
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
                0% { transform: translateX(-200px); }
                30%, 100% { transform: translateX(315px); }
            }
            @keyframes blueCarLeftStage {
                0% { transform: translateX(-350px); }
                30%, 100% { transform: translateX(150px); }
            }
            .left-success-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarLeftSuccessTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .left-success-player-back {
                position: absolute; width: 120px; height: auto; bottom: 10px; left: 0;
                transform: translateX(650px); opacity: 0; z-index: 4; will-change: transform, opacity;
                animation: redCarBackLeftSuccessTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .left-success-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: blueCarLeftSuccessTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            @keyframes redCarLeftSuccessTransform {
                0% { transform: translateX(315px); opacity: 1; }
                20% { transform: translateX(810px); opacity: 1; }
                22.1%, 100% { transform: translateX(810px); opacity: 0; }
            }
            @keyframes redCarBackLeftSuccessTransform {
                0%, 22.1% { transform: translateX(850px) scale(0.9); bottom: 20px; opacity: 0; }
                23% { transform: translateX(850px) scale(0.9); bottom: 20px; opacity: 1; }
                100% { transform: translateX(980px) scale(0.35); bottom: 250px; opacity: 0.1; }
            }
            @keyframes blueCarLeftSuccessTransform {
                0% { transform: translateX(150px); }
                30% { transform: translateX(540px); }
                100% { transform: translateX(1100px); }
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
            }
            .left-fail-bomb.active-play { animation: bombEffectLeftFail 4.2s ease-out forwards; }
            .left-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInLeftFail 7s ease-out forwards;
            }
            @keyframes redCarLeftFailTransform { 0% { transform: translateX(315px); } 60%, 100% { transform: translateX(660px); } }
            @keyframes blueCarLeftFailTransform { 0% { transform: translateX(150px); } 60%, 100% { transform: translateX(550px); } }
            @keyframes bombEffectLeftFail { 0% { opacity: 1; transform: scale(1.2); } 60%, 100% { opacity: 0; transform: scale(0.8); } }
            @keyframes bannerFadeInLeftFail { 0%, 44% { opacity: 0; } 60%, 100% { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/CAR.webp" class="left-player-car" alt="紅車">
        <img src="images/CAR2.webp" class="left-blue-car" alt="藍車">
        <img src="images/321.webp" id="leftCountdownImg" class="left-countdown-overlay" alt="321倒數">
    `;

    function handleGestureOrKey(action) {
        if (isJudgmentActive && action === 'LEFT TURN') {
            console.log("🎯 [左轉關卡] 收到影像辨識成功指令：LEFT TURN !");
            hasCorrectInput = true;
        }
    }
    function onGestureEvent(e) { handleGestureOrKey(e.detail); }
    function onKeyDownEvent(e) { if (e.key === 'ArrowLeft') handleGestureOrKey('LEFT TURN'); }
    
    window.addEventListener('gestureDetected', onGestureEvent);
    window.addEventListener('keydown', onKeyDownEvent);

    setTimeout(() => {
        const countdownImg = document.getElementById('leftCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            // 🛠️ 1. 動態重新賦予 src，強迫圖檔從第一影格重頭播放一次
            countdownImg.src = 'images/321.webp?t=' + Date.now();

            // 🛠️ 2. 在倒數動畫播完一次後 (約 2.8 秒)，自動隱藏圖檔，防止它循環播放第二次
            setTimeout(() => {
                if (countdownImg) countdownImg.style.display = 'none';
            }, 2800);
        }

        isJudgmentActive = true;

        // 🛠️ 3. 判定時間保持為您設定的 4000ms (4 秒)
        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('gestureDetected', onGestureEvent);
            window.removeEventListener('keydown', onKeyDownEvent);

            if (hasCorrectInput) {
                console.log("[左轉關卡] 🎉 通關成功！");
                renderInternalLeftSuccess(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 5000);
            } else {
                console.log("[左轉關卡] ❌ 辨識失敗！");
                renderInternalLeftFail(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(false); }, 7000);
            }
        }, 4000);

    }, 500);
}

function renderInternalLeftSuccess(container) {
    container.innerHTML = `
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img src="images/CAR.webp" class="left-success-player-car" alt="紅車">
        <img src="images/CAR_BACK.webp" class="left-success-player-back" alt="後視車">
        <img src="images/CAR2.webp" class="left-success-blue-car" alt="藍車">
    `;
}

function renderInternalLeftFail(container) {
    container.innerHTML = `
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img id="leftFailBomb" class="left-fail-bomb" alt="爆炸">
        <img src="images/CAR.webp" class="left-fail-player-car" alt="紅車">
        <img src="images/CAR2.webp" class="left-blue-car left-fail-blue-car" alt="藍車">
        <img src="images/遊戲失敗.png" class="left-fail-banner" alt="失敗">
    `;

    setTimeout(() => {
        const bombImg = document.getElementById('leftFailBomb');
        if (bombImg) {
            bombImg.src = 'images/BOMB.webp?t=' + Date.now();
            bombImg.classList.add('active-play');
        }
    }, 2800);
}