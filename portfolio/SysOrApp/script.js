document.addEventListener('DOMContentLoaded', () => {

    const softwareData = [
        { name: 'Windows 11', type: 'System Software' },
        { name: 'Linux', type: 'System Software' },
        { name: 'macOS', type: 'System Software' },
        { name: 'Android', type: 'System Software' },
        { name: 'iOS', type: 'System Software' },
        { name: 'Ubuntu', type: 'System Software' },
        { name: 'FreeBSD', type: 'System Software' },
        { name: 'Windows Server', type: 'System Software' },
        { name: 'Chrome OS', type: 'System Software' },
        { name: 'Debian', type: 'System Software' },
        { name: 'Kali Linux', type: 'System Software' },
        { name: 'DOS', type: 'System Software' },
        { name: 'VMware ESXi', type: 'System Software' },
        { name: 'Hyper-V', type: 'System Software' },
        { name: 'VirtualBox', type: 'System Software' },
        { name: 'UEFI', type: 'System Software' },
        { name: 'GRUB', type: 'System Software' },
        { name: 'File Explorer', type: 'System Software' },
        { name: 'Task Manager', type: 'System Software' },
        { name: 'Systemd', type: 'System Software' },
        { name: 'Android Kernel', type: 'System Software' },
        { name: 'Windows Defender', type: 'System Software' },
        { name: 'AppArmor', type: 'System Software' },
        { name: 'Device Drivers', type: 'System Software' },
        { name: 'OpenWRT', type: 'System Software' },
        { name: 'BIOS', type: 'System Software' },
        { name: 'Fedora', type: 'System Software' },
        { name: 'Unix', type: 'System Software' },

        { name: 'Photoshop', type: 'Application Software' },
        { name: 'Microsoft Word', type: 'Application Software' },
        { name: 'Google Chrome', type: 'Application Software' },
        { name: 'Firefox', type: 'Application Software' },
        { name: 'Opera', type: 'Application Software' },
        { name: 'Microsoft Excel', type: 'Application Software' },
        { name: 'Microsoft PowerPoint', type: 'Application Software' },
        { name: 'Notepad++', type: 'Application Software' },
        { name: 'Visual Studio Code', type: 'Application Software' },
        { name: 'JetBrains IntelliJ IDEA', type: 'Application Software' },
        { name: 'PyCharm', type: 'Application Software' },
        { name: 'Blender', type: 'Application Software' },
        { name: 'AutoCAD', type: 'Application Software' },
        { name: 'Adobe Illustrator', type: 'Application Software' },
        { name: 'Adobe Premiere Pro', type: 'Application Software' },
        { name: 'DaVinci Resolve', type: 'Application Software' },
        { name: 'Spotify', type: 'Application Software' },
        { name: 'VLC Media Player', type: 'Application Software' },
        { name: 'Zoom', type: 'Application Software' },
        { name: 'Discord', type: 'Application Software' },
        { name: 'Telegram Desktop', type: 'Application Software' },
        { name: 'WhatsApp Desktop', type: 'Application Software' },
        { name: 'Steam', type: 'Application Software' },
        { name: 'Adobe Acrobat Reader', type: 'Application Software' },
        { name: '7-Zip', type: 'Application Software' },
        { name: 'WinRAR', type: 'Application Software' },
        { name: 'Figma', type: 'Application Software' },
    ];

    // --- ЭЛЕМЕНТЫ DOM ---
    const learnContainer = document.getElementById('card-container');
    const randomBtn = document.getElementById('random-btn');
    const startTestBtn = document.getElementById('start-test-btn');
    const testArea = document.getElementById('test-area');
    const sourceCardsContainer = document.getElementById('source-cards');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkBtn = document.getElementById('check-btn');
    const retryBtn = document.getElementById('retry-btn');
    const backBtn = document.getElementById('back-btn');
    const resultsContainer = document.getElementById('results');
    const timerElement = document.getElementById('timer');
    let timerInterval;
    let totalSeconds = 0;
    let hintCount = 0;

    /**
     * Создаем начальный набор переворачиваемых карточек для обучения
     */
    function createLearningCards() {
        const shuffledData = [...softwareData].sort(() => Math.random() - 0.5);
        shuffledData.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-face card-front"><button class="learn-btn">✔</button>${item.name}</div>
                <div class="card-face card-back"><h3>${item.type}</h3></div>
            `;

            const learnBtn = card.querySelector('.learn-btn');

            learnBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                card.classList.toggle('learned');
                setTimeout(() => card.remove(), 500);
            });

            card.addEventListener('click', () => card.classList.toggle('is-flipped'));
            learnContainer.appendChild(card);
        });
    }

    /**
     * Перемешиваем набор карточек в случайном порядке
     */
    function shuffleLearningCards() {
        const cards = Array.from(learnContainer.children);
        const fragment = document.createDocumentFragment();

        cards.sort(() => Math.random() - 0.5);

        cards.forEach(card => fragment.appendChild(card));

        learnContainer.innerHTML = "";
        learnContainer.appendChild(fragment);
    }

    function startTimer() {
        totalSeconds = 0;
        timerElement.textContent = 'Timer: 00:00';
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            totalSeconds++;
            const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            document.getElementById('timer').textContent = `Timer: ${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }


    function initializeTest() {
        hintCount = 0;
        // Скрыть область обучения и показать область теста
        learnContainer.classList.add('hidden');
        randomBtn.classList.add('hidden');
        startTestBtn.classList.add('hidden');
        testArea.classList.remove('hidden');

        // Сбросить предыдущее состояние теста
        sourceCardsContainer.innerHTML = '';
        resultsContainer.innerHTML = '';
        checkBtn.classList.add('hidden');
        dropZones.forEach(zone => {
            zone.innerHTML = `<h3>${zone.dataset.type}</h3>`; // Сбросить содержимое, но сохранить заголовок
        });

        // Создать перетаскиваемые карточки
        const shuffledData = [...softwareData].sort(() => Math.random() - 0.5);
        const testData = shuffledData.slice(0, 20);

        testData.forEach((item, index) => {
            const card = document.createElement('div');
            card.id = `card-${index}`;
            card.classList.add('card'); // Повторное использование стиля .card, но он будет вести себя по-другому
            card.draggable = true;
            card.textContent = item.name;
            card.dataset.type = item.type;
            sourceCardsContainer.appendChild(card);

            const hintBtn = document.createElement('button');
            hintBtn.textContent = '?';
            hintBtn.classList.add('hint-btn');
            hintBtn.style.position = 'absolute';
            hintBtn.style.top = '5px';
            hintBtn.style.right = '5px';
            hintBtn.style.cursor = 'pointer';
            card.style.position = 'relative';
            card.appendChild(hintBtn);

            hintBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hintCount++;

                // Создаем tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = `${item.type}`;
                card.appendChild(tooltip);

                tooltip.style.top = `${hintBtn.offsetTop - 30}px`;
                tooltip.style.left = `${hintBtn.offsetLeft}px`;

                setTimeout(() => tooltip.classList.add('show'), 10);

                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => tooltip.remove(), 300);
                }, 3000);
            });
        });

        addDragAndDropListeners();
        startTimer();
        backBtn.classList.remove('hidden');
    }

    /**
     * Перезапускаем тест
     */
    function resetTest() {
        stopTimer();
        // Очистка зон и исходных карточек
        sourceCardsContainer.innerHTML = '';
        resultsContainer.innerHTML = '';
        dropZones.forEach(zone => {
            zone.innerHTML = `<h3>${zone.dataset.type}</h3>`;
        });

        const shuffledData = [...softwareData].sort(() => Math.random() - 0.5).slice(0, 20);
        shuffledData.forEach((item, index) => {
            const card = document.createElement('div');
            card.id = `card-${index}`;
            card.classList.add('card');
            card.draggable = true;
            card.textContent = true;
            card.textContent = item.name;
            card.dataset.type = item.type;
            sourceCardsContainer.appendChild(card);

            const hintBtn = document.createElement('button');
            hintBtn.textContent = '?';
            hintBtn.classList.add('hint-btn');
            hintBtn.style.position = 'absolute';
            hintBtn.style.top = '5px';
            hintBtn.style.right = '5px';
            hintBtn.style.cursor = 'pointer';
            card.style.position = 'relative';
            card.appendChild(hintBtn);

            hintBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hintCount++;

                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = `${item.type}`;
                card.appendChild(tooltip);

                tooltip.style.top = `${hintBtn.offsetTop - 30}px`;
                tooltip.style.left = `${hintBtn.offsetLeft}px`;

                setTimeout(() => tooltip.classList.add('show'), 10);

                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => tooltip.remove(), 300);
                }, 4000);
            });
        });

        addDragAndDropListeners();
        startTimer();

        retryBtn.classList.add('hidden');
        checkBtn.classList.add('hidden');
    }

    function goBckToLearning() {
        stopTimer();
        // Скрыть область теста
        testArea.classList.add('hidden');

        // Показать область обучения
        learnContainer.classList.remove('hidden');
        randomBtn.classList.remove('hidden');
        startTestBtn.classList.remove('hidden');

        // Очистить тестовое поле
        sourceCardsContainer.innerHTML = '';
        dropZones.forEach(zone => {
            zone.innerHTML = `<h3>${zone.dataset.type}</h3>`;
        });
        resultsContainer.innerHTML = '';
        checkBtn.classList.add('hidden');
        backBtn.classList.add('hidden');

        learnContainer.innerHTML = '';
        createLearningCards();
    }

    /**
     * Добавляет все необходимые слушатели событий для функциональности перетаскивания
     */
    function addDragAndDropListeners() {
        const draggableCards = document.querySelectorAll('#source-cards .card');

        draggableCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id);
                setTimeout(() => card.classList.add('hidden'), 0); // Скрыть во время перетаскивания
            });
            card.addEventListener('dragend', () => {
                // Это событие не ялвяется строго необзодимым здесь, но хорошо для очистки
                card.classList.remove('hidden');
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const id = e.dataTransfer.getData('text/plain');
                const draggable = document.getElementById(id);
                if (draggable) {
                    zone.appendChild(draggable);

                    const hintBtn = draggable.querySelector('.hint-btn');
                    if (hintBtn) {
                        hintBtn.remove();
                    }
                }
                checkTestCompletion();
            });
        });
    }

    /**
     * Проверяем, перемещены ли все карточки в зоны сброса, и показывает кнопку проверки
     */
    function checkTestCompletion() {
        if (sourceCardsContainer.children.length === 0) {
            checkBtn.classList.remove('hidden');
        }
    }

    /**
     * Вычисляет и отображает результаты теста
     */
    function calculateResults() {
        stopTimer();
        let correctAnswers = 0;
        let incorrectAnswers = 0;

        dropZones.forEach(zone => {
            const zoneType = zone.dataset.type;
            const cardsInZone = zone.querySelectorAll('.card');

            cardsInZone.forEach(card => {
                card.draggable = false; // Отключить дальнейшее перетаскивание
                card.style.cursor = 'default';
                if (card.dataset.type === zoneType) {
                    correctAnswers++;
                    card.classList.add('correct');
                } else {
                    incorrectAnswers++;
                    card.classList.add('incorrect');
                }
            });
        });

        resultsContainer.innerHTML = `
            <span class="good">Правильно: ${correctAnswers}  </span> <span class="bad">Ошибочно: ${incorrectAnswers}</span>
            <br>
            Использовано подсказок: ${hintCount}
        `;
        checkBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
    }

    // --- ИНИЦИАЛИЗАЦИЯ ---
    createLearningCards();
    randomBtn.addEventListener('click', shuffleLearningCards);
    startTestBtn.addEventListener('click', initializeTest);
    checkBtn.addEventListener('click', calculateResults);
    backBtn.addEventListener('click', goBckToLearning);
    retryBtn.addEventListener('click', resetTest);
});