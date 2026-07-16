// Configs and Settings
const targetDateStr = 'August 16, 2026 12:00:00';
const whatsappNumber = '918136896676'; // Replace with groom/bride/host phone number (with country code, no + or spaces)
const adminPasscode = '1234'; // Passcode for viewing admin dashboard

// --- Particles Canvas Effect ---
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(init = false) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : -10;
            this.size = Math.random() * 4 + 1; // Gold dust sizes
            this.type = Math.random() > 0.6 ? 'petal' : 'dust'; // 40% petals, 60% gold dust
            if (this.type === 'petal') {
                this.size = Math.random() * 8 + 5;
                this.weight = Math.random() * 0.5 + 0.2;
                this.angle = Math.random() * 360;
                this.spin = Math.random() * 2 - 1;
            } else {
                this.weight = Math.random() * 0.2 + 0.1;
                this.angle = 0;
                this.spin = 0;
            }
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1 + 0.5;
            // Palette of Gold and Soft White/Pink for jasmine petals
            this.color = this.type === 'petal' 
                ? `rgba(255, 253, 240, ${Math.random() * 0.6 + 0.3})` // Jasmine petals
                : `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})`;  // Gold dust
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.type === 'petal') {
                this.angle += this.spin;
            }

            if (this.y > canvas.height || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            
            if (this.type === 'petal') {
                ctx.rotate((this.angle * Math.PI) / 180);
                // Draw a simple organic petal shape
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size / 2);
                ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size / 2);
                ctx.fill();
            } else {
                // Gold dust (glowing circle)
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#d4af37';
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// --- Countdown Timer Logic ---
const countdownTarget = new Date(targetDateStr).getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownTarget - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const timerTitleEl = document.getElementById('timer-title');

    if (distance < 0) {
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minutesEl) minutesEl.innerText = "00";
        if (secondsEl) secondsEl.innerText = "00";
        if (timerTitleEl) timerTitleEl.innerText = "The Celebration Has Begun!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- Add to Calendar Options ---
const calBtn = document.getElementById('calendar-btn');
const calMenu = document.getElementById('calendar-menu');

if (calBtn && calMenu) {
    calBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        calMenu.style.display = calMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
        calMenu.style.display = 'none';
    });
}

// Generate Universal iCal / ICS file Data URI
const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nabeel and Nidha Invitation//EN',
    'BEGIN:VEVENT',
    'UID:wedding-nabeel-nidha-2026',
    'DTSTAMP:20260707T000000Z',
    'DTSTART:20260816T063000Z', // 12:00 PM IST is 6:30 AM UTC
    'DTEND:20260816T103000Z',
    'SUMMARY:Wedding Reception of Nabeel & Nidha',
    'DESCRIPTION:You are cordially invited to the wedding reception of Nabeel VP and Nidha Sharaf at VP House, Mattool South.',
    'LOCATION:VP House, Mattool South',
    'END:VEVENT',
    'END:VCALENDAR'
].join('\r\n');

const icsHref = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsData);
const icsLink = document.getElementById('ical-link');
if (icsLink) {
    icsLink.setAttribute('href', icsHref);
}

// --- Interactive RSVP Flow ---
const rsvpForm = document.getElementById('rsvp-form');
const attendYes = document.getElementById('attend-yes');
const attendNo = document.getElementById('attend-no');
const familyCountSection = document.getElementById('family-count-section');
const familyCountVal = document.getElementById('family-count');
const btnMinus = document.getElementById('btn-minus');
const btnPlus = document.getElementById('btn-plus');

if (rsvpForm) {
    // Show/hide family count section dynamically
    attendYes.addEventListener('change', () => {
        if (attendYes.checked) {
            familyCountSection.classList.add('show');
            // Make name and family count required/accessible
            document.getElementById('guest-name').setAttribute('required', 'true');
        }
    });

    attendNo.addEventListener('change', () => {
        if (attendNo.checked) {
            familyCountSection.classList.remove('show');
            document.getElementById('guest-name').removeAttribute('required');
        }
    });

    // Family Member Counter buttons
    if (btnMinus && btnPlus && familyCountVal) {
        btnMinus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(familyCountVal.innerText) || 0;
            if (val > 0) {
                familyCountVal.innerText = val - 1;
            }
        });

        btnPlus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(familyCountVal.innerText) || 0;
            familyCountVal.innerText = val + 1;
        });
    }

    // Submit Action
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const willAttend = attendYes.checked;
        const guestName = willAttend ? document.getElementById('guest-name').value.trim() : 'Declined Guest';
        // Total attendees = guest themselves + family members
        const familyMembers = willAttend ? parseInt(familyCountVal.innerText) || 0 : 0;
        const totalGuestsCount = willAttend ? (familyMembers + 1) : 0;
        
        if (willAttend && !guestName) return;

        // 1. Save locally to localStorage for the designer dashboard (admin.html)
        const newRsvp = {
            id: Date.now(),
            name: guestName,
            attending: willAttend ? 'Yes' : 'No',
            familyCount: familyMembers,
            totalGuests: totalGuestsCount,
            date: new Date().toLocaleDateString()
        };

        let existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
        existingRsvps.push(newRsvp);
        localStorage.setItem('wedding_rsvps', JSON.stringify(existingRsvps));

        // 2. Format WhatsApp Share link (the "wonderful link")
        let messageText = '';
        if (willAttend) {
            messageText = `Hi Nabeel, I will be attending your wedding reception along with ${familyMembers} family members! - ${guestName}`;
        } else {
            messageText = `Hi Nabeel, I'm sorry, I won't be able to make it to the wedding reception. Sending my warmest wishes!`;
        }
        
        const encodedMsg = encodeURIComponent(messageText);
        const waLink = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

        // 3. Show Success Animation & redirect to WhatsApp after a brief delay
        const cardFrame = rsvpForm.closest('.card-frame');
        cardFrame.innerHTML = `
            <div style="padding: 2rem 0; animation: fadeIn 0.8s ease-out;">
                <div class="islamic-divider">
                    <svg viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,17.93V19a1,1,0,0,1-2,0v-1.07A8,8,0,0,1,4.07,13H5a1,1,0,0,1,0-2H4.07A8,8,0,0,1,11,4.07V5a1,1,0,0,1,2,0V4.07A8,8,0,0,1,19.93,11H19a1,1,0,0,1,0,2h0.93A8,8,0,0,1,13,17.93Z"/></svg>
                </div>
                <h3 class="gold-text" style="font-size: 1.8rem; margin-bottom: 1rem;">Jazakallah Khair!</h3>
                <p style="margin-bottom: 1.5rem;">Thank you for your RSVP${willAttend ? `, <strong>${guestName}</strong>` : ''}. Your response has been saved.</p>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 2rem;">We are redirecting you to send these details via WhatsApp...</p>
                <a href="${waLink}" target="_blank" class="btn btn-gold" id="wa-redirect-btn">
                    Send Details via Whatsapp...
                </a>
            </div>
        `;

        // Automatically open WhatsApp link
        setTimeout(() => {
            window.open(waLink, '_blank');
        }, 1500);
    });
}

// --- Reveal Sections on Scroll ---
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// --- Self-Contained Web Audio API Ambient Music Synth ---
// We generate a beautiful, soothing ambient background music utilizing
// browser Audio Context so it works without loading external MP3 files.
class AmbientSynth {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.timeoutIds = [];
        // Maqam Hijaz on D (D4, Eb4, F#4, G4, A4, Bb4, C5, D5)
        this.scale = [293.66, 311.13, 369.99, 392.00, 440.00, 466.16, 523.25, 587.33]; 
        this.bassNotes = [146.83, 196.00, 220.00]; // D3, G3, A3 (Grounding tones)
    }

    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playNote(freq, duration, volume = 0.08, type = 'sine', addVibrato = false) {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Add LFO vibrato to recreate traditional Arabic flute (Nay) signature vibrato
        if (addVibrato) {
            const vibrato = this.ctx.createOscillator();
            const vibratoGain = this.ctx.createGain();
            vibrato.frequency.setValueAtTime(5.5, this.ctx.currentTime); // 5.5Hz modulation
            vibratoGain.gain.setValueAtTime(freq * 0.015, this.ctx.currentTime); // Vibrato depth
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);
            vibrato.start();
            vibrato.stop(this.ctx.currentTime + duration);
        }
        
        // Soft envelope: slower attack for woodwind character, long release
        const attack = duration * 0.3;
        const decay = duration * 0.7;
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        // Warm lowpass filter to emulate acoustics
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    startDrone() {
        if (!this.isPlaying) return;
        
        // Play soft ambient Arabic Nay flute melodies
        const scheduleNextFlute = () => {
            if (!this.isPlaying) return;
            const note = this.scale[Math.floor(Math.random() * this.scale.length)];
            const octaveShift = Math.random() > 0.4 ? 2 : 1; // Play in mid-high register
            const dur = Math.random() * 3 + 3; // 3 to 6 second phrasing
            
            // Generate flute notes using triangle wave with soft vibrato
            this.playNote(note * octaveShift, dur, 0.025, 'triangle', true);
            
            // Random pause between woodwind breaths (phrasing)
            const nextTime = Math.random() * 2500 + 1500;
            const tid = setTimeout(scheduleNextFlute, nextTime);
            this.timeoutIds.push(tid);
        };

        // Play soft grounding Arabic synth pad drone
        const scheduleNextBass = () => {
            if (!this.isPlaying) return;
            const note = this.bassNotes[Math.floor(Math.random() * this.bassNotes.length)];
            const dur = 9;
            // Warm sawtooth waves with heavy lowpass filter sound like a nice string drone
            this.playNote(note, dur, 0.035, 'sawtooth', false);
            
            const tid = setTimeout(scheduleNextBass, 8000);
            this.timeoutIds.push(tid);
        };
        
        scheduleNextFlute();
        scheduleNextBass();
    }

    toggle() {
        if (!this.ctx) {
            this.init();
        }
        
        if (this.isPlaying) {
            this.isPlaying = false;
            this.timeoutIds.forEach(id => clearTimeout(id));
            this.timeoutIds = [];
            if (this.ctx.state === 'running') {
                this.ctx.suspend();
            }
        } else {
            this.isPlaying = true;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.startDrone();
        }
        return this.isPlaying;
    }
}

const synth = new AmbientSynth();
const playToggle = document.getElementById('music-toggle');
if (playToggle) {
    playToggle.addEventListener('click', () => {
        const isPlaying = synth.toggle();
        if (isPlaying) {
            playToggle.classList.remove('paused');
        } else {
            playToggle.classList.add('paused');
        }
    });
}
