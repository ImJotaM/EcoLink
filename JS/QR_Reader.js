let html5QrCode;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startCamera");
    const manualCodeInput = document.getElementById('manualCode');
    const submitManualBtn = document.getElementById('submitManualCode');
    const readerElement = document.getElementById('reader');

    html5QrCode = new Html5Qrcode("reader");

    startBtn.addEventListener("click", async () => {
        startBtn.disabled = true;
        startBtn.style.display = "none";

        try {
            const cameras = await Html5Qrcode.getCameras();
            if (!cameras || cameras.length === 0) {
                alert("Nenhuma câmera encontrada");
                startBtn.style.display = "block";
                startBtn.disabled = false;
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
                    video.style.objectFit = "cover";
                    video.style.borderRadius = '8px';
                }
            }, 500);

        } catch (err) {
            console.error(err);
            startBtn.style.display = "block";
            startBtn.disabled = false;
            alert("Erro ao acessar a câmera");
        }
    });

    if (submitManualBtn && manualCodeInput) {
        const handleManualSubmit = async () => {
            const code = manualCodeInput.value.trim();
            if (code) {
                if (html5QrCode && html5QrCode.isScanning) {
                    try {
                        await html5QrCode.stop();
                    } catch (err) {
                        console.warn("Erro ao parar câmera:", err);
                    }
                }
                window.location.href = `detalhes.html?page=${encodeURIComponent(code)}`;
            } else {
                manualCodeInput.focus();
                manualCodeInput.placeholder = "Por favor, digite um código...";
            }
        };

        submitManualBtn.addEventListener('click', handleManualSubmit);
        
        manualCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleManualSubmit();
        });

        setTimeout(() => manualCodeInput.focus(), 800);
    }
});

async function onScanSuccess(decodedText) {
    if (html5QrCode) {
        try {
            await html5QrCode.stop();
        } catch(e) {}
    }
    window.location.href = `detalhes.html?page=${encodeURIComponent(decodedText)}`;
}

function onScanFailure(error) {}