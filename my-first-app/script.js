// 等待DOM加载完成
 document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHistory = document.getElementById('chatHistory');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingText = document.getElementById('breathingText');
    const moodBtns = document.querySelectorAll('.mood-btn');
    const moodHistory = document.getElementById('moodHistory');
    const mindfulnessReminder = document.getElementById('mindfulnessReminder');
    const closeReminder = document.getElementById('closeReminder');
    const reminderBtn = document.querySelector('.reminder-btn');
    const thinkingIndicator = document.getElementById('thinkingIndicator');

    // 预设的心理咨询师回复
    const responses = {
        anxiety: [
            "我理解您现在感到焦虑，这是很正常的情绪反应。让我们一起做个深呼吸练习，慢慢地吸气...保持...然后缓缓呼出...",
            "焦虑就像一个不速之客，但它也在提醒我们关注自己的状态。您愿意多和我分享一些具体的感受吗？",
            "当焦虑来临时，试着将注意力集中在当下的呼吸上，让我们一起感受空气进入和离开身体的感觉..."
        ],
        sadness: [
            "感到低落是很正常的，情绪就像天气一样会有阴晴变化。您愿意和我聊聊是什么让您有这种感受吗？",
            "低落的情绪也是在告诉我们，或许需要给自己一些时间和空间去照顾自己了。您最近有做一些让自己开心的事情吗？",
            "我能感受到您此刻的沉重，这一定不容易。请记住，这种感觉不会永远持续下去。"
        ],
        stress: [
            "听起来您最近承受了很多压力，感到疲惫是身体在提醒我们需要休息了。您最近有好好照顾自己吗？",
            "压力就像肩上的重担，我们需要找到适合自己的方式来释放它。您平时有什么减压的好方法吗？",
            "面对压力，我们可以尝试将任务分解成小步骤，一步一步来。您愿意和我一起梳理一下当前的状况吗？"
        ],
        loneliness: [
            "感到孤独是一种很深刻的情绪体验，我想让您知道，此刻我在这里陪伴着您，您并不是一个人...",
            "孤独有时会让我们感到与世界隔绝，但它也给了我们一个了解自己的机会。您愿意和我分享您内心的感受吗？",
            "孤独并不可怕，重要的是我们如何与它相处。让我们一起寻找一些温暖的方式来陪伴自己。"
        ],
        general: [
            "感谢您的分享，我能感受到您的真诚。每一种情绪都是有意义的，它们在向我们传递重要的信息。",
            "您的感受很重要，无论是什么样的情绪，都值得被接纳和理解。",
            "我在这里认真倾听，您可以畅所欲言，不用担心被评判。",
            "有时候，把内心的感受说出来本身就是一种疗愈。继续分享吧，我一直在这儿。"
        ]
    };

    // 加载情绪历史
    let moodData = JSON.parse(localStorage.getItem('moodData')) || {};
    
    // 初始化情绪历史图表
    function initMoodHistory() {
        const days = [];
        const today = new Date();
        
        // 获取最近7天的日期
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push(dateStr);
        }
        
        // 清空情绪历史
        moodHistory.innerHTML = '';
        
        // 添加每一天的情绪
        days.forEach(date => {
            const dayEl = document.createElement('div');
            dayEl.className = 'mood-day';
            
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString('zh-CN', { weekday: 'short' });
            
            dayEl.innerHTML = `
                <span class="mood-day-label">${dayName}</span>
                <span class="mood-day-value">${moodData[date] || '—'}</span>
            `;
            
            moodHistory.appendChild(dayEl);
        });
    }

    // 发送消息
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // 添加用户消息到聊天历史
            addMessageToHistory(message, 'user');
            
            // 清空输入框
            userInput.value = '';
            
            // 显示思考中提示
            thinkingIndicator.style.display = 'block';
            
            // 模拟思考延迟
            setTimeout(() => {
                // 隐藏思考中提示
                thinkingIndicator.style.display = 'none';
                
                // 生成回复
                const response = generateResponse(message);
                
                // 添加回复到聊天历史，带打字机效果
                addResponseWithTypingEffect(response);
            }, 1500);
        }
    }

    // 添加消息到聊天历史
    function addMessageToHistory(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message fade-in`;
        messageEl.innerHTML = `<div class="message-content"><p>${message}</p></div>`;
        
        chatHistory.appendChild(messageEl);
        
        // 滚动到底部
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // 添加带打字机效果的回复
    function addResponseWithTypingEffect(response) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message bot-message fade-in';
        messageEl.innerHTML = '<div class="message-content"><p></p></div>';
        
        chatHistory.appendChild(messageEl);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        const textEl = messageEl.querySelector('p');
        let index = 0;
        
        function typeNextChar() {
            if (index < response.length) {
                textEl.textContent += response.charAt(index);
                index++;
                setTimeout(typeNextChar, 30); // 打字速度
            }
        }
        
        typeNextChar();
    }

    // 生成回复
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('焦虑') || lowerMessage.includes('紧张') || lowerMessage.includes('担心')) {
            return getRandomResponse('anxiety');
        } else if (lowerMessage.includes('低落') || lowerMessage.includes('难过') || lowerMessage.includes('伤心')) {
            return getRandomResponse('sadness');
        } else if (lowerMessage.includes('压力') || lowerMessage.includes('累') || lowerMessage.includes('疲惫')) {
            return getRandomResponse('stress');
        } else if (lowerMessage.includes('孤独') || lowerMessage.includes('寂寞') || lowerMessage.includes('没人理解')) {
            return getRandomResponse('loneliness');
        } else {
            return getRandomResponse('general');
        }
    }

    // 获取随机回复
    function getRandomResponse(type) {
        const responsesOfType = responses[type];
        const randomIndex = Math.floor(Math.random() * responsesOfType.length);
        return responsesOfType[randomIndex];
    }

    // 呼吸练习功能
    let breathingActive = false;
    let breathingInterval;
    
    function startBreathingExercise() {
        if (breathingActive) {
            stopBreathingExercise();
            return;
        }
        
        breathingActive = true;
        breathingCircle.classList.add('breathing-animation');
        
        let phase = 0; // 0: 吸气, 1: 屏息, 2: 呼气
        let phaseTime = 0;
        
        // 4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒
        const phases = [
            { text: '吸气', duration: 4000 },
            { text: '屏息', duration: 7000 },
            { text: '呼气', duration: 8000 }
        ];
        
        breathingText.textContent = phases[phase].text;
        
        breathingInterval = setInterval(() => {
            phaseTime += 1000;
            
            if (phaseTime >= phases[phase].duration) {
                phaseTime = 0;
                phase = (phase + 1) % 3;
                breathingText.textContent = phases[phase].text;
            }
        }, 1000);
    }
    
    function stopBreathingExercise() {
        breathingActive = false;
        breathingCircle.classList.remove('breathing-animation');
        breathingText.textContent = '点击开始';
        clearInterval(breathingInterval);
    }

    // 记录情绪
    function recordMood(mood) {
        const today = new Date().toISOString().split('T')[0];
        moodData[today] = mood;
        localStorage.setItem('moodData', JSON.stringify(moodData));
        
        // 更新情绪历史显示
        initMoodHistory();
        
        // 显示简短反馈
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'message bot-message fade-in';
        feedbackEl.innerHTML = `<div class="message-content"><p>我已记录下您今天的情绪状态，感谢您的分享。</p></div>`;
        
        chatHistory.appendChild(feedbackEl);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // 显示正念提醒
    function showMindfulnessReminder() {
        mindfulnessReminder.style.display = 'block';
    }

    // 关闭正念提醒
    function hideMindfulnessReminder() {
        mindfulnessReminder.style.display = 'none';
    }

    // 设置正念提醒定时器（30分钟一次）
    let reminderInterval = setInterval(showMindfulnessReminder, 30 * 60 * 1000);

    // 事件监听器
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userInput.value = this.getAttribute('data-text');
            userInput.focus();
        });
    });
    
    breathingCircle.addEventListener('click', startBreathingExercise);
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            recordMood(mood);
        });
    });
    
    closeReminder.addEventListener('click', hideMindfulnessReminder);
    
    reminderBtn.addEventListener('click', hideMindfulnessReminder);
    
    // 点击空白处关闭提醒
    mindfulnessReminder.addEventListener('click', function(e) {
        if (e.target === this) {
            hideMindfulnessReminder();
        }
    });

    // 初始化情绪历史
    initMoodHistory();

    // 添加欢迎消息的打字机效果
    setTimeout(() => {
        const welcomeMessage = document.querySelector('.chat-history .message p');
        const originalText = welcomeMessage.textContent;
        welcomeMessage.textContent = '';
        
        let index = 0;
        function typeWelcome() {
            if (index < originalText.length) {
                welcomeMessage.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWelcome, 50);
            }
        }
        
        typeWelcome();
    }, 500);
});