// 存储签诗数据
let fortuneData = [];

// 异步加载签诗数据
async function loadFortuneData() {
    try {
        const response = await fetch('签诗.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fortuneData = await response.json();
        console.log('签诗数据加载成功');
        console.log('签诗数据:', fortuneData);
    } catch (error) {
        console.error('加载签诗数据失败:', error);
        // 可选：在此处向用户显示错误信息
        const fortuneResultDiv = document.getElementById('fortune-result');
        fortuneResultDiv.innerHTML = '<p class="error">加载签诗数据失败，请稍后重试。</p>';
        fortuneResultDiv.style.display = 'block';
    }
}

// 初始化虚拟掷杯界面
let throwCount = 0;
const throwResults = [];

// 模拟掷杯结果
function simulateThrow() {
    const outcomes = ['圣杯', '笑杯', '阴杯']; // 圣杯: 一正一反, 笑杯: 两平面, 阴杯: 两凸面
    // 实际概率可能不同，这里简化处理
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    return outcomes[randomIndex];
}

// 显示签诗
function displayFortune(fortune) {
    const fortuneResultDiv = document.getElementById('fortune-result');
    if (fortune) {
        fortuneResultDiv.innerHTML = `
            <h2>${fortune['签诗名称']}</h2>
            <p>${fortune['原签诗']}</p>
            <h3>解签：</h3>
            <p>${fortune['核心解读']}</p>
            <h3>运势解析：</h3>
            <p>${fortune['运势维度解释']}</p>
            <h3>有利时辰/方位：</h3>
            <p>${fortune['有利时辰']} ${fortune['方位指引']}</p>
        `;
    } else {
        fortuneResultDiv.innerHTML = '<p class="error">未能求得签诗，请稍后再试。</p>';
    }
    fortuneResultDiv.style.display = 'block'; // 显示结果区域
}

// 处理掷杯逻辑
async function handleThrow() {
    console.log('handleThrow 被触发');
    if (!fortuneData || fortuneData.length === 0) {
        alert('签诗数据尚未加载，请稍后再试。');
        return;
    }
    const button = document.getElementById('throw-button');
    const animationArea = document.querySelector('.animation-area');
    const fortuneResultDiv = document.getElementById('fortune-result');

    button.disabled = true; // 禁用按钮防止重复点击
    fortuneResultDiv.style.display = 'none'; // 隐藏旧结果
    animationArea.innerHTML = ''; // 清空动画区域

    // 创建动画容器
    const ritualElement = document.createElement('div');
    ritualElement.classList.add('ritual-animation');
    animationArea.appendChild(ritualElement);

    // 第一次掷杯前显示仪式动画
    if (throwCount === 0) {
        // 净手动画
        ritualElement.classList.add('hand-wash');
        await anime({
            targets: ritualElement,
            translateY: [0, -20, 0],
            rotate: [0, 15, 0],
            duration: 1500,
            easing: 'easeInOutSine',
            loop: 3
        }).finished;
        ritualElement.classList.remove('hand-wash');

        // 绕香炉动画
        ritualElement.classList.add('incense-circle');
        await anime({
            targets: ritualElement,
            rotate: [0, 360],
            duration: 2000,
            easing: 'linear'
        }).finished;
        ritualElement.classList.remove('incense-circle');
    }

    // 显示掷杯动画
    ritualElement.classList.add('cup-throw');
    // 模拟抛掷和掉落效果
    await anime({
        targets: ritualElement,
        translateY: [0, 100], // 从初始位置向下移动
        rotate: '3turn', // 旋转3圈
        scale: [1, 0.8, 1], // 添加一点缩放模拟撞击
        duration: 1200,
        easing: 'cubicBezier(.17,.67,.83,.67)' // 模拟物理下落和反弹感
    }).finished;
    ritualElement.classList.remove('cup-throw');
    animationArea.innerHTML = '';

    // 获取并显示掷杯结果
    const result = simulateThrow();
    throwResults[throwCount] = result;
    document.getElementById(`throw-${throwCount + 1}-result`).textContent = `第${throwCount + 1}次: ${result}`;
    throwCount++;

    // 判断是否完成三次掷杯
    if (throwCount < 3) {
        button.textContent = `继续第 ${throwCount + 1} 次掷杯`;
        button.disabled = false;
    } else {
        // 三次掷杯完成，组合结果并查找签诗
        const combination = throwResults.map(r => r.charAt(0)).join('');
        console.log(`掷杯结果组合: ${combination}`);
        try {
            const fortune = findFortuneByCombination(combination);
            displayFortune(fortune);
        } catch (error) {
            console.error('查找签诗失败:', error);
            displayFortune(null);
        }
        button.textContent = '重新掷杯';
        button.disabled = false;
        throwCount = 0;
        throwResults.length = 0;
        // 可选：延迟清除掷杯结果显示
        // setTimeout(() => {
        //     document.getElementById('throw-1-result').textContent = '第一次: -';
        //     document.getElementById('throw-2-result').textContent = '第二次: -';
        //     document.getElementById('throw-3-result').textContent = '第三次: -';
        // }, 3000);
    }
}

// 初始化掷杯功能
function initDivination() {
    const button = document.getElementById('throw-button');
    if (button) {
        button.addEventListener('click', handleThrow);
        console.log('事件监听器已添加到掷杯按钮');
    } else {
        console.error('未找到掷杯按钮元素');
    }

    // 初始化时隐藏结果区域
    const fortuneResultDiv = document.getElementById('fortune-result');
    if (fortuneResultDiv) {
        fortuneResultDiv.style.display = 'none';
    }

    // 加载签诗数据
    loadFortuneData();
}

// 根据掷杯组合查找签诗
function findFortuneByCombination(combination) {
    if (fortuneData.length === 0) {
        console.error('签诗数据未加载或为空');
        throw new Error('签诗数据不可用');
    }

    // 将中文杯型映射到签诗名称中的关键字
    const combinationMap = {
        '圣圣圣': '圣圣圣',
        '圣圣笑': '圣圣笑',
        '圣圣阴': '圣圣阴',
        '圣笑圣': '圣笑圣', // 可能需要根据实际规则调整
        '圣笑笑': '圣笑笑',
        '圣笑阴': '圣笑阴',
        '圣阴圣': '圣阴圣', // 可能需要根据实际规则调整
        '圣阴笑': '圣阴笑',
        '圣阴阴': '圣阴阴',
        '笑圣圣': '笑圣圣', // 可能需要根据实际规则调整
        '笑圣笑': '笑圣笑',
        '笑圣阴': '笑圣阴',
        '笑笑圣': '笑笑圣',
        '笑笑笑': '笑笑笑',
        '笑笑阴': '笑笑阴',
        '笑阴圣': '笑阴圣',
        '笑阴笑': '笑阴笑',
        '笑阴阴': '笑阴阴',
        '阴圣圣': '阴圣圣',
        '阴圣笑': '阴圣笑',
        '阴圣阴': '阴圣阴',
        '阴笑圣': '阴笑圣',
        '阴笑笑': '阴笑笑',
        '阴笑阴': '阴笑阴',
        '阴阴圣': '阴阴圣',
        '阴阴笑': '阴阴笑',
        '阴阴阴': '阴阴阴' // 假设全阴对应特定签
        // 注意：实际的对应关系可能更复杂，这里是基于签诗名称的简化假设
        // 可能还需要处理“竖杯”等特殊情况，如果签诗数据中有的话
    };

    const searchKey = combinationMap[combination];
    if (!searchKey) {
        console.log(`未找到组合 ${combination} 的映射`);
        return null; // 没有对应的签诗类型
    }

    console.log(`查找关键字: ${searchKey}`); // 调试信息

    const foundFortune = fortuneData.find(fortune => 
        fortune['签诗名称'] && fortune['签诗名称'].startsWith(searchKey)
    );

    if (!foundFortune) {
        console.log(`未找到以 ${searchKey} 开头的签诗`);
    }

    return foundFortune || null; // 返回找到的签诗或null
}

// 页面加载完成后初始化
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadFortuneData(); // 先加载数据
    initDivination(); // 再初始化界面和事件监听
});