function onScanSuccess(decodedText, decodedResult) {
    let pageId = decodedText;
    
    if (decodedText.includes("?page=")) {
        const urlParams = new URLSearchParams(decodedText.split('?')[1]);
        pageId = urlParams.get('page');
    }

    html5QrcodeScanner.clear();
    window.location.href = `detalhes.html?page=${pageId}`;
}

function onScanFailure(error) {
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    }, 
    false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);