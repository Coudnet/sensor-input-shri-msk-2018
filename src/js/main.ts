interface ICurrentGestures {
    pointerId: number;
    startX: number;
    x: number;
    startY: number;
    y: number;
}

let currentGestures: ICurrentGestures[] = []; // Текущие поинтеры
let currentGestureType: GestureEnum | null = null; // Текущий тип жеста

// Начальные значения для всех состояний, которые будут изменяться
let startTranslateX: number = -38;
let currentTranslateX: number = -38;
let currentZoom: number = 1;
let currentBrightness: number = 1;
let currentWidth: number;

const zoomValueText: HTMLSpanElement | null = document.querySelector(".zoom-value-text");
const brightnessValueText: HTMLSpanElement | null = document.querySelector(".brightness-value-text");
const imageBG: HTMLDivElement | null = document.querySelector("#imageBG");
const barSlider: HTMLDivElement | null = document.querySelector(".bar-slider");

if (zoomValueText && brightnessValueText) {
    zoomValueText.innerHTML = Math.round(currentZoom) + "";
    brightnessValueText.innerHTML = currentBrightness * 100 + "%";
}

const imagecontainer: HTMLDivElement | null = document.querySelector("#imagecontainer");

// Enum для типов жестов
enum GestureEnum {
    Pinch = "Pinch",
    Rotate = "Rotate",
}


if (imagecontainer) {
    currentWidth = imagecontainer.getBoundingClientRect().width;
    /**
     * Обработчик события начала качания/клика
     * Максимум 2 касания
     * Запись стартовых значений координат
     */

    imagecontainer.addEventListener("pointerdown", (event: PointerEvent): void => {
        let gesture: ICurrentGestures | null = null;

        for (let i = 0; i < currentGestures.length; i++) {
            if (currentGestures[i].pointerId === event.pointerId) {
                gesture = currentGestures[i];
            }
        }
        if (currentGestures.length < 2 && !gesture) {
            currentGestures.push({
                pointerId: event.pointerId,
                startX: event.pageX,
                startY: event.pageY,
                x: event.pageX,
                y: event.pageY,
            });
        }
    });

    /**
     * Обработчик движения поинтера по блоку, в котором находится изображение
     * Если поинтер один, то выполняется движение(поворот) изображения(камеры)
     * Если поинтеров два, то в поитер, который вызывал событие, записываются новые координаты
     * и определяется тип жеста
     */

    imagecontainer.addEventListener("pointermove", (event: PointerEvent): void => {
        if (!currentGestures.length) { return; }
        if (currentGestures.length === 1) {
            moveTransform(event);
        } else {
            let gesture: ICurrentGestures | null = null;
            // Поиск поинтера, который инициировал событие в массиве текущих поинтеров
            for (let i = 0; i < currentGestures.length; i++) {
                if (currentGestures[i].pointerId === event.pointerId) {
                    gesture = currentGestures[i];
                }
            }
            if (gesture) {
                gesture.x = event.pageX;
                gesture.y = event.pageY;
            }
            // Определение типа жеста
            if (!currentGestureType) {
                getGestureType();
            } else {
                switch (currentGestureType) {
                    case GestureEnum.Pinch:
                        pinchTransform();
                        break;
                    case GestureEnum.Rotate:
                        rotateTransform();
                        break;
                    default:
                }
            }
        }
    });

    imagecontainer.addEventListener("pointerleave", (): void => {
        gestureEnd();
    });
    imagecontainer.addEventListener("pointerup", (): void => {
        gestureEnd();
    });
}



/**
 * Жест Pinch - масштабирование изображения
 * Максимальный scale - 4
 */
function pinchTransform() {
    const zoom = currentZoom + getVectorLengthDif() / 1000; // Опредедление зума через длинну вектора от одного поинтера до другого
    if (zoom <= 4 && zoom >= 1) { currentZoom = zoom; }
    if (zoomValueText && imageBG) {
        zoomValueText.innerHTML = (Math.round(currentZoom * 10) / 10) + "";
        imageBG.style.transform = `translateX(${startTranslateX}%) scale(${currentZoom})`;
    }
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
    if ((angle > -100 && angle < -10) || (angle < 100 && angle > 10)) {
        bright = angle / 1000;
    }
    if (currentBrightness + bright > 0 && currentBrightness + bright < 1) {
        currentBrightness += bright;
    }
    if (brightnessValueText && imageBG) {
        brightnessValueText.innerHTML = Math.round(currentBrightness * 100) + "%";
        imageBG.style.filter = `brightness(${currentBrightness})`;
    }
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
function moveTransform(event: PointerEvent): void {
    const {pageX} = event;
    const {startX} = currentGestures[0];
    const d = (((pageX - startX) / currentWidth) * 100) / 1.39;
    const offset = startTranslateX + d;

    if (offset < 1 && offset > -72 && event.offsetX >= 0 && event.offsetX <= currentWidth) {
        currentTranslateX = offset;
        if (barSlider && imageBG) {
            barSlider.style.right = -1 * (currentTranslateX * 1.39) + "%";
            imageBG.style.transform = `translateX(${offset}%) scale(${currentZoom})`;
        }
    }
}

/**
 * Функция для определения типа жеста.
 * Предполагается всего три типа Pinch, Spread, Rotate
 * При Pinch изменяется только расстояние между двумя тачами
 * При Rotate расстояние остается постоянным, изменяется только направление (вектор) тачей
 */

function getGestureType(): void {
    if (getVectorLengthDif() > 20 || getVectorLengthDif() < -20) {
        currentGestureType = GestureEnum.Pinch;
    }
    if (getVectorAngleDif() > 10 || getVectorAngleDif() < -10) {
        currentGestureType = GestureEnum.Rotate;
    }
}

/**
 * Вычисление длинны вектора, который проходит от одного поинтера до другого
 *
 * @returns {number}
 */
function getVectorLengthDif(): number {
    let x1: number = currentGestures[0].startX;
    let y1: number = currentGestures[0].startY;
    let x2: number = currentGestures[1].startX;
    let y2: number = currentGestures[1].startY;
    let vectorstartl = getVectorModule(x1, y1, x2, y2);

    x1 = currentGestures[0].x;
    y1 = currentGestures[0].y;
    x2 = currentGestures[1].x;
    y2 = currentGestures[1].y;
    let vectorl = getVectorModule(x1, y1, x2, y2);

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
function getVectorAngleDif(): number {
    const x10: number = 0;
    const y10: number = 0;
    const x20: number = currentGestures[0].startX;
    const y20: number = currentGestures[0].startY;

    const x11: number = 0;
    const y11: number = 0;
    let x21: number = currentGestures[1].x - x20;
    let y21: number = currentGestures[1].y - y20;

    const angle: number = getVectorAngle(x10, y10, x20, y20, x11, y11, x21, y21);

    x21 = currentGestures[1].startX - x20;
    y21 = currentGestures[1].startY - y20;

    const anglestart: number = getVectorAngle(x10, y10, x20, y20, x11, y11, x21, y21);

    return angle - anglestart;
}


/**
 * Функция рассчета угла между двумя векторами по формуле для скалярного произведения векторов.
 * Возвращает угол в градусах
 *
 * @param x10
 * @param y10
 * @param x20
 * @param y20
 * @param x11
 * @param y11
 * @param x21
 * @param y21
 * @returns {number}
 */
function getVectorAngle(x10: number, y10: number, x20: number, y20: number, x11: number, y11: number, x21: number, y21: number): number {
    let scalarmul: number = scalarVectorMultiple(x20, y20, x21, y21);
    let am: number = getVectorModule(x10, y10, x20, y20); // Центр
    let bm: number = getVectorModule(x11, y11, x21, y21);
    let cos: number = getVectorCos(scalarmul, am, bm);
    let acos: number = Math.acos(cos); // Функция арккосинуса возвращает угол в радианах

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
function getVectorModule(x1: number, y1: number, x2: number, y2: number): number {
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
function scalarVectorMultiple(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * x2 + y1 * y2;
}

/**
 * Высисление косинуса угла между векторами по формуле скалярного произведения
 * @param ab
 * @param am
 * @param bm
 * @returns {number}
 */
function getVectorCos(ab: number, am: number, bm: number): number {
    return ab / (am * bm);
}

/**
 * Жест закончен. Очистка массива поинтеров и типа жеста
 */
function gestureEnd(): void {
    currentGestures = [];
    currentGestureType = null;
    startTranslateX = currentTranslateX;
}

