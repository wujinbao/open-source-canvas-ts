var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 画布类
var Canvas = /** @class */ (function () {
    function Canvas(id, canvasParam) {
        this.canvasParam = {
            width: 800,
            height: 600
        };
        this.drawTarget = [];
        var body = document.body;
        var canvas = document.createElement('canvas');
        body.appendChild(canvas);
        if (canvasParam) {
            for (var key in canvasParam) {
                canvas[key] = canvasParam[key];
            }
            this.canvasParam = canvasParam;
        }
        else {
            canvas.width = this.canvasParam.width;
            canvas.height = this.canvasParam.height;
        }
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
    }
    Canvas.prototype.add = function () {
        var _this = this;
        var drawTarget = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            drawTarget[_i] = arguments[_i];
        }
        drawTarget.map(function (item) {
            item.draw(_this.ctx, item);
            _this.drawTarget.push(item);
        });
    };
    Canvas.prototype.remove = function () {
        var _this = this;
        var drawTarget = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            drawTarget[_i] = arguments[_i];
        }
        var newDrawTarget = [];
        this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height);
        this.drawTarget.map(function (item, index) {
            if (drawTarget.indexOf(item) == -1) {
                item.draw(_this.ctx, item);
                newDrawTarget.push(item);
            }
        });
        this.drawTarget = newDrawTarget;
    };
    return Canvas;
}());
// 图形公共类
// 问题：获取子类的属性与方法可以先获取到子类实例 this
var DarwCommon = /** @class */ (function () {
    function DarwCommon(drawParam) {
        this.drawParam = {
            left: 0,
            top: 0,
            width: 50,
            height: 50,
            radius: 50,
            sAngle: 0,
            eAngle: 2,
            counterclockwise: false,
            fill: '',
            stroke: '',
            lineWidth: 1
        };
        if (drawParam) {
            for (var key in drawParam) {
                this.drawParam[key] = drawParam[key];
            }
        }
    }
    DarwCommon.prototype.get = function (attr) {
        var drawParam = this.drawParam;
        return drawParam[attr];
    };
    DarwCommon.prototype.set = function (attr, val) {
        var drawParam = this.drawParam;
        if (arguments.length === 2) {
            drawParam[attr] = val;
        }
        else {
            for (var key in attr) {
                drawParam[key] = attr[key];
            }
        }
    };
    DarwCommon.prototype.draw = function (ctx, drawTarget) {
        ctx.save();
        ctx.beginPath();
        drawTarget.privateDraw(ctx);
        if (this.drawParam.fill) {
            ctx.fillStyle = this.drawParam.fill;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this.drawParam.stroke;
            ctx.lineWidth = this.drawParam.lineWidth;
            ctx.stroke();
        }
        ctx.restore();
    };
    return DarwCommon;
}());
// 矩形类
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(drawParam) {
        return _super.call(this, drawParam) || this;
    }
    Rect.prototype.privateDraw = function (ctx) {
        var drawParam = this.drawParam;
        ctx.rect(drawParam.left, drawParam.top, drawParam.width, drawParam.height);
    };
    return Rect;
}(DarwCommon));
// 圆形类
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(drawParam) {
        return _super.call(this, drawParam) || this;
    }
    Circle.prototype.privateDraw = function (ctx) {
        var drawParam = this.drawParam;
        ctx.arc(drawParam.left, drawParam.top, drawParam.radius, drawParam.sAngle * Math.PI, drawParam.eAngle * Math.PI, drawParam.counterclockwise);
    };
    return Circle;
}(DarwCommon));
var Triangle = /** @class */ (function (_super) {
    __extends(Triangle, _super);
    function Triangle(drawParam) {
        return _super.call(this, drawParam) || this;
    }
    Triangle.prototype.privateDraw = function (ctx) {
        var drawParam = this.drawParam;
        ctx.moveTo(drawParam.left, drawParam.top);
        ctx.lineTo(drawParam.left + drawParam.width / 2, drawParam.top + drawParam.height);
        ctx.lineTo(drawParam.left - drawParam.width / 2, drawParam.top + drawParam.height);
        ctx.closePath();
    };
    return Triangle;
}(DarwCommon));
// 代码运行测试
var canvas = new Canvas();
var rect = new Rect({
    left: 10,
    top: 10,
    fill: 'red'
});
var rect1 = new Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    stroke: 'yellow',
    lineWidth: 5
});
var circle = new Circle({
    left: 200,
    top: 50,
    eAngle: 1.5,
    fill: "green"
});
var triangle = new Triangle();
canvas.add(rect, rect1, circle);
rect1.set('left', 200);
circle.set({
    left: 250,
    radius: 20
});
canvas.remove(rect1);
