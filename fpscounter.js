let overlay;
let animationId;

const refreshOverlay = (canvas) => {
    //Create overlay div and add it to the body
    if (!overlay) {
        overlay = document.createElement('div');
        document.body.appendChild(overlay);

        overlay.style.background = 'rgba(0, 0, 0, 0.4)';
        overlay.style.color = '#fff';
        overlay.style.position = 'absolute';
        overlay.style.fontFamily = 'Helvetica';
        overlay.style.fontSize = '12px';
        overlay.style.padding = '5px 8px';
    }
    overlay.style.top = canvas.offsetTop + 'px';
    overlay.style.left = canvas.offsetLeft + 'px';
    overlay.innerHTML = '-';

    // Stop last animation
    if (animationId)
        cancelAnimationFrame(animationId);

    // Create new interval
    let count = 0;
    let lastCount = 0;
    let lastTime = performance.now();
    const animation = (time) => {
        if (time - lastTime >= 750)
            overlay.innerHTML = Math.round((lastCount - (lastCount = count)) / (lastTime - (lastTime = time)) * 1000);
        count++;
        requestAnimationFrame(animation);
    };
    animationId = requestAnimationFrame(animation);
};

// Check for an existing canvas at page load
const existingCanvas = document.getElementsByTagName('canvas')[0];
if (existingCanvas)
    refreshOverlay(existingCanvas);

// Create a mutation observer to check if a new canvas was added to the dom later
const observer = new MutationObserver((mutations) => {
    let canvas;
    for (const mutation of mutations) {
        for (const el of mutation.addedNodes) {
            canvas = el.getElementsByTagName('canvas')[0];
            if (canvas) {
                refreshOverlay(canvas);
                break;
            }
        }

        if (canvas)
            break;
    }
});

observer.observe(document.body, { childList: true, subtree: true });
