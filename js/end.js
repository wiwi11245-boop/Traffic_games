// 🛠️ 完整動態版 end.js：支援鍵盤 Enter 與手機/滑鼠點擊螢幕返回標題、完整音效時序

function renderEndScene(container, onReturnToTitle) {
    let canReturnToTitle = false;

    // 🎵 音效與音樂宣告
    const audioEnd = new Audio('sound_effect/end.mp3');
    audioEnd.loop = false;
    audioEnd.volume = 0.1; // 10% 音量

    const audioEndingTheme = new Audio('sound_effect/結局音樂.mp3');
    audioEndingTheme.loop = true; // 循環播放直到按下 Enter 或點擊
    audioEndingTheme.volume = 0.05; // 5% 音量

    // 1. 場景開啟，立即播放 end.mp3
    audioEnd.currentTime = 0;
    audioEnd.play().catch(err => console.warn("end 音樂播放受阻:", err));

    if (!document.getElementById('css-scene-end-gpu-optimized')) {
        const style = document.createElement('style');
        style.id = 'css-scene-end-gpu-optimized';
        style.textContent = `
            .scene-end-viewport {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/修車廠.webp');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
                transform: translate3d(0, 0, 0); /* 開啟 GPU 合成圖層 */
            }

            /* 落日太陽 */
            .setting-sun {
                position: absolute; width: 172px; height: auto; top: -62px; left: 98px;
                z-index: 1.5; pointer-events: none; will-change: transform, opacity;
                animation: sunSunsetGpu 12s ease-in-out forwards;
            }

            /* ⚡ 影格一：優化貝茲曲線，改用 (0.25, 1, 0.5, 1) 讓進場快速且減速流暢 */
            .car-frame1 {
                position: absolute; width: 200px; height: auto; bottom: 75px; left: 0; z-index: 2; opacity: 1;
                will-change: transform, opacity;
                animation: parkStage1Gpu 12s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            /* 影格二：轉向後視 */
            .car-frame2 {
                position: absolute; width: 80px; height: auto; left: 0; bottom: 0; z-index: 2; opacity: 0;
                will-change: transform, opacity;
                animation: parkStage2Gpu 12s linear forwards;
            }

            /* 影格三：開燈停妥 */
            .car-frame3 {
                position: absolute; width: 200px; height: auto; left: 0; bottom: 0; z-index: 2; opacity: 0;
                will-change: transform, opacity;
                animation: parkStage3Gpu 12s linear forwards;
            }

            /* 影格四：熄燈停妥 */
            .car-frame4 {
                position: absolute; width: 127px; height: auto; left: 0; bottom: 0; z-index: 3; opacity: 0;
                will-change: transform, opacity;
                animation: parkStage4Gpu 12s linear forwards;
            }

            .dark-overlay {
                position: absolute; width: 100%; height: 100%; left: 0; top: 0;
                background-color: #111118; z-index: 4; pointer-events: none; opacity: 0;
                will-change: opacity;
                animation: smoothDarkenOnce 12s ease-out forwards;
            }

            .foreground-mountain {
                position: absolute; width: 1000px; height: 400px; bottom: 17px; left: 0;
                background-image: url('images/mountain.webp'); background-size: contain;
                background-position: center; background-repeat: no-repeat; z-index: 3; pointer-events: none;
            }

            .thanks-banner {
                position: absolute; width: 320px; height: auto; left: 50%; top: 0px;
                z-index: 5; pointer-events: none; opacity: 0; will-change: transform, opacity;
                animation: thanksFadeInOutGpu 12s ease-out forwards;
            }

            .return-title-banner {
                position: absolute; width: 420px; height: auto; left: 50%; top: 50%;
                z-index: 6; pointer-events: none; opacity: 0; will-change: transform, opacity;
                animation: returnTitleFadeInGpu 12s ease-out forwards;
            }

            /* ==========================================
               ⚡ 時間軸 Keyframes (12s 總時長)
               ========================================== */

            /* 影格一 (CAR_finish.webp)：流暢快速駛入，於 35% 停下 */
            @keyframes parkStage1Gpu {
                0% { transform: translate3d(-250px, 0, 0); opacity: 1; }
                35% { transform: translate3d(800px, 0, 0); opacity: 1; }
                36%, 100% { transform: translate3d(800px, 0, 0); opacity: 0; }
            }

            /* 影格二 (CAR_BACK2.webp)：36%~46% 順暢轉向倒車 */
            @keyframes parkStage2Gpu {
                0%, 35% { opacity: 0; transform: translate3d(900px, -70px, 0); }
                36% { opacity: 1; transform: translate3d(900px, -60px, 0); }
                45% { opacity: 1; transform: translate3d(900px, -90px, 0); }
                46%, 100% { opacity: 0; transform: translate3d(900px, -90px, 0); }
            }

            /* 影格三 (CAR_finish2.webp)：47%~55% 開燈停妥 */
            @keyframes parkStage3Gpu {
                0%, 46% { opacity: 0; transform: translate3d(770px, -160px, 0); }
                47%, 54% { opacity: 1; transform: translate3d(770px, -160px, 0); }
                55%, 100% { opacity: 0; transform: translate3d(770px, -160px, 0); }
            }

            /* 影格四 (CAR_finish3.webp)：55% 熄燈並持續定格 */
            @keyframes parkStage4Gpu {
                0%, 54% { opacity: 0; transform: translate3d(843px, -160px, 0); }
                55%, 100% { opacity: 1; transform: translate3d(843px, -160px, 0); }
            }

            /* 太陽下山 */
            @keyframes sunSunsetGpu {
                0% { transform: translate3d(0, 0, 0); opacity: 1; }
                65%, 100% { transform: translate3d(0, 32px, 0); opacity: 0.2; }
            }

            /* 天黑遮罩 */
            @keyframes smoothDarkenOnce {
                0%, 60% { opacity: 0; }
                65% { opacity: 0.2; }
                80%, 100% { opacity: 0.85; }
            }

            /* 感謝遊玩 (70% 處即 8.4s 開始淡入) */
            @keyframes thanksFadeInOutGpu {
                0%, 70% { opacity: 0; transform: translate3d(-50%, -15px, 0); }
                74%, 82% { opacity: 1; transform: translate3d(-50%, 0, 0); }
                86%, 100% { opacity: 0; transform: translate3d(-50%, 15px, 0); }
            }

            /* 回到標題：淡入 */
            @keyframes returnTitleFadeInGpu {
                0%, 89.9% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(0.9); }
                90%, 100% { opacity: 1; transform: translate3d(-50%, -50%, 0) scale(1); }
            }

            /* 呼吸燈一閃一閃特效 (啟用點擊提示與指標) */
            .return-title-banner.active-pulse {
                opacity: 1 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                animation: pulseBlinkTitleGpu 2s ease-in-out infinite !important;
            }
            @keyframes pulseBlinkTitleGpu {
                0%, 100% { opacity: 0.35; transform: translate3d(-50%, -50%, 0) scale(0.98); }
                50% { opacity: 1; transform: translate(-50%, -50%, 0) scale(1.02); }
            }
        `;
        document.head.appendChild(style);
    }

    // 渲染結局 DOM 結構
    container.innerHTML = `
        <div class="scene-end-viewport">
            <img src="images/sun.webp" class="setting-sun" alt="落日太陽">
            <img src="images/CAR_finish.webp" class="car-frame1" alt="第一影格主角車">
            <img src="images/CAR_BACK2.webp" class="car-frame2" alt="第二影格後視車">
            <img src="images/CAR_finish2.webp" class="car-frame3" alt="第三影格停妥車">
            <img src="images/CAR_finish3.webp" class="car-frame4" alt="第四影格熄燈車">
            <div class="dark-overlay"></div>
            <div class="foreground-mountain"></div>
            <img src="images/感謝遊玩.webp" class="thanks-banner" alt="感謝遊玩標題">
            <img src="images/回到標題.webp" id="returnTitleImg" class="return-title-banner" alt="按ENTER鍵或點擊回到標題">
        </div>
    `;

    // 2. 於 8400ms（70% 感謝遊玩.webp 出現時）切換播放 結局音樂.mp3
    setTimeout(() => {
        audioEnd.pause();
        audioEndingTheme.currentTime = 0;
        audioEndingTheme.play().catch(err => console.warn("結局音樂 播放受阻:", err));
    }, 8400); // 12000ms * 70% = 8400ms

    // 雙重 requestAnimationFrame 防重排，於 10.5 秒後啟用呼吸燈與返回功能
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                canReturnToTitle = true;
                const returnImg = document.getElementById('returnTitleImg');
                if (returnImg) {
                    returnImg.classList.add('active-pulse');
                }
                console.log("[End 結局] 按 Enter 鍵或點擊螢幕即可重回遊戲標題畫面！");
            }, 10500);
        });
    });

    // 🛠️ 通用返回標題函式 (鍵盤 Enter / 滑鼠點擊 / 手機觸控共用)
    function triggerReturnToTitle() {
        if (!canReturnToTitle) return;

        // 移除所有相關監聽器避免重複觸發
        window.removeEventListener('keydown', handleReturnEnter);
        container.removeEventListener('click', handleScreenClick);
        container.removeEventListener('touchstart', handleScreenClick);

        // 停止結局音樂
        audioEndingTheme.pause();
        audioEndingTheme.currentTime = 0;

        if (typeof onReturnToTitle === 'function') {
            onReturnToTitle();
        }
    }

    // 1. 鍵盤 Enter 監聽
    function handleReturnEnter(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            triggerReturnToTitle();
        }
    }

    // 2. 手機觸控 / 滑鼠點擊監聽
    function handleScreenClick() {
        triggerReturnToTitle();
    }

    window.addEventListener('keydown', handleReturnEnter);
    container.addEventListener('click', handleScreenClick);
    container.addEventListener('touchstart', handleScreenClick);
}