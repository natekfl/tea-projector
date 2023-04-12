const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const mediaSource = "/resources/stars.mp4"

const baseVideo = document.createElement("video")
baseVideo.src = mediaSource
baseVideo.autoplay = true
baseVideo.loop = true
baseVideo.muted = true

const backgroundAudio = new Audio('/resources/background.mp3')
backgroundAudio.loop = true
const openAudio = new Audio('/resources/open.mp3')
const closeAudio = new Audio('/resources/close.mp3')
const idleAudio = new Audio('/resources/idle.mp3')
idleAudio.loop = true

let starOpen = false

const mainStarLoop = []
for (let i = 0; i < 250; i++) {
    const image = new Image()
    image.src = `/resources/star-main/image${i.toString().padStart(4, "0")}.png`
    mainStarLoop.push(image)
}
let mainLoopStartedAt = null

const introStarLoop = []
for (let i = 0; i < 50; i++) {
    const image = new Image()
    image.src = `/resources/star-intro/image${i.toString().padStart(5, "0")}.png`
    introStarLoop.push(image)
}
let introLoopStartedAt = null

const outroStarLoop = []
for (let i = 0; i < 17; i++) {
    const image = new Image()
    image.src = `/resources/star-outro/image${i.toString().padStart(5, "0")}.png`
    outroStarLoop.push(image)
}
let outroLoopStartedAt = null

baseVideo.oncanplay = () => {
    baseVideo.play()
    backgroundAudio.play()
    function step() {
        drawFrame()
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
}

function drawFrame() {
    ctx.drawImage(baseVideo, 0, 0, canvas.width, canvas.height)
    if (mainLoopStartedAt != null) {
        const time = (Date.now() - mainLoopStartedAt) / 1000
        const frameNum = Math.floor(time * 24) % 250
        const frame = mainStarLoop[frameNum]
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)

        if (frameNum % 48 === 0) {
            if (!starOpen) {
                mainLoopStartedAt = null
                outroLoopStartedAt = Date.now()
                closeAudio.play()
            }
        }
    } else if (introLoopStartedAt != null) {
        const time = (Date.now() - introLoopStartedAt) / 1000
        const frameNum = Math.min(Math.floor(time * 24), 49)
        const frame = introStarLoop[frameNum]
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        idleAudio.volume = frameNum / 49
        if (frameNum >= 49) {
            introLoopStartedAt = null
            mainLoopStartedAt = Date.now()
        }
    } else if (outroLoopStartedAt != null) {
        const time = (Date.now() - outroLoopStartedAt) / 1000
        const frameNum = Math.min(Math.floor(time * 24), 16)
        const frame = outroStarLoop[frameNum]
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        idleAudio.volume = 1.0 - frameNum / 16
        if (frameNum >= 16) {
            outroLoopStartedAt = null
            idleAudio.pause()
        }
    } else {
        if (starOpen) {
            introLoopStartedAt = Date.now()
            openAudio.play()
            idleAudio.play()
            idleAudio.volume = 0.0
        }
    }
}

setInterval(() => {
    fetch(`http://${window.location.hostname}:3001`)
        .then((response) => response.json())
        .then((data) => starOpen = data)
}, 50)