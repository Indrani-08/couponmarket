import React, { useRef, useEffect, useState } from 'react';
import './ScratchCard.css';

const ScratchCard = ({ rewardImg, onComplete, onStartScratch, initialScratched = false, isLocked = false, canScratch = true }) => {
    const canvasRef = useRef(null);
    const [isScratched, setIsScratched] = useState(initialScratched);
    const [isDrawing, setIsDrawing] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = 250;
        const height = 250;

        canvas.width = width;
        canvas.height = height;

        if (initialScratched || isLocked) {
            if (initialScratched) canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
        }

        // Draw background color (Premium Metallic Blue)
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#A5C9FF'); // Light Silver Blue
        gradient.addColorStop(1, '#4A90E2'); // Deeper Sky Blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Create offscreen canvas for monochromatic pattern
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';

        // Add GPay Pattern
        const drawPatternIcon = (x, y, type) => {
            offCtx.save();
            offCtx.translate(x, y);
            offCtx.rotate((Math.random() - 0.5) * 0.8);

            if (type === 0) { // 'G' logo
                offCtx.font = 'bold 50px Arial';
                offCtx.fillText('G', 0, 0);
            } else if (type === 1) { // Burst
                offCtx.font = '30px Arial';
                offCtx.fillText('🎇', 0, 0);
            } else if (type === 2) { // Trophy
                offCtx.font = '28px Arial';
                offCtx.fillText('🏆', 0, 0);
            } else if (type === 3) { // Shopping Bag
                offCtx.font = '28px Arial';
                offCtx.fillText('🛍️', 0, 0);
            } else if (type === 4) { // Ticket
                offCtx.font = '28px Arial';
                offCtx.fillText('🎟️', 0, 0);
            } else if (type === 5) { // Star/Circle
                offCtx.beginPath();
                offCtx.arc(0, 0, 5, 0, Math.PI * 2);
                offCtx.fill();
            } else {
                offCtx.font = '24px Arial';
                offCtx.fillText('✨', 0, 0);
            }
            offCtx.restore();
        };

        // Draw centered large G
        drawPatternIcon(width / 2, height / 2, 0);

        // Draw scattered icons
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            drawPatternIcon(x, y, Math.floor(Math.random() * 7));
        }

        // Colorize the pattern layer to a semi-transparent white/blue
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        offCtx.fillRect(0, 0, width, height);

        // Draw pattern over base canvas
        ctx.drawImage(offCanvas, 0, 0);

        ctx.globalCompositeOperation = 'destination-out';
    }, [initialScratched, isLocked]);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const scratch = (e) => {
        if (!canScratch || !isDrawing || isScratched || isLocked) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fill();

        checkPercentage();
    };

    const checkPercentage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let count = 0;

        for (let i = 0; i < pixels.data.length; i += 32) {
            if (pixels.data[i + 3] === 0) count++;
        }

        const percentage = (count / (pixels.data.length / 32)) * 100;
        if (percentage > 45) {
            handleComplete();
        }
    };

    const handleComplete = () => {
        if (isScratched) return;
        setIsScratched(true);
        const canvas = canvasRef.current;
        canvas.style.transition = 'opacity 0.6s ease-out';
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        setTimeout(() => onComplete(), 400);
    };

    const startDrawing = (e) => {
        if (!canScratch || isLocked || isScratched) return;
        setIsDrawing(true);
        if (!started) {
            setStarted(true);
            if (onStartScratch) onStartScratch();
        }
    };

    const stopDrawing = () => setIsDrawing(false);

    return (
        <div className="scratch-card-container">
            <div className="reward-content">
                {rewardImg}
            </div>
            <canvas
                ref={canvasRef}
                className="scratch-canvas"
                onMouseDown={startDrawing}
                onMouseMove={scratch}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={scratch}
                onTouchEnd={stopDrawing}
                style={{ cursor: isScratched || isLocked ? 'default' : (canScratch ? 'crosshair' : 'pointer') }}
            />
        </div>
    );
};

export default ScratchCard;
