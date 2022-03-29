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
	drawTarget: Array<any> = []
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

			this.drawTarget.push(item)
		})
	}

	remove(...drawTarget) {
		let newDrawTarget: Array<any> = []
		this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height)
		this.drawTarget.map((item, index) => {
			if (drawTarget.indexOf(item) == -1) {
				item.draw(this.ctx, item)
				newDrawTarget.push(item)
			}
		})
		this.drawTarget = newDrawTarget
	}
}

// 图形参数类型描述
type DrawParam = {
	left?: number,
	top?: number,
	width?: number,
	height?: number,
	radius?: number,
	sAngle?: number,
	eAngle?: number,
	counterclockwise?: boolean,
	fill?: string,
	stroke?: string,
	lineWidth?: number
}

// 图形公共类
// 问题：获取子类的属性与方法可以先获取到子类实例 this
class DarwCommon {
	drawParam: DrawParam = {
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
		drawTarget.privateDraw(ctx)
		if (this.drawParam.fill) {
			ctx.fillStyle = this.drawParam.fill
			ctx.fill()
		} else {
			ctx.strokeStyle = this.drawParam.stroke
			ctx.lineWidth = this.drawParam.lineWidth
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
			drawParam.left, 
			drawParam.top, 
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
			drawParam.left, 
			drawParam.top, 
			drawParam.radius, 
			drawParam.sAngle*Math.PI,
			drawParam.eAngle*Math.PI,
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
		ctx.moveTo(drawParam.left, drawParam.top)
		ctx.lineTo(drawParam.left + drawParam.width / 2, drawParam.top + drawParam.height)
		ctx.lineTo(drawParam.left - drawParam.width / 2, drawParam.top + drawParam.height)
		ctx.closePath()
	}
}



// 代码运行测试
let canvas = new Canvas()

let rect = new Rect({
	left: 10,
	top: 10,
	fill: 'red'
})

let rect1 = new Rect({
	left: 100,
	top: 100,
	width: 100,
	height: 100,
	stroke: 'yellow',
	lineWidth: 5
})

let circle = new Circle({
	left: 200,
	top: 50,
	eAngle: 1.5,
	fill: "green"
})

let triangle = new Triangle()

canvas.add(rect, rect1, circle)

rect1.set('left', 200)
circle.set({
	left: 250,
	radius: 20
})

canvas.remove(rect1)