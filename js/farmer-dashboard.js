// market prices used for trend checker
const MARKET_PRICES = {
    wheat: 26,
    rice: 55,
    tomato: 40,
    potato: 22,
    onion: 25,
    soybean: 62
};

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "farmer") {
    window.location.href = "login.html";
}

document.getElementById("welcomeName").innerText =
    `Welcome, ${currentUser.name}!`;

// --- FIXED: PRICE TRACKER LOGIC ---
function trackPrice() {
    const query = document.getElementById('priceSearch').value.trim().toLowerCase();
    const resultBox = document.getElementById('priceResult');
    const valDisplay = document.getElementById('trendVal');

    if (!query) return alert("Enter a crop name to track.");

    // Get stable price or generic fallback
    const price = MARKET_PRICES[query] || 42;
    valDisplay.innerText = `₹${price}/Kg`;

    resultBox.classList.remove('hidden');
    resultBox.classList.add('animate-pulse');
    setTimeout(() => resultBox.classList.remove('animate-pulse'), 1000);
}

    async function fastAIAnalyze(input) {

    const status = document.getElementById("aiStatus");
    const preview = document.getElementById("previewImg");
    const label = document.getElementById("uploadLabel");
    const line = document.getElementById("scannerLine");
    const btn = document.getElementById("postBtn");

    const API_KEY = "PASTE_YOUR_GEMINI_API_KEY";

    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = async function (e) {

        const base64Image = e.target.result.split(",")[1];

        preview.src = e.target.result;
        preview.classList.remove("hidden");

        label.classList.add("hidden");
        line.classList.remove("hidden");

        status.innerHTML =
        `<span class="text-blue-500 italic">Analyzing crop with AI...</span>`;

        try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                {
                    parts: [
                    {
                        text:
                        "Look at this image and identify the crop. Respond with ONLY ONE WORD like wheat, rice, tomato, potato, onion or soybean."
                    },
                    {
                        inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Image
                        }
                    }
                    ]
                }
                ]
            })
            }
        );

        const data = await response.json();

        console.log("Gemini Response:", data);

        line.classList.add("hidden");

        if (!data.candidates || data.candidates.length === 0) {

            status.innerHTML =
            `<span class="text-red-500 font-bold">AI could not detect crop</span>`;

            return;
        }

        let cropDetected =
            data.candidates[0].content.parts[0].text
            .toLowerCase();

        cropDetected = cropDetected.replace(/[^a-z]/g, "").trim();

        if (cropDetected.includes("wheat")) cropDetected = "wheat";
        if (cropDetected.includes("rice")) cropDetected = "rice";
        if (cropDetected.includes("tomato")) cropDetected = "tomato";
        if (cropDetected.includes("potato")) cropDetected = "potato";
        if (cropDetected.includes("onion")) cropDetected = "onion";
        if (cropDetected.includes("soy")) cropDetected = "soybean";

        const cropName =
            cropDetected.charAt(0).toUpperCase() +
            cropDetected.slice(1);

        document.getElementById("cropName").value = cropName;

        const price = MARKET_PRICES[cropDetected] || 45;

        document.getElementById("cropPrice").value = price;

        status.innerHTML =
            `<span class="text-green-600 font-bold">✅ AI Detected: ${cropName}</span>`;

        btn.disabled = false;

        btn.classList.remove(
            "opacity-20",
            "cursor-not-allowed"
        );

        } catch (error) {

        console.error(error);

        line.classList.add("hidden");

        status.innerHTML =
            `<span class="text-red-500 font-bold">AI detection failed</span>`;

        }

    };

    reader.readAsDataURL(file);

    }

// --- MESSAGES / NOTIFICATIONS ---
function checkNewMessages() {
    const messages = JSON.parse(localStorage.getItem('cropBoomMessages')) || [];
    const myUnread = messages.filter(m => m.to === currentUser.email && !m.read);
    const badge = document.getElementById('msgCount');
    if (myUnread.length > 0) {
        badge.innerText = myUnread.length;
        badge.classList.remove('hidden');
    } else { badge.classList.add('hidden'); }
}

function toggleMessagePanel() {
    const panel = document.getElementById('messagePanel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) renderInquiries();
}

function renderInquiries() {
    const messages = JSON.parse(localStorage.getItem('cropBoomMessages')) || [];
    const list = document.getElementById('inquiryList');
    const myInquiries = messages.filter(m => m.to === currentUser.email);
    if (myInquiries.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-400 text-xs py-4">No inquiries yet.</p>';
        return;
    }
    list.innerHTML = myInquiries.reverse().map(m => `
                <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 ${m.read ? 'opacity-60' : 'border-l-4 border-l-green-500'}">
                    <p class="text-[9px] font-black text-blue-600 uppercase tracking-tighter">From: ${m.from}</p>
                    <p class="text-xs text-gray-700 font-medium leading-tight mt-1">${m.text}</p>
                    ${!m.read ? `<button onclick="markAsRead('${m.time}')" class="text-[9px] text-green-600 font-black mt-2 uppercase underline">Read</button>` : ''}
                </div>
            `).join('');
}

function markAsRead(time) {
    let messages = JSON.parse(localStorage.getItem('cropBoomMessages')) || [];
    messages = messages.map(m => m.time === time ? { ...m, read: true } : m);
    localStorage.setItem('cropBoomMessages', JSON.stringify(messages));
    checkNewMessages(); renderInquiries();
}

// --- CRUD & STATS ---
function loadData() {
    const crops = JSON.parse(localStorage.getItem('cropBoomItems')) || [];
    const myCrops = crops.filter(c => c.farmerEmail === currentUser.email);
    document.getElementById('cropTableBody').innerHTML = myCrops.map(c => `
                <tr class="hover:bg-gray-50"><td class="p-6 font-bold text-gray-700 uppercase text-xs">${c.name}</td>
                <td class="p-6 text-green-600 font-black">₹${c.price}</td><td class="p-6 font-bold text-gray-500">${c.qty} Kg</td>
                <td class="p-6 text-center"><button onclick="deleteCrop('${c.id}')" class="text-red-300 hover:text-red-600"><i class="fas fa-trash"></i></button></td></tr>`).join('');
    document.getElementById('statTotalCrops').innerText = myCrops.length;

    const orders = JSON.parse(localStorage.getItem('cropBoomBookings')) || [];
    const myOrders = orders.filter(o => o.farmerEmail === currentUser.email);
    document.getElementById('bookingTableBody').innerHTML = myOrders.map(o => `
                <tr class="hover:bg-gray-50 border-b"><td class="p-6 font-bold text-xs">${o.buyerName}</td>
                <td class="p-6 font-medium text-xs">${o.cropName} (${o.quantity}Kg)</td><td class="p-6 font-black text-green-600">₹${o.totalPrice}</td>
                <td class="p-6"><span class="px-3 py-1 rounded-full text-[9px] font-black ${o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}">${o.status}</span></td>
                <td class="p-6 text-center">${o.status === 'Pending' ? `<button onclick="confirmDelivery('${o.orderId}')" class="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black">Deliver</button>` : `<i class="fas fa-check-circle text-green-500"></i>`}</td></tr>`).join('');
    document.getElementById('statActiveOrders').innerText = myOrders.filter(o => o.status === 'Pending').length;
    document.getElementById('statRevenue').innerText = `₹` + myOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + Number(o.totalPrice), 0);
    document.getElementById('emptyBookings').style.display = myOrders.length > 0 ? 'none' : 'block';
}

document.getElementById('addCropForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const all = JSON.parse(localStorage.getItem('cropBoomItems')) || [];
    all.push({
        id: Date.now().toString(), name: document.getElementById('cropName').value, price: document.getElementById('cropPrice').value,
        qty: document.getElementById('cropQty').value, location: document.getElementById('cropLoc').value, farmerEmail: currentUser.email
    });
    localStorage.setItem('cropBoomItems', JSON.stringify(all));
    location.reload();
});

function confirmDelivery(id) {
    let all = JSON.parse(localStorage.getItem('cropBoomBookings')) || [];
    const i = all.findIndex(b => b.orderId === id);
    if (i !== -1) { all[i].status = 'Delivered'; localStorage.setItem('cropBoomBookings', JSON.stringify(all)); loadData(); }
}

function deleteCrop(id) {
    let all = JSON.parse(localStorage.getItem('cropBoomItems')) || [];
    localStorage.setItem('cropBoomItems', JSON.stringify(all.filter(c => c.id !== id))); loadData();
}

function showAddModal() { document.getElementById('cropModal').classList.remove('hidden'); }
function hideAddModal() { document.getElementById('cropModal').classList.add('hidden'); }
function logout() { localStorage.removeItem('currentUser'); window.location.href = 'login.html'; }

setInterval(checkNewMessages, 3000);
loadData();
checkNewMessages();