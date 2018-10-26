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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__webpack_require__(/*! ./js/main.ts */ \"./src/js/main.ts\");\r\n__webpack_require__(/*! ./scss/base.scss */ \"./src/scss/base.scss\");\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/js/main.ts":
/*!************************!*\
  !*** ./src/js/main.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar currentGestures = []; // Текущие поинтеры\r\nvar currentGestureType = null; // Текущий тип жеста\r\n// Начальные значения для всех состояний, которые будут изменяться\r\nvar startTranslateX = -38;\r\nvar currentTranslateX = -38;\r\nvar currentZoom = 1;\r\nvar currentBrightness = 1;\r\nvar currentWidth;\r\nvar zoomValueText = document.querySelector(\".zoom-value-text\");\r\nvar brightnessValueText = document.querySelector(\".brightness-value-text\");\r\nvar imageBG = document.querySelector(\"#imageBG\");\r\nvar barSlider = document.querySelector(\".bar-slider\");\r\nif (zoomValueText && brightnessValueText) {\r\n    zoomValueText.innerHTML = Math.round(currentZoom) + \"\";\r\n    brightnessValueText.innerHTML = currentBrightness * 100 + \"%\";\r\n}\r\nvar imagecontainer = document.querySelector(\"#imagecontainer\");\r\n// Enum для типов жестов\r\nvar GestureEnum;\r\n(function (GestureEnum) {\r\n    GestureEnum[\"Pinch\"] = \"Pinch\";\r\n    GestureEnum[\"Rotate\"] = \"Rotate\";\r\n})(GestureEnum || (GestureEnum = {}));\r\nif (imagecontainer) {\r\n    currentWidth = imagecontainer.getBoundingClientRect().width;\r\n    /**\r\n     * Обработчик события начала качания/клика\r\n     * Максимум 2 касания\r\n     * Запись стартовых значений координат\r\n     */\r\n    imagecontainer.addEventListener(\"dragstart\", function (event) { event.preventDefault(); });\r\n    imagecontainer.addEventListener(\"pointerdown\", function (event) {\r\n        var gesture = null;\r\n        for (var i = 0; i < currentGestures.length; i++) {\r\n            if (currentGestures[i].pointerId === event.pointerId) {\r\n                gesture = currentGestures[i];\r\n            }\r\n        }\r\n        if (currentGestures.length < 2 && !gesture) {\r\n            currentGestures.push({\r\n                pointerId: event.pointerId,\r\n                startX: event.pageX,\r\n                startY: event.pageY,\r\n                x: event.pageX,\r\n                y: event.pageY,\r\n            });\r\n        }\r\n    });\r\n    /**\r\n     * Обработчик движения поинтера по блоку, в котором находится изображение\r\n     * Если поинтер один, то выполняется движение(поворот) изображения(камеры)\r\n     * Если поинтеров два, то в поитер, который вызывал событие, записываются новые координаты\r\n     * и определяется тип жеста\r\n     */\r\n    imagecontainer.addEventListener(\"pointermove\", function (event) {\r\n        if (!currentGestures.length) {\r\n            return;\r\n        }\r\n        if (currentGestures.length === 1) {\r\n            moveTransform(event);\r\n        }\r\n        else {\r\n            var gesture = null;\r\n            // Поиск поинтера, который инициировал событие в массиве текущих поинтеров\r\n            for (var i = 0; i < currentGestures.length; i++) {\r\n                if (currentGestures[i].pointerId === event.pointerId) {\r\n                    gesture = currentGestures[i];\r\n                }\r\n            }\r\n            if (gesture) {\r\n                gesture.x = event.pageX;\r\n                gesture.y = event.pageY;\r\n            }\r\n            // Определение типа жеста\r\n            if (!currentGestureType) {\r\n                getGestureType();\r\n            }\r\n            else {\r\n                switch (currentGestureType) {\r\n                    case GestureEnum.Pinch:\r\n                        pinchTransform();\r\n                        break;\r\n                    case GestureEnum.Rotate:\r\n                        rotateTransform();\r\n                        break;\r\n                    default:\r\n                }\r\n            }\r\n        }\r\n    });\r\n    imagecontainer.addEventListener(\"pointerleave\", function () {\r\n        gestureEnd();\r\n    });\r\n    imagecontainer.addEventListener(\"pointerup\", function () {\r\n        gestureEnd();\r\n    });\r\n}\r\n/**\r\n * Жест Pinch - масштабирование изображения\r\n * Максимальный scale - 4\r\n */\r\nfunction pinchTransform() {\r\n    var zoom = currentZoom + getVectorLengthDif() / 1000; // Опредедление зума через длинну вектора от одного поинтера до другого\r\n    if (zoom <= 4 && zoom >= 1) {\r\n        currentZoom = zoom;\r\n    }\r\n    if (zoomValueText && imageBG) {\r\n        zoomValueText.innerHTML = (Math.round(currentZoom * 10) / 10) + \"\";\r\n        imageBG.style.transform = \"translateX(\" + startTranslateX + \"%) scale(\" + currentZoom + \")\";\r\n    }\r\n}\r\n/**\r\n * Жест Rotate - изменение яркости\r\n * Угол, при котором изменяется яркость лежит в диапазоне от 10 до 100\r\n * Меньше 10 - изменения не заметны\r\n * Больше 100 - для пользователя трудно реализуемый жест\r\n * css filter: brightness() - в диапазоне от 0 до 1\r\n */\r\nfunction rotateTransform() {\r\n    var angle = getVectorAngleDif();\r\n    var bright = 0;\r\n    if ((angle > -100 && angle < -10) || (angle < 100 && angle > 10)) {\r\n        bright = angle / 1000;\r\n    }\r\n    if (currentBrightness + bright > 0 && currentBrightness + bright < 1) {\r\n        currentBrightness += bright;\r\n    }\r\n    if (brightnessValueText && imageBG) {\r\n        brightnessValueText.innerHTML = Math.round(currentBrightness * 100) + \"%\";\r\n        imageBG.style.filter = \"brightness(\" + currentBrightness + \")\";\r\n    }\r\n}\r\n/**\r\n * ПОворот камеры, простой move либо мышки, либо тача\r\n * Поворот выполняется с помощью css transform: translateX\r\n * Начальное значение 38% - это середина изображения или 0 градусов.\r\n * Типичная ширина обзора веб-камеры - 90 градусов. Это все изображение или полная ширина контейнера с ним.\r\n * Влево, вправо - повороты на 180 и -180. То есть по 2 изображения или по 2 ширины контейнера. +- 38%.\r\n * Вычисляется какое расстояние от начального положения, где было касание у текущего поинтера.\r\n * Сколько это расстояние в процентах от ширины контейнера. А затем / 1.39 для перевода в проценты для translateX,\r\n * потому что там не 100%, а 74% - максимальная ширина\r\n *\r\n * @param event\r\n */\r\nfunction moveTransform(event) {\r\n    var pageX = event.pageX;\r\n    var startX = currentGestures[0].startX;\r\n    var d = (((pageX - startX) / currentWidth) * 100) / 1.39;\r\n    var offset = startTranslateX + d;\r\n    if (offset < 1 && offset > -72 && event.offsetX >= 0 && event.offsetX <= currentWidth) {\r\n        currentTranslateX = offset;\r\n        if (barSlider && imageBG) {\r\n            barSlider.style.right = -1 * (currentTranslateX * 1.39) + \"%\";\r\n            imageBG.style.transform = \"translateX(\" + offset + \"%) scale(\" + currentZoom + \")\";\r\n        }\r\n    }\r\n}\r\n/**\r\n * Функция для определения типа жеста.\r\n * Предполагается всего три типа Pinch, Spread, Rotate\r\n * При Pinch изменяется только расстояние между двумя тачами\r\n * При Rotate расстояние остается постоянным, изменяется только направление (вектор) тачей\r\n */\r\nfunction getGestureType() {\r\n    if (getVectorLengthDif() > 20 || getVectorLengthDif() < -20) {\r\n        currentGestureType = GestureEnum.Pinch;\r\n    }\r\n    if (getVectorAngleDif() > 10 || getVectorAngleDif() < -10) {\r\n        currentGestureType = GestureEnum.Rotate;\r\n    }\r\n}\r\n/**\r\n * Вычисление длинны вектора, который проходит от одного поинтера до другого\r\n *\r\n * @returns {number}\r\n */\r\nfunction getVectorLengthDif() {\r\n    var x1 = currentGestures[0].startX;\r\n    var y1 = currentGestures[0].startY;\r\n    var x2 = currentGestures[1].startX;\r\n    var y2 = currentGestures[1].startY;\r\n    var vectorstartl = getVectorModule(x1, y1, x2, y2);\r\n    x1 = currentGestures[0].x;\r\n    y1 = currentGestures[0].y;\r\n    x2 = currentGestures[1].x;\r\n    y2 = currentGestures[1].y;\r\n    var vectorl = getVectorModule(x1, y1, x2, y2);\r\n    return vectorl - vectorstartl;\r\n}\r\n/**\r\n * Вычисление как изменился угол между центральным поинтером и тем поинтером, который вращается вокруг центрального\r\n * Для этого вызывается функция рассчета угла между векторами для двух состояний.\r\n * Один из векторов (тот, который направлен от центрального поинтера к поинтеру, который вращается) переносится в центр,\r\n * для рассчета угла\r\n *\r\n * @returns {number}\r\n */\r\nfunction getVectorAngleDif() {\r\n    var x10 = 0;\r\n    var y10 = 0;\r\n    var x20 = currentGestures[0].startX;\r\n    var y20 = currentGestures[0].startY;\r\n    var x11 = 0;\r\n    var y11 = 0;\r\n    var x21 = currentGestures[1].x - x20;\r\n    var y21 = currentGestures[1].y - y20;\r\n    var angle = getVectorAngle(x10, y10, x20, y20, x11, y11, x21, y21);\r\n    x21 = currentGestures[1].startX - x20;\r\n    y21 = currentGestures[1].startY - y20;\r\n    var anglestart = getVectorAngle(x10, y10, x20, y20, x11, y11, x21, y21);\r\n    return angle - anglestart;\r\n}\r\n/**\r\n * Функция рассчета угла между двумя векторами по формуле для скалярного произведения векторов.\r\n * Возвращает угол в градусах\r\n *\r\n * @param x10\r\n * @param y10\r\n * @param x20\r\n * @param y20\r\n * @param x11\r\n * @param y11\r\n * @param x21\r\n * @param y21\r\n * @returns {number}\r\n */\r\nfunction getVectorAngle(x10, y10, x20, y20, x11, y11, x21, y21) {\r\n    var scalarmul = scalarVectorMultiple(x20, y20, x21, y21);\r\n    var am = getVectorModule(x10, y10, x20, y20); // Центр\r\n    var bm = getVectorModule(x11, y11, x21, y21);\r\n    var cos = getVectorCos(scalarmul, am, bm);\r\n    var acos = Math.acos(cos); // Функция арккосинуса возвращает угол в радианах\r\n    return (acos * 180) / 3.14; // Перевод угла в градусы\r\n}\r\n/**\r\n * Вычисление модуля вектора по формуле\r\n *\r\n * @param x1\r\n * @param y1\r\n * @param x2\r\n * @param y2\r\n * @returns {number}\r\n */\r\nfunction getVectorModule(x1, y1, x2, y2) {\r\n    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));\r\n}\r\n/**\r\n * Скалярное умножение векторов через их координаты\r\n *\r\n * @param x1\r\n * @param y1\r\n * @param x2\r\n * @param y2\r\n * @returns {number}\r\n */\r\nfunction scalarVectorMultiple(x1, y1, x2, y2) {\r\n    return x1 * x2 + y1 * y2;\r\n}\r\n/**\r\n * Высисление косинуса угла между векторами по формуле скалярного произведения\r\n * @param ab\r\n * @param am\r\n * @param bm\r\n * @returns {number}\r\n */\r\nfunction getVectorCos(ab, am, bm) {\r\n    return ab / (am * bm);\r\n}\r\n/**\r\n * Жест закончен. Очистка массива поинтеров и типа жеста\r\n */\r\nfunction gestureEnd() {\r\n    currentGestures = [];\r\n    currentGestureType = null;\r\n    startTranslateX = currentTranslateX;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/js/main.ts?");

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