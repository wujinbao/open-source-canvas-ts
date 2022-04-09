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
	drawTargetArray: Array<any> = [] // todo 不定数的实例化对象是什么类型
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

	// todo ...drawTarget 不定数的实例化对象是什么类型
	add(...drawTarget) {
		drawTarget.map((item) => {
			if (this.drawTargetArray.indexOf(item) == -1) {
				item.draw(this, item)
				this.drawTargetArray.push(item)
			}
		})

		return this
	}

	remove(...drawTarget) {
		this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height)
		this.drawTargetArray.map((item, index) => {
			if (drawTarget.indexOf(item) == -1) {
				item.draw(this, item)
				this.drawTargetArray.push(item)
			}
		})

		return this
	}

	renderAll() {
		this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height)
		this.drawTargetArray.map((item) => {
			item.draw(this, item)
		})
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
	globalCompositeOperation?: GlobalCompositeOperation,
	selectable?: boolean
}

enum Direction {
	Left = 'left',
	Right ='right',
	Top = 'top',
	Down = 'down'
}

type AnimateOption = {
	vx?: number,
	vy?: number,
	sx?: number,
	sy?: number,
	kx?: number,
	ky?: number
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
		globalCompositeOperation: 'source-over',
		selectable: false
	}
	vertexArray: Array<[number, number]>
	canvas: Canvas
	requestID: number
	animateOption: AnimateOption = {
		vx: 1, vy: 1, sx: 1, sy: 1, kx: 1, ky: 1
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

	set(attr: string | DrawParam, val?: any) {
		let drawParam = this.drawParam
		if (typeof attr === 'string') {
			drawParam[attr] = val
		} else {
			for (let key in attr) {
				drawParam[key] = attr[key]
			}
		}

		return this
	}

	draw(canvas: Canvas, drawTarget: any) {
		this.canvas = canvas
		let ctx = canvas.ctx
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
		ctx.closePath()

		if (drawTarget.drawParam.selectable) {
			this.vertexDraw(ctx, drawTarget)
		}

		ctx.restore()
	}

	vertexDraw(ctx: CanvasRenderingContext2D, drawTarget: any) {
		let vertexArray = drawTarget.vertexArray
		let drawParam = drawTarget.drawParam
		ctx.translate(-drawParam.left, -drawParam.top)
		ctx.lineCap = 'butt'
		ctx.lineJoin = 'miter'
		ctx.lineWidth = 1
		ctx.miterLimit = 10
		ctx.globalAlpha = 0.2
		ctx.globalCompositeOperation = 'source-over'
		ctx.strokeStyle = '#00a7d0'
		ctx.fillStyle = '#00a7d0'
		ctx.beginPath()
		vertexArray.map((item, index) => {
			if (index === 0) {
				ctx.moveTo(item[0], item[1])
			} else {
				ctx.lineTo(item[0], item[1])
			}
		
			ctx.fillRect(item[0] - 2.5, item[1] - 2.5, 5, 5)
		})
		ctx.fillRect(vertexArray[1][0] - 2.5, vertexArray[1][1] - 17.5, 5, 5)
		ctx.closePath()
		ctx.moveTo(vertexArray[1][0], vertexArray[1][1] - 2.5)
		ctx.lineTo(vertexArray[1][0], vertexArray[1][1] - 12.5)
		ctx.stroke()
		ctx.closePath()
	}
	
	animate(direction: string, distance: number | string, animateOption?: AnimateOption) {
		this.requestID = requestAnimationFrame(this.animate.bind(this, direction, distance, animateOption))

		if (animateOption) {
			for(let key in animateOption){
        		this.animateOption[key] = animateOption[key]
  			}
		}

		if (typeof distance == 'number') {
			if (direction == Direction.Left && this.drawParam.left >= distance) {
				this.drawParam.left -= this.animateOption.vx * this.animateOption.sx
			} else if (direction == Direction.Right && this.drawParam.left <= distance) {
				this.drawParam.left += this.animateOption.vx * this.animateOption.sx
			} else if (direction == Direction.Top && this.drawParam.top >= distance) {
				this.drawParam.top -= this.animateOption.vy * this.animateOption.sy
			} else if (direction == Direction.Down && this.drawParam.top <= distance) {
				this.drawParam.top += this.animateOption.vy * this.animateOption.sy
			} else {
				cancelAnimationFrame(this.requestID)
			}
		} else if (typeof distance == 'string') {

		}

		this.canvas.ctx.clearRect(0, 0, this.canvas.canvasParam.width, this.canvas.canvasParam.height)
		this.canvas.renderAll()		
	}
}

// 矩形类
class Rect extends DarwCommon {
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

		this.vertex()
	}

	vertex() {
		let left = this.drawParam.left
		let top = this.drawParam.top
		let width = this.drawParam.width
		let height = this.drawParam.height
		this.vertexArray = [
			[left, top],
			[left + width / 2, top],
			[left + width, top],
			[left + width, top + height / 2],
			[left + width, top + height],
			[left + width / 2, top + height],
			[left, top + height],
			[left, top + height / 2]
		]
	}
}

// 圆形类
class Circle extends DarwCommon {
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

		this.vertex()
	}

	vertex() {
		let left = this.drawParam.left
		let top = this.drawParam.top
		let radius = this.drawParam.radius
		this.vertexArray = [
			[left - radius, top - radius],
			[left, top - radius],
			[left + radius, top - radius],
			[left + radius, top],
			[left + radius, top + radius],
			[left, top + radius],
			[left - radius, top + radius],
			[left - radius, top]
		]
	}
}

class Triangle extends DarwCommon {
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		ctx.moveTo(0, 0)
		ctx.lineTo(drawParam.width / 2, drawParam.height)
		ctx.lineTo(-drawParam.width / 2, drawParam.height)
		ctx.closePath()

		this.vertex()
	}

	vertex() {
		let left = this.drawParam.left
		let top = this.drawParam.top
		let width = this.drawParam.width
		let height = this.drawParam.height
		this.vertexArray = [
			[left - width / 2, top],
			[left, top],
			[left + width / 2, top],
			[left + width / 2, top + height / 2],
			[left + width / 2, top + height],
			[left, top + height],
			[left - width / 2, top + height],
			[left - width / 2, top + height / 2]
		]
	}
}

class Line extends DarwCommon {
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
	constructor(drawParam?: DrawParam) {
		super(drawParam)
	}

	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		let rX = drawParam.rX
		let rY = drawParam.rY
		let r = (rX > rY) ? rX : rY
    	drawParam.scaleWidth = rX / r
    	drawParam.scaleHeight = rY / r
		if (ctx.ellipse) {
			ctx.ellipse(0, 0, rX, rY, 0, drawParam.sAngle * Math.PI,
			drawParam.eAngle * Math.PI,
			drawParam.counterclockwise)
		} else {
    		ctx.scale(drawParam.scaleWidth, drawParam.scaleHeight)
    		ctx.arc(0, 0, r, 0, 2 * Math.PI, false)
		}

		this.vertex()
	}

	vertex() {
		let left = this.drawParam.left
		let top = this.drawParam.top
		let rX = this.drawParam.rX
		let rY = this.drawParam.rY
		this.vertexArray = [
			[left - rX, top - rY],
			[left, top - rY],
			[left + rX, top - rY],
			[left + rX, top],
			[left + rX, top + rY],
			[left, top + rY],
			[left - rX, top + rY],
			[left - rX, top]
		]
	}
}



// 代码运行测试
let canvas = new Canvas()

let rect = new Rect({
	left: 30,
	top: 30,
	fill: 'red',
	shadowBlur: 20,
	shadowOffsetX: -20,
	selectable: true
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
	scaleHeight: 2,
	selectable: true,
	lineWidth: 5
})

let circle = new Circle({
	left: 200,
	top: 350,
	eAngle: 1.5,
	fill: "green",
	angle: 45,
	globalAlpha: 0.5,
	selectable: true
})

let triangle = new Triangle({
	left: 50,
	top: 120,
	width: 80,
	stroke: 'blue',
	lineJoin: 'round',
	lineWidth: 5,
	selectable: true
})

canvas.add(rect, rect1, rect2, circle, triangle)

rect2.set('left', 200)
circle.set({
	left: 250,
	radius: 20
})

canvas.remove(rect2)

let line = new Line({
	left: 50,
	top: 250,
	stroke: 'purple',
	dotArray: [[50, 50]]
})

let ellipse = new Ellipse({
	left: 150,
	top: 200,
	stroke: 'orange',
	angle: 45,
	scaleWidth: 2,
	scaleHeight: 2,
	selectable: true
})

canvas.add(line, ellipse, rect2)

rect1.animate('right', 150, {
	vx: 2
})
triangle.animate('down', 200)
circle.animate('top', 50)