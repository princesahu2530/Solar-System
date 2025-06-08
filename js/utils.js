

// Create orbit line
function createOrbitLine(radius) {
    const segments = 128;
    const material = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
    });
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        vertices.push(
            radius * Math.cos(theta),
            0,
            radius * Math.sin(theta)
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return new THREE.Line(geometry, material);
}

// Create stars background
function createStars(count = 10000) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < count; i++) {
       
        const radius = 500; 
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: false
    });
    
    return new THREE.Points(geometry, material);
}

// Calculate real-time planet positions based on current date
function calculateRealTimePositions() {
    const now = new Date();
    
    
    const orbitalPeriods = {
        Mercury: 88,
        Venus: 225,
        Earth: 365.25,
        Mars: 687,
        Jupiter: 4333,
        Saturn: 10759,
        Uranus: 30687,
        Neptune: 60190
    };
    
    
    const j2000 = new Date('2000-01-01T12:00:00Z');
    
    
    const daysSinceJ2000 = (now - j2000) / (1000 * 60 * 60 * 24);
    
    
    const positions = {};
    
    for (const planet in orbitalPeriods) {
        
        const period = orbitalPeriods[planet];
        const angle = (daysSinceJ2000 % period) / period * Math.PI * 2;
        
        positions[planet] = angle;
    }
    
    return positions;
}

// Create Saturn's rings
function createSaturnRings(saturnRadius) {
    const innerRadius = saturnRadius * 1.2;
    const outerRadius = saturnRadius * 2;
    
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });
    
    const rings = new THREE.Mesh(geometry, material);
    rings.rotation.x = Math.PI / 2;
    
    return rings;
}

// Handle window resize
function handleResize(renderer, camera) {
    window.addEventListener('resize', () => {
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Convert degrees to radians
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}