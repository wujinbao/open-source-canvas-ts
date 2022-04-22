/*
* 遇坑总结
* 1. 图形变化时得考虑到原先图形的放大、缩小系数
 */

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
	drawTargetArray: Array<DrawCommon> = []
	lastX: number
	lastY: number
	delay: number = 1000 / 60
	constructor(canvasParam?: CanvasParam, id?: number | string) {
		let body = document.body as HTMLCanvasElement
		let canvas = document.createElement('canvas') as HTMLCanvasElement
		body.appendChild(canvas)
		canvas.onmousedown = this.onmousedown.bind(this)
		canvas.onmouseup = this.onmouseup.bind(this)
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

	add(drawTargetArray: Array<DrawCommon>) {
		drawTargetArray.map((item) => {
			if (this.drawTargetArray.indexOf(item) == -1) {
				item.draw(this)
				this.drawTargetArray.push(item)
			}
		})

		return this
	}

	remove(drawTargetArray: Array<DrawCommon>) {
		this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height)
		
		let newDrawTargetArray: Array<DrawCommon> = []
		this.drawTargetArray.map((item, index) => {
			if (drawTargetArray.indexOf(item) == -1) {
				item.draw(this)
				newDrawTargetArray.push(item)
			}
		})

		this.drawTargetArray = newDrawTargetArray

		return this
	}

	renderAll() {
		this.ctx.clearRect(0, 0, this.canvasParam.width, this.canvasParam.height)
		this.drawTargetArray.map((item) => {
			item.draw(this)
		})
	}

	// todo e 是什么类型
	onmousedown(e) {
		this.lastX = e.offsetX
		this.lastY = e.offsetY
		this.drawTargetArray.map((drawTargetItem) => {
			let vertexWidth: number = drawTargetItem.vertexWidth
			let vertexHeight: number = drawTargetItem.vertexHeight
			let vertexArray = drawTargetItem.vertexArray
			
			// 需注意一下，map 遍历数组无法通过 return 退出循环
			for (let i = 0; i < vertexArray.length; i++) {
				if (this.lastX >= vertexArray[i][0] - vertexWidth && this.lastX <= vertexArray[i][0] + vertexWidth && this.lastY >= vertexArray[i][1] - vertexHeight && this.lastY <= vertexArray[i][1] + vertexHeight) {
					this.canvas.onmousemove = this.throttle(this.onmousemove.bind(this, drawTargetItem, i), this.delay)
					
					return drawTargetItem
				}
			}

			if (this.lastX >= vertexArray[0][0] && this.lastX <= vertexArray[4][0] && this.lastY >= vertexArray[0][1] && this.lastY <= vertexArray[4][1]) {
				this.canvas.onmousemove = this.throttle(this.onmousemove.bind(this, drawTargetItem, 9), this.delay)
			}
		})
	}

	onmouseup() {
		this.canvas.onmousemove = null
	}

	onmousemove(drawTargetItem: DrawCommon, vertexIndex: number, e) {
		let currentX: number = e.offsetX
		let currentY: number = e.offsetY
		let moveX: number = currentX - this.lastX
		let moveY: number = currentY - this.lastY

		if (vertexIndex == 9) {
			drawTargetItem.drawParam.left += moveX
			drawTargetItem.drawParam.top += moveY
		} else {
			drawTargetItem.onmousemove(vertexIndex, moveX, moveY)
		}

		this.renderAll()

		this.lastX = currentX
		this.lastY = currentY
	}

	// 节流，在一定时间内只执行一次
	throttle(fn, delay) {
		let flag: boolean = true
    	return function (...args) {
        	if (!flag) return
        	flag = false
        	setTimeout(() => {
            	fn(...args)
            	flag = true
        	}, delay)
    	}
	}
}

// 图形参数类型描述
// 注意属性 lineCap、lineJoin、globalCompositeOperation 类型
// 分别是：CanvasLineCap、CanvasLineJoin、GlobalCompositeOperation
// 而不是 string 类型
type DrawParam = {
	left: number,
	top: number,
	dotArray: Array<[number, number]>,
	width: number,
	height: number,
	radius: number,
	rX: number,
	rY: number,
	sAngle: number,
	eAngle: number,
	counterclockwise: boolean,
	fill: string,
	stroke: string,
	shadowColor: string,
	shadowBlur: number,
	shadowOffsetX: number,
	shadowOffsetY: number,
	lineCap: CanvasLineCap,
	lineJoin: CanvasLineJoin,
	lineWidth: number,
	miterLimit: number,
	angle: number,
	scaleWidth: number,
	scaleHeight: number,
	globalAlpha: number,
	globalCompositeOperation: GlobalCompositeOperation,
	selectable: boolean
}

// Partial 变为可选参数
type PartialDrawParam = Partial<DrawParam>

enum Direction {
	Left = 'left',
	Right ='right',
	Top = 'top',
	Down = 'down'
}

type AnimateOption = {
	vX: number,
	vY: number,
	sX: number,
	sY: number
}

type PartialAnimateOption = Partial<AnimateOption>

// 图形公共类
// 问题：获取子类的属性与方法可以先获取到子类实例 this
class DrawCommon {
	drawParam: PartialDrawParam = {
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
	vertexWidth: number = 10
	vertexHeight: number = 10
	canvas: Canvas
	requestID: number
	animateOption: PartialAnimateOption = {
		vX: 0, vY: 0, sX: 0, sY: 0
	}
	constructor(drawParam: PartialDrawParam) {
		if (drawParam) {
			for(let key in drawParam){
        		this.drawParam[key] = drawParam[key]
  			}
		}
	}

	get(attr: string) {
		return this.drawParam[attr]
	}

	set(attr: PartialDrawParam) {
		for (let key in attr) {
			this.drawParam[key] = attr[key]
		}

		return this
	}

	draw(canvas: Canvas) {
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
		this.privateDraw(ctx)
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

		ctx.restore()

		if (this.drawParam.selectable) {
			this.vertexDraw(ctx)
		}
	}

	// 父类需子类重写的方法
	privateDraw(ctx: CanvasRenderingContext2D) {}
	onmousemove(vertexIndex: number, moveX: number, moveY: number) {}

	// 图形选择器 - 根据顶点绘制
	vertexDraw(ctx: CanvasRenderingContext2D) {
		let vertexArray = this.vertexArray
		let drawParam = this.drawParam
		let scaleWidth: number = drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight
		let vertexWidth: number = this.vertexWidth * scaleWidth
		let vertexHeight: number = this.vertexHeight * scaleHeight
		ctx.save()
		// 处理旋转问题
		ctx.translate(this.drawParam.left, this.drawParam.top)
		ctx.rotate(this.drawParam.angle * Math.PI / 180)
		ctx.translate(-this.drawParam.left, -this.drawParam.top)
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
			
			ctx.fillRect(item[0] - vertexWidth / 2, item[1] - vertexHeight / 2, vertexWidth, vertexHeight)
		})
		ctx.fillRect(vertexArray[1][0] - vertexWidth / 2, vertexArray[1][1] - vertexHeight * 3.5, vertexWidth, vertexHeight)
		ctx.closePath()
		ctx.moveTo(vertexArray[1][0], vertexArray[1][1] - vertexHeight / 2)
		ctx.lineTo(vertexArray[1][0], vertexArray[1][1] - vertexHeight * 2.5)
		ctx.stroke()
		ctx.closePath()
		ctx.restore()
	}
	
	animate(direction: string, distance: number | string, animateOption?: PartialAnimateOption) {
		// 判断图形是否已添加到画布上
		if (this.canvas.drawTargetArray.indexOf(this) == -1) {
			this.canvas.drawTargetArray.push(this)
		}

		this.requestID = requestAnimationFrame(this.animate.bind(this, direction, distance, this.animateOption))

		if (animateOption) {
			for(let key in animateOption){
        		this.animateOption[key] = animateOption[key]
  			}
		}

		if (typeof distance == 'number') {
			if (direction == Direction.Left && this.drawParam.left >= distance) {
				this.drawParam.left -= this.animateOption.vX
				this.drawParam.top += this.animateOption.vY
			} else if (direction == Direction.Right && this.drawParam.left <= distance) {
				this.drawParam.left += this.animateOption.vX
				this.drawParam.top += this.animateOption.vY
			} else if (direction == Direction.Top && this.drawParam.top >= distance) {
				this.drawParam.left += this.animateOption.vX
				this.drawParam.top -= this.animateOption.vY
			} else if (direction == Direction.Down && this.drawParam.top <= distance) {
				this.drawParam.left += this.animateOption.vX
				this.drawParam.top += this.animateOption.vY
			} else {
				cancelAnimationFrame(this.requestID)
			}
		} else if (typeof distance == 'string') {

		}

		this.animateOption.vX += this.animateOption.sX
		this.animateOption.vY += this.animateOption.sY

		this.canvas.ctx.clearRect(0, 0, this.canvas.canvasParam.width, this.canvas.canvasParam.height)
		this.canvas.renderAll()
	}
}

// 矩形类
class Rect extends DrawCommon {
	constructor(drawParam?: PartialDrawParam) {
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
		let left: number = this.drawParam.left
		let top: number = this.drawParam.top

		// 保证放大、缩小后获取的顶点坐标正确值
		let scaleWidth: number = this.drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight
		let width: number = this.drawParam.width * scaleWidth
		let height: number = this.drawParam.height * scaleHeight

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

	onmousemove(vertexIndex: number, moveX: number, moveY: number) {
		let scaleWidth: number = this.drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight

		switch (vertexIndex) {
			case 0:
				this.drawParam.left += moveX
				this.drawParam.top += moveY
				this.drawParam.width -= moveX / scaleWidth
				this.drawParam.height -= moveY / scaleHeight
				break

			case 1:
				this.drawParam.top += moveY
				this.drawParam.height -= moveY / scaleHeight
				break

			case 2:
				this.drawParam.top += moveY
				this.drawParam.width += moveX / scaleWidth
				this.drawParam.height -= moveY / scaleHeight
				break

			case 3:
				this.drawParam.width += moveX / scaleWidth
				break

			case 4:
				this.drawParam.width += moveX / scaleWidth
				this.drawParam.height += moveY / scaleHeight
				break

			case 5:
				this.drawParam.height += moveY / scaleHeight
				break

			case 6:
				this.drawParam.left += moveX
				this.drawParam.width -= moveX / scaleWidth
				this.drawParam.height += moveY / scaleHeight
				break

			case 7:
				this.drawParam.left += moveX
				this.drawParam.width -= moveX / scaleWidth
				break
		}
	}
}

// 圆形类
class Circle extends DrawCommon {
	constructor(drawParam?: PartialDrawParam) {
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
		let left: number = this.drawParam.left
		let top: number = this.drawParam.top

		// // 保证放大、缩小后获取的顶点坐标正确值
		let scaleWidth: number = this.drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight
		let radius: number = this.drawParam.radius
		let radiusWidth: number = radius * scaleWidth
		let radiusHeight: number = radius * scaleHeight

		this.vertexArray = [
			[left - radiusWidth, top - radiusHeight],
			[left, top - radiusHeight],
			[left + radiusWidth, top - radiusHeight],
			[left + radiusWidth, top],
			[left + radiusWidth, top + radiusHeight],
			[left, top + radiusHeight],
			[left - radiusWidth, top + radiusHeight],
			[left - radiusWidth, top]
		]
	}

	onmousemove(vertexIndex: number, moveX: number, moveY: number) {
		let radius: number = this.drawParam.radius

		switch (vertexIndex) {
			case 0:
				this.drawParam.left += moveX
				this.drawParam.top += moveY
				this.drawParam.scaleWidth -= moveX / radius
				this.drawParam.scaleHeight -= moveY / radius
				break

			case 1:
				this.drawParam.top += moveY
				this.drawParam.scaleHeight -= moveY / radius
				break

			case 2:
				this.drawParam.left += moveX
				this.drawParam.top += moveY
				this.drawParam.scaleWidth += moveX / radius
				this.drawParam.scaleHeight -= moveY / radius
				break

			case 3:
				this.drawParam.left += moveX
				this.drawParam.scaleWidth += moveX / radius
				break

			case 4:
				this.drawParam.left += moveX
				this.drawParam.top += moveY
				this.drawParam.scaleWidth += moveX / radius
				this.drawParam.scaleHeight += moveY / radius
				break

			case 5:
				this.drawParam.top += moveY
				this.drawParam.scaleHeight += moveY / radius
				break

			case 6:
				this.drawParam.left += moveX
				this.drawParam.top += moveY
				this.drawParam.scaleWidth -= moveX / radius
				this.drawParam.scaleHeight += moveY / radius
				break

			case 7:
				this.drawParam.left += moveX
				this.drawParam.scaleWidth -= moveX / radius
				break
		}
	}
}

// 三角形类
class Triangle extends DrawCommon {
	constructor(drawParam?: PartialDrawParam) {
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
		let left: number = this.drawParam.left
		let top: number = this.drawParam.top
		
		// 保证放大、缩小后获取的顶点坐标正确值
		let scaleWidth: number = this.drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight
		let width: number = this.drawParam.width * scaleWidth
		let height: number = this.drawParam.height * scaleHeight

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

		onmousemove(vertexIndex: number, moveX: number, moveY: number) {
		let scaleWidth: number = this.drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight

		switch (vertexIndex) {
			case 0:
				this.drawParam.left += moveX / 2
				this.drawParam.top += moveY
				this.drawParam.width -= moveX / scaleWidth
				this.drawParam.height -= moveY / scaleHeight
				break

			case 1:
				this.drawParam.top += moveY
				this.drawParam.height -= moveY / scaleHeight
				break

			case 2:
				this.drawParam.left += moveX / 2
				this.drawParam.top += moveY
				this.drawParam.width += moveX / scaleWidth
				this.drawParam.height -= moveY / scaleHeight
				break

			case 3:
				this.drawParam.left += moveX / 2
				this.drawParam.width += moveX / scaleWidth
				break

			case 4:
				this.drawParam.left += moveX / 2
				this.drawParam.width += moveX / scaleWidth
				this.drawParam.height += moveY / scaleHeight
				break

			case 5:
				this.drawParam.height += moveY / scaleHeight
				break

			case 6:
				this.drawParam.left += moveX / 2
				this.drawParam.width -= moveX / scaleWidth
				this.drawParam.height += moveY / scaleHeight
				break

			case 7:
				this.drawParam.left += moveX / 2
				this.drawParam.width -= moveX / scaleWidth
				break
		}
	}
}

// 线类
class Line extends DrawCommon {
	constructor(drawParam?: PartialDrawParam) {
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

// 椭圆类
class Ellipse extends DrawCommon {
	constructor(drawParam?: PartialDrawParam) {
		super(drawParam)
	}

	// todo 椭圆放大缩小问题未解决
	privateDraw(ctx: CanvasRenderingContext2D) {
		let drawParam = this.drawParam
		let rX = drawParam.rX
		let rY = drawParam.rY
		let r = (rX > rY) ? rX : rY
    	drawParam.scaleWidth = rX / r
    	drawParam.scaleHeight = rY / r
		if (ctx.ellipse) {
			console.log(drawParam.scaleWidth)
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
		let left: number = this.drawParam.left
		let top: number = this.drawParam.top

		// // 保证放大、缩小后获取的顶点坐标正确值
		let scaleWidth: number = this.drawParam.scaleWidth
		let scaleHeight: number = this.drawParam.scaleHeight
		let rX: number = this.drawParam.rX * scaleWidth
		let rY: number = this.drawParam.rY * scaleHeight

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