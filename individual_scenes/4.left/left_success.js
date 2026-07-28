function renderLeftSuccessScene(container) {
    if (!document.getElementById('css-scene-left-success')) {
        const style = document.createElement('style');
        style.id = 'css-scene-left-success';
        style.textContent = `
            .scene-left-success-bg {
                position: absolute; top: 0; left: 0; width: 1000px; height: 400px;
                background-image: url('images/左轉場景.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            }
            .left-success-sun {
                position: absolute; top: -62px; left: 98px; width: 172px; height: auto;
                z-index: 2; pointer-events: none;
            }
            .left-success-flower {
                position: absolute; width: 130px; height: auto;
                z-index: 2; pointer-events: none;
            }
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
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="scene-left-success-bg"></div>
        <img src="images/sun.webp" class="left-success-sun" alt="太陽">
        <img src="images/FLOWER.webp" class="left-success-flower" style="left: 30px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-success-flower" style="left: 380px; bottom: -50px;" alt="花朵">
        <img src="images/FLOWER.webp" class="left-success-flower" style="right: 130px; bottom: -50px;" alt="花朵">
        <img src="images/CAR.webp" class="left-success-player-car" alt="紅車主角側身">
        <img src="images/CAR_BACK.webp" class="left-success-player-back" alt="紅車主角後視">
        <img src="images/CAR2.webp" class="left-success-blue-car" alt="藍車直行">
    `;
}