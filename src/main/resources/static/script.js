document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const responseDiv = document.getElementById("response");

    async function sendRequest() {
        const userPrompt = inputField.value.trim();
        if (userPrompt === "") return;

        inputField.value = ""; // Clear input
        responseDiv.innerHTML = `<b>You:</b> ${userPrompt}<br><b>AI:</b> `;

        try {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "dolphin3:8b",
                    prompt: userPrompt,
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let resultText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                
                try {
                    const chunkData = JSON.parse(chunk);
                    if (chunkData.response) {
                        resultText += chunkData.response;
                        responseDiv.innerHTML = `<b>You:</b> ${userPrompt}<br><b>AI:</b> ${resultText}`;
                    }
                } catch (jsonError) {
                    console.error("JSON parse error:", jsonError);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            responseDiv.innerHTML = `<b>Error:</b> ${error.message}`;
        }
    }

    sendButton.addEventListener("click", sendRequest);

    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendRequest();
        }
    });
});
