/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/main.js */ \"./src/js/main.js\");\n/* harmony import */ var _js_main_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_main_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _scss_base_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scss/base.scss */ \"./src/scss/base.scss\");\n/* harmony import */ var _scss_base_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_scss_base_scss__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let currentGestures = []; // Текущие поинтеры\r\nlet currentGestureType = null; // Текущий тип жеста\r\n\r\n// Начальные значения для всех состояний, которые будут изменяться\r\nlet startTranslateX = -38;\r\nlet currentTranslateX = -38;\r\nlet currentZoom = 1;\r\nlet currentBrightness = 1;\r\n\r\ndocument.body.querySelector('.zoom-value span').innerHTML = Math.round(currentZoom);\r\ndocument.body.querySelector('.brightness-value span').innerHTML = currentBrightness * 100 + '%';\r\n\r\nlet currentWidth = imagecontainer.getBoundingClientRect().width; // Текущая длина контейнера с изображением. Эквивалентна углу обзора в 90 градусов\r\n\r\n// Enum для типов жестов\r\nlet GestureEnum = {\r\n    Pinch: 1,\r\n    Rotate: 2\r\n};\r\n\r\n/**\r\n * Обработчик события начала качания/клика\r\n * Максимум 2 касания\r\n * Запись стартовых значений координат\r\n */\r\n\r\nimagecontainer.addEventListener('pointerdown', event => {\r\n    console.log('down');\r\n    if(currentGestures.length < 2 && !currentGestures.find(x => x.pointerId === event.pointerId)) {\r\n        currentGestures.push({\r\n            pointerId: event.pointerId,\r\n            startX: event.pageX,\r\n            x: event.pageX,\r\n            startY: event.pageY,\r\n            y: event.pageY\r\n        });\r\n    }\r\n});\r\n\r\n/**\r\n * Обработчик движения поинтера по блоку, в котором находится изображение\r\n * Если поинтер один, то выполняется движение(поворот) изображения(камеры)\r\n * Если поинтеров два, то в поитер, который вызывал событие, записываются новые координаты\r\n * и определяется тип жеста\r\n */\r\n\r\nimagecontainer.addEventListener('pointermove', event => {\r\n    if(!currentGestures.length) return;\r\n    if(currentGestures.length === 1) {\r\n        moveTransform(event);\r\n    } else {\r\n        // Поиск поинтера, который инициировал событие в массиве текущих поинтеров\r\n        let gesture = currentGestures.find(x => x.pointerId === event.pointerId);\r\n        gesture.x = event.pageX;\r\n        gesture.y = event.pageY;\r\n\r\n        // Определение типа жеста\r\n        if(!currentGestureType) getGestureType();\r\n        else {\r\n            switch(currentGestureType) {\r\n                case GestureEnum.Pinch:\r\n                    pinchTransform();\r\n                    break;\r\n                case GestureEnum.Rotate:\r\n                    rotateTransform();\r\n            }\r\n        }\r\n    }\r\n});\r\n\r\n/**\r\n * Жест Pinch - масштабирование изображения\r\n * Максимальный scale - 4\r\n */\r\nfunction pinchTransform() {\r\n    const zoom = currentZoom + getVectorLengthDif() / 1000; // Опредедление зума через длинну вектора от одного поинтера до другого\r\n    if(zoom <= 4 && zoom >= 1) currentZoom = zoom;\r\n    document.body.querySelector('.zoom-value span').innerHTML = Math.round(currentZoom * 10) / 10;\r\n    imageBG.style.transform = `translateX(${startTranslateX}%) scale(${currentZoom})`;\r\n}\r\n\r\n/**\r\n * Жест Rotate - изменение яркости\r\n * Угол, при котором изменяется яркость лежит в диапазоне от 10 до 100\r\n * Меньше 10 - изменения не заметны\r\n * Больше 100 - для пользователя трудно реализуемый жест\r\n * css filter: brightness() - в диапазоне от 0 до 1\r\n */\r\nfunction rotateTransform() {\r\n    const angle = getVectorAngleDif();\r\n    let bright = 0;\r\n    if ((angle > -100 && angle < -10) || (angle < 100 && angle > 10)) bright = angle / 1000;\r\n    if(currentBrightness + bright > 0 && currentBrightness + bright < 1) currentBrightness += bright;\r\n    document.body.querySelector('.brightness-value span').innerHTML = Math.round(currentBrightness * 100) + '%';;\r\n    imageBG.style.filter = `brightness(${currentBrightness})`;\r\n}\r\n\r\n/**\r\n * ПОворот камеры, простой move либо мышки, либо тача\r\n * Поворот выполняется с помощью css transform: translateX\r\n * Начальное значение 38% - это середина изображения или 0 градусов.\r\n * Типичная ширина обзора веб-камеры - 90 градусов. Это все изображение или полная ширина контейнера с ним.\r\n * Влево, вправо - повороты на 180 и -180. То есть по 2 изображения или по 2 ширины контейнера. +- 38%.\r\n * Вычисляется какое расстояние от начального положения, где было касание у текущего поинтера.\r\n * Сколько это расстояние в процентах от ширины контейнера. А затем / 1.39 для перевода в проценты для translateX,\r\n * потому что там не 100%, а 74% - максимальная ширина\r\n *\r\n * @param event\r\n */\r\nfunction moveTransform(event) {\r\n    const {pageX} = event;\r\n    const {startX} = currentGestures[0];\r\n    const d = (((pageX - startX) / currentWidth) * 100) / 1.39;\r\n    const offset = startTranslateX + d;\r\n\r\n    if(offset < 1 && offset > -72 && event.offsetX >= 0 && event.offsetX <= currentWidth) {\r\n        currentTranslateX = offset;\r\n        document.body.querySelector('.bar-slider').style.right = -1 * (currentTranslateX * 1.39) + '%';\r\n        imageBG.style.transform = `translateX(${offset}%) scale(${currentZoom})`;\r\n    }\r\n}\r\n\r\n/**\r\n * Функция для определения типа жеста.\r\n * Предполагается всего три типа Pinch, Spread, Rotate\r\n * При Pinch изменяется только расстояние между двумя тачами\r\n * При Rotate расстояние остается постоянным, изменяется только направление (вектор) тачей\r\n */\r\n\r\nfunction getGestureType() {\r\n    if(getVectorLengthDif() > 20 || getVectorLengthDif() < -20) currentGestureType = GestureEnum.Pinch;\r\n    if(getVectorAngleDif() > 10 || getVectorAngleDif() < -10) {\r\n        currentGestureType = GestureEnum.Rotate;\r\n    }\r\n}\r\n\r\n/**\r\n * Вычисление длинны вектора, который проходит от одного поинтера до другого\r\n *\r\n * @returns {number}\r\n */\r\nfunction getVectorLengthDif() {\r\n    let vectorstartl = getVectorModule(currentGestures[0].startX, currentGestures[0].startY, currentGestures[1].startX, currentGestures[1].startY);\r\n    let vectorl = getVectorModule(currentGestures[0].x, currentGestures[0].y, currentGestures[1].x, currentGestures[1].y);\r\n\r\n    return vectorl - vectorstartl;\r\n}\r\n\r\n/**\r\n * Вычисление как изменился угол между центральным поинтером и тем поинтером, который вращается вокруг центрального\r\n * Для этого вызывается функция рассчета угла между векторами для двух состояний.\r\n * Один из векторов (тот, который направлен от центрального поинтера к поинтеру, который вращается) переносится в центр,\r\n * для рассчета угла\r\n *\r\n * @returns {number}\r\n */\r\nfunction getVectorAngleDif() {\r\n    let x1_0 = 0;\r\n    let y1_0 = 0;\r\n    let x2_0 = currentGestures[0].startX;\r\n    let y2_0 = currentGestures[0].startY;\r\n\r\n    let x1_1 = 0;\r\n    let y1_1 = 0;\r\n    let x2_1 = currentGestures[1].x - x2_0;\r\n    let y2_1 = currentGestures[1].y - y2_0;\r\n\r\n    const angle = getVectorAngle(x1_0, y1_0, x2_0, y2_0, x1_1, y1_1, x2_1, y2_1);\r\n\r\n    x2_1 = currentGestures[1].startX - x2_0;\r\n    y2_1 = currentGestures[1].startY - y2_0;\r\n\r\n    const anglestart = getVectorAngle(x1_0, y1_0, x2_0, y2_0, x1_1, y1_1, x2_1, y2_1);\r\n\r\n    return angle - anglestart;\r\n}\r\n\r\n\r\n/**\r\n * Функция рассчета угла между двумя векторами по формуле для скалярного произведения векторов.\r\n * Возвращает угол в градусах\r\n *\r\n * @param x1_0\r\n * @param y1_0\r\n * @param x2_0\r\n * @param y2_0\r\n * @param x1_1\r\n * @param y1_1\r\n * @param x2_1\r\n * @param y2_1\r\n * @returns {number}\r\n */\r\nfunction getVectorAngle(x1_0, y1_0, x2_0, y2_0, x1_1, y1_1, x2_1, y2_1) {\r\n    let scalarmul = scalarVectorMultiple(x2_0, y2_0, x2_1, y2_1);\r\n    let am = getVectorModule(x1_0, y1_0, x2_0, y2_0); // Центр\r\n    let bm = getVectorModule(x1_1, y1_1, x2_1, y2_1);\r\n    let cos = getVectorCos(scalarmul, am, bm);\r\n    let acos = Math.acos(cos); // Функция арккосинуса возвращает угол в радианах\r\n\r\n    return (acos * 180) / 3.14; // Перевод угла в градусы\r\n}\r\n\r\n/**\r\n * Вычисление модуля вектора по формуле\r\n *\r\n * @param x1\r\n * @param y1\r\n * @param x2\r\n * @param y2\r\n * @returns {number}\r\n */\r\nfunction getVectorModule(x1, y1, x2, y2) {\r\n    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));\r\n}\r\n\r\n/**\r\n * Скалярное умножение векторов через их координаты\r\n *\r\n * @param x1\r\n * @param y1\r\n * @param x2\r\n * @param y2\r\n * @returns {number}\r\n */\r\nfunction scalarVectorMultiple(x1, y1, x2, y2) {\r\n    return x1 * x2 + y1 * y2;\r\n}\r\n\r\n/**\r\n * Высисление косинуса угла между векторами по формуле скалярного произведения\r\n * @param ab\r\n * @param am\r\n * @param bm\r\n * @returns {number}\r\n */\r\nfunction getVectorCos(ab, am, bm) {\r\n    return ab / (am * bm);\r\n}\r\n\r\n/**\r\n * Жест закончен. Очистка массива поинтеров и типа жеста\r\n */\r\nfunction gestureEnd() {\r\n    currentGestures = [];\r\n    currentGestureType = null;\r\n    startTranslateX = currentTranslateX;\r\n}\r\n\r\nimagecontainer.addEventListener('pointerleave', () => {\r\n    gestureEnd();\r\n});\r\nimagecontainer.addEventListener('pointerup', () => {\r\n    gestureEnd();\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./src/js/main.js?");

/***/ }),

/***/ "./src/scss/base.scss":
/*!****************************!*\
  !*** ./src/scss/base.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n\n//# sourceURL=webpack:///./src/scss/base.scss?");

/***/ })

/******/ });