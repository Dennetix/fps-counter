let overlay;
let animationId;

const createOverlay = () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    if (!canvas) {
        return;
    }

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

    // Create new animation
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

// Create a mutation observer to check if a new canvas was added to the dom later
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const el of mutation.addedNodes) {
            const canvas = el.nodeName.toLowerCase() == 'canvas' ? el : el.getElementsByTagName('canvas')[0];
            if (canvas) {
                createOverlay();
                return;
            }
        }

        if (overlay && mutation.removedNodes.length > 0 && document.getElementsByTagName('canvas').length === 0) {
            cancelAnimationFrame(animationId);
            overlay.remove();
            overlay = undefined;
        }
    }
});

createOverlay();
observer.observe(document.body, { childList: true, subtree: true });
