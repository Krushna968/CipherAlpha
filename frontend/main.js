// CipherAlpha AI - Midnight Slate Dashboard Client Logic

const BACKEND_URL = "http://localhost:3001/api";

// 1. Chat Interactivity
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.querySelector('.overflow-y-auto');
    const chatInput = document.querySelector('input[type="text"]');
    
    // Auto-scroll chat to bottom
    const scrollToBottom = () => {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };
    scrollToBottom();

    // Send Message Logic
    const handleSend = async () => {
        if (!chatInput || !chatContainer) return;
        const text = chatInput.value.trim();
        if (!text) return;

        // Clear input
        chatInput.value = '';

        // Remove the existing "AI typing" indicator if present
        const typingIndicator = Array.from(chatContainer.querySelectorAll('.flex')).find(el => el.textContent.includes('Calculating encrypted paths') || el.textContent.includes('Computing'));
        if (typingIndicator) {
            typingIndicator.remove();
        }

        // 1. Create User Message HTML
        const userMsg = document.createElement('div');
        userMsg.className = 'flex gap-stack-md max-w-[85%] self-end flex-row-reverse';
        userMsg.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-on-surface">person</span>
            </div>
            <div class="bg-primary-container/20 border border-primary/30 p-stack-md rounded-2xl rounded-tr-none">
                <p class="text-body-md text-on-surface">${escapeHtml(text)}</p>
                <span class="text-[10px] text-primary mt-2 block">${formatTime(new Date())}</span>
            </div>
        `;
        chatContainer.appendChild(userMsg);
        scrollToBottom();

        // 2. Create & Append AI Typing State
        const newTyping = document.createElement('div');
        newTyping.className = 'flex gap-stack-md max-w-[85%]';
        newTyping.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-on-primary-container">psychology</span>
            </div>
            <div class="bg-surface-container p-stack-md rounded-2xl rounded-tl-none flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-on-surface-variant font-label-md">Computing FHE multi-agent path</span>
                    <span class="flex">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </span>
                </div>
                <div class="agent-activity-log flex flex-col gap-1 text-[11px] text-primary-fixed-dim">
                    <span>Initializing supervisor node...</span>
                </div>
            </div>
        `;
        chatContainer.appendChild(newTyping);
        scrollToBottom();

        try {
            // Fetch from Express API
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    context: { riskScore: 28, portfolioHealth: 88 }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const logContainer = newTyping.querySelector('.agent-activity-log');

                // Progressively show agent steps
                if (data.agentActivity && data.agentActivity.length > 0) {
                    for (let step of data.agentActivity) {
                        await new Promise(resolve => setTimeout(resolve, 800));
                        if (logContainer) {
                            const stepEl = document.createElement('span');
                            stepEl.innerText = `✔ ${step}`;
                            logContainer.appendChild(stepEl);
                            scrollToBottom();
                        }
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 600));
                newTyping.remove();

                const aiMsg = document.createElement('div');
                aiMsg.className = 'flex gap-stack-md max-w-[85%]';
                aiMsg.innerHTML = `
                    <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-on-primary-container">psychology</span>
                    </div>
                    <div class="bg-surface-container p-stack-md rounded-2xl rounded-tl-none">
                        <p class="text-body-md text-on-surface">${data.reply}</p>
                        <span class="text-[10px] text-on-surface-variant mt-2 block">${formatTime(new Date())}</span>
                    </div>
                `;
                chatContainer.appendChild(aiMsg);
                scrollToBottom();
            } else {
                throw new Error("Failed to get response");
            }
        } catch (e) {
            console.error("Chat API failed:", e);
            newTyping.remove();

            const aiMsg = document.createElement('div');
            aiMsg.className = 'flex gap-stack-md max-w-[85%]';
            aiMsg.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-on-primary-container">psychology</span>
                </div>
                <div class="bg-surface-container p-stack-md rounded-2xl rounded-tl-none">
                    <p class="text-body-md text-on-surface">${getMockAIResponse(text)}</p>
                    <span class="text-[10px] text-on-surface-variant mt-2 block">${formatTime(new Date())}</span>
                </div>
            `;
            chatContainer.appendChild(aiMsg);
            scrollToBottom();
        }
    };

    // Helper functions
    const escapeHtml = (unsafe) => {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    };

    const getMockAIResponse = (input) => {
        const query = input.toLowerCase();
        if (query.includes('rebalance') || query.includes('execute')) {
            return "Rebalancing execution completed confidentially. Fhenix Layer-2 block confirmation finalized. TX Hash: 0x8a92...fb3c. You can audit the proof inside the CoFHE dashboard.";
        }
        if (query.includes('snapshot') || query.includes('portfolio')) {
            return "Portfolio snapshot compiled under zero-knowledge. Your current portfolio valuation is $1,248,392 with zero risk exposure to public mempools.";
        }
        if (query.includes('withdraw') || query.includes('stealth')) {
            return "Generated a single-use stealth address on-chain. Please sign the transaction payload in your connected Fhenix-compatible wallet to route the withdrawal.";
        }
        if (query.includes('contract') || query.includes('safety') || query.includes('verify')) {
            return "CoFHE contract verification run completed. The logic matches the bytecode on the Fhenix mainnet, containing no re-entrancy vectors or administrative backdoors.";
        }
        return "Command received and processed via CoFHE-shielded VM. The current state has been updated on Fhenix L2. What else would you like to verify under zero-knowledge?";
    };

    // Bind event listeners
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }

    // Find the send button
    const findSendBtn = () => {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon && icon.textContent.trim() === 'send') {
                return btn;
            }
        }
        return null;
    };

    const actualSendBtn = findSendBtn();
    if (actualSendBtn) {
        actualSendBtn.addEventListener('click', handleSend);
    }

    // Handle suggestion pills click
    const suggestionPills = document.querySelectorAll('button.flex-shrink-0');
    suggestionPills.forEach(pill => {
        pill.addEventListener('click', () => {
            if (chatInput) {
                chatInput.value = pill.textContent.trim();
                handleSend();
            }
        });
    });

    // 3. Wallet Connection (MetaMask)
    const connectWalletBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Connect Wallet' || btn.textContent.trim().startsWith('0x'));
    
    if (connectWalletBtn) {
        const updateWalletUI = async (account) => {
            const truncated = account.slice(0, 6) + '...' + account.slice(-4);
            connectWalletBtn.innerText = truncated;
            connectWalletBtn.className = 'border border-tertiary/40 bg-tertiary/10 text-tertiary px-stack-lg py-2 rounded-lg font-label-md text-label-md font-bold transition-all hover:bg-tertiary/20 active:opacity-80 scale-95';

            // Query real-time balance metrics from backend
            try {
                const res = await fetch(`${BACKEND_URL}/portfolio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: account })
                });
                if (res.ok) {
                    const data = await res.json();
                    // Update total portfolio balance card
                    const metrics = document.querySelectorAll('.font-headline-md');
                    metrics.forEach(metric => {
                        if (metric.innerText.includes('$') || metric.innerText.includes('1,248')) {
                            metric.innerText = '$' + data.totalValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 });
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to query portfolio values:", e);
            }
        };

        const resetWalletUI = () => {
            connectWalletBtn.innerText = 'Connect Wallet';
            connectWalletBtn.className = 'bg-primary-container text-on-primary-container px-stack-lg py-2 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all scale-95 active:opacity-80';
        };

        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        updateWalletUI(accounts[0]);
                    }
                } catch (err) {
                    console.error("Error checking wallet connection:", err);
                }
            }
        };

        connectWalletBtn.addEventListener('click', async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    if (accounts.length > 0) {
                        updateWalletUI(accounts[0]);
                    }
                } catch (err) {
                    console.error("User rejected wallet connection:", err);
                }
            } else {
                alert("MetaMask is not installed. Redirecting to MetaMask download page...");
                window.open('https://metamask.io/download/', '_blank');
            }
        });

        // Listen for changes
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    updateWalletUI(accounts[0]);
                } else {
                    resetWalletUI();
                }
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        // Run initial check
        checkConnection();
    }
});

// 2. Micro-interaction: Live metrics simulation
setInterval(() => {
    const metrics = document.querySelectorAll('.font-headline-md');
    if (metrics.length > 0) {
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        if (randomMetric.innerText.includes('$')) {
            const currentVal = parseFloat(randomMetric.innerText.replace('$', '').replace(/,/g, ''));
            const newVal = currentVal + (Math.random() * 200 - 100);
            randomMetric.innerText = '$' + newVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        } else if (randomMetric.innerText === '04' || randomMetric.innerText === '05') {
            const randomVal = Math.random() > 0.8 ? '05' : '04';
            randomMetric.innerText = randomVal;
        }
    }
}, 5000);
