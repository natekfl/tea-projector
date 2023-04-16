let starOpen = false

const backgroundAudio = new Audio('/resources/background.mp3')
backgroundAudio.loop = true
const openAudio = new Audio('/resources/open.mp3')
const closeAudio = new Audio('/resources/close.mp3')
const idleAudio = new Audio('/resources/idle.mp3')
idleAudio.loop = true

const videoElementA = document.getElementById("starVideoA")
const videoElementB = document.getElementById("starVideoB")

let state = "closed" //"closed", "opening", "open", "closing", "closed"

setInterval(() => {
    if (state === "closed") {
        if (starOpen) {
            state = "opening"
            videoElementA.src = "/resources/star-intro/output.webm"
            videoElementA.loop = false
            videoElementA.currentTime = 0.0
            videoElementA.play()
            openAudio.play()
            idleAudio.play()
        }
    } else if (state === "open") {
        if (!starOpen) {
            state = "closing"
            videoElementA.src = "/resources/star-outro/output.webm"
            videoElementA.loop = false
            videoElementA.currentTime = 0.0
            videoElementA.play()
            closeAudio.play()
        }
    }

    if (state === "opening") {
        idleAudio.volume = videoElementA.currentTime / videoElementA.duration
    } else if (state === "closing") {
        idleAudio.volume = 1- (videoElementA.currentTime / videoElementA.duration)
    }
}, 100)

videoElementA.onended = () => {
    if (state === "opening") {
        state = "open"
        videoElementB.src = "/resources/star-main/output.webm"
        videoElementB.loop = true
        videoElementB.currentTime = 0.0
        videoElementB.play()
    } else if (state === "closing") {
        state = "closed"
        videoElementB.src = ""
        videoElementA.src = "/resources/star-intro/output.webm"
        videoElementA.loop = false
        videoElementA.currentTime = 0.0
        videoElementA.pause()
        videoElementA.load()
        idleAudio.pause()
    }
}

videoElementA.onplaying = () => {
    if (state === "closing") {
        videoElementB.src = ""
    }
}

videoElementB.onplaying = () => {
    videoElementA.src = ""
}

backgroundAudio.play()

setInterval(() => {
    fetch(`http://${window.location.hostname}:3001`)
        .then((response) => response.json())
        .then((data) => starOpen = data)
}, 50)