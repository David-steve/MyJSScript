// ==UserScript==
// @name         Cangshi-TimerHooker
// @namespace    https://greasyfork.org/en/users/104201
// @version      1.0.57
// @description  黄盐改版的→控制网页计时器速度|加速跳过页面计时广告|视频快进（慢放）|跳过广告|支持几乎所有网页.
// @include      *
// @author       Cangshi,黄盐
// @match        http://*/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0-or-later
// ==/UserScript==
/**
 * ---------------------------
 * Time: 2017/11/20 19:28.
 * Author: Cangshi
 * View: http://palerock.cn
 * 
 * 需要预加载脚本 https://gitee.com/HGJing/everthing-hook/raw/master/src/everything-hook.js
 * 黄盐 修改于 2021-1-24 21:07:48
 * @license    GPL-3.0-or-later
 * ---------------------------
 */
window.isDOMLoaded = false;
window.isDOMRendered = false;

document.addEventListener('readystatechange', function () {
    if (document.readyState === "interactive" || document.readyState === "complete") {
        window.isDOMLoaded = true;
    }
});

~function (global) {
    var workerURLs = [];
    var extraElements = [];

    var helper = function (eHookContext, timerContext, util) {
        return {
            /***************禁用 BY 黄盐, PART 2 BEGIN
            applyUI: function () {
                var style = '._th-container ._th-item{margin-bottom:3px;position:relative;width:0;height:0;cursor:pointer;opacity:.3;background-color:aquamarine;border-radius:100%;text-align:center;line-height:30px;-webkit-transition:all .35s;-o-transition:all .35s;transition:all .35s;right:30px}._th-container ._th-item,._th-container ._th-click-hover,._th_cover-all-show-times ._th_times{-webkit-box-shadow:-3px 4px 12px -5px black;box-shadow:-3px 4px 12px -5px black}._th-container:hover ._th-item._item-x2{margin-left:18px;width:40px;height:40px;line-height:40px}._th-container:hover ._th-item._item-x-2{margin-left:17px;width:38px;height:38px;line-height:38px}._th-container:hover ._th-item._item-xx2{width:36px;height:36px;margin-left:16px;line-height:36px}._th-container:hover ._th-item._item-xx-2{width:32px;height:32px;line-height:32px;margin-left:14px}._th-container:hover ._th-item._item-reset{width:30px;line-height:30px;height:30px;margin-left:10px}._th-click-hover{position:relative;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;height:45px;width:45px;cursor:pointer;opacity:.3;border-radius:100%;background-color:aquamarine;text-align:center;line-height:45px;right:0}._th-container:hover{left:-5px}._th-container{font-size:12px;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;left:-35px;top:20%;position:fixed;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:100000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._th-container ._th-item:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th-container ._th-item:active{opacity:.9;background-color:#1b3a26;color:aliceblue}._th-container:hover ._th-click-hover{opacity:.8}._th-container:hover ._th-item{opacity:.6;right:0}._th-container ._th-click-hover:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th_cover-all-show-times{position:fixed;top:0;right:0;width:100%;height:100%;z-index:99999;opacity:1;font-weight:900;font-size:30px;color:#4f4f4f;background-color:rgba(0,0,0,0.1)}._th_cover-all-show-times._th_hidden{z-index:-99999;opacity:0;-webkit-transition:1s all;-o-transition:1s all;transition:1s all}._th_cover-all-show-times ._th_times{width:300px;height:300px;border-radius:50%;background-color:rgba(127,255,212,0.51);text-align:center;line-height:300px;position:absolute;top:50%;right:50%;margin-top:-150px;margin-right:-150px}';

                var displayNum = (1 / timerContext._percentage).toFixed(2);

                // 在页面左边添加一个半圆便于修改
                var html = '<div class="_th-container">\n' +
                    '    <div class="_th-click-hover _item-input">\n' +
                    '        x' + displayNum + '\n' +
                    '    </div>\n' +
                    '    <div class="_th-item _item-x2">&gt;</div>\n' +
                    '    <div class="_th-item _item-x-2">&lt;</div>\n' +
                    '    <div class="_th-item _item-xx2">&gt;&gt;</div>\n' +
                    '    <div class="_th-item _item-xx-2">&lt;&lt;</div>\n' +
                    '    <div class="_th-item _item-reset">O</div>\n' +
                    '</div>\n' +
                    '<div class="_th_cover-all-show-times _th_hidden">\n' +
                    '    <div class="_th_times">x' + displayNum + '</div>\n' +
                    '</div>' +
                    '';
                var stylenode = document.createElement('style');
                stylenode.setAttribute("type", "text/css");
                if (stylenode.styleSheet) {// IE
                    stylenode.styleSheet.cssText = style;
                } else {// w3c
                    var cssText = document.createTextNode(style);
                    stylenode.appendChild(cssText);
                }
                var node = document.createElement('div');
                node.innerHTML = html;

                var clickMapper = {
                    '_item-input': function () {
                        changeTime();
                    },
                    '_item-x2': function () {
                        changeTime(2, 0, true);
                    },
                    '_item-x-2': function () {
                        changeTime(-2, 0, true);
                    },
                    '_item-xx2': function () {
                        changeTime(0, 2);
                    },
                    '_item-xx-2': function () {
                        changeTime(0, -2);
                    },
                    '_item-reset': function () {
                        changeTime(0, 0, false, true);
                    }
                };

                Object.keys(clickMapper).forEach(function (className) {
                    var exec = clickMapper[className];
                    var targetEle = node.getElementsByClassName(className)[0];
                    if (targetEle) {
                        targetEle.onclick = exec;
                    }
                });

                if (!global.isDOMLoaded) {
                    document.addEventListener('readystatechange', function () {
                        if ((document.readyState === "interactive" || document.readyState === "complete") && !global.isDOMRendered) {
                            document.head.appendChild(stylenode);
                            document.body.appendChild(node);
                            global.isDOMRendered = true;
                            console.log('Time Hooker Works!');
                        }
                    });
                } else {
                    document.head.appendChild(stylenode);
                    document.body.appendChild(node);
                    global.isDOMRendered = true;
                    console.log('Time Hooker Works!');
                }
            },
            applyGlobalAction: function (timer) {
                // 界面半圆按钮点击的方法
                timer.changeTime = function (anum, cnum, isa, isr) {
                    if (isr) {
                        global.timer.change(1);
                        return;
                    }
                    if (!global.timer) {
                        return;
                    }
                    var result;
                    if (!anum && !cnum) {
                        var t = prompt("输入欲改变计时器变化倍率（当前：" + 1 / timerContext._percentage + "）");
                        if (t == null) {
                            return;
                        }
                        if (isNaN(parseFloat(t))) {
                            alert("请输入正确的数字");
                            timer.changeTime();
                            return;
                        }
                        if (parseFloat(t) <= 0) {
                            alert("倍率不能小于等于0");
                            timer.changeTime();
                            return;
                        }
                        result = 1 / parseFloat(t);
                    } else {
                        if (isa && anum) {
                            if (1 / timerContext._percentage <= 1 && anum < 0) {
                                return;
                            }
                            result = 1 / (1 / timerContext._percentage + anum);
                        } else {
                            if (cnum <= 0) {
                                cnum = 1 / -cnum
                            }
                            result = 1 / ((1 / timerContext._percentage) * cnum);
                        }
                    }
                    timer.change(result);
                };
                global.changeTime = timer.changeTime;
            },
          
            ****************禁用 BY 黄盐, PART 2 END*/
            applyHooking: function () {
                // 劫持循环计时器
                eHookContext.hookReplace(window, 'setInterval', function (setInterval) {
                    return function () {
                        // 储存原始时间间隔
                        var originMS = arguments[1];
                        // 获取变速时间间隔
                        arguments[1] *= timerContext._percentage;
                        var resultId = setInterval.apply(window, arguments);
                        // 保存每次使用计时器得到的id以及参数等
                        timerContext._intervalIds[resultId] = {
                            args: arguments,
                            originMS: originMS,
                            nowId: resultId
                        };
                        return resultId;
                    };
                });
                // 劫持循环计时器的清除方法
                eHookContext.hookBefore(window, 'clearInterval', function (method, args) {
                    var id = args[0];
                    if (timerContext._intervalIds[id]) {
                        args[0] = timerContext._intervalIds[id].nowId;
                    }
                    // 清除该记录id
                    delete timerContext._intervalIds[id];
                });
                // 劫持循环计时器的清除方法
                eHookContext.hookBefore(window, 'clearTimeout', function (method, args) {
                    var id = args[0];
                    if (timerContext._intervalIds[id]) {
                        args[0] = timerContext._intervalIds[id].nowId;
                    }
                    // 清除该记录id
                    delete timerContext._intervalIds[id];
                });
                // 劫持单次计时器setTimeout
                eHookContext.hookBefore(window, 'setTimeout', function (method, args) {
                    args[1] *= timerContext._percentage;
                });
                var newFunc = this.getHookedDateConstructor();
                eHookContext.hookClass(window, 'Date', newFunc, '_innerDate', ['now']);
                Date.now = function () {
                    return new Date().getTime();
                };
                eHookContext.hookedToString(timerContext._Date.now, Date.now);
                var objToString = Object.prototype.toString;

                Object.prototype.toString = function toString() {
                    'use strict';
                    if (this instanceof timerContext._mDate) {
                        return '[object Date]';
                    } else {
                        return objToString.call(this);
                    }
                };

                eHookContext.hookedToString(objToString, Object.prototype.toString);
                eHookContext.hookedToString(timerContext._setInterval, setInterval);
                eHookContext.hookedToString(timerContext._setTimeout, setTimeout);
                eHookContext.hookedToString(timerContext._clearInterval, clearInterval);
                timerContext._mDate = window.Date;
                
                /***************禁用 BY 黄盐, PART 2 BEGIN
                this.hookShadowRoot();
                ****************禁用 BY 黄盐, PART 2 END*/
            },
            getHookedDateConstructor: function () {
                return function () {
                    if (arguments.length === 1) {
                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: new timerContext._Date(arguments[0]),
                            writable: false
                        });
                        return;
                    } else if (arguments.length > 1) {
                        var definedValue;
                        switch (arguments.length) {
                            case 2:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1]
                                );
                                break;
                            case 3:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                );
                                break;
                            case 4:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                );
                                break;
                            case 5:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4]
                                );
                                break;
                            case 6:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4],
                                    arguments[5]
                                );
                                break;
                            default:
                            case 7:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4],
                                    arguments[5],
                                    arguments[6]
                                );
                                break;
                        }

                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: definedValue,
                            writable: false
                        });
                        return;
                    }
                    var now = timerContext._Date.now();
                    var passTime = now - timerContext.__lastDatetime;
                    var hookPassTime = passTime * (1 / timerContext._percentage);
                    // console.log(__this.__lastDatetime + hookPassTime, now,__this.__lastDatetime + hookPassTime - now);
                    Object.defineProperty(this, '_innerDate', {
                        configurable: false,
                        enumerable: false,
                        value: new timerContext._Date(timerContext.__lastMDatetime + hookPassTime),
                        writable: false
                    });
                };
            },
            /***************禁用 BY 黄盐, PART 3 BEGIN
            registerShortcutKeys: function (timer) {
                // 快捷键注册
                addEventListener('keydown', function (e) {
                    switch (e.keyCode) {
                        case 57:
                            if (e.ctrlKey || e.altKey) {
                                // custom
                                timer.changeTime();
                            }
                            break;
                        // [=]
                        case 190:
                        case 187: {
                            if (e.ctrlKey) {
                                // console.log('+2');
                                timer.changeTime(2, 0, true);
                            } else if (e.altKey) {
                                // console.log('xx2');
                                timer.changeTime(0, 2);
                            }
                            break;
                        }
                        // [-]
                        case 188:
                        case 189: {
                            if (e.ctrlKey) {
                                // console.log('-2');
                                timer.changeTime(-2, 0, true);
                            } else if (e.altKey) {
                                // console.log('xx-2');
                                timer.changeTime(0, -2);
                            }
                            break;
                        }
                        // [0]
                        case 48: {
                            if (e.ctrlKey || e.altKey) {
                                // console.log('reset');
                                timer.changeTime(0, 0, false, true);
                            }
                            break;
                        }
                        default:
                        // console.log(e);
                    }
                });
            },
            this.hookShadowRoot();
            ****************禁用 BY 黄盐, PART 3 END*/
            /**
             * 当计时器速率被改变时调用的回调方法
             * @param percentage
             * @private
             */
            percentageChangeHandler: function (percentage) {
                // 改变所有的循环计时
                util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
                    idObj.args[1] = Math.floor(idObj.originMS || 1 * percentage);
                    // 结束原来的计时器
                    this._clearInterval.call(window, idObj.nowId);
                    // 新开一个计时器
                    idObj.nowId = this._setInterval.apply(window, idObj.args);
                });
            },
            /***************禁用 BY 黄盐, PART 4 BEGIN
            hookShadowRoot: function () {
                var origin = Element.prototype.attachShadow;
                eHookContext.hookAfter(Element.prototype, 'attachShadow',
                    function (m, args, result) {
                        extraElements.push(result);
                        return result;
                    }, false);
                eHookContext.hookedToString(origin, Element.prototype.attachShadow);
            }
            ****************禁用 BY 黄盐, PART 4 END*/
        }
    };

    var normalUtil = {
        isInIframe: function () {
            let is = global.parent !== global;
            try {
                is = is && global.parent.document.body.tagName !== 'FRAMESET'
            } catch (e) {
                // ignore
            }
            return is;
        },
        listenParentEvent: function (handler) {
            global.addEventListener('message', function (e) {
                var data = e.data;
                var type = data.type || '';
                if (type === 'changePercentage') {
                    handler(data.percentage || 0);
                }
            })
        },
        sentChangesToIframe: function (percentage) {
            var iframes = document.querySelectorAll('iframe') || [];
            var frames = document.querySelectorAll('frame');
            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].contentWindow.postMessage(
                        {type: 'changePercentage', percentage: percentage}, '*');
                }
            }
            if (frames.length) {
                for (var j = 0; j < frames.length; j++) {
                    frames[j].contentWindow.postMessage(
                        {type: 'changePercentage', percentage: percentage}, '*');
                }
            }
        }
    };

    var querySelectorAll = function (ele, selector, includeExtra) {
        var elements = ele.querySelectorAll(selector);
        elements = Array.prototype.slice.call(elements || []);
        if (includeExtra) {
            extraElements.forEach(function (element) {
                elements = elements.concat(querySelectorAll(element, selector, false));
            })
        }
        return elements;
    };

    var generate = function () {
        return function (util) {
            // disable worker
            workerURLs.forEach(function (url) {
                if (util.urlMatching(location.href, 'http.*://.*' + url + '.*')) {
                    window['Worker'] = undefined;
                    console.log('Worker disabled');
                }
            });
            var eHookContext = this;
            var timerHooker = {
                // 用于储存计时器的id和参数
                _intervalIds: {},
                // 计时器速率
                __percentage: 1.0,
                // 劫持前的原始的方法
                _setInterval: window['setInterval'],
                _clearInterval: window['clearInterval'],
                _clearTimeout: window['clearTimeout'],
                _setTimeout: window['setTimeout'],
                _Date: window['Date'],
                __lastDatetime: new Date().getTime(),
                __lastMDatetime: new Date().getTime(),
                videoSpeedInterval: 1000,
                /**
                 * 初始化方法
                 */
                init: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);

                    h.applyHooking();

                    // 设定百分比属性被修改的回调
                    Object.defineProperty(timerContext, '_percentage', {
                        get: function () {
                            return timerContext.__percentage;
                        },
                        set: function (percentage) {
                            if (percentage === timerContext.__percentage) {
                                return percentage;
                            }
                            h.percentageChangeHandler(percentage);
                            timerContext.__percentage = percentage;
                            return percentage;
                        }
                    });

                    if (!normalUtil.isInIframe()) {
                        console.log('[TimeHooker]', 'loading outer window...');
                        /***************禁用 BY 黄盐, PART 5 BEGIN
                        h.applyUI();
                        h.applyGlobalAction(timerContext);
                        h.registerShortcutKeys(timerContext);
                        ****************禁用 BY 黄盐, PART 5 END*/
                    } else {
                        console.log('[TimeHooker]', 'loading inner window...');
                        normalUtil.listenParentEvent((function (percentage) {
                            console.log('[TimeHooker]', 'Inner Changed', percentage)
                            this.change(percentage);
                        }).bind(this))
                    }
                },
                /**
                 * 调用该方法改变计时器速率
                 * @param percentage
                 */
                change: function (percentage) {
                    var _this = this;
                    this.__lastMDatetime = this._mDate.now();
                    // console.log(this._mDate.toString());
                    // console.log(new this._mDate());
                    this.__lastDatetime = this._Date.now();
                    // debugger;
                    //---------------------------------//
                    this._percentage = percentage;
                    /***************禁用 BY 黄盐, PART 6 BEGIN
                    var oldNode = document.getElementsByClassName('_th-click-hover');
                    var oldNode1 = document.getElementsByClassName('_th_times');
                    var displayNum = (1 / this._percentage).toFixed(2);
                    (oldNode[0] || {}).innerHTML = 'x' + displayNum;
                    (oldNode1[0] || {}).innerHTML = 'x' + displayNum;
                    var a = document.getElementsByClassName('_th_cover-all-show-times')[0] || {};
                    // console.log(a.className);
                    a.className = '_th_cover-all-show-times';
                    this._setTimeout.bind(window)(function () {
                        a.className = '_th_cover-all-show-times _th_hidden';
                    }, 100);
                    ****************禁用 BY 黄盐, PART 6 END*/
                    this.changeVideoSpeed();
                    this._clearInterval.bind(window)(this.videoSpeedIntervalId);
                    this.videoSpeedIntervalId = this._setInterval.bind(window)(function () {
                        _this.changeVideoSpeed();
                        var rate = 1 / _this._percentage;
                        if (rate === 1) {
                            _this._clearInterval.bind(window)(_this.videoSpeedIntervalId);
                        }
                    }, this.videoSpeedInterval);
                    normalUtil.sentChangesToIframe(percentage);
                },
                changeVideoSpeed: function () {
                    var rate = 1 / this._percentage;
                    /***************修改 BY 黄盐, PART 7 BEGIN */
                    rate > 20 && (rate = 20);
                    rate < 0.065 && (rate = 0.065);
                    // console.log(rate);
                    /****************修改 BY 黄盐, PART 7 END */

                    var videos = querySelectorAll(document, 'video', true) || [];
                    if (videos.length) {
                        for (var i = 0; i < videos.length; i++) {
                          /***************修改 BY 黄盐, PART 8 BEGIN */
                          try {
                            videos[i].playbackRate = rate
                          } catch (error) {
                            console.log("可能是设置播放速度超出支持的范围了", rate, error)
                          }
                          /****************修改 BY 黄盐, PART 8 END */
                        }
                    }
                }
            };
            // 默认初始化
            timerHooker.init();
            return timerHooker;
        }
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: 'timer',
            /**
             * 插件装载
             * @param util
             */
            mount: generate()
        });
    }
}(window);