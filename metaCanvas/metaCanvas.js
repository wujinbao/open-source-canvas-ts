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
    function Canvas(canvasParam, id) {
        this.canvasParam = {
            width: 800,
            height: 600
        };
        this.drawTargetArray = [];
        this.interval = 1000 / 60;
        var body = document.body;
        var canvas = document.createElement('canvas');
        body.appendChild(canvas);
        canvas.onmousedown = this.onmousedown.bind(this);
        canvas.onmouseup = this.onmouseup.bind(this);
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
    Canvas.prototype.add = function (drawTargetArray) {
        var _this = this;
        drawTargetArray.map(function (item) {
            if (_this.drawTargetArray.indexOf(item) == -1) {
                item.draw(_this, item);
                _this.drawTargetArray.push(item);
            }
        });
        return this;
    };
    Canvas.prototype.remove = function (drawTargetArray) {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height);
        var newDrawTargetArray = [];
        this.drawTargetArray.map(function (item, index) {
            if (drawTargetArray.indexOf(item) == -1) {
                item.draw(_this, item);
                newDrawTargetArray.push(item);
            }
        });
        this.drawTargetArray = newDrawTargetArray;
        return this;
    };
    Canvas.prototype.renderAll = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height);
        this.drawTargetArray.map(function (item) {
            item.draw(_this, item);
        });
    };
    // todo e 是什么类型
    Canvas.prototype.onmousedown = function (e) {
        var _this = this;
        var x = e.offsetX;
        var y = e.offsetY;
        this.drawTargetArray.map(function (drawTargetItem) {
            var vertexWidth = drawTargetItem.vertexWidth;
            var vertexHeight = drawTargetItem.vertexHeight;
            var vertexArray = drawTargetItem.vertexArray;
            vertexArray.map(function (item) {
                if (x >= item[0] - vertexWidth && x <= item[0] + vertexWidth && y >= item[1] - vertexHeight && y <= item[1] + vertexHeight) {
                    console.log(item);
                }
            });
            if (x >= vertexArray[0][0] && x <= vertexArray[4][0] && y >= vertexArray[0][1] && y <= vertexArray[4][1]) {
                _this.lastX = x;
                _this.lastY = y;
                _this.now = Date.now();
                _this.canvas.onmousemove = _this.onmousemove.bind(_this, drawTargetItem);
            }
        });
    };
    Canvas.prototype.onmouseup = function () {
        this.canvas.onmousemove = null;
    };
    Canvas.prototype.onmousemove = function (drawTargetItem, e) {
        var currentX = e.offsetX;
        var currentY = e.offsetY;
        var currentTime = Date.now();
        var currentInterval = currentTime - this.now;
        if (currentInterval > this.interval) {
            drawTargetItem.drawParam.left += currentX - this.lastX;
            drawTargetItem.drawParam.top += currentY - this.lastY;
            this.renderAll();
            this.now = currentTime;
            this.lastX = currentX;
            this.lastY = currentY;
        }
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
var DrawCommon = /** @class */ (function () {
    function DrawCommon(drawParam) {
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
        this.vertexWidth = 10;
        this.vertexHeight = 10;
        this.animateOption = {
            vX: 0, vY: 0, sX: 0, sY: 0
        };
        if (drawParam) {
            for (var key in drawParam) {
                this.drawParam[key] = drawParam[key];
            }
        }
    }
    DrawCommon.prototype.get = function (attr) {
        return this.drawParam[attr];
    };
    DrawCommon.prototype.set = function (attr) {
        for (var key in attr) {
            this.drawParam[key] = attr[key];
        }
        return this;
    };
    DrawCommon.prototype.draw = function (canvas, drawTarget) {
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
        ctx.restore();
        if (drawTarget.drawParam.selectable) {
            this.vertexDraw(ctx, drawTarget);
        }
    };
    // 父类需子类重写的方法
    DrawCommon.prototype.privateDraw = function (ctx) { };
    // 图形选择器 - 根据顶点绘制
    DrawCommon.prototype.vertexDraw = function (ctx, drawTarget) {
        var vertexArray = drawTarget.vertexArray;
        var drawParam = drawTarget.drawParam;
        var scaleWidth = drawParam.scaleWidth;
        var scaleHeight = drawTarget.drawParam.scaleHeight;
        var vertexWidth = drawTarget.vertexWidth * scaleWidth;
        var vertexHeight = drawTarget.vertexHeight * scaleHeight;
        ctx.save();
        // 处理旋转问题
        ctx.translate(drawTarget.drawParam.left, drawTarget.drawParam.top);
        ctx.rotate(drawTarget.drawParam.angle * Math.PI / 180);
        ctx.translate(-drawTarget.drawParam.left, -drawTarget.drawParam.top);
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
            ctx.fillRect(item[0] - vertexWidth / 2, item[1] - vertexHeight / 2, vertexWidth, vertexHeight);
        });
        ctx.fillRect(vertexArray[1][0] - vertexWidth / 2, vertexArray[1][1] - vertexHeight * 3.5, vertexWidth, vertexHeight);
        ctx.closePath();
        ctx.moveTo(vertexArray[1][0], vertexArray[1][1] - vertexHeight / 2);
        ctx.lineTo(vertexArray[1][0], vertexArray[1][1] - vertexHeight * 2.5);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
    DrawCommon.prototype.animate = function (direction, distance, animateOption) {
        // 判断图形是否已添加到画布上
        if (this.canvas.drawTargetArray.indexOf(this) == -1) {
            this.canvas.drawTargetArray.push(this);
        }
        this.requestID = requestAnimationFrame(this.animate.bind(this, direction, distance, this.animateOption));
        if (animateOption) {
            for (var key in animateOption) {
                this.animateOption[key] = animateOption[key];
            }
        }
        if (typeof distance == 'number') {
            if (direction == Direction.Left && this.drawParam.left >= distance) {
                this.drawParam.left -= this.animateOption.vX;
                this.drawParam.top += this.animateOption.vY;
            }
            else if (direction == Direction.Right && this.drawParam.left <= distance) {
                this.drawParam.left += this.animateOption.vX;
                this.drawParam.top += this.animateOption.vY;
            }
            else if (direction == Direction.Top && this.drawParam.top >= distance) {
                this.drawParam.left += this.animateOption.vX;
                this.drawParam.top -= this.animateOption.vY;
            }
            else if (direction == Direction.Down && this.drawParam.top <= distance) {
                this.drawParam.left += this.animateOption.vX;
                this.drawParam.top += this.animateOption.vY;
            }
            else {
                cancelAnimationFrame(this.requestID);
            }
        }
        else if (typeof distance == 'string') {
        }
        this.animateOption.vX += this.animateOption.sX;
        this.animateOption.vY += this.animateOption.sY;
        this.canvas.ctx.clearRect(0, 0, this.canvas.canvasParam.width, this.canvas.canvasParam.height);
        this.canvas.renderAll();
    };
    return DrawCommon;
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
        // 保证放大、缩小后获取的顶点坐标正确值
        var scaleWidth = this.drawParam.scaleWidth;
        var scaleHeight = this.drawParam.scaleHeight;
        var width = this.drawParam.width * scaleWidth;
        var height = this.drawParam.height * scaleHeight;
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
}(DrawCommon));
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
        // // 保证放大、缩小后获取的顶点坐标正确值
        var scaleWidth = this.drawParam.scaleWidth;
        var scaleHeight = this.drawParam.scaleHeight;
        var radius = this.drawParam.radius;
        var radiusWidth = radius * scaleWidth;
        var radiusHeight = radius * scaleHeight;
        this.vertexArray = [
            [left - radiusWidth, top - radiusHeight],
            [left, top - radiusHeight],
            [left + radiusWidth, top - radiusHeight],
            [left + radiusWidth, top],
            [left + radiusWidth, top + radiusHeight],
            [left, top + radiusHeight],
            [left - radiusWidth, top + radiusHeight],
            [left - radiusWidth, top]
        ];
    };
    return Circle;
}(DrawCommon));
// 三角形类
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
        // 保证放大、缩小后获取的顶点坐标正确值
        var scaleWidth = this.drawParam.scaleWidth;
        var scaleHeight = this.drawParam.scaleHeight;
        var width = this.drawParam.width * scaleWidth;
        var height = this.drawParam.height * scaleHeight;
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
}(DrawCommon));
// 线类
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
}(DrawCommon));
// 椭圆类
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(drawParam) {
        return _super.call(this, drawParam) || this;
    }
    // todo 椭圆放大缩小问题未解决
    Ellipse.prototype.privateDraw = function (ctx) {
        var drawParam = this.drawParam;
        var rX = drawParam.rX;
        var rY = drawParam.rY;
        var r = (rX > rY) ? rX : rY;
        drawParam.scaleWidth = rX / r;
        drawParam.scaleHeight = rY / r;
        if (ctx.ellipse) {
            console.log(drawParam.scaleWidth);
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
        // // 保证放大、缩小后获取的顶点坐标正确值
        var scaleWidth = this.drawParam.scaleWidth;
        var scaleHeight = this.drawParam.scaleHeight;
        var rX = this.drawParam.rX * scaleWidth;
        var rY = this.drawParam.rY * scaleHeight;
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
}(DrawCommon));
