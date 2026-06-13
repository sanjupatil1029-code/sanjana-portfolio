// --- SOUND SYNTHESIS USING WEB AUDIO API ---
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound toggle controller
const soundToggleBtn = document.getElementById('sound-toggle');
soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        initAudio();
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        soundToggleBtn.classList.add('bg-cyber-cyan/15', 'border-cyber-cyan');
        playSynthSound('success');
    } else {
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        soundToggleBtn.classList.remove('bg-cyber-cyan/15', 'border-cyber-cyan');
    }
});

// Synthesizer helper function
function playSynthSound(type) {
    if (!soundEnabled) return;
    initAudio();
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
        // Soft mechanical typing click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'grab') {
        // Short rising sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'drop') {
        // Short falling sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
    } else if (type === 'spin') {
        // Cyber bubble sound sweep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.45);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'delete') {
        // Retro laser drop
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.32);
    } else if (type === 'success') {
        // Two-tone chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.setValueAtTime(0.1, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'glitch') {
        // Distorted noise burst
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.2);
        
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(600, now);
        osc2.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.35);
        osc2.stop(now + 0.35);
    }
}

// --- CUSTOM INTERACTIVE CURSOR TRAIL ---
const cursorOutline = document.getElementById('cursor-outline');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position the inner dot immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// Animate outline with easing delay
function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// Cursor hover active states
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cyber-card, .sticker-pack-item');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('custom-cursor-active');
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('custom-cursor-active');
    });
});

// --- INTERACTIVE CANVA NEON BACKGROUND ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 65;
let mouse = { x: null, y: null, radius: 180 };

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track mouse position on canvas
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#9d00ff';
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wall collisions
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Interaction with mouse (push away slightly)
        if (mouse.x != null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 2;
                this.y += Math.sin(angle) * force * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        ctx.globalAlpha = 1.0;
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();

// Animation Loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw neon background grid lines lightly
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
    ctx.lineWidth = 1;
    let gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connecting neon lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
                // Base opacity
                let opacity = (130 - dist) / 130 * 0.12;
                
                // Mouse connection multiplier (grows brighter near cursor)
                if (mouse.x != null) {
                    let mdx = (particles[i].x + particles[j].x) / 2 - mouse.x;
                    let mdy = (particles[i].y + particles[j].y) / 2 - mouse.y;
                    let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < mouse.radius) {
                        opacity += (mouse.radius - mdist) / mouse.radius * 0.18;
                    }
                }

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = particles[i].color === '#00f0ff' ? 'rgba(0, 240, 255, ' + opacity + ')' : 'rgba(157, 0, 255, ' + opacity + ')';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- HERO MASCOT SPEECH BUBBLES ---
const speechTexts = [
    "I'm Sanjana Patil, an aspiring software engineer. Let's build something!",
    "You can drag and drop stickers from the sidebar to decorate this page!",
    "Double click me to run a spin sequence protocol!",
    "My favorite full-stack build is Khet Saathi! Check it out below.",
    "Try typing 'sudo hack' or 'skills' in the terminal shell!",
    "I'm experienced in Generative AI prompting and backend DBMS integrations.",
    "Double click any sticker on the screen to rotate it 360 degrees!",
    "Need to get in touch? Send me a package in the transmission bay!"
];

const mascotSpeech = document.getElementById('mascot-speech');

function changeMascotSpeech() {
    const randomMsg = speechTexts[Math.floor(Math.random() * speechTexts.length)];
    // Add typewriter effect
    let idx = 0;
    mascotSpeech.textContent = "";
    
    function type() {
        if (idx < randomMsg.length) {
            mascotSpeech.textContent += randomMsg.charAt(idx);
            idx++;
            setTimeout(type, 20);
        }
    }
    type();
}
// Cycle speech every 12 seconds
setInterval(changeMascotSpeech, 12000);
setTimeout(changeMascotSpeech, 1000); // Initial speech trigger

// Mascot Click - Double Click
const heroMascotWrapper = document.getElementById('hero-mascot-wrapper');
const heroMascot = document.getElementById('hero-mascot');

heroMascotWrapper.addEventListener('dblclick', () => {
    heroMascot.classList.add('sticker-spin');
    playSynthSound('spin');
    mascotSpeech.textContent = "WHOA! Spin protocol executed. Refreshing cache!";
    setTimeout(() => {
        heroMascot.classList.remove('sticker-spin');
    }, 600);
});

// Cycle Mascot Poses
const cyclePoseBtn = document.getElementById('cycle-pose-btn');
const mascotPoseIndicator = document.getElementById('mascot-pose-indicator');
const poses = [
    'large_front',
    'right_profile',
    'left_profile',
    'small_front_right',
    'back_left',
    'back',
    'small_front_left'
];
let currentPoseIdx = 0;

cyclePoseBtn.addEventListener('click', () => {
    currentPoseIdx = (currentPoseIdx + 1) % poses.length;
    const nextPose = poses[currentPoseIdx];
    heroMascot.src = `stickers/${nextPose}.png`;
    mascotPoseIndicator.textContent = nextPose;
    playSynthSound('click');
});

// Hero Typing Terminal
const typingStrings = [
    "solving complex data structures...",
    "architecting the Khet Saathi app...",
    "engineering prompts for GenAI tasks...",
    "structuring relational DBMS logs...",
    "coding modular JavaScript components..."
];
let typingIdx = 0;
let stringIdx = 0;
let currentStr = "";
let isDeleting = false;
const typingTextEl = document.getElementById('typing-text');

function typeTerminal() {
    const fullText = typingStrings[stringIdx];
    
    if (isDeleting) {
        currentStr = fullText.substring(0, currentStr.length - 1);
    } else {
        currentStr = fullText.substring(0, currentStr.length + 1);
    }
    
    typingTextEl.textContent = currentStr;
    
    let typeSpeed = 80;
    if (isDeleting) typeSpeed /= 2;
    
    if (!isDeleting && currentStr === fullText) {
        typeSpeed = 2000; // Wait before deleting
        isDeleting = true;
    } else if (isDeleting && currentStr === '') {
        isDeleting = false;
        stringIdx = (stringIdx + 1) % typingStrings.length;
        typeSpeed = 500; // Wait before writing next
    }
    
    setTimeout(typeTerminal, typeSpeed);
}
typeTerminal();

// --- RPG STATS CARD HOVER SYSTEM ---
const statsAvatar = document.getElementById('stats-avatar');
const statCards = document.querySelectorAll('#stats .group[data-pose]');
const statBars = document.querySelectorAll('.stats-bar-inner');

// Animate RPG progress bars on scroll load
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-val');
            });
        }
    });
}, { threshold: 0.1 });

observer.observe(document.getElementById('stats'));

// Update avatar based on hovered stat card
statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const pose = card.getAttribute('data-pose');
        statsAvatar.src = `stickers/${pose}.png`;
        statsAvatar.style.filter = "drop-shadow(0 0 15px var(--neon-cyan))";
        playSynthSound('click');
    });
    card.addEventListener('mouseleave', () => {
        statsAvatar.src = 'stickers/right_profile.png';
        statsAvatar.style.filter = "drop-shadow(0 0 8px rgba(0, 240, 255, 0.2))";
    });
});

// --- DRAGGABLE STICKERS SYSTEM ---
let activeDraggedSticker = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Setup Drag & Drop from Sidebar Items
const packItems = document.querySelectorAll('.sticker-pack-item');

packItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.getAttribute('data-pose'));
        playSynthSound('grab');
    });
    
    // Support mobile touch drag initiation
    item.addEventListener('touchstart', (e) => {
        const pose = item.getAttribute('data-pose');
        spawnSticker(pose, e.touches[0].clientX - 40, e.touches[0].clientY - 40);
        playSynthSound('grab');
    });
});

// Allow drop anywhere on the page
document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.body.addEventListener('drop', (e) => {
    e.preventDefault();
    const pose = e.dataTransfer.getData('text/plain');
    if (pose) {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        spawnSticker(pose, e.clientX + scrollX - 50, e.clientY + scrollY - 50);
        playSynthSound('drop');
    }
});

// Helper to spawn a new sticker on the board
function spawnSticker(pose, x, y) {
    // Sanitize pose if browser passes absolute image URL on drag-and-drop
    if (pose.includes('/')) {
        const filename = pose.substring(pose.lastIndexOf('/') + 1);
        pose = filename.split('.')[0];
    }

    const container = document.createElement('div');
    container.classList.add('sticker', 'sticker-wiggle', 'w-24', 'h-24', 'flex', 'items-center', 'justify-center');
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    
    // Add random tilt for analog look
    const angle = (Math.random() * 20 - 10).toFixed(1);
    container.style.transform = `rotate(${angle}deg)`;
    
    const img = document.createElement('img');
    img.src = `stickers/${pose}.png`;
    img.classList.add('h-20', 'object-contain');
    container.appendChild(img);
    
    // Setup drag events for the newly spawned sticker
    container.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'I') return; // ignore delete action click
        activeDraggedSticker = container;
        
        // Bring to front
        document.querySelectorAll('.sticker').forEach(s => s.style.zIndex = 1000);
        container.style.zIndex = 1001;
        
        const rect = container.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        container.classList.remove('sticker-wiggle');
        playSynthSound('grab');
    });
    
    // Mobile touch drag events
    container.addEventListener('touchstart', (e) => {
        activeDraggedSticker = container;
        document.querySelectorAll('.sticker').forEach(s => s.style.zIndex = 1000);
        container.style.zIndex = 1001;
        
        const rect = container.getBoundingClientRect();
        dragOffsetX = e.touches[0].clientX - rect.left;
        dragOffsetY = e.touches[0].clientY - rect.top;
        
        container.classList.remove('sticker-wiggle');
        playSynthSound('grab');
    });

    // Double click to spin
    container.addEventListener('dblclick', () => {
        container.classList.add('sticker-spin');
        playSynthSound('spin');
        setTimeout(() => {
            container.classList.remove('sticker-spin');
        }, 600);
    });

    document.body.appendChild(container);
    updateClearStickersButtonVisibility();
}

// Global Move & Mouse Up handlers for smooth dragging
document.addEventListener('mousemove', (e) => {
    if (activeDraggedSticker) {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        
        let newX = e.clientX + scrollX - dragOffsetX;
        let newY = e.clientY + scrollY - dragOffsetY;
        
        activeDraggedSticker.style.left = `${newX}px`;
        activeDraggedSticker.style.top = `${newY}px`;
        
        // Highlight trash bin if dragged near
        checkTrashBinHover(e.clientX, e.clientY);
    }
});

document.addEventListener('touchmove', (e) => {
    if (activeDraggedSticker) {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        
        let newX = e.touches[0].clientX + scrollX - dragOffsetX;
        let newY = e.touches[0].clientY + scrollY - dragOffsetY;
        
        activeDraggedSticker.style.left = `${newX}px`;
        activeDraggedSticker.style.top = `${newY}px`;
        
        checkTrashBinHover(e.touches[0].clientX, e.touches[0].clientY);
    }
});

const trashBin = document.getElementById('sticker-bin');
function checkTrashBinHover(x, y) {
    const binRect = trashBin.getBoundingClientRect();
    if (x >= binRect.left && x <= binRect.right && y >= binRect.top && y <= binRect.bottom) {
        trashBin.classList.add('bg-red-500/20', 'border-red-500');
    } else {
        trashBin.classList.remove('bg-red-500/20', 'border-red-500');
    }
}

document.addEventListener('mouseup', (e) => {
    if (activeDraggedSticker) {
        // Check if dropped on trash bin
        const binRect = trashBin.getBoundingClientRect();
        if (e.clientX >= binRect.left && e.clientX <= binRect.right && e.clientY >= binRect.top && e.clientY <= binRect.bottom) {
            activeDraggedSticker.classList.add('scale-0', 'opacity-0');
            playSynthSound('delete');
            const target = activeDraggedSticker;
            setTimeout(() => { 
                target.remove(); 
                updateClearStickersButtonVisibility();
            }, 300);
        } else {
            activeDraggedSticker.classList.add('sticker-wiggle');
            playSynthSound('drop');
        }
        activeDraggedSticker = null;
        trashBin.classList.remove('bg-red-500/20', 'border-red-500');
    }
});

document.addEventListener('touchend', (e) => {
    if (activeDraggedSticker) {
        // On touch end, we check changedTouches coordinate
        const touch = e.changedTouches[0];
        const binRect = trashBin.getBoundingClientRect();
        if (touch.clientX >= binRect.left && touch.clientX <= binRect.right && touch.clientY >= binRect.top && touch.clientY <= binRect.bottom) {
            activeDraggedSticker.classList.add('scale-0', 'opacity-0');
            playSynthSound('delete');
            const target = activeDraggedSticker;
            setTimeout(() => { 
                target.remove(); 
                updateClearStickersButtonVisibility();
            }, 300);
        } else {
            activeDraggedSticker.classList.add('sticker-wiggle');
            playSynthSound('drop');
        }
        activeDraggedSticker = null;
        trashBin.classList.remove('bg-red-500/20', 'border-red-500');
    }
});

// Sticker Party Trigger
const partyBtn = document.getElementById('sticker-party-btn');
partyBtn.addEventListener('click', () => {
    playSynthSound('success');
    const borderSpacing = 100;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const randomPose = poses[Math.floor(Math.random() * poses.length)];
            const randomX = Math.random() * (window.innerWidth - borderSpacing * 2) + borderSpacing + window.scrollX;
            const randomY = Math.random() * (window.innerHeight - borderSpacing * 2) + borderSpacing + window.scrollY;
            spawnSticker(randomPose, randomX, randomY);
        }, i * 70);
    }
});

// Clear Stickers Controller
const clearStickersBtn = document.getElementById('clear-stickers-btn');

function updateClearStickersButtonVisibility() {
    const activeStickers = document.querySelectorAll('.sticker');
    if (activeStickers.length > 0) {
        clearStickersBtn.classList.remove('hidden');
    } else {
        clearStickersBtn.classList.add('hidden');
    }
}

clearStickersBtn.addEventListener('click', () => {
    const activeStickers = document.querySelectorAll('.sticker');
    if (activeStickers.length === 0) return;
    
    playSynthSound('delete');
    
    activeStickers.forEach((sticker, index) => {
        setTimeout(() => {
            sticker.classList.add('scale-0', 'opacity-0');
            setTimeout(() => {
                sticker.remove();
                updateClearStickersButtonVisibility();
            }, 300);
        }, index * 25);
    });
});

// --- RETRO TERMINAL CORE LOGIC ---
const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input-field');

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = "";
        
        playSynthSound('click');
        
        // Print echo line
        appendTerminalLine(`guest@sanjana-patil:~$ ${cmd}`, 'text-cyber-pink');
        
        // Process Command
        executeTerminalCommand(cmd);
    }
});

function appendTerminalLine(text, cssClass = '') {
    const div = document.createElement('div');
    if (cssClass) div.classList.add(cssClass);
    div.innerHTML = text;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function executeTerminalCommand(cmd) {
    if (cmd === '') return;
    
    const parts = cmd.split(' ');
    const mainCmd = parts[0];
    
    switch (mainCmd) {
        case 'help':
            appendTerminalLine(`Available Command Nodes:<br>
            - <span class="text-cyber-cyan">about</span> : General software developer configuration bio<br>
            - <span class="text-cyber-cyan">education</span> : Read educational history logs<br>
            - <span class="text-cyber-cyan">skills</span> : Read skills database ledger<br>
            - <span class="text-cyber-cyan">projects</span> : Read deployed project directory files<br>
            - <span class="text-cyber-cyan">contact</span> : Read communication transmission addresses<br>
            - <span class="text-cyber-cyan">stickers</span> : Inject a random sticker onto current coords<br>
            - <span class="text-cyber-cyan">clear</span> : Flush terminal shell log<br>
            - <span class="text-cyber-cyan">sudo hack</span> : Run security visual code matrix [WARN]`);
            break;
            
        case 'clear':
            terminalBody.innerHTML = "";
            appendTerminalLine("SANJANA-OS v2.4.0 (c) 2026 Patil Inc. Shell cleared.");
            break;
            
        case 'about':
            appendTerminalLine(`<span class="text-white font-bold">BIOGRAPHY:</span> Sanjana Patil is a Level 2 Software Engineer aspiring to build high-performance systems. She studies Information Science and Engineering, designs full-stack web architectures, and experiments with LLM orchestration (Generative AI).`);
            break;
            
        case 'education':
            appendTerminalLine(`<span class="text-white font-bold">ACADEMIC LOGS:</span><br>
            1. <span class="text-cyber-cyan font-bold">Bachelor of Engineering (B.E):</span> Information Science and Engineering at KLS Gogte Institute of Technology, Belgavi [2024 - 2028]<br>
            2. <span class="text-cyber-purple font-bold">Pre-University Education:</span> Science Stream (PCMB) at Prism PU College, Dharwad [2022 - 2024]`);
            break;
            
        case 'skills':
            appendTerminalLine(`<span class="text-white font-bold">SKILLS LEDGER DATABASES:</span><br>
            - Languages: HTML, CSS, JavaScript, SQL<br>
            - CS Core: DBMS, Object-Oriented Programming (OOPs), Data Structures (Basic DSA)<br>
            - Developer Tools: Git, GitHub, VS Code, Postman Client, REST API Integrations<br>
            - Specialized: Generative AI, Prompt Engineering, Analytical Problem Solving`);
            break;
            
        case 'projects':
            appendTerminalLine(`<span class="text-white font-bold">SOFTWARE PROJECT DIRECTORY:</span><br>
            1. <span class="text-cyber-cyan font-bold">Khet Saathi (Webapp):</span> Farmer-friendly agricultural optimizer utilizing weather endpoints & crop recommendation algorithms.<br>
            2. <span class="text-cyber-purple font-bold">Finance Tracker:</span> Budgeting application utilizing relational local storage logs for user data sheets.<br>
            3. <span class="text-cyber-pink font-bold">DSA Visualizer:</span> Canvas sandbox illustrating sorting heuristics step-by-step.`);
            break;
            
        case 'contact':
            appendTerminalLine(`Email node: <a href="mailto:sanjupatil1029@gmail.com" class="text-cyber-cyan underline" target="_blank">sanjupatil1029@gmail.com</a><br>
            Phone node: <a href="tel:6360185950" class="text-cyber-cyan underline">6360185950</a><br>
            GitHub node: <a href="https://github.com/sanjupatil1029-code" class="text-cyber-cyan underline" target="_blank">github.com/sanjupatil1029-code</a><br>
            LinkedIn node: <a href="https://www.linkedin.com/in/sanjana-patil-1a1b98332?utm_source=share_via&utm_content=profile&utm_medium=member_android" class="text-cyber-cyan underline" target="_blank">linkedin.com/sanjana-patil</a>`);
            break;
            
        case 'stickers':
            const randomPose = poses[Math.floor(Math.random() * poses.length)];
            const randomX = Math.random() * (window.innerWidth - 300) + 150 + window.scrollX;
            const randomY = Math.random() * (window.innerHeight - 300) + 150 + window.scrollY;
            spawnSticker(randomPose, randomX, randomY);
            appendTerminalLine(`Successfully spawned sticker [${randomPose}] at x:${Math.floor(randomX)} y:${Math.floor(randomY)}`, 'text-cyber-green');
            break;
            
        case 'sudo':
            if (parts[1] === 'hack') {
                appendTerminalLine("WARNING: INITIALIZING HACK WATERFALL... BYPASSING SECURITY GRID...", "text-red-500 animate-pulse");
                playSynthSound('glitch');
                setTimeout(() => {
                    startMatrixRain();
                }, 1000);
            } else {
                appendTerminalLine("SUDO EXECUTABLE DENIED. COMMAND ARG NOT SUPPORTED.", "text-red-500");
            }
            break;
            
        default:
            appendTerminalLine(`Command not found: '${cmd}'. Type 'help' to review correct protocol.`, 'text-red-500');
    }
}

// --- FULLSCREEN CANVAS MATRIX GREEN RAIN ---
const matrixOverlay = document.getElementById('matrix-overlay');
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');
const closeMatrixBtn = document.getElementById('matrix-close-btn');

let matrixInterval = null;
let mColors = ['#0f0', '#00f0ff', '#39ff14', '#ff007f'];

function startMatrixRain() {
    matrixOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // block scrolling
    
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@%&<>[]{}+-*=";
    const alphabet = chars.split("");
    
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }
    
    function draw() {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = '#0F0'; // Default green rain
        matrixCtx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < rainDrops.length; i++) {
            // Randomize character selection
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            
            // Randomly flash cyan/pink drops for tech style
            if (Math.random() > 0.98) {
                matrixCtx.fillStyle = '#ff007f';
            } else if (Math.random() > 0.96) {
                matrixCtx.fillStyle = '#00f0ff';
            } else {
                matrixCtx.fillStyle = '#39ff14';
            }
            
            const x = i * fontSize;
            const y = rainDrops[i] * fontSize;
            
            matrixCtx.fillText(text, x, y);
            
            if (y > matrixCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }
    
    matrixInterval = setInterval(draw, 30);
}

closeMatrixBtn.addEventListener('click', () => {
    clearInterval(matrixInterval);
    matrixOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // restore scrolling
    playSynthSound('click');
});

// Resize matrix on window size change
window.addEventListener('resize', () => {
    if (matrixOverlay.style.display === 'block') {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
});

// --- SUBMIT CONTACT TRANSMISSION ---
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;
    
    // Simulate encryption transmission sequence
    playSynthSound('success');
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const oldText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>ENCRYPTING...</span> <i class="fa-solid fa-lock animate-pulse"></i>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '<span>TRANSMITTED SUCCESSFULLY!</span> <i class="fa-solid fa-check-double text-cyber-green"></i>';
        mascotSpeech.textContent = `Transmission received, ${name}! Packets successfully queued. I will get back to you shortly!`;
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.innerHTML = oldText;
            submitBtn.disabled = false;
        }, 5000);
    }, 2000);
});
