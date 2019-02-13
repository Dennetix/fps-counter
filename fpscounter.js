let overlay;
let intervalId;

const refreshOverlay = (canvas) => {
    //Create overlay div and add it to the body
    if (!overlay) {
        overlay = document.createElement('div');
        document.body.appendChild(overlay);

        overlay.style.background = 'rgba(0, 0, 0, 0.4)';
        overlay.style.color = '#fff';
        overlay.style.position = 'fixed';
        overlay.style.fontFamily = 'Helvetica';
        overlay.style.fontSize = '11px';
        overlay.style.padding = '5px 8px';
    }
    overlay.style.top = canvas.offsetTop + 'px';
    overlay.style.left = canvas.offsetLeft + 'px';
    overlay.innerHTML = '-';

    // Stop last interval
    if (intervalId)
        clearInterval(intervalId);

    // Create new interval
    let lastCount = window.mozPaintCount;
    let lastTime = performance.now();
    intervalId = setInterval(() => {
        overlay.innerHTML = Math.round((lastCount + -(lastCount = window.mozPaintCount)) / (lastTime + -(lastTime = performance.now())) * 1000);
    }, 750);
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
