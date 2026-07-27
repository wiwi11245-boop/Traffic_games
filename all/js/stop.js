function renderStopScene(container) {
    if (!document.getElementById('css-scene-stop')) {
        const style = document.createElement('style');
        style.id = 'css-scene-stop';
        style.textContent = `
            .scene-stop-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/停止場景.png');
                background-size: 100% 100%; background-repeat: no-repeat;
                z-index: 1;
            }
            .stop-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .stop-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(-200px); z-index: 5; will-change: transform;
                animation: redCarStopStage 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .stop-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(-350px); z-index: 5; will-change: transform;
                animation: blueCarStopStage 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .car3-event-group {
                position: absolute; width: 110px; height: auto; left: 740px; bottom: 70px;
                z-index: 6; opacity: 0.9;
            }
            .car3-event-group img { position: absolute; height: auto; bottom: 0; }
            .car3-side { width: 100%; left: -90px; }
            .car3-side2 { width: 100%; left: 30px; }
            .car3-back { width: 95px; left: 130px; }

            .top-house { position: absolute; width: 110px; height: auto; bottom: -10px; z-index: 8; pointer-events: none; }
            .house-1 { left: 730px; }
            .house-2 { left: 880px; }

            @keyframes redCarStopStage {
                0% { transform: translateX(-200px) translateY(0px); }
                30% { transform: translateX(235px) translateY(0px); }
                40% { transform: translateX(235px) translateY(-3px); }
                50% { transform: translateX(235px) translateY(0px); }
                60% { transform: translateX(235px) translateY(-3px); }
                70% { transform: translateX(235px) translateY(0px); }
                80% { transform: translateX(235px) translateY(-3px); }
                90%, 100% { transform: translateX(235px) translateY(0px); }
            }
            @keyframes blueCarStopStage {
                0% { transform: translateX(-350px) translateY(0px); }
                30% { transform: translateX(80px) translateY(0px); }
                40% { transform: translateX(80px) translateY(-3px); }
                50% { transform: translateX(80px) translateY(0px); }
                60% { transform: translateX(80px) translateY(-3px); }
                70% { transform: translateX(80px) translateY(0px); }
                80% { transform: translateX(80px) translateY(-3px); }
                90%, 100% { transform: translateX(80px) translateY(0px); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-stop-bg"></div>
        <img src="images/sun.webp" class="stop-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.png" class="car3-side" alt="迴轉車側身">
            <img src="images/CAR4.png" class="car3-side2" alt="迴轉車側身">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="迴轉車後視">
        </div>
        <img src="images/house.png" class="top-house house-1" alt="前景房屋A">
        <img src="images/house.png" class="top-house house-2" alt="前景房屋B">
    `;
}