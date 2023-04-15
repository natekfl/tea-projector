const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let starOpen = false

const skyVideo = document.createElement("video")
skyVideo.src = "/resources/stars.mp4"
skyVideo.autoplay = true
skyVideo.loop = true
skyVideo.muted = true

const starIntroVideo = document.createElement("video")
starIntroVideo.src = "/resources/star-intro/output.webm"
starIntroVideo.load()

const starMainVideo = document.createElement("video")
starMainVideo.src = "/resources/star-main/output.webm"
starMainVideo.loop = true
starMainVideo.load()

const starOutroVideo = document.createElement("video")
starOutroVideo.src = "/resources/star-outro/output.webm"
starOutroVideo.load()

const backgroundAudio = new Audio('/resources/background.mp3')
backgroundAudio.loop = true
const openAudio = new Audio('/resources/open.mp3')
const closeAudio = new Audio('/resources/close.mp3')
const idleAudio = new Audio('/resources/idle.mp3')
idleAudio.loop = true

skyVideo.oncanplay = () => {
    skyVideo.play()
    backgroundAudio.play()
    function step() {
        drawFrame()
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
}

function drawFrame() {
    ctx.drawImage(skyVideo, 0, 0, canvas.width, canvas.height)
    if (!starOutroVideo.paused && starOutroVideo.readyState === 4) {
        ctx.drawImage(starOutroVideo, 0, 0, canvas.width, canvas.height)
        if (!starMainVideo.paused) {
            starMainVideo.pause()
            starMainVideo.currentTime = 0.0
            starMainVideo.load()
        }
        idleAudio.volume = 1 - (starIntroVideo.currentTime / starIntroVideo.duration)
    } else if (!starMainVideo.paused) {
        ctx.drawImage(starMainVideo, 0, 0, canvas.width, canvas.height)
        if (starIntroVideo.currentTime === starIntroVideo.duration) {
            console.log("t")
            starIntroVideo.pause()
            starIntroVideo.currentTime = 0.0
            starIntroVideo.load()
            starOutroVideo.pause()
            starOutroVideo.currentTime = 0.0
            starOutroVideo.load()
        }
        if (!starOpen) {
            const loopTime = starMainVideo.currentTime % 2
            if (loopTime < 0.1 || loopTime > 1.9) {
                starOutroVideo.currentTime = 0.0
                starOutroVideo.play()
                closeAudio.currentTime = 0.0
                closeAudio.play()
            }
        }
    } else if (!starIntroVideo.paused || starIntroVideo.currentTime === starIntroVideo.duration) {
        ctx.drawImage(starIntroVideo, 0, 0, canvas.width, canvas.height)
        if (starIntroVideo.currentTime === starIntroVideo.duration) {
            starMainVideo.play()
        }
        idleAudio.volume = starIntroVideo.currentTime / starIntroVideo.duration
    } else {
        if (!idleAudio.paused) {
            idleAudio.pause()
        }
        if (starOpen) {
            starIntroVideo.currentTime = 0.0
            starIntroVideo.play()
            openAudio.currentTime = 0.0
            openAudio.play()
            idleAudio.play()
        }
    }
}

setInterval(() => {
    fetch(`http://${window.location.hostname}:3001`)
        .then((response) => response.json())
        .then((data) => starOpen = data)
}, 50)

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}

function acceptableValue(x, target, error) {
    return inRange(preshowFrame.currentTime, target - error, target + error);
}