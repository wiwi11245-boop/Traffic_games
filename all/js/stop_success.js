function renderStopSuccessScene(container) {
    if (!document.getElementById('css-scene-stop-success')) {
        const style = document.createElement('style');
        style.id = 'css-scene-stop-success';
        style.textContent = `
            .scene-stop-success-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/停止場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .stop-success-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .top-house {
                position: absolute; width: 110px; height: auto; bottom: -10px;
                z-index: 8; pointer-events: none;
            }
            .house-1 { left: 730px; }
            .house-2 { left: 880px; }

            .stop-success-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(205px); z-index: 5; will-change: transform;
                animation: redCarSuccessDriveTransform 6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .stop-success-blue-car {
                position: absolute; width: 160px; height: auto; bottom: 15px; left: 0;
                transform: translateX(50px); z-index: 5; will-change: transform;
                animation: blueCarSuccessDriveTransform 6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }

            .car3-event-group {
                position: absolute; width: 110px; height: auto; left: 740px; bottom: 70px; z-index: 3;
            }
            .car3-event-group img { position: absolute; height: auto; bottom: 0; }
            .car3-side { width: 100%; left: -90px; animation: car3SidesFade 6s linear forwards; }
            .car3-side2 { width: 100%; left: 30px; animation: car3SidesFade 6s linear forwards; }
            .car3-back { width: 95px; left: 130px; animation: car3BackFade 6s linear forwards; }

            .car5-parked {
                position: absolute; width: 110px; height: auto; left: 790px; bottom: 140px;
                z-index: 4; opacity: 0; pointer-events: none;
                animation: car5FadeIn 6s linear forwards;
            }

            @keyframes redCarSuccessDriveTransform {
                0% { transform: translateX(205px) translateY(0px); }
                35% { transform: translateX(470px) translateY(0px); }
                35.1% { transform: translateX(470px) translateY(-3px); }
                40%, 60% { transform: translateX(470px) translateY(0px); }
                100% { transform: translateX(1100px) translateY(0px); }
            }

            @keyframes blueCarSuccessDriveTransform {
                0% { transform: translateX(50px) translateY(0px); }
                35% { transform: translateX(370px) translateY(0px); }
                35.1% { transform: translateX(370px) translateY(-3px); }
                40%, 60% { transform: translateX(370px) translateY(0px); }
                100% { transform: translateX(1100px) translateY(0px); }
            }

            @keyframes car3BackFade { 0%, 38% { opacity: 1; } 40%, 100% { opacity: 0; } }
            @keyframes car3SidesFade { 0%, 48% { opacity: 1; } 56%, 100% { opacity: 0; } }
            @keyframes car5FadeIn { 0%, 50% { opacity: 0; } 60%, 100% { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-stop-success-bg"></div>
        <img src="images/sun.webp" class="stop-success-sun" alt="太陽">
        <img src="images/CAR.webp" class="stop-success-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="stop-success-blue-car" alt="藍車後車">
        <div class="car3-event-group">
            <img src="images/CAR3.png" class="car3-side" alt="CAR3">
            <img src="images/CAR4.png" class="car3-side2" alt="CAR4">
            <img src="images/CAR3_BACK.webp" class="car3-back" alt="CAR3_BACK">
        </div>
        <img src="images/CAR5.png" class="car5-parked" alt="CAR5">
        <img src="images/house.png" class="top-house house-1" alt="房屋A">
        <img src="images/house.png" class="top-house house-2" alt="房屋B">
    `;
}