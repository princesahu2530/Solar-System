
const planetData = [
    {
        name: "Mercury",
        radius: 0.4,  
        distance: 5,  
        rotationSpeed: 0.004,  
        orbitSpeed: 0.04,     
        texture: "assets/textures/mercury.jpg",
        tilt: 0.034,  
        color: 0xaaaaaa,
        info: "Mercury is the smallest and innermost planet in the Solar System. It completes an orbit around the Sun every 88 Earth days.",
        moons: []
    },
    {
        name: "Venus",
        radius: 0.9,
        distance: 7,
        rotationSpeed: 0.002,
        orbitSpeed: 0.015,
        texture: "assets/textures/venus.jpg",
        tilt: 0.001,
        color: 0xffd700,
        info: "Venus is the second planet from the Sun. It's named after the Roman goddess of love and beauty and is the second-brightest natural object in Earth's night sky after the Moon.",
        moons: []
    },
    {
        name: "Earth",
        radius: 1,
        distance: 10,
        rotationSpeed: 0.01,
        orbitSpeed: 0.01,
        texture: "assets/textures/earth.jpg",
        tilt: 0.41,
        color: 0x2233ff,
        info: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is water-covered.",
        moons: [
            {
                name: "Moon",
                radius: 0.27,
                distance: 2,
                orbitSpeed: 0.05,
                texture: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg"
            }
        ]
    },
    {
        name: "Mars",
        radius: 0.5,
        distance: 14,
        rotationSpeed: 0.008,
        orbitSpeed: 0.008,
        texture: "assets/textures/mars.jpg",
        tilt: 0.44,
        color: 0xff4500,
        info: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Mars is often referred to as the 'Red Planet'.",
        moons: [
            {
                name: "Phobos",
                radius: 0.1,
                distance: 1.2,
                orbitSpeed: 0.08
            },
            {
                name: "Deimos",
                radius: 0.08,
                distance: 1.8,
                orbitSpeed: 0.06
            }
        ]
    },
    {
        name: "Jupiter",
        radius: 2.5,
        distance: 25,
        rotationSpeed: 0.04,
        orbitSpeed: 0.002,
        texture: "assets/textures/jupiter.jpg",
        tilt: 0.05,
        color: 0xffa500,
        info: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant with a mass more than two and a half times that of all the other planets combined.",
        moons: [
            {
                name: "Io",
                radius: 0.2,
                distance: 3.5,
                orbitSpeed: 0.04
            },
            {
                name: "Europa",
                radius: 0.18,
                distance: 4.2,
                orbitSpeed: 0.03
            },
            {
                name: "Ganymede",
                radius: 0.25,
                distance: 5,
                orbitSpeed: 0.025
            },
            {
                name: "Callisto",
                radius: 0.22,
                distance: 6,
                orbitSpeed: 0.02
            }
        ]
    },
    {
        name: "Saturn",
        radius: 2.2,
        distance: 40,
        rotationSpeed: 0.038,
        orbitSpeed: 0.0009,
        texture: "assets/textures/saturn.jpg",
        tilt: 0.47,
        color: 0xffd700,
        info: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It's known for its prominent ring system.",
        hasRings: true,
        moons: [
            {
                name: "Titan",
                radius: 0.3,
                distance: 4.5,
                orbitSpeed: 0.02
            },
            {
                name: "Enceladus",
                radius: 0.15,
                distance: 3.2,
                orbitSpeed: 0.03
            }
        ]
    },
    {
        name: "Uranus",
        radius: 1.8,
        distance: 60,
        rotationSpeed: 0.03,
        orbitSpeed: 0.0004,
        texture: "assets/textures/uranus.jpg",
        tilt: 1.71,
        color: 0x40e0d0,
        info: "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
        moons: [
            {
                name: "Titania",
                radius: 0.15,
                distance: 3,
                orbitSpeed: 0.025
            },
            {
                name: "Oberon",
                radius: 0.14,
                distance: 3.8,
                orbitSpeed: 0.02
            }
        ]
    },
    {
        name: "Neptune",
        radius: 1.7,
        distance: 80,
        rotationSpeed: 0.032,
        orbitSpeed: 0.0001,
        texture: "assets/textures/neptune.jpg",
        tilt: 0.49,
        color: 0x4169e1,
        info: "Neptune is the eighth and farthest known planet from the Sun. It's the fourth-largest planet by diameter and the third-most-massive planet.",
        moons: [
            {
                name: "Triton",
                radius: 0.18,
                distance: 3.2,
                orbitSpeed: 0.03
            }
        ]
    }
];


const sunData = {
    name: "Sun",
    radius: 5,
    rotationSpeed: 0.002,
    texture: "assets/textures/sun.jpg",
    info: "The Sun is the star at the center of the Solar System. It's a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core."
};