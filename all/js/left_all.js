// 🛠️ 整合版 left.js：包含上半段駛入、0.5s 後 321.webp 倒數判定、以及 Success / Loss 串接

function renderLeftScene(container) {
    let hasCorrectInput = false;
    let isJudgmentActive = false;

    // 1. 動態注入左轉場景全套 CSS (包含基礎、成功、失敗與倒數 Overlay 樣式)
    if (!document.getElementById('css-scene-left-combined')) {
        const style = document.createElement('style');
        style.id = 'css-scene-left-combined';
        style.textContent = `
            /* 全域左轉背景 */
            .scene-left-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/左轉場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .left-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .left-flower {
                position: absolute; width: 130px; height: auto;
                z-index: 2; pointer-events: none;
            }

            /* 倒數動圖 321.webp 樣式 */
            .left-countdown-overlay {
                position: absolute; width: 800px; height: auto;
                left: 50%; top: 20%; transform: translate(-50%, -50%);
                z-index: 10; pointer-events: none; display: none;
            }

            /* --- 上半段車輛樣式 --- */
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
                0% { transform: translateX(-200px) translateY(0px); }
                30% { transform: translateX(315px) translateY(0px); }
                40% { transform: translateX(315px) translateY(-3px); }
                50% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                70% { transform: translateX(315px) translateY(0px); }
                80% { transform: translateX(315px) translateY(-3px); }
                90%, 100% { transform: translateX(315px) translateY(0px); }
            }
            @keyframes blueCarLeftStage {
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
                0% { transform: translateX(315px) translateY(0px); opacity: 1; }
                20% { transform: translateX(810px) translateY(0px); opacity: 1; }
                21% { transform: translateX(810px) translateY(-5px); opacity: 1; }
                22% { transform: translateX(810px) translateY(0px); opacity: 1; }
                22.1%, 100% { transform: translateX(810px); opacity: 0; }
            }
            @keyframes redCarBackLeftSuccessTransform {
                0%, 22.1% { transform: translateX(850px) scale(0.9); bottom: 20px; opacity: 0; }
                23% { transform: translateX(850px) scale(0.9); bottom: 20px; opacity: 1; }
                100% { transform: translateX(980px) scale(0.35); bottom: 250px; opacity: 0.1; }
            }
            @keyframes blueCarLeftSuccessTransform {
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
                animation: bombEffectLeftFail 7s ease-out forwards;
            }
            .left-fail-banner {
                position: absolute; width: 200px; height: auto; left: 50%; top: 30px;
                transform: translateX(-50%); z-index: 7; pointer-events: none; opacity: 0;
                animation: bannerFadeInLeftFail 7s ease-out forwards;
            }

            @keyframes redCarLeftFailTransform {
                0% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(650px) translateY(0px); }
                60.1% { transform: translateX(660px) translate(2px, 1px) rotate(0deg); }
                61.2% { transform: translateX(660px) translate(0px, 0px) rotate(-10deg); }
                62.3%, 100% { transform: translateX(660px) translate(0px, 0px) rotate(0deg); }
            }
            @keyframes blueCarLeftFailTransform {
                0% { transform: translateX(150px) translateY(0px); }
                60% { transform: translateX(560px) translateY(0px); }
                60.1% { transform: translateX(550px) translate(-2px, 1px) rotate(0deg); }
                61.2% { transform: translateX(550px) translate(0px, 0px) rotate(-10deg); }
                62.3%, 100% { transform: translateX(550px) translate(0px, 0px) rotate(0deg); }
            }
            @keyframes bombEffectLeftFail {
                0%, 40% { opacity: 0; transform: scale(0.5); }
                40.1% { opacity: 1; transform: scale(1.2) translate(-3px, 2px) rotate(-4deg); }
                61.5% { transform: scale(1.15) translate(3px, -2px) rotate(4deg); }
                63% { transform: scale(1.1) translate(-2px, 1px) rotate(-2deg); }
                64.5% { transform: scale(1.05) translate(1px, -1px) rotate(1deg); }
                65% { opacity: 1; transform: scale(1) translate(0px, 0px) rotate(0deg); }
                75% { opacity: 0; transform: scale(0.8) translate(0, 10px) rotate(0deg); }
                75.1%, 100% { opacity: 0; }
            }
            @keyframes bannerFadeInLeftFail {
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
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 30px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 380px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="right: 130px; bottom: -50px;" alt="裝飾花朵">
        <img src="images/CAR.webp" class="left-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="left-blue-car" alt="藍車事件">
        <img src="images/321.webp" id="leftCountdownImg" class="left-countdown-overlay" alt="321倒數">
    `;

    // 3. 鍵盤輸入監聽器 (按下 ArrowLeft 代表成功輸入)
    function handleKeyDown(e) {
        if (isJudgmentActive && (e.key === 'ArrowLeft' || e.code === 'ArrowLeft')) {
            console.log("[手勢判定] 收到正確輸入：ArrowLeft !");
            hasCorrectInput = true;
        }
    }

    // 綁定全域監聽器
    window.addEventListener('keydown', handleKeyDown);

    // 4. 0.5 秒後啟動 321.webp 倒數 (2 秒判定時間)
    setTimeout(() => {
        const countdownImg = document.getElementById('leftCountdownImg');
        if (countdownImg) {
            countdownImg.style.display = 'block';
            // 加時間戳記確保 WebP 倒數動圖從第一影格重新播放
            countdownImg.src = 'images/321.webp?t=' + Date.now();
        }

        // 開啟判定視窗
        isJudgmentActive = true;
        console.log("[判定開始] 請在 2 秒內按下 ArrowLeft 方向鍵！");

        // 5. 2 秒倒數結束 (進入場景 2.5 秒處)，進行結果結算
        setTimeout(() => {
            isJudgmentActive = false;
            window.removeEventListener('keydown', handleKeyDown);

            if (countdownImg) countdownImg.style.display = 'none';

            // 根據判定結果切換對應的下半段場景
            if (hasCorrectInput) {
                console.log("[判定結果] 🎉 成功！切換至左轉成功場景...");
                renderInternalLeftSuccess(container);
            } else {
                console.log("[判定結果] ❌ 失敗！未接收到正確輸入，切換至追撞失敗場景...");
                renderInternalLeftFail(container);
            }
        }, 2000); // 2 秒倒數

    }, 500); // 進入場景 0.5 秒處
}

// 🛠️ 內部函數：渲染左轉成功下半段[cite: 37]
function renderInternalLeftSuccess(container) {
    container.innerHTML = `
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/CAR.webp" class="left-success-player-car" alt="紅車主角側身">
        <img src="images/CAR_BACK.webp" class="left-success-player-back" alt="紅車主角後視">
        <img src="images/CAR2.webp" class="left-success-blue-car" alt="藍車直行">
    `;
}

// 🛠️ 內部函數：渲染左轉失敗下半段[cite: 39]
function renderInternalLeftFail(container) {
    container.innerHTML = `
        <div class="scene-left-bg"></div>
        <img src="images/sun.webp" class="left-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/BOMB.webp" class="left-fail-bomb" alt="爆炸特效">
        <img src="images/CAR.webp" class="left-fail-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="left-blue-car left-fail-blue-car" alt="藍車追撞">
        <img src="images/遊戲失敗.png" class="left-fail-banner" alt="遊戲失敗標題">
    `;
}