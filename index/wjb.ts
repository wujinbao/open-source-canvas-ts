// 画布配置选项类型描述
type CanvasParam = {
	width: number,
	height: number
}

// 画布类
class Canvas {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	id: number | string
	canvasParam: CanvasParam = {
		width: 800,
		height: 600
	}
	drawTargetArray: Array<any> = []
	constructor(id?: number | string, canvasParam?: CanvasParam) {
		let body = document.body as HTMLCanvasElement
		let canvas = document.createElement('canvas') as HTMLCanvasElement
		body.appendChild(canvas)
		if (canvasParam) {
			for(let key in canvasParam){
        		canvas[key] = canvasParam[key]
  			}
  			this.canvasParam = canvasParam
		} else {
			canvas.width = this.canvasParam.width
			canvas.height = this.canvasParam.height		
		}
		this.ctx = canvas.getContext('2d')
		this.canvas = canvas
	}

	add(...drawTarget) {
		drawTarget.map((item) => {
			item.draw(this.ctx, item)

			this.drawTargetArray.push(item)
		})
	}

	remove(...drawTarget) {
		let newDrawTargetArray: Array<any> = []
		this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height)
		this.drawTargetArray.map((item, index) => {
			if (drawTarget.indexOf(item) == -1) {
				item.draw(this.ctx, item)
				newDrawTargetArray.push(item)
			}
		})
		this.drawTargetArray = newDrawTargetArray
	}
}

// 图形参数类型描述
// 注意属性 lineCap、lineJoin、globalCompositeOperation 类型
// 分别是：CanvasLineCap、CanvasLineJoin、GlobalCompositeOperation
// 而不是 string 类型
type DrawParam = {
	left?: number,
	top?: number,
	dotArray?: Array<[number, number]>,
	width?: number,
	height?: number,
	radius?: number,
	rX?: number,
	rY?: number,
	sAngle?: number,
	eAngle?: number,
	counterclockwise?: boolean,
	fill?: string,
	stroke?: string,
	shadowColor?: string,
	shadowBlur?: number,
	shadowOffsetX?: number,
	shadowOffsetY?: number,
	lineCap?: CanvasLineCap,
	lineJoin?: CanvasLineJoin,
	lineWidth?: number,
	miterLimit?: number,
	angle?: number,
	scaleWidth?: number,
	scaleHeight?: number,
	globalAlpha?: number,
	globalCompositeOperation?: GlobalCompositeOperation
}

// 图形公共类
// 问题：获取子类的属性与方法可以先获取到子类实例 this
class DarwCommon {
	drawParam: DrawParam = {
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
		globalCompositeOperation: 'source-over'
	}

	constructor(drawParam: DrawParam) {
		if (drawParam) {
			for(let key in drawParam){
        		this.drawParam[key] = drawParam[key]
  			}
		}
	}

	get(attr: string) {
		let drawParam = this.drawParam
		return drawParam[attr]
	}

	set(attr: any, val?: any) {
		let drawParam = this.drawParam
		if (arguments.length === 2) {
			drawParam[attr] = val
		} else {
			for (let key in attr) {
				drawParam[key] = attr[key]
			}
		}
	}

	draw(ctx: CanvasRenderingContext2D, drawTarget: any) {
		ctx.save()
		ctx.beginPath()
		ctx.shadowColor = this.drawParam.shadowColor
		ctx.shadowBlur = this.drawParam.shadowBlur
		ctx.shadowOffsetX = this.drawParam.shadowOffsetX
		ctx.shadowOffsetY = this.drawParam.shadowOffsetY
		ctx.lineCap = this.drawParam.lineCap
		ctx.lineJoin = this.drawParam.lineJoin
		ctx.lineWidth = this.drawParam.lineWidth
		ctx.miterLimit = this.drawParam.miterLimit
		ctx.globalAlpha = this.drawParam.globalAlpha
		ctx.globalCompositeOperation = this.drawParam.globalCompositeOperation
		ctx.translate(this.drawParam.left, this.drawParam.top)
		ctx.rotate(this.drawParam.angle * Math.PI / 180)
		ctx.scale(this.drawParam.scaleWidth, this.drawParam.scaleHeight)
		drawTarget.privateDraw(ctx)
		if (this.drawParam.fill && this.drawParam.stroke) {
			ctx.fillStyle = this.drawParam.fill
			ctx.fill()

			ctx.strokeStyle = this.drawParam.stroke
			ctx.stroke()
		} else if (this.drawParam.fill) {
			ctx.fillStyle = this.drawParam.fill
			ctx.fill()
		} else {
			ctx.strokeStyle = this.drawParam.stroke
			ctx.stroke()
		}
		ctx.restore()
	}
}

// 矩形类
class Rect extends DarwCommon {
	drawParam: DrawParam
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		ctx.rect(
			0, 
			0, 
			drawParam.width, 
			drawParam.height
		)
	}
}

// 圆形类
class Circle extends DarwCommon {
	drawParam: DrawParam
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		ctx.arc(
			0, 
			0, 
			drawParam.radius, 
			drawParam.sAngle * Math.PI,
			drawParam.eAngle * Math.PI,
			drawParam.counterclockwise
		)
	}
}

class Triangle extends DarwCommon {
	drawParam: DrawParam
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		ctx.moveTo(0, 0)
		ctx.lineTo(drawParam.width / 2, drawParam.height)
		ctx.lineTo(-drawParam.width / 2, drawParam.height)
		ctx.closePath()
	}
}

class Line extends DarwCommon {
	drawParam: DrawParam
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let dotArray = this.drawParam.dotArray
		ctx.moveTo(0, 0)
		dotArray.map((item) => {
			ctx.lineTo(item[0], item[1])
		})
	}
}

class Ellipse extends DarwCommon {
	drawParam: DrawParam
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		let rX = drawParam.rX
		let rY = drawParam.rY
		if (!ctx.ellipse) {
			ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI*2)
		} else {
			ctx.translate(-drawParam.left, -drawParam.top)
			let r = (rX > rY) ? rX : rY
    		drawParam.scaleWidth = rX / r
    		drawParam.scaleHeight = rY / r
    		ctx.scale(drawParam.scaleWidth, drawParam.scaleHeight)
    		ctx.arc(drawParam.left / drawParam.scaleWidth, drawParam.top / drawParam.scaleHeight, r, 0, 2 * Math.PI, false)
		}
	}
}



// 代码运行测试
let canvas = new Canvas()

let rect = new Rect({
	left: 30,
	top: 30,
	fill: 'red',
	shadowBlur: 20,
	shadowOffsetX: -20
})

let rect1 = new Rect({
	left: 50,
	top: 50,
	fill: 'yellow',
	globalCompositeOperation: "destination-over"
})

let rect2 = new Rect({
	left: 100,
	top: 100,
	width: 100,
	height: 100,
	stroke: 'yellow',
	scaleWidth: 2,
	scaleHeight: 2
})

let circle = new Circle({
	left: 200,
	top: 50,
	eAngle: 1.5,
	fill: "green",
	angle: 45,
	globalAlpha: 0.5
})

let triangle = new Triangle({
	left: 50,
	top: 120,
	width: 80,
	stroke: 'blue',
	lineJoin: 'round',
	lineWidth: 5,
})

canvas.add(rect, rect1, rect2, circle, triangle)

rect2.set('left', 200)
circle.set({
	left: 250,
	radius: 20
})

canvas.remove(rect2)

let line = new Line({
	left: 150,
	top: 50,
	stroke: 'purple',
	angle: 90,
	dotArray: [[50, -50]]
})

let ellipse = new Ellipse({
	left: 150,
	top: 200,
	angle: 45,
	stroke: 'orange'
})

canvas.add(line, ellipse)