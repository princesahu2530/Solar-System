// Controls for the simulation
class SimulationControls {
    constructor(planets, scene, camera) {
        this.planets = planets;
        this.scene = scene;
        this.camera = camera;
        this.isPaused = false;
        this.isSoundOn = false;
        this.isDarkMode = true;
        this.showOrbits = true;
        this.backgroundMusic = null;
        this.hoverSound = null;
        this.globalSpeedFactor = 1; // Add global speed factor
        
        this.initSounds();
        this.setupEventListeners();
        this.createSpeedControls();
        this.createGlobalSpeedControl(); // Add this new method call
    }
    
    initSounds() {
        // Create audio elements
        this.backgroundMusic = new Audio();
        this.backgroundMusic.src = "assets/sounds/solarBackground.mp3";
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.8;
        
        // Initialize hover sound
        this.hoverSound = new Audio();
        this.hoverSound.src = "assets/sounds/solarBackground.mp3"; 
        this.hoverSound.volume = 0.2; 
        
        // Add error handling for audio loading
        this.backgroundMusic.addEventListener('error', (e) => {
            console.error('Error loading background music:', e);
        });
        
        this.hoverSound.addEventListener('error', (e) => {
            console.error('Error loading hover sound:', e);
        });
        
        // Create audio context for better browser compatibility
        this.audioContext = null;
        this.setupAudioContext();
    }

    setupAudioContext() {
        // Create audio context only when needed (on first user interaction)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            // Add a one-time event listener to the document for user interaction
            const setupAudio = () => {
                if (!this.audioContext) {
                    this.audioContext = new AudioContext();
                    console.log('Audio context created after user interaction');
                    
                    // If sound is already toggled on, try to play it
                    if (this.isSoundOn) {
                        this.backgroundMusic.play().catch(e => {
                            console.warn('Could not play audio after creating context:', e);
                        });
                    }
                }
            };
            
            // Listen for user interactions to initialize audio
            ['click', 'touchstart', 'keydown'].forEach(event => {
                document.addEventListener(event, setupAudio, { once: true });
            });
        }
    }
    
    setupEventListeners() {
        // Pause/Resume button
        const pauseButton = document.getElementById('pause-button');
        pauseButton.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.body.classList.toggle('light-mode', !this.isDarkMode);
        });
        
        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('click', () => {
            this.isSoundOn = !this.isSoundOn;
            soundToggle.textContent = `Sound: ${this.isSoundOn ? 'On' : 'Off'}`;
            
            if (this.isSoundOn) {
                // Create audio context if it doesn't exist yet
                if (!this.audioContext && window.AudioContext) {
                    this.setupAudioContext();
                }
                
                // Play with error handling
                this.backgroundMusic.play().catch(e => {
                    console.warn('Could not play background music:', e);
                    alert('Sound playback failed. This may be due to browser autoplay policies. Try clicking elsewhere on the page first.');
                });
            } else {
                this.backgroundMusic.pause();
            }
        });
        
        // Add orbit toggle button
        const orbitToggle = document.createElement('button');
        orbitToggle.id = 'orbit-toggle';
        orbitToggle.textContent = 'Orbits: On';
        document.querySelector('.toggle-container').appendChild(orbitToggle);
        
        orbitToggle.addEventListener('click', () => {
            this.showOrbits = !this.showOrbits;
            orbitToggle.textContent = `Orbits: ${this.showOrbits ? 'On' : 'Off'}`;
            
            
            this.scene.children.forEach(child => {
                
                if (child instanceof THREE.Line && 
                    child.material && 
                    child.material.transparent) {
                    child.visible = this.showOrbits;
                }
            });
        });
    }
    
    createGlobalSpeedControl() {
        // Create container for global speed control
        const globalSpeedControl = document.createElement('div');
        globalSpeedControl.id = 'global-speed-control';
        
        // Create heading
        const heading = document.createElement('h4');
        heading.textContent = 'Global Speed';
        
        // Create label
        const label = document.createElement('label');
        label.textContent = 'All Planets Speed';
        label.htmlFor = 'global-speed';
        
        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = 'global-speed';
        slider.min = '0';
        slider.max = '500'; // 5x max speed
        slider.value = '100'; // Default 1x
        
        // Create value display
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'speed-value';
        valueDisplay.textContent = '1x';
        
        // Add event listener to slider
        slider.addEventListener('input', (e) => {
            const speedFactor = parseInt(e.target.value) / 100;
            this.globalSpeedFactor = speedFactor;
            valueDisplay.textContent = `${speedFactor.toFixed(2)}x`;
            
            // Update all planet speeds
            this.planets.forEach(planet => {
                planet.userData.speedFactor = speedFactor;
                
                // Update individual planet sliders to match global speed
                const planetIndex = this.planets.indexOf(planet);
                const planetSlider = document.getElementById(`speed-${planetIndex}`);
                if (planetSlider) {
                    planetSlider.value = e.target.value;
                    const planetValueDisplay = planetSlider.parentNode.querySelector('.speed-value');
                    if (planetValueDisplay) {
                        planetValueDisplay.textContent = `${speedFactor.toFixed(2)}x`;
                    }
                }
            });
        });
        
        // Append elements to container
        globalSpeedControl.appendChild(heading);
        globalSpeedControl.appendChild(label);
        globalSpeedControl.appendChild(slider);
        globalSpeedControl.appendChild(valueDisplay);
        
        // Append container to body
        document.body.appendChild(globalSpeedControl);
    }
    
    createSpeedControls() {
        const speedControlsContainer = document.getElementById('speed-controls');
        
        this.planets.forEach((planet, index) => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'planet-speed-control';
            
            const planetName = document.createElement('h4');
            planetName.textContent = planet.userData.name;
            planetName.className = 'planet-name';
            
            const label = document.createElement('label');
            label.textContent = `Speed Control`;
            label.htmlFor = `speed-${index}`;
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = `speed-${index}`;
            slider.min = '0';
            slider.max = '500'; // Changed from 500 to match global speed max
            slider.value = '100';
            
            const valueDisplay = document.createElement('div');
            valueDisplay.className = 'speed-value';
            valueDisplay.textContent = '1x';
            
            slider.addEventListener('input', (e) => {
                const speedFactor = parseInt(e.target.value) / 100;
                planet.userData.speedFactor = speedFactor;
                valueDisplay.textContent = `${speedFactor.toFixed(2)}x`;
            });
            
            controlDiv.appendChild(planetName); 
            controlDiv.appendChild(label);
            controlDiv.appendChild(slider);
            controlDiv.appendChild(valueDisplay);
            speedControlsContainer.appendChild(controlDiv);
        });
    }
    
    showTooltip(planetMesh, mouseX, mouseY) {
        const tooltip = document.getElementById('tooltip');
        const planetInfo = planetMesh.userData.info;
        
        tooltip.innerHTML = `
            <h3>${planetMesh.userData.name}</h3>
            <p>${planetInfo}</p>
        `;
        
        tooltip.style.left = `${mouseX + 15}px`;
        tooltip.style.top = `${mouseY + 15}px`;
        tooltip.style.display = 'block';
        
        if (this.isSoundOn) {
            this.hoverSound.currentTime = 0;
            this.hoverSound.play().catch(e => {
                // Silently handle hover sound errors
                console.warn('Could not play hover sound:', e);
            });
        }
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }
    
    focusCamera(planetMesh) {
        
        if (!this.originalCameraPosition) {
            this.originalCameraPosition = {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            };
        }
        
        
        const targetPosition = planetMesh.position.clone();
        const distance = planetMesh.userData.radius * 5; // Adjust distance based on planet size
        
        
        const direction = new THREE.Vector3().subVectors(targetPosition, this.camera.position).normalize();
        const newPosition = targetPosition.clone().sub(direction.multiplyScalar(distance));
        
        
        this.animateCamera(newPosition, targetPosition);
    }
    
    resetCamera() {
        if (this.originalCameraPosition) {
            this.animateCamera(
                new THREE.Vector3(
                    this.originalCameraPosition.x,
                    this.originalCameraPosition.y,
                    this.originalCameraPosition.z
                ),
                new THREE.Vector3(0, 0, 0)
            );
        }
    }
    
    animateCamera(newPosition, lookAtPosition) {
        
        const startPosition = this.camera.position.clone();
        const startLookAt = this.camera.getWorldDirection(new THREE.Vector3());
        const endLookAt = new THREE.Vector3().subVectors(lookAtPosition, newPosition).normalize();
        
        const duration = 1000; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            
            this.camera.position.lerpVectors(startPosition, newPosition, progress);
            
            
            const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, endLookAt, progress);
            this.camera.lookAt(
                this.camera.position.x + currentLookAt.x,
                this.camera.position.y + currentLookAt.y,
                this.camera.position.z + currentLookAt.z
            );
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}