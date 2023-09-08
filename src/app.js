import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { gsap } from 'gsap'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.landingCanvas')

// Scene
const scene = new THREE.Scene()

// Helpers
const axisHelper = new THREE.AxesHelper(10)
scene.add(axisHelper)

const gridHelper = new THREE.GridHelper(20, 20)
scene.add(gridHelper)

const backimg = 'background/main.png';
const img = new Image();
img.onload = function () {
	scene.background = new THREE.TextureLoader().load(backimg);
	setBackground(scene, img.width, img.height);
};
img.src = backimg;

/**
 * Textures
 */

/**
 * Fonts
 */
const fontLoader = new FontLoader()
const material = new THREE.MeshBasicMaterial()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Cool Logo',
            {
                font: font,
                size: 0.2,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        text.position.y = 3.5
    }
)

const geometry = new THREE.SphereGeometry( 0.3, 20, 20 );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //Update background
    if(scene.background) {
        setBackground(scene, img.width, img.height);
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animation
    gsap.to(sphere.position, {duration: 0.1, y: Math.abs( Math.sin( elapsedTime ) ) * 3 + 0.3, ease: "power2.inOut"})

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// Funcitons
function setBackground(scene, backgroundImageWidth, backgroundImageHeight) {
	const windowSize = function(withScrollBar) {
		let wid = 0;
		let hei = 0;
		if (typeof window.innerWidth != "undefined") {
			wid = window.innerWidth;
			hei = window.innerHeight;
		}
		else {
			if (document.documentElement.clientWidth == 0) {
				wid = document.body.clientWidth;
				hei = document.body.clientHeight;
			}
			else {
				wid = document.documentElement.clientWidth;
				hei = document.documentElement.clientHeight;
			}
		}
		return { width: wid - (withScrollBar ? (wid - document.body.offsetWidth + 1) : 0), height: hei };
	};

	if (scene.background) {

		var size = windowSize(true);
		var factor = (backgroundImageWidth / backgroundImageHeight) / (size.width / size.height);

		scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
		scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;

		scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
		scene.background.repeat.y = factor > 1 ? 1 : factor;
	}
}