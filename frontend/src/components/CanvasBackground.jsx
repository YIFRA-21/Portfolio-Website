import React, { useEffect, useRef } from 'react';

const CanvasBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let points = [];
        let mouse = { x: null, y: null, radius: 125 };

        // Point Constructor
        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = 1.2;
                this.density = (Math.random() * 20) + 12;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = (dx / distance) * force * this.density;
                        let directionY = (dy / distance) * force * this.density;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                        this.size = 2.0;
                    } else {
                        if (this.x !== this.baseX) {
                            let dxBase = this.x - this.baseX;
                            this.x -= dxBase / 10;
                        }
                        if (this.y !== this.baseY) {
                            let dyBase = this.y - this.baseY;
                            this.y -= dyBase / 10;
                        }
                        this.size = 1.2;
                    }
                } else {
                    if (this.x !== this.baseX) {
                        let dxBase = this.x - this.baseX;
                        this.x -= dxBase / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dyBase = this.y - this.baseY;
                        this.y -= dyBase / 10;
                    }
                    this.size = 1.2;
                }
            }
        }

        const initializePoints = () => {
            points = [];
            const gridSpacing = 45;
            const cols = Math.floor(canvas.width / gridSpacing) + 1;
            const rows = Math.floor(canvas.height / gridSpacing) + 1;

            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const x = c * gridSpacing + (Math.random() * 4 - 2);
                    const y = r * gridSpacing + (Math.random() * 4 - 2);
                    points.push(new Point(x, y));
                }
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initializePoints();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Initial setup
        resizeCanvas();

        // Loop animation
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background subtle radial gradient
            const radialGrad = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 5,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            radialGrad.addColorStop(0, '#0E0E14');
            radialGrad.addColorStop(1, '#060609');
            ctx.fillStyle = radialGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle color for dot grid
            ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
            
            points.forEach(point => {
                point.update();
                
                // Color mapping: mouse hovering points glow cyan-ish
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - point.x;
                    let dy = mouse.y - point.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        ctx.fillStyle = 'rgba(0, 245, 255, 0.4)';
                    } else {
                        ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
                    }
                }
                point.draw();
            });

            // Draw circuit-style mouse connector lines
            if (mouse.x !== null && mouse.y !== null) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(127, 119, 221, 0.07)';
                ctx.lineWidth = 1;
                
                // Connect closest dots to mouse
                let connections = 0;
                for (let i = 0; i < points.length; i++) {
                    let dx = mouse.x - points[i].x;
                    let dy = mouse.y - points[i].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100 && connections < 8) {
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(points[i].x, points[i].y);
                        connections++;
                    }
                }
                ctx.stroke();
                ctx.closePath();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="canvas-bg" ref={canvasRef} />;
};

export default CanvasBackground;
