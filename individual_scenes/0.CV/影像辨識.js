// ====== 1. 變數與佇列初始化 ======
const wristYHistory = [];      // maxlen = 15
const overtakeVotePool = [];   // maxlen = 30

let activeFramesCount = 0;
let lastDetectedGesture = null;
let gestureStreakCount = 0;
let finalAction = null;

// ====== 2. 每影格 (Frame) 判斷主邏輯 ======
function processPoseLandmarks(landmarks, canvasWidth, canvasHeight) {
    let instantIntent = null;

    if (landmarks && landmarks.length > 0) {
        // 取出第 0 個人的 landmark (11: 左肩, 13: 左肘, 15: 左腕)
        const lm = landmarks[0];
        
        // 轉換為像素座標
        const sX = lm[11].x * canvasWidth,  sY = lm[11].y * canvasHeight;
        const eX = lm[13].x * canvasWidth,  eY = lm[13].y * canvasHeight;
        const wX = lm[15].x * canvasWidth,  wY = lm[15].y * canvasHeight;

        // 計算手臂與前臂角度 (度數 deg)
        const armAngle = Math.atan2(eY - sY, eX - sX) * (180 / Math.PI);
        const forearmAngle = Math.atan2(wY - eY, wX - eX) * (180 / Math.PI);

        // Y 軸晃動度計算 (維持 15 幀)
        wristYHistory.push(wY);
        if (wristYHistory.length > 15) wristYHistory.shift();

        let yMovement = 0;
        if (wristYHistory.length === 15) {
            yMovement = Math.max(...wristYHistory) - Math.min(...wristYHistory);
        }

        // ====== 休息狀態判斷 ======
        if ((armAngle > 70 && armAngle < 110 && (eX - sX) < 50) || (wY > sY && Math.abs(wX - sX) < 60)) {
            activeFramesCount = 0;
            instantIntent = "RESTING";
        } else {
            activeFramesCount++;
        }

        // ====== 核心手勢判定 (離開休息區滿 0.5 秒 / 15 幀後啟用) ======
        if (activeFramesCount >= 15) {
            // 1. 右轉彎
            if (forearmAngle > -120 && forearmAngle < -35) {
                instantIntent = "RIGHT TURN";
            }
            // 2. 左轉彎
            else if (Math.abs(armAngle) < 20 && !(forearmAngle > -120 && forearmAngle < -35)) {
                instantIntent = "LEFT TURN";
            }
            // 3. 往下沈區間 (DOWNWARD_ZONE)
            else if (wY > eY + 20) {
                instantIntent = "DOWNWARD_ZONE";
                
                // 記錄晃動狀態
                const isWaving = yMovement > 12 ? 1 : 0;
                overtakeVotePool.push(isWaving);
                if (overtakeVotePool.length > 30) overtakeVotePool.shift();
            }
        }
    }

    // ====== 🛠️ 1秒穩定度決策機制 ======
    if (instantIntent && instantIntent !== "RESTING") {
        if (instantIntent === lastDetectedGesture) {
            gestureStreakCount++;
        } else {
            gestureStreakCount = 1;
        }

        lastDetectedGesture = instantIntent;

        // 當手勢維持滿 1 秒 (30 幀)
        if (gestureStreakCount >= 30) {
            if (instantIntent === "DOWNWARD_ZONE") {
                // 計算 30 幀內的晃動總次數
                const waveSum = overtakeVotePool.reduce((a, b) => a + b, 0);
                if (waveSum >= 8) {
                    finalAction = "OVERTAKE ALLOWED";
                } else {
                    finalAction = "STOP / SLOW DOWN";
                }
            } else {
                finalAction = instantIntent;
            }
        }
    } else {
        gestureStreakCount = 0;
        lastDetectedGesture = null;
        finalAction = null;
        overtakeVotePool.length = 0; // 清空投票池
    }

    return finalAction;
}