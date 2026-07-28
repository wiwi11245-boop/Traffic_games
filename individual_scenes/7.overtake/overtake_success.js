function renderOvertakeSuccessScene(container) {
    if (!document.getElementById('css-scene-overtake-success')) {
        const style = document.createElement('style');
        style.id = 'css-scene-overtake-success';
        style.textContent = `
            .scene-overtake-success-bg {
                position: absolute; top: 0; left: 0; width: 2000px; height: 400px;
                background-image: url('images/background.png');
                background-size: auto 100%; background-repeat: repeat-x; z-index: 1;
                animation: scrollBgOvertakeSuccess 7s linear infinite; will-change: transform;
            }
            @keyframes scrollBgOvertakeSuccess {
                0% { transform: translateX(0px); }
                100% { transform: translateX(-1400px); }
            }

            .overtake-success-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .overtake-success-angry-car {
                position: absolute; width: 255px; height: auto; bottom: 65px; left: 0;
                transform: translateX(150px); z-index: 5; will-change: transform;
                animation: angryCarSuccessOvertakeTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .overtake-success-player-car {
                position: absolute; width: 160px; height: auto; bottom: -5px; left: 0;
                transform: translateX(315px); z-index: 5; will-change: transform;
                animation: redCarKeepDrivingTransform 7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .overtake-success-opposite-car {
                position: absolute; width: 160px; height: auto; bottom: 60px; left: 0;
                transform: translateX(1100px) scaleX(-1); z-index: 4; will-change: transform;
                animation: oppositeCarPassTransform 7s linear forwards;
            }

            @keyframes angryCarSuccessOvertakeTransform {
                0%, 20% { transform: translateX(150px) translateY(0px) rotate(0deg); }
                45% { transform: translateX(150px) translateY(-40px) rotate(-3deg); }
                65% { transform: translateX(450px) translateY(-40px) rotate(0deg); }
                75% { transform: translateX(450px) translateY(0px) rotate(3deg); }
                100% { transform: translateX(1100px) translateY(0px) rotate(0deg); }
            }

            @keyframes redCarKeepDrivingTransform {
                0%, 100% { transform: translateX(315px) translateY(0px); }
                20% { transform: translateX(315px) translateY(-3px); }
                40% { transform: translateX(315px) translateY(0px); }
                60% { transform: translateX(315px) translateY(-3px); }
                80% { transform: translateX(315px) translateY(0px); }
            }

            @keyframes oppositeCarPassTransform {
                0% { opacity: 0.1; transform: translateX(1100px) scaleX(-1) translateY(0px); }
                20% { opacity: 1; transform: translateX(700px) scaleX(-1) translateY(-2px); }
                50%, 100% { opacity: 0.1; transform: translateX(-1000px) scaleX(-1) translateY(0px); }
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-overtake-success-bg"></div>
        <img src="images/sun.webp" class="overtake-success-sun" alt="太陽">
        <img src="images/ANGRY_CAR.webp" class="overtake-success-angry-car" alt="怒氣後車">
        <img src="images/CAR.webp" class="overtake-success-player-car" alt="紅車主角">
        <img src="images/CAR2.webp" class="overtake-success-opposite-car" alt="對向來車">
    `;
}