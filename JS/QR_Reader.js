let html5QrCode;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startCamera");
    html5QrCode = new Html5Qrcode("reader");

    startBtn.addEventListener("click", async () => {
        
        startBtn.disabled = true;
        startBtn.style.display = "none";

        try {
            const cameras = await Html5Qrcode.getCameras();
            if (!cameras || cameras.length === 0) {
                alert("Nenhuma câmera encontrada");
                return;
            }

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                onScanFailure
            );

            setTimeout(() => {
                const video = document.querySelector("#reader video");
                if (video) {
                    video.setAttribute("playsinline", true);
                    video.setAttribute("muted", true);
                    video.style.objectFit = "cover";
                }
            }, 300);

        } catch (err) {
            console.error(err);

            startBtn.style.display = "block";
            startBtn.disabled = false;

            alert("Erro ao acessar a câmera");
        }
    });
});

function onScanSuccess(decodedText) {
    html5QrCode.stop().catch(() => {});
    window.location.href = `detalhes.html?page=${decodedText}`;
}

function onScanFailure(_) {}

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

document.addEventListener('DOMContentLoaded', function() {
    const manualCodeInput = document.getElementById('manualCode');
    const submitManualBtn = document.getElementById('submitManualCode');
    
    if (submitManualBtn && manualCodeInput) {
        submitManualBtn.addEventListener('click', function() {
            const code = manualCodeInput.value.trim();
            if (code) {
                if (html5QrcodeScanner) {
                    html5QrcodeScanner.clear();
                }
                window.location.href = `detalhes.html?page=${code}`;
            } else {
                manualCodeInput.focus();
                manualCodeInput.placeholder = "Por favor, digite um código...";
            }
        });
        
        manualCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitManualBtn.click();
            }
        });
        
        setTimeout(() => {
            manualCodeInput.focus();
        }, 800);
    }
    
    setTimeout(() => {
        const readerElement = document.getElementById('reader');
        if (readerElement) {
            const buttons = readerElement.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.width = 'auto';
                button.style.minWidth = '180px';
                button.style.margin = '10px auto 0 auto';
                button.style.display = 'block';
                button.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.1)';
            });
            
            const videoElement = readerElement.querySelector('video');
            const canvasElement = readerElement.querySelector('canvas');
            
            if (videoElement) {
                videoElement.style.borderRadius = '8px';
                videoElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }
            
            if (canvasElement) {
                canvasElement.style.borderRadius = '8px';
            }
        }
    }, 1000);
});