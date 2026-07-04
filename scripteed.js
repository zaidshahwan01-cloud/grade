const CORRECT_PASSWORD = "Grad2026";
const bgMusic = document.getElementById('bg-music');

// استخدام حدث إلكتروني متقدم لربط الضغط بتشغيل الصوت فوراً (إلزام للمتصفحات)
document.getElementById('unlock-btn').addEventListener('click', function() {
    checkPassword();
});

function checkPassword() {
    const input = document.getElementById('password-input').value;
    const error = document.getElementById('error-message');
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.getElementById('main-content');

    if (input === CORRECT_PASSWORD) {
        
        // تشغيل الموسيقى فوراً هنا لأن المتصفح يعتبر ضغط الزر إذناً رسمياً
        bgMusic.play().catch(err => {
            console.log("فشل تشغيل الصوت، تأكد من صحة رابط الـ MP3 في ملف الـ HTML");
        });

        lockScreen.style.transform = 'scale(0.9)';
        lockScreen.style.opacity = '0';
        
        setTimeout(() => {
            lockScreen.style.display = 'none';
            mainContent.style.display = 'block';
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 100);
            
            createHats();
            loadGallery();
            loadMessages();
        }, 800);

    } else {
        error.style.display = 'block';
    }
}

function toggleMusic() {
    const btn = document.getElementById('music-toggle');
    if (bgMusic.paused) {
        bgMusic.play();
        btn.innerText = "🎵 إيقاف الموسيقى";
    } else {
        bgMusic.pause();
        btn.innerText = "🎵 تشغيل الموسيقى";
    }
}

function createHats() {
    const header = document.getElementById('header');
    for (let i = 0; i < 25; i++) {
        const hat = document.createElement('div');
        hat.classList.add('hat-confetti');
        hat.innerText = '🎓';
        hat.style.left = Math.random() * 100 + 'vw';
        hat.style.animationDuration = (Math.random() * 3 + 3) + 's';
        hat.style.fontSize = Math.random() * 15 + 15 + 'px';
        header.appendChild(hat);
        setTimeout(() => { hat.remove(); }, 5000);
    }
}

/* --- إدارة المعرض (LocalStorage) --- */
function uploadImage() {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let images = JSON.parse(localStorage.getItem('grad_luxury_images')) || [];
            images.push(e.target.result);
            localStorage.setItem('grad_luxury_images', JSON.stringify(images));
            loadGallery();
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    }
}

function loadGallery() {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';
    let images = JSON.parse(localStorage.getItem('grad_luxury_images')) || [];
    if(images.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted);">لم يتم رفع وثائق بصرية حتى الآن.</p>`;
        return;
    }
    images.forEach((imgSrc, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <img src="${imgSrc}" alt="توثيق التخرج">
            <button class="delete-btn" onclick="deleteImage(${index})">×</button>
        `;
        container.appendChild(item);
    });
}

function deleteImage(index) {
    let images = JSON.parse(localStorage.getItem('grad_luxury_images')) || [];
    images.splice(index, 1);
    localStorage.setItem('grad_luxury_images', JSON.stringify(images));
    loadGallery();
}

/* --- إدارة سجل التهاني (LocalStorage) --- */
function addMessage() {
    const nameInput = document.getElementById('sender-name');
    const textInput = document.getElementById('message-text');
    if (nameInput.value.trim() === '' || textInput.value.trim() === '') {
        alert('يرجى ملء الحقول الرسمية لتثبيت الكلمة بالرمز المعتمد.');
        return;
    }
    const newMessage = { sender: nameInput.value, text: textInput.value };
    let messages = JSON.parse(localStorage.getItem('grad_luxury_messages')) || [];
    messages.push(newMessage);
    localStorage.setItem('grad_luxury_messages', JSON.stringify(messages));
    nameInput.value = ''; textInput.value = '';
    loadMessages();
}

function loadMessages() {
    const container = document.getElementById('messages-container');
    container.innerHTML = '';
    let messages = JSON.parse(localStorage.getItem('grad_luxury_messages')) || [];
    if(messages.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted);">السجل خالٍ من الرسائل حالياً.</p>`;
        return;
    }
    messages.forEach((msg, index) => {
        const card = document.createElement('div');
        card.classList.add('message-card');
        card.innerHTML = `
            <h4>${msg.sender}</h4>
            <p>${msg.text}</p>
            <button class="delete-btn" onclick="deleteMessage(${index})">×</button>
        `;
        container.appendChild(card);
    });
}

function deleteMessage(index) {
    let messages = JSON.parse(localStorage.getItem('grad_luxury_messages')) || [];
    messages.splice(index, 1);
    localStorage.setItem('grad_luxury_messages', JSON.stringify(messages));
    loadMessages();
}