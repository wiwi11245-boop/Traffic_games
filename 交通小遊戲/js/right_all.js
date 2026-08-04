// 🛠️ 修正版 right_all.js：修正 ID 搜尋為 rightCountdownImg，支援 4 秒判定與 321.webp 單次播放

function renderRightScene(container, onSceneComplete) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    if (!document.getElementById('css-scene-right-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-right-combined';
        style.textContent = `
            .scene-right-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/右轉場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .right-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .right-flower {
                position: absolute; width: 130px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .right-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }
            .right-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(-200px); z-index: 5; will-change: transform;
                animation: redCarRightStage 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .right-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(-350px); z-index: 5; will-change: transform;
                animation: blueCarRightStage 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            @keyframes redCarRightStage {
                0% { transform: translateX(-200px); }
                30%, 100% { transform: translateX(315px); }
            }
            @keyframes blueCarRightStage {
                0% { transform: translateX(-350px); }
                30%, 100% { transform: translateX(150px); }
            }

            .right-success-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarRightSuccessTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .right-success-player-back {
                position: absolute; width: 120px; height: auto; bottom: 10px; left: 0;
                transform: translateX(650px); opacity: 0; z-index: 4; will-change: transform, opacity;
                animation: redCarBackRightSuccessTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .right-success-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: blueCarRightSuccessTransform 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            @keyframes redCarRightSuccessTransform {
                0% { transform: translateX(315px); opacity: 1; }
                20% { transform: translateX(790px); opacity: 1; }
                22.1%, 100% { transform: translateX(790px); opacity: 0; }
            }
            @keyframes redCarBackRightSuccessTransform {
                0%, 22.1% { transform: translateX(820px) scale(1.2); bottom: 10px; opacity: 0; }
                23% { transform: translateX(820px) scale(1.2); bottom: 10px; opacity: 1; }
                100% { transform: translateX(820px) scale(1.2); bottom: -150px; opacity: 0.3; }
            }
            @keyframes blueCarRightSuccessTransform {
                0% { transform: translateX(150px); }
                30% { transform: translateX(540px); }
                100% { transform: translateX(1100px); }
            }

            .right-fail-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarRightFailTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .right-fail-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: blueCarRightFailTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .right-fail-bomb {
                position: absolute; width: 150px; height: 180px; left: 630px; bottom: 15px;
                z-index: 6; pointer-events: none; opacity: 0;
            }
            .right-fail-bomb.active-play { animation: bombEffectRightFail 5.4s ease-out forwards; }
            .right-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInRightFail 7s ease-out forwards;
            }

            @keyframes redCarRightFailTransform { 0% { transform: translateX(315px); } 60%, 100% { transform: translateX(660px); } }
            @keyframes blueCarRightFailTransform { 0% { transform: translateX(150px); } 60%, 100% { transform: translateX(560px); } }
            @keyframes bombEffectRightFail { 0% { opacity: 1; transform: scale(1.2); } 60%, 100% { opacity: 0; transform: scale(0.8); } }
            @keyframes bannerFadeInRightFail { 0%, 44% { opacity: 0; } 60%, 100% { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <img src="images/sun.webp" class="right-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 30px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 380px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="right: 130px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/CAR.webp" class="right-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="right-blue-car" alt="藍車事件">
        <img src="images/321.webp" id="rightCountdownImg" class="right-countdown-overlay" alt="321倒數">
    `;

    function handleGestureOrKey(action) {
        if (isJudgmentActive && action === 'RIGHT TURN') {
            console.log("🎯 [右轉關卡] 收到影像辨識成功指令：RIGHT TURN !");
            hasCorrectInput = true;
        }
    }

    function onGestureEvent(e) { handleGestureOrKey(e.detail); }
    function onKeyDownEvent(e) { if (e.key === 'ArrowRight') handleGestureOrKey('RIGHT TURN'); }

    window.addEventListener('gestureDetected', onGestureEvent);
    window.addEventListener('keydown', onKeyDownEvent);

    setTimeout(() => {
        // 🛠️ 修正問題點：改搜尋 rightCountdownImg 關鍵字
        const countdownImg = document.getElementById('rightCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();

            // 動畫播完單次 (2.8 秒) 後自動隱藏，避免重複循環
            setTimeout(() => {
                if (countdownImg) countdownImg.style.display = 'none';
            }, 2800);
        }

        isJudgmentActive = true;
        console.log("[右轉判定開始] 請在 4 秒內做出右轉手勢！");

        // 判定保持 4000ms (4 秒)
        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('gestureDetected', onGestureEvent);
            window.removeEventListener('keydown', onKeyDownEvent);
            if (countdownImg) countdownImg.style.display = 'none';

            if (hasCorrectInput) {
                console.log("[右轉關卡] 🎉 通關成功！");
                renderInternalRightSuccess(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 5000);
            } else {
                console.log("[右轉關卡] ❌ 辨識失敗！");
                renderInternalRightFail(container);
                setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(false); }, 7000);
            }
        }, 4000);
    }, 500);
}

function renderInternalRightSuccess(container) {
    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <img src="images/sun.webp" class="right-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img id="rightFailBomb" class="right-fail-bomb" alt="爆炸特效">
        <img src="images/CAR.webp" class="right-success-player-car" alt="紅車主角側身">
        <img src="images/CAR_FORWARD.webp" class="right-success-player-back" alt="紅車主角後視">
        <img src="images/CAR2.webp" class="right-success-blue-car" alt="藍車直行">
    `;
}

function renderInternalRightFail(container) {
    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <img src="images/sun.webp" class="right-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img id="rightFailBomb" class="right-fail-bomb" alt="爆炸特效">
        <img src="images/CAR.webp" class="right-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="right-blue-car right-fail-blue-car" alt="藍車追撞">
        <img src="images/遊戲失敗.png" class="right-fail-banner" alt="遊戲失敗標題">
    `;

    setTimeout(() => {
        const bombImg = document.getElementById('rightFailBomb');
        if (bombImg) {
            bombImg.src = 'images/BOMB.webp?t=' + Date.now();
            bombImg.classList.add('active-play');
        }
    }, 4200);
}