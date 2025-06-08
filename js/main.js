// Main application file for the Solar System Simulation

// Global variables
let scene, camera, renderer, controls;
let sun, planets = [];
let raycaster, mouse;
let clock = new THREE.Clock();
let simulationControls;
let orbitControls;


function init() {
    
    scene = new THREE.Scene();
    
    
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 30, 90);
    camera.lookAt(0, 0, 0);
    
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    
   
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
   
    setupEventListeners();
    
    
    const stars = createStars();
    scene.add(stars);
    
   
    createCelestialBodies();
    
    
    simulationControls = new SimulationControls(planets, scene, camera);
    
    
    handleResize(renderer, camera);
    
    
    animate();
}

// Create sun and planets
function createCelestialBodies() {
    // Create sun
    const sunGeometry = new THREE.SphereGeometry(sunData.radius, 32, 32);
    const sunTexture = new THREE.TextureLoader().load('assets/textures/sun.jpg');
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        map: sunTexture,
        emissive: 0xffff00,
        emissiveIntensity: 0.5
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = {
        name: sunData.name,
        info: sunData.info,
        radius: sunData.radius,
        rotationSpeed: sunData.rotationSpeed
    };
    scene.add(sun);
    
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
    sun.add(sunLight);
    
    
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    
    // Create planets
    planetData.forEach(data => {
        
        const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const planetTexture = new THREE.TextureLoader().load(data.texture);
        
        
        const planetMaterial = new THREE.MeshStandardMaterial({ 
            map: planetTexture,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        
        const orbitGroup = new THREE.Group();
        scene.add(orbitGroup);
        
        
        orbitGroup.add(planet);
        
        
        planet.position.x = data.distance;
        
        
        const orbitLine = createOrbitLine(data.distance);
        scene.add(orbitLine);
        
        
        planet.userData = {
            ...data,
            orbitGroup: orbitGroup,
            speedFactor: 1
        };
        
        
        if (data.hasRings) {
            const rings = createSaturnRings(data.radius);
            planet.add(rings);
        }
        
        // Create moons 
        if (data.moons && data.moons.length > 0) {
            data.moons.forEach(moonData => {
                const moonGeometry = new THREE.SphereGeometry(moonData.radius, 16, 16);
                const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
                
                if (moonData.texture) {
                    const moonTexture = new THREE.TextureLoader().load(moonData.texture);
                    moonMaterial.map = moonTexture;
                }
                
                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                
                
                const moonOrbitGroup = new THREE.Group();
                planet.add(moonOrbitGroup);
                
                
                moonOrbitGroup.add(moon);
                
                
                moon.position.x = moonData.distance;
                
                
                moon.userData = {
                    ...moonData,
                    orbitGroup: moonOrbitGroup,
                    isPlanetMoon: true,
                    parentPlanet: data.name
                };
            });
        }
        
       
        planets.push(planet);
    });
    
    
    updateRealTimePositions();
}

// Update planet positions based on real-time date
function updateRealTimePositions() {
    const positions = calculateRealTimePositions();
    
    planets.forEach(planet => {
        const name = planet.userData.name;
        if (positions[name] !== undefined) {
            const angle = positions[name];
            planet.userData.orbitGroup.rotation.y = angle;
        }
    });
}


function setupEventListeners() {
 
    window.addEventListener('mousemove', onMouseMove);
    
   
    window.addEventListener('click', onMouseClick);
    
  
    window.addEventListener('dblclick', onDoubleClick);
}

// Handle mouse movement
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    
    raycaster.setFromCamera(mouse, camera);
    
    
    const intersects = raycaster.intersectObjects([sun, ...planets]);
    
    
    document.body.style.cursor = 'auto';
    
    
    simulationControls.hideTooltip();
    
    
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const object = intersects[0].object;
        
        
        if (!object.userData.isPlanetMoon) {
            simulationControls.showTooltip(object, event.clientX, event.clientY);
        }
    }
}

// Handle mouse click
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    
    raycaster.setFromCamera(mouse, camera);
    
   
    const intersects = raycaster.intersectObjects([sun, ...planets]);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        
        simulationControls.focusCamera(object);
        
        
        const infoPanel = document.getElementById('planet-info');
        infoPanel.innerHTML = `
            <h3>${object.userData.name}</h3>
            <p>${object.userData.info}</p>
        `;
    }
}

// Handle double click
function onDoubleClick() {
   
    simulationControls.resetCamera();
    
    
    const infoPanel = document.getElementById('planet-info');
    infoPanel.innerHTML = '<p>Hover over a planet to see details</p>';
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
   
    if (!simulationControls.isPaused) {
        
        sun.rotation.y += sunData.rotationSpeed * delta;
        
       
        planets.forEach(planet => {
            const data = planet.userData;
            
            
            planet.rotation.y += data.rotationSpeed * delta;
            
           
            if (data.tilt && !planet.userData.tiltApplied) {
                planet.rotation.x = data.tilt;
                planet.userData.tiltApplied = true;
            }
            
            
            data.orbitGroup.rotation.y += data.orbitSpeed * data.speedFactor * delta;
            
           
            planet.children.forEach(child => {
                if (child instanceof THREE.Group) {
                    child.children.forEach(moon => {
                        if (moon.userData && moon.userData.orbitSpeed) {
                            // Rotate moon around its planet
                            moon.userData.orbitGroup.rotation.y += moon.userData.orbitSpeed * delta;
                        }
                    });
                }
            });
        });
    }
    
    
    orbitControls.update();
    
   
    renderer.render(scene, camera);
}


window.addEventListener('load', init);