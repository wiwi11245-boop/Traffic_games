// 🛠️ 整合版 right.js：包含右轉上半段、微調版 321.webp 倒數 (width: 800px, top: 20%)、以及 ArrowRight 鍵盤判定 Success / Loss

function renderRightScene(container) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    // 1. 動態注入右轉場景全套 CSS (包含基礎、成功、失敗與微調後的倒數 Overlay 樣式)
    if (!document.getElementById('css-scene-right-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-right-combined';
        style.textContent = `
            /* 全域右轉背景 */
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

            /* 🛠️ 微調後的倒數動圖 321.webp 樣式 */
            .right-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }

            /* --- 上半段車輛樣式 --- */
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

            /* --- 成功下半段樣式 --- */
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

            /* --- 失敗下半段樣式 --- */
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
                position: absolute; width: 150px; height: 180px; left: 640px; bottom: 15px;
                z-index: 6; pointer-events: none; opacity: 0;
                animation: bombEffectRightFail 7s ease-out forwards;
            }
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
                0%, 40% { opacity: 0; transform: scale(0.5); }
                40.1% { opacity: 1; transform: scale(1.2) translate(-3px, 2px) rotate(-4deg); }
                61.5% { transform: scale(1.15) translate(3px, -2px) rotate(4deg); }
                63% { transform: scale(1.1) translate(-2px, 1px) rotate(-2deg); }
                64.5% { transform: scale(1.05) translate(1px, -1px) rotate(1deg); }
                65% { opacity: 1; transform: scale(1) translate(0px, 0px) rotate(0deg); }
                75% { opacity: 0; transform: scale(0.8) translate(0, 10px) rotate(0deg); }
                75.1%, 100% { opacity: 0; }
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

    // 2. 渲染上半段基礎 DOM 畫面
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

    // 3. 鍵盤輸入監聽器 (按下 ArrowRight 代表右轉成功)
    function handleKeyDown(e) {
        if (isJudgmentActive && (e.key === 'ArrowRight' || e.code === 'ArrowRight')) {
            console.log("[手勢判定] 收到正確輸入：ArrowRight !");
            hasCorrectInput = true;
        }
    }

    window.addEventListener('keydown', handleKeyDown);

    // 4. 0.5 秒後啟動 321.webp 倒數
    setTimeout(() => {
        const countdownImg = document.getElementById('rightCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            countdownImg.src = 'images/321.webp?t=' + Date.now();
        }

        isJudgmentActive = true;
        console.log("[右轉判定開始] 請在 2 秒內按下 ArrowRight 方向鍵！");

        // 5. 2 秒倒數結束結算
        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('keydown', handleKeyDown);

            if (countdownImg) countdownImg.style.display = 'none';

            if (hasCorrectInput) {
                console.log("[右轉判定結果] 🎉 成功！切換至右轉成功場景...");
                renderInternalRightSuccess(container);
            } else {
                console.log("[右轉判定結果] ❌ 失敗！未接收到 ArrowRight，切換至追撞失敗場景...");
                renderInternalRightFail(container);
            }
        }, 2000);

    }, 500);
}

// 🛠️ 內部函數：渲染右轉成功下半段
function renderInternalRightSuccess(container) {
    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <img src="images/sun.webp" class="right-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/CAR.webp" class="right-success-player-car" alt="紅車主角側身">
        <img src="images/CAR_FORWARD.webp" class="right-success-player-back" alt="紅車主角後視">
        <img src="images/CAR2.webp" class="right-success-blue-car" alt="藍車直行">
    `;
}

// 🛠️ 內部函數：渲染右轉失敗下半段
function renderInternalRightFail(container) {
    container.innerHTML = `
        <div class="scene-right-bg"></div>
        <img src="images/sun.webp" class="right-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="right-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/BOMB.webp" class="right-fail-bomb" alt="爆炸特效">
        <img src="images/CAR.webp" class="right-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="right-blue-car right-fail-blue-car" alt="藍車追撞">
        <img src="images/遊戲失敗.png" class="right-fail-banner" alt="遊戲失敗標題">
    `;
}