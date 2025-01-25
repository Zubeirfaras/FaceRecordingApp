const videoElement = document.getElementById('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadLink = document.getElementById('downloadLink');

let mediaRecorder;
let recordedChunks = [];

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    videoElement.srcObject = stream;

    startBtn.addEventListener('click', () => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        recordedChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        
        // Enable download link and set the video URL
        downloadLink.href = videoURL;
        downloadLink.style.display = 'inline-block';
        stopBtn.disabled = true;
        startBtn.disabled = false;

        // Upload the video to the server
        uploadVideo(blob);
      };

      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
    });

    stopBtn.addEventListener('click', () => {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());  // Stop the camera
    });
  })
  .catch(error => {
    console.error('Error accessing webcam:', error);
  });

// Function to upload the video to the server
function uploadVideo(blob) {
  const formData = new FormData();
  formData.append('video', blob, 'recorded-video.webm');

  // Send the video to the server using Fetch API
  fetch('upload_video.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Video uploaded successfully:', data);
    alert('Video uploaded successfully!');
  })
  .catch(error => {
    console.error('Error uploading video:', error);
    alert('Failed to upload video');
  });
}
