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



        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 3});

        drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});



        const leftShoulder = results.poseLandmarks[11];

        const leftElbow = results.poseLandmarks[13];

        const leftWrist = results.poseLandmarks[15];

        const leftIndex = results.poseLandmarks[19];



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

            // (1) 左轉灣 (Left Turn)

            if (armAngle > 130 && Math.abs(leftWrist.x - leftShoulder.x) > 0.25) {

                if (leftWrist.y < leftShoulder.y + 0.3) {

                    detectedGesture = 'LEFT_TURN';

                    wavingYHistory = [];

                }

            }

            // (2) 右轉灣 (Right Turn)

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

        modelComplexity: 1,

        smoothLandmarks: true,

        enableSegmentation: false,

        minDetectionConfidence: 0.5,

        minTrackingConfidence: 0.5

    });



    pose.onResults(onResults);



    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoElement) {

        const camera = new Camera(videoElement, {

            onFrame: async () => {

                try {

                    await pose.send({image: videoElement});

                } catch (error) {

                    console.error("Pose processing error:", error);

                }

            },

            width: 320,

            height: 240

        });

        camera.start().then(() => {

            console.log("✅ 320x240 適中鏡頭啟動成功！");

        });

    }

}

console.log("videoElement =", document.getElementById("input_video"));