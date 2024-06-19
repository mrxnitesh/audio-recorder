let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById('recordButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const stopButton = document.getElementById('stopButton');
const recordingWave = document.getElementById('recordingWave');
const recordingActions = document.getElementById('recordingActions');
const audioPlayback = document.getElementById('audioPlayback');
const filenameInput = document.getElementById('filename');
const downloadButton = document.getElementById('downloadButton');
const deleteButton = document.getElementById('deleteButton');

// Create 10 wave elements dynamically
for (let i = 0; i < 10; i++) {
    const wave = document.createElement('div');
    wave.className = 'wave';
    recordingWave.appendChild(wave);
}

const waves = document.querySelectorAll('.wave');

recordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        recordingActions.classList.remove('hidden');
        stopWaveAnimation();
    };
    
    mediaRecorder.start();
    recordButton.disabled = true;
    recordButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    stopButton.classList.remove('hidden');
    recordingWave.classList.remove('hidden');
    recordingWave.classList.add('recording');
    startWaveAnimation();
});

pauseButton.addEventListener('click', () => {
    mediaRecorder.pause();
    pauseButton.classList.add('hidden');
    resumeButton.classList.remove('hidden');
    stopWaveAnimation(); // Pause wave animation
});

resumeButton.addEventListener('click', () => {
    mediaRecorder.resume();
    resumeButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    startWaveAnimation(); // Resume wave animation
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.classList.add('hidden');
    resumeButton.classList.add('hidden');
    stopButton.classList.add('hidden');
    recordButton.classList.remove('hidden');
    recordingWave.classList.add('hidden');
    waves.forEach(wave => wave.classList.add('stopped'));
});

downloadButton.addEventListener('click', () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    const filename = filenameInput.value || `${new Date().toISOString()}.wav`;
    a.style.display = 'none';
    a.href = audioUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

deleteButton.addEventListener('click', () => {
    audioChunks = [];
    recordingActions.classList.add('hidden');
    audioPlayback.src = '';
    filenameInput.value = '';
});

function startWaveAnimation() {
    waves.forEach(wave => {
        wave.style.animationPlayState = 'running';
    });
}

function stopWaveAnimation() {
    waves.forEach(wave => {
        wave.style.animationPlayState = 'paused';
    });
}
