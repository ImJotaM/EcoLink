document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const pageId = params.get('page');

    if (!pageId) {
        document.getElementById('page-title').innerText = "Erro: Página não encontrada";
        return;
    }

    fetch(`../contents/${pageId}.txt`)
        .then(response => {
            if (!response.ok) throw new Error("Arquivo não encontrado");
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n').map(line => line.trim()).filter(line => line !== "");
            
            const title = lines.shift();
            document.title = `EcoLink - ${title}`;
            document.getElementById('page-title').innerText = title;

            const container = document.getElementById('content-container');
            container.innerHTML = "";

            lines.forEach(line => {
                const imgMatch = line.match(/\[(.*?)\]/);

                if (imgMatch) {
                    const imgSrc = imgMatch[1];
                    const imgElement = document.createElement('img');
                    imgElement.src = `../assets/imgs/${imgSrc}`;
                    imgElement.className = "content-img shadow-sm";
                    imgElement.style.marginBottom = "25px";
                    container.appendChild(imgElement);
                } else {
                    const textSection = document.createElement('div');
                    textSection.className = "content-section";
                    textSection.style.marginBottom = "25px";
                    
                    const textDiv = document.createElement('div');
                    textDiv.className = "content-text";
                    textDiv.innerText = line;
                    
                    textSection.appendChild(textDiv);
                    container.appendChild(textSection);
                }
            });
        })
        .catch(error => {
            console.error(error);
            document.getElementById('page-title').innerText = "Erro ao carregar conteúdo";
        });
});