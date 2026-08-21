// ==========================================
// 1. 取得 HTML 元素 (DOM Elements)
// ==========================================
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement ? canvasElement.getContext('2d') : null;
const gestureStatusEl = document.getElementById('gesture_status');

// ==========================================
// 2. 全域變數與狀態追蹤 (Global Variables)
// ==========================================
let isModelLoaded = false;
let currentState = 'NONE';
let consecutiveFrames = 0;
let isMoving = false;
let moveStartFrames = 0;

// 確認手勢所需的影格數 (預設 12 影格即觸發以保持良好體驗)
const STANDARD_REQUIRED_FRAMES = 12;
const YIELD_REQUIRED_FRAMES = 15;

let wavingYHistory = [];

// 🛠️ 輕量節流設定 (約 16~20 FPS 推論，釋放手機 CPU)
let lastAIProcessTime = 0;
const AI_INTERVAL = 60; // 60ms 執行一次推論
let isAIProcessing = false;

// ==========================================
// 3. 輔助函式 (Helper Functions)
// ==========================================
function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}

function detectWaving(history) {
    if (history.length < 10) return false;
    let directionChanges = 0;
    let lastDirection = 0;

    for (let i = 1; i < history.length; i++) {
        const diff = history[i] - history[i - 1];
        if (Math.abs(diff) < 0.0001) continue;

        const currentDirection = diff > 0 ? 1 : -1;
        if (lastDirection !== 0 && currentDirection !== lastDirection) {
            directionChanges++;
        }
        lastDirection = currentDirection;
    }
    return directionChanges >= 2;
}

// 手勢轉換為遊戲相容事件名稱
function mapGestureToGameEvent(gesture) {
    switch(gesture) {
        case 'LEFT_TURN': return 'LEFT TURN';
        case 'RIGHT_TURN': return 'RIGHT TURN';
        case 'SLOW_DOWN': return 'STOP / SLOW DOWN';
        case 'YIELD_OVERTAKE': return 'OVERTAKE ALLOWED';
        default: return null;
    }
}

// ==========================================
// 4. 核心處理邏輯 (Core Logic - onResults)
// ==========================================
function onResults(results) {
    if (!canvasCtx || !canvasElement) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        if (!isModelLoaded) {
            console.log('✅ MediaPipe 模型載入完成，開始進行姿態辨識！');
            isModelLoaded = true;
        }
        
        const LEFT_ARM_INDICES = [11, 13, 15, 19];
        
        // 2. 定義自訂連線 (肩膀 -> 手肘 -> 手腕 -> 食指)
        const LEFT_ARM_CONNECTIONS = [
            [11, 13],
            [13, 15],
            [15, 19]
        ];

        // 3. 過濾節點：將不在 LEFT_ARM_INDICES 中的節點 visibility 設為 0 以隱藏
        const filteredLandmarks = results.poseLandmarks.map((lm, index) => {
            if (LEFT_ARM_INDICES.includes(index)) {
                return lm; // 保留需要的節點
            }
            return { ...lm, visibility: 0 }; // 隱藏其他節點
        });

        // 4. 使用過濾後的資料與自訂連線繪圖，加入 visibilityMin 確保被隱藏的點不被畫出
        drawConnectors(canvasCtx, filteredLandmarks, LEFT_ARM_CONNECTIONS, {color: '#00FF00', lineWidth: 3});
        drawLandmarks(canvasCtx, filteredLandmarks, {color: '#FF0000', lineWidth: 2, visibilityMin: 0.1});

        const leftShoulder = results.poseLandmarks[11];
        const leftElbow = results.poseLandmarks[13];
        const leftWrist = results.poseLandmarks[15];
        const leftIndex = results.poseLandmarks[19];

        const VISIBILITY_THRESHOLD = 0.6;
        
        const isArmVisible = leftShoulder.visibility > VISIBILITY_THRESHOLD &&
                             leftElbow.visibility > VISIBILITY_THRESHOLD &&
                             leftWrist.visibility > VISIBILITY_THRESHOLD;

        if (!isArmVisible) {
            // 如果左手不在畫面內或被遮擋，強制重置狀態為 NONE
            currentState = 'NONE';
            consecutiveFrames = 0;
            isMoving = false;
            moveStartFrames = 0;
            wavingYHistory = [];
            
            if (gestureStatusEl) gestureStatusEl.innerText = 'NONE (OUT OF FRAME)';
            
            // 恢復畫布狀態並直接結束這回合，不執行後續的數學計算與手勢判斷
            canvasCtx.restore();
            return;
        }

        const armAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        const elbowOutwardDist = Math.abs(leftElbow.x - leftShoulder.x);
        const elbowToShoulderY = leftElbow.y - leftShoulder.y;
        const wristToElbowY = leftWrist.y - leftElbow.y;

        let detectedGesture = 'NONE';

        // 1. 判斷自然下垂 (NONE)
        const isResting = (leftWrist.y > leftElbow.y &&
                           leftElbow.y > leftShoulder.y &&
                           elbowOutwardDist < 0.08 &&
                           armAngle > 165);

        if (isResting) {
            detectedGesture = 'NONE';
            isMoving = false;
            moveStartFrames = 0;
            wavingYHistory = [];
        } else {
            moveStartFrames++;
            if (moveStartFrames >= 5) {
                isMoving = true;
            }
        }

        if (isMoving) {
            // (1) 左轉彎 (Left Turn)
            if (armAngle > 130 && Math.abs(leftWrist.x - leftShoulder.x) > 0.25) {
                if (leftWrist.y < leftShoulder.y + 0.3) {
                    detectedGesture = 'LEFT_TURN';
                    wavingYHistory = [];
                }
            }
            // (2) 右轉彎 (Right Turn)
            else if (armAngle >= 50 && armAngle <= 140 && leftWrist.y < leftElbow.y - 0.05) {
                if (leftElbow.y < leftShoulder.y + 0.35) {
                    detectedGesture = 'RIGHT_TURN';
                    wavingYHistory = [];
                }
            }
            // (3) 與 (4) 處理手腕在手肘下方的姿態
            else if (leftWrist.y > leftElbow.y - 0.05) {
                if (elbowOutwardDist < 0.15 && elbowToShoulderY < 0.35 && wristToElbowY < 0.15) {
                    wavingYHistory.push(leftIndex.y - leftWrist.y);
                    if (wavingYHistory.length > YIELD_REQUIRED_FRAMES) wavingYHistory.shift();

                    if (detectWaving(wavingYHistory)) {
                        detectedGesture = 'YIELD_OVERTAKE';
                    } else {
                        detectedGesture = 'WAVING_DETECTING...';
                    }
                } else {
                    detectedGesture = 'SLOW_DOWN';
                    wavingYHistory = [];
                }
            }
        }

        // 狀態機 (State Machine) 邏輯更新與廣播
        if (detectedGesture === currentState && detectedGesture !== 'NONE' && !detectedGesture.includes('DETECTING')) {
            consecutiveFrames++;
            if (gestureStatusEl) gestureStatusEl.innerText = `${detectedGesture} (${consecutiveFrames}/${STANDARD_REQUIRED_FRAMES})`;

            if (consecutiveFrames >= STANDARD_REQUIRED_FRAMES) {
                const gameEventName = mapGestureToGameEvent(detectedGesture);
                if (gameEventName) {
                    window.dispatchEvent(new CustomEvent('gestureDetected', { detail: gameEventName }));
                }
            }
        } else {
            currentState = detectedGesture;
            consecutiveFrames = 0;
            if (gestureStatusEl) gestureStatusEl.innerText = detectedGesture;
        }
    }

    canvasCtx.restore();
}

// ==========================================
// 5. 模型初始化與攝影機啟動 (對齊 320x240 解析度)
// ==========================================
if (typeof Pose !== 'undefined') {
    const pose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});

    pose.setOptions({
        modelComplexity: 0,           // ⚡ 關鍵優化 1：切換為 Lite 輕量模型，大幅降低手機晶片運算量
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoElement) {
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                const now = performance.now();
                // ⚡ 關鍵優化 2：降頻節流 (60ms) 與重疊防護，避免手機塞車掉幀
                if (now - lastAIProcessTime < AI_INTERVAL || isAIProcessing) {
                    return;
                }
                lastAIProcessTime = now;
                isAIProcessing = true;

                try {
                    await pose.send({image: videoElement});
                } catch (error) {
                    console.error("Pose processing error:", error);
                } finally {
                    isAIProcessing = false;
                }
            },
            width: 320,
            height: 240
        });

        camera.start().then(() => {
            console.log("✅ 320x240 適中鏡頭啟動成功 (已啟用效能最佳化)！");
        });
    }
}

console.log("videoElement =", document.getElementById("input_video"));