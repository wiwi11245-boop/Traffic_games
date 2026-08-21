// 🛠️ 完整動態版 right_all.js：左上角加入「右轉.webp」提示、rAF 渲染防搶跑、完整音效

function renderRightScene(container, onSceneComplete) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    // 🎵 音效宣告
    const sfxCountdown = new Audio('sound_effect/tiktok.mp3');
    sfxCountdown.volume = 0.15; // 15% 音量

    const sfxSuccess = new Audio('sound_effect/success.mp3');
    sfxSuccess.volume = 0.20; // 20% 音量

    const sfxSuccessEvent = new Audio('sound_effect/event&begin.mp3');
    sfxSuccessEvent.volume = 0.05; // 5% 音量 (與 success 同時播放)

    const sfxLoss = new Audio('sound_effect/loss.mp3');
    sfxLoss.volume = 0.35; // 失敗音效

    if (!document.getElementById('css-scene-right-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-right-combined';
        style.textContent = `
            .scene-right-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/右轉場景.webp');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            /* 🛠️ 左上角手勢字樣提示 */
            .gesture-hint {
                position: absolute; top: -170px; left: -60px; width: 300px; height: auto;
                z-index: 9; pointer-events: none;
                filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4));
            }
            .right-sun { position: absolute; top: -62px; left: 98px; width: 172px; height: auto; z-index: 2; pointer-events: none; }
            .right-flower { position: absolute; width: 130px; height: auto; z-index: 2; pointer-events: none; }
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
                0% { transform: translateX(-200px) translateY(0px); }
                30% { transform: translateX(315px) translateY(0px); }
                40% { transform: translateX(315px) translateY(-3px); }
                50% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                70% { transform: translateX(315px) translateY(0px); }
                80% { transform: translateX(315px) translateY(-3px); }
                90%, 100% { transform: translateX(315px) translateY(0px); }
            }
            @keyframes blueCarRightStage {
                0% { transform: translateX(-350px) translateY(0px); }
                30% { transform: translateX(150px) translateY(0px); }
                40% { transform: translateX(150px) translateY(-3px); }
                50% { transform: translateX(150px) translateY(0px); }
                60% { transform: translateX(150px) translateY(-3px); }
                70% { transform: translateX(150px) translateY(0px); }
                80% { transform: translateX(150px) translateY(-3px); }
                90%, 100% { transform: translateX(150px) translateY(0px); }
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
                0% { transform: translateX(315px) translateY(0px); opacity: 1; }
                20% { transform: translateX(790px) translateY(0px); opacity: 1; }
                21% { transform: translateX(790px) translateY(-5px); opacity: 1; }
                22% { transform: translateX(790px) translateY(0px); opacity: 1; }
                22.1%, 100% { transform: translateX(790px); opacity: 0; }
            }
            @keyframes redCarBackRightSuccessTransform {
                0%, 22.1% { transform: translateX(820px) scale(1.2); bottom: 10px; opacity: 0; }
                23% { transform: translateX(820px) scale(1.2); bottom: 10px; opacity: 1; }
                100% { transform: translateX(820px) scale(1.2); bottom: -150px; opacity: 0.3; }
            }
            @keyframes blueCarRightSuccessTransform {
                0% { transform: translateX(150px) translateY(0px); }
                20% { transform: translateX(540px) translateY(0px); }
                21% { transform: translateX(540px) translateY(-3px); }
                23% { transform: translateX(540px) translateY(0px); }
                25% { transform: translateX(540px) translateY(-3px); }
                27% { transform: translateX(540px) translateY(0px); }
                29% { transform: translateX(540px) translateY(-3px); }
                30% { transform: translateX(540px) translateY(0px); }
                100% { transform: translateX(1100px) translateY(0px); }
            }

            /* 🛠️ 失敗下半段：完整保留撞擊瞬間的震動與車身傾斜時間軸 */
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

            @keyframes redCarRightFailTransform {
                0% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(650px) translateY(0px); }
                60.1% { transform: translateX(660px) translate(2px, 1px) rotate(0deg); }
                61.2% { transform: translateX(660px) translate(0px, 0px) rotate(-10deg); }
                62.3%, 100% { transform: translateX(660px) translate(0px, 0px) rotate(0deg); }
            }
            @keyframes blueCarRightFailTransform {
                0% { transform: translateX(150px) translateY(0px); }
                60% { transform: translateX(560px) translateY(0px); }
                60.1% { transform: translateX(550px) translate(-2px, 1px) rotate(0deg); }
                61.2% { transform: translateX(550px) translate(0px, 0px) rotate(-10deg); }
                62.3%, 100% { transform: translateX(550px) translate(0px, 0px) rotate(0deg); }
            }

            @keyframes bombEffectRightFail {
                0% { opacity: 1; transform: scale(1.2) translate(-3px, 2px) rotate(-4deg); }
                30% { transform: scale(1.15) translate(3px, -2px) rotate(4deg); }
                35% { transform: scale(1.1) translate(-2px, 1px) rotate(-2deg); }
                40% { transform: scale(1.05) translate(1px, -1px) rotate(1deg); }
                42% { opacity: 1; transform: scale(1) translate(0px, 0px) rotate(0deg); }
                60% { opacity: 0; transform: scale(0.8) translate(0, 10px) rotate(0deg); }
                60.1%, 100% { opacity: 0; }
            }
            @keyframes bannerFadeInRightFail {
                0%, 44% { opacity: 0; transform: translate(-50%, -15px) scale(0.8); }
                45% { opacity: 0.1; transform: translate(-50%, 0) scale(1); }
                50% { opacity: 0.3; transform: translate(-50%, 0) scale(1); }
                55% { opacity: 0.5; transform: translate(-50%, 0) scale(1); }
                60% { opacity: 0.7; transform: translate(-50%, 0) scale(1); }
                100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <!-- 🛠️ 左上角手勢字樣提示 -->
        <img src="images/右轉.webp" class="gesture-hint" alt="右轉手勢提示">
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

    // 🛠️ 雙重 rAF 確保畫面渲染就緒後再開始計時，徹底防止搶跑[cite: 20]
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                const countdownImg = document.getElementById('rightCountdownImg');
                if (countdownImg) {
                    countdownImg.style.display = 'block';
                    countdownImg.src = 'images/321.webp?t=' + Date.now();

                    // 🎵 播放 tiktok.mp3 倒數音效 (15% 音量)[cite: 25]
                    sfxCountdown.currentTime = 0;
                    sfxCountdown.play().catch(err => console.warn("tiktok 音效播放受阻:", err));

                    setTimeout(() => {
                        if (countdownImg) countdownImg.style.display = 'none';
                    }, 2800);
                }

                isJudgmentActive = true;
                console.log("[右轉判定開始] 請在 4 秒內做出右轉手勢！");

                setTimeout(() => {
                    isJudgmentActive = false;
                    window.removeEventListener('gestureDetected', onGestureEvent);
                    window.removeEventListener('keydown', onKeyDownEvent);
                    if (countdownImg) countdownImg.style.display = 'none';

                    if (hasCorrectInput) {
                        console.log("[右轉關卡] 🎉 通關成功！");
                        // 🎵 同步播放 success.mp3 (20%) 與 event&begin.mp3 (5%)[cite: 25]
                        sfxSuccess.currentTime = 0;
                        sfxSuccess.play().catch(err => console.warn("success 音效播放受阻:", err));
                        sfxSuccessEvent.currentTime = 0;
                        sfxSuccessEvent.play().catch(err => console.warn("event&begin 音效播放受阻:", err));

                        renderInternalRightSuccess(container);
                        setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(true); }, 5000);
                    } else {
                        console.log("[右轉關卡] ❌ 辨識失敗！");
                        // 🎵 播放失敗音效[cite: 25]
                        sfxLoss.currentTime = 0;
                        sfxLoss.play().catch(err => console.warn("loss 音效播放受阻:", err));

                        renderInternalRightFail(container);
                        setTimeout(() => { if (typeof onSceneComplete === 'function') onSceneComplete(false); }, 7000);
                    }
                }, 4000);

            }, 600); // 留給轉場完全拉開的穩定時間[cite: 20]
        });
    });
}

function renderInternalRightSuccess(container) {
    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <img src="images/右轉.webp" class="gesture-hint" alt="右轉手勢提示">
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
        <img src="images/右轉.webp" class="gesture-hint" alt="右轉手勢提示">
        <img src="images/sun.webp" class="right-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img id="rightFailBomb" class="right-fail-bomb" alt="爆炸特效">
        <img src="images/CAR.webp" class="right-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="right-blue-car right-fail-blue-car" alt="藍車追撞">
        <img src="images/遊戲失敗.webp" class="right-fail-banner" alt="遊戲失敗標題">
    `;

    // 🎵 宣告爆炸音效 (20% 音量)[cite: 25]
    const sfxCrash = new Audio('sound_effect/crash.mp3');
    sfxCrash.volume = 0.20;

    setTimeout(() => {
        const bombImg = document.getElementById('rightFailBomb');
        if (bombImg) {
            bombImg.src = 'images/BOMB.webp?t=' + Date.now();
            bombImg.classList.add('active-play');

            // 🎵 BOMB.webp 出現時同步播放 crash.mp3[cite: 25]
            sfxCrash.currentTime = 0;
            sfxCrash.play().catch(err => console.warn("crash 音效播放受阻:", err));
        }
    }, 4200);
}