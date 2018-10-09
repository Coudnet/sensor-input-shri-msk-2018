let currentGestures = []; // Текущие поинтеры
let currentGestureType = null; // Текущий тип жеста

// Начальные значения для всех состояний, которые будут изменяться
let startTranslateX = -38;
let currentTranslateX = -38;
let currentZoom = 1;
let currentBrightness = 1;

document.body.querySelector('.zoom-value span').innerHTML = Math.round(currentZoom);
document.body.querySelector('.brightness-value span').innerHTML = currentBrightness * 100 + '%';

let currentWidth = imagecontainer.getBoundingClientRect().width; // Текущая длина контейнера с изображением. Эквивалентна углу обзора в 90 градусов

// Enum для типов жестов
let GestureEnum = {
    Pinch: 1,
    Rotate: 2
};

/**
 * Обработчик события начала качания/клика
 * Максимум 2 касания
 * Запись стартовых значений координат
 */

imagecontainer.addEventListener('pointerdown', event => {
    console.log('down');
    if(currentGestures.length < 2 && !currentGestures.find(x => x.pointerId === event.pointerId)) {
        currentGestures.push({
            pointerId: event.pointerId,
            startX: event.pageX,
            x: event.pageX,
            startY: event.pageY,
            y: event.pageY
        });
    }
});

/**
 * Обработчик движения поинтера по блоку, в котором находится изображение
 * Если поинтер один, то выполняется движение(поворот) изображения(камеры)
 * Если поинтеров два, то в поитер, который вызывал событие, записываются новые координаты
 * и определяется тип жеста
 */

imagecontainer.addEventListener('pointermove', event => {
    if(!currentGestures.length) return;
    if(currentGestures.length === 1) {
        moveTransform(event);
    } else {
        // Поиск поинтера, который инициировал событие в массиве текущих поинтеров
        let gesture = currentGestures.find(x => x.pointerId === event.pointerId);
        gesture.x = event.pageX;
        gesture.y = event.pageY;

        // Определение типа жеста
        if(!currentGestureType) getGestureType();
        else {
            switch(currentGestureType) {
                case GestureEnum.Pinch:
                    pinchTransform();
                    break;
                case GestureEnum.Rotate:
                    rotateTransform();
            }
        }
    }
});

/**
 * Жест Pinch - масштабирование изображения
 * Максимальный scale - 4
 */
function pinchTransform() {
    const zoom = currentZoom + getVectorLengthDif() / 1000; // Опредедление зума через длинну вектора от одного поинтера до другого
    if(zoom <= 4 && zoom >= 1) currentZoom = zoom;
    document.body.querySelector('.zoom-value span').innerHTML = Math.round(currentZoom * 10) / 10;
    imageBG.style.transform = `translateX(${startTranslateX}%) scale(${currentZoom})`;
}

/**
 * Жест Rotate - изменение яркости
 * Угол, при котором изменяется яркость лежит в диапазоне от 10 до 100
 * Меньше 10 - изменения не заметны
 * Больше 100 - для пользователя трудно реализуемый жест
 * css filter: brightness() - в диапазоне от 0 до 1
 */
function rotateTransform() {
    const angle = getVectorAngleDif();
    let bright = 0;
    if ((angle > -100 && angle < -10) || (angle < 100 && angle > 10)) bright = angle / 1000;
    if(currentBrightness + bright > 0 && currentBrightness + bright < 1) currentBrightness += bright;
    document.body.querySelector('.brightness-value span').innerHTML = Math.round(currentBrightness * 100) + '%';;
    imageBG.style.filter = `brightness(${currentBrightness})`;
}

/**
 * ПОворот камеры, простой move либо мышки, либо тача
 * Поворот выполняется с помощью css transform: translateX
 * Начальное значение 38% - это середина изображения или 0 градусов.
 * Типичная ширина обзора веб-камеры - 90 градусов. Это все изображение или полная ширина контейнера с ним.
 * Влево, вправо - повороты на 180 и -180. То есть по 2 изображения или по 2 ширины контейнера. +- 38%.
 * Вычисляется какое расстояние от начального положения, где было касание у текущего поинтера.
 * Сколько это расстояние в процентах от ширины контейнера. А затем / 1.39 для перевода в проценты для translateX,
 * потому что там не 100%, а 74% - максимальная ширина
 *
 * @param event
 */
function moveTransform(event) {
    const {pageX} = event;
    const {startX} = currentGestures[0];
    const d = (((pageX - startX) / currentWidth) * 100) / 1.39;
    const offset = startTranslateX + d;

    if(offset < 1 && offset > -72 && event.offsetX >= 0 && event.offsetX <= currentWidth) {
        currentTranslateX = offset;
        document.body.querySelector('.bar-slider').style.right = -1 * (currentTranslateX * 1.39) + '%';
        imageBG.style.transform = `translateX(${offset}%) scale(${currentZoom})`;
    }
}

/**
 * Функция для определения типа жеста.
 * Предполагается всего три типа Pinch, Spread, Rotate
 * При Pinch изменяется только расстояние между двумя тачами
 * При Rotate расстояние остается постоянным, изменяется только направление (вектор) тачей
 */

function getGestureType() {
    if(getVectorLengthDif() > 20 || getVectorLengthDif() < -20) currentGestureType = GestureEnum.Pinch;
    if(getVectorAngleDif() > 10 || getVectorAngleDif() < -10) {
        currentGestureType = GestureEnum.Rotate;
    }
}

/**
 * Вычисление длинны вектора, который проходит от одного поинтера до другого
 *
 * @returns {number}
 */
function getVectorLengthDif() {
    let vectorstartl = getVectorModule(currentGestures[0].startX, currentGestures[0].startY, currentGestures[1].startX, currentGestures[1].startY);
    let vectorl = getVectorModule(currentGestures[0].x, currentGestures[0].y, currentGestures[1].x, currentGestures[1].y);

    return vectorl - vectorstartl;
}

/**
 * Вычисление как изменился угол между центральным поинтером и тем поинтером, который вращается вокруг центрального
 * Для этого вызывается функция рассчета угла между векторами для двух состояний.
 * Один из векторов (тот, который направлен от центрального поинтера к поинтеру, который вращается) переносится в центр,
 * для рассчета угла
 *
 * @returns {number}
 */
function getVectorAngleDif() {
    let x1_0 = 0;
    let y1_0 = 0;
    let x2_0 = currentGestures[0].startX;
    let y2_0 = currentGestures[0].startY;

    let x1_1 = 0;
    let y1_1 = 0;
    let x2_1 = currentGestures[1].x - x2_0;
    let y2_1 = currentGestures[1].y - y2_0;

    const angle = getVectorAngle(x1_0, y1_0, x2_0, y2_0, x1_1, y1_1, x2_1, y2_1);

    x2_1 = currentGestures[1].startX - x2_0;
    y2_1 = currentGestures[1].startY - y2_0;

    const anglestart = getVectorAngle(x1_0, y1_0, x2_0, y2_0, x1_1, y1_1, x2_1, y2_1);

    return angle - anglestart;
}


/**
 * Функция рассчета угла между двумя векторами по формуле для скалярного произведения векторов.
 * Возвращает угол в градусах
 *
 * @param x1_0
 * @param y1_0
 * @param x2_0
 * @param y2_0
 * @param x1_1
 * @param y1_1
 * @param x2_1
 * @param y2_1
 * @returns {number}
 */
function getVectorAngle(x1_0, y1_0, x2_0, y2_0, x1_1, y1_1, x2_1, y2_1) {
    let scalarmul = scalarVectorMultiple(x2_0, y2_0, x2_1, y2_1);
    let am = getVectorModule(x1_0, y1_0, x2_0, y2_0); // Центр
    let bm = getVectorModule(x1_1, y1_1, x2_1, y2_1);
    let cos = getVectorCos(scalarmul, am, bm);
    let acos = Math.acos(cos); // Функция арккосинуса возвращает угол в радианах

    return (acos * 180) / 3.14; // Перевод угла в градусы
}

/**
 * Вычисление модуля вектора по формуле
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
function getVectorModule(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Скалярное умножение векторов через их координаты
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
function scalarVectorMultiple(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

/**
 * Высисление косинуса угла между векторами по формуле скалярного произведения
 * @param ab
 * @param am
 * @param bm
 * @returns {number}
 */
function getVectorCos(ab, am, bm) {
    return ab / (am * bm);
}

/**
 * Жест закончен. Очистка массива поинтеров и типа жеста
 */
function gestureEnd() {
    currentGestures = [];
    currentGestureType = null;
    startTranslateX = currentTranslateX;
}

imagecontainer.addEventListener('pointerleave', () => {
    gestureEnd();
});
imagecontainer.addEventListener('pointerup', () => {
    gestureEnd();
});

