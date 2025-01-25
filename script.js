const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoElement = document.getElementById('videoElement');
let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Display the video stream
        videoElement.srcObject = stream;

        // Initialize the MediaRecorder for capturing the video
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = 'recorded_video.webm';
            link.click();
        };

        // Start recording
        mediaRecorder.start();

        // Toggle visibility of buttons
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline';

        stopBtn.addEventListener('click', () => {
            mediaRecorder.stop();
            videoElement.srcObject.getTracks().forEach(track => track.stop());
        });
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Camera access denied or unavailable.');
    }
});
