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
        this.drawTargetArray = []; // todo 不定数的实例化对象是什么类型
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
    // todo ...drawTarget 不定数的实例化对象是什么类型
    Canvas.prototype.add = function () {
        var _this = this;
        var drawTarget = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            drawTarget[_i] = arguments[_i];
        }
        drawTarget.map(function (item) {
            if (_this.drawTargetArray.indexOf(item) == -1) {
                item.draw(_this, item);
                _this.drawTargetArray.push(item);
            }
        });
        return this;
    };
    Canvas.prototype.remove = function () {
        var _this = this;
        var drawTarget = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            drawTarget[_i] = arguments[_i];
        }
        this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height);
        this.drawTargetArray.map(function (item, index) {
            if (drawTarget.indexOf(item) == -1) {
                item.draw(_this, item);
                _this.drawTargetArray.push(item);
            }
        });
        return this;
    };
    Canvas.prototype.renderAll = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height);
        this.drawTargetArray.map(function (item) {
            item.draw(_this, item);
        });
    };
    return Canvas;
}());
var Direction;
(function (Direction) {
    Direction["Left"] = "left";
    Direction["Right"] = "right";
    Direction["Top"] = "top";
    Direction["Down"] = "down";
})(Direction || (Direction = {}));
// 图形公共类
// 问题：获取子类的属性与方法可以先获取到子类实例 this
var DarwCommon = /** @class */ (function () {
    function DarwCommon(drawParam) {
        this.drawParam = {
            left: 0,
            top: 0,
            dotArray: [[10, 10]],
            width: 50,
            height: 50,
            radius: 50,
            rX: 20,
            rY: 10,
            sAngle: 0,
            eAngle: 2,
            counterclockwise: false,
            fill: '',
            stroke: '',
            shadowColor: '#000',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            lineCap: 'butt',
            lineJoin: 'miter',
            lineWidth: 1,
            miterLimit: 10,
            angle: 0,
            scaleWidth: 1,
            scaleHeight: 1,
            globalAlpha: 1,
            globalCompositeOperation: 'source-over',
            selectable: false
        };
        this.animateOption = {
            vx: 1, vy: 1, sx: 1, sy: 1, kx: 1, ky: 1
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
        if (typeof attr === 'string') {
            drawParam[attr] = val;
        }
        else {
            for (var key in attr) {
                drawParam[key] = attr[key];
            }
        }
        return this;
    };
    DarwCommon.prototype.draw = function (canvas, drawTarget) {
        this.canvas = canvas;
        var ctx = canvas.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.shadowColor = this.drawParam.shadowColor;
        ctx.shadowBlur = this.drawParam.shadowBlur;
        ctx.shadowOffsetX = this.drawParam.shadowOffsetX;
        ctx.shadowOffsetY = this.drawParam.shadowOffsetY;
        ctx.lineCap = this.drawParam.lineCap;
        ctx.lineJoin = this.drawParam.lineJoin;
        ctx.lineWidth = this.drawParam.lineWidth;
        ctx.miterLimit = this.drawParam.miterLimit;
        ctx.globalAlpha = this.drawParam.globalAlpha;
        ctx.globalCompositeOperation = this.drawParam.globalCompositeOperation;
        ctx.translate(this.drawParam.left, this.drawParam.top);
        ctx.rotate(this.drawParam.angle * Math.PI / 180);
        ctx.scale(this.drawParam.scaleWidth, this.drawParam.scaleHeight);
        drawTarget.privateDraw(ctx);
        if (this.drawParam.fill && this.drawParam.stroke) {
            ctx.fillStyle = this.drawParam.fill;
            ctx.fill();
            ctx.strokeStyle = this.drawParam.stroke;
            ctx.stroke();
        }
        else if (this.drawParam.fill) {
            ctx.fillStyle = this.drawParam.fill;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this.drawParam.stroke;
            ctx.stroke();
        }
        ctx.closePath();
        if (drawTarget.drawParam.selectable) {
            this.vertexDraw(ctx, drawTarget);
        }
        ctx.restore();
    };
    DarwCommon.prototype.vertexDraw = function (ctx, drawTarget) {
        var vertexArray = drawTarget.vertexArray;
        var drawParam = drawTarget.drawParam;
        ctx.translate(-drawParam.left, -drawParam.top);
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.lineWidth = 1;
        ctx.miterLimit = 10;
        ctx.globalAlpha = 0.2;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = '#00a7d0';
        ctx.fillStyle = '#00a7d0';
        ctx.beginPath();
        vertexArray.map(function (item, index) {
            if (index === 0) {
                ctx.moveTo(item[0], item[1]);
            }
            else {
                ctx.lineTo(item[0], item[1]);
            }
            ctx.fillRect(item[0] - 2.5, item[1] - 2.5, 5, 5);
        });
        ctx.fillRect(vertexArray[1][0] - 2.5, vertexArray[1][1] - 17.5, 5, 5);
        ctx.closePath();
        ctx.moveTo(vertexArray[1][0], vertexArray[1][1] - 2.5);
        ctx.lineTo(vertexArray[1][0], vertexArray[1][1] - 12.5);
        ctx.stroke();
        ctx.closePath();
    };
    DarwCommon.prototype.animate = function (direction, distance, animateOption) {
        this.requestID = requestAnimationFrame(this.animate.bind(this, direction, distance, animateOption));
        if (animateOption) {
            for (var key in animateOption) {
                this.animateOption[key] = animateOption[key];
            }
        }
        if (typeof distance == 'number') {
            if (direction == Direction.Left && this.drawParam.left >= distance) {
                this.drawParam.left -= this.animateOption.vx * this.animateOption.sx;
            }
            else if (direction == Direction.Right && this.drawParam.left <= distance) {
                this.drawParam.left += this.animateOption.vx * this.animateOption.sx;
            }
            else if (direction == Direction.Top && this.drawParam.top >= distance) {
                this.drawParam.top -= this.animateOption.vy * this.animateOption.sy;
            }
            else if (direction == Direction.Down && this.drawParam.top <= distance) {
                this.drawParam.top += this.animateOption.vy * this.animateOption.sy;
            }
            else {
                cancelAnimationFrame(this.requestID);
            }
        }
        else if (typeof distance == 'string') {
        }
        this.canvas.ctx.clearRect(0, 0, this.canvas.canvasParam.width, this.canvas.canvasParam.height);
        this.canvas.renderAll();
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
        ctx.rect(0, 0, drawParam.width, drawParam.height);
        this.vertex();
    };
    Rect.prototype.vertex = function () {
        var left = this.drawParam.left;
        var top = this.drawParam.top;
        var width = this.drawParam.width;
        var height = this.drawParam.height;
        this.vertexArray = [
            [left, top],
            [left + width / 2, top],
            [left + width, top],
            [left + width, top + height / 2],
            [left + width, top + height],
            [left + width / 2, top + height],
            [left, top + height],
            [left, top + height / 2]
        ];
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
        ctx.arc(0, 0, drawParam.radius, drawParam.sAngle * Math.PI, drawParam.eAngle * Math.PI, drawParam.counterclockwise);
        this.vertex();
    };
    Circle.prototype.vertex = function () {
        var left = this.drawParam.left;
        var top = this.drawParam.top;
        var radius = this.drawParam.radius;
        this.vertexArray = [
            [left - radius, top - radius],
            [left, top - radius],
            [left + radius, top - radius],
            [left + radius, top],
            [left + radius, top + radius],
            [left, top + radius],
            [left - radius, top + radius],
            [left - radius, top]
        ];
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
        ctx.moveTo(0, 0);
        ctx.lineTo(drawParam.width / 2, drawParam.height);
        ctx.lineTo(-drawParam.width / 2, drawParam.height);
        ctx.closePath();
        this.vertex();
    };
    Triangle.prototype.vertex = function () {
        var left = this.drawParam.left;
        var top = this.drawParam.top;
        var width = this.drawParam.width;
        var height = this.drawParam.height;
        this.vertexArray = [
            [left - width / 2, top],
            [left, top],
            [left + width / 2, top],
            [left + width / 2, top + height / 2],
            [left + width / 2, top + height],
            [left, top + height],
            [left - width / 2, top + height],
            [left - width / 2, top + height / 2]
        ];
    };
    return Triangle;
}(DarwCommon));
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(drawParam) {
        return _super.call(this, drawParam) || this;
    }
    Line.prototype.privateDraw = function (ctx) {
        var dotArray = this.drawParam.dotArray;
        ctx.moveTo(0, 0);
        dotArray.map(function (item) {
            ctx.lineTo(item[0], item[1]);
        });
    };
    return Line;
}(DarwCommon));
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(drawParam) {
        return _super.call(this, drawParam) || this;
    }
    Ellipse.prototype.privateDraw = function (ctx) {
        var drawParam = this.drawParam;
        var rX = drawParam.rX;
        var rY = drawParam.rY;
        var r = (rX > rY) ? rX : rY;
        drawParam.scaleWidth = rX / r;
        drawParam.scaleHeight = rY / r;
        if (ctx.ellipse) {
            ctx.ellipse(0, 0, rX, rY, 0, drawParam.sAngle * Math.PI, drawParam.eAngle * Math.PI, drawParam.counterclockwise);
        }
        else {
            ctx.scale(drawParam.scaleWidth, drawParam.scaleHeight);
            ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
        }
        this.vertex();
    };
    Ellipse.prototype.vertex = function () {
        var left = this.drawParam.left;
        var top = this.drawParam.top;
        var rX = this.drawParam.rX;
        var rY = this.drawParam.rY;
        this.vertexArray = [
            [left - rX, top - rY],
            [left, top - rY],
            [left + rX, top - rY],
            [left + rX, top],
            [left + rX, top + rY],
            [left, top + rY],
            [left - rX, top + rY],
            [left - rX, top]
        ];
    };
    return Ellipse;
}(DarwCommon));
// 代码运行测试
var canvas = new Canvas();
var rect = new Rect({
    left: 30,
    top: 30,
    fill: 'red',
    shadowBlur: 20,
    shadowOffsetX: -20,
    selectable: true
});
var rect1 = new Rect({
    left: 50,
    top: 50,
    fill: 'yellow',
    globalCompositeOperation: "destination-over"
});
var rect2 = new Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    stroke: 'yellow',
    scaleWidth: 2,
    scaleHeight: 2,
    selectable: true,
    lineWidth: 5
});
var circle = new Circle({
    left: 200,
    top: 350,
    eAngle: 1.5,
    fill: "green",
    angle: 45,
    globalAlpha: 0.5,
    selectable: true
});
var triangle = new Triangle({
    left: 50,
    top: 120,
    width: 80,
    stroke: 'blue',
    lineJoin: 'round',
    lineWidth: 5,
    selectable: true
});
canvas.add(rect, rect1, rect2, circle, triangle);
rect2.set('left', 200);
circle.set({
    left: 250,
    radius: 20
});
canvas.remove(rect2);
var line = new Line({
    left: 50,
    top: 250,
    stroke: 'purple',
    dotArray: [[50, 50]]
});
var ellipse = new Ellipse({
    left: 150,
    top: 200,
    stroke: 'orange',
    angle: 45,
    scaleWidth: 2,
    scaleHeight: 2,
    selectable: true
});
canvas.add(line, ellipse, rect2);
rect1.animate('right', 150, {
    vx: 2
});
triangle.animate('down', 200);
circle.animate('top', 50);
