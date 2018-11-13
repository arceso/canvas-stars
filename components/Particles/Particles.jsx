import './Particles.styl';
import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dpi: 1,
      starArray: []
    }

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.polifillRequestAnimFrame();
    this.setState({ dpi: window.devicePixelRatio || 1 });
    this.fix_dpi();

    let tempStarArray = [];

    for (let i = 0; i < 50; i++) {
      tempStarArray.push((new Star(
        Math.floor(Math.random() * window.innerWidth) + 1,
        Math.floor(Math.random() * window.innerHeight) + 1,
        Math.floor(Math.random() * 6) + 2,
        this.canvasRef.current.getContext('2d'),
        i)));
    }

    canvas = this.canvasRef.current;
    starArray = tempStarArray;
    this.setState({ starArray: tempStarArray });

    animate();
  }


  fix_dpi() {
    this.canvasRef.current.setAttribute('width', this.getCanvasFixedComputedValue('width'));
    this.canvasRef.current.setAttribute('height', this.getCanvasFixedComputedValue('height'));
  }


  getCanvasFixedComputedValue(value) {
    return +getComputedStyle(this.canvasRef.current).getPropertyValue(value).slice(0, -2) * this.state.dpi;
  }


  polifillRequestAnimFrame() {
    window.requestAnimFrame = function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (callback => window.setTimeout(callback, 1000 / 60))
      );
    }();
  }

  render() {
    return (
      <div>
        <canvas id="canvas" ref={this.canvasRef} />
      </div>
    );
  }


}

function animate() {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  starArray.forEach(star => star.move());

  requestAnimFrame(animate);
}

class Star {
  constructor(centerX, centerY, multiplier, context, selfIndex) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.multiplier = multiplier;
    this.context = context;
    this.opacity = 1;
    this.color = (() => {
      const colors = (['#f34d70', '#FF9800', '#673AB7', '#8BC34A', '#00BCD4']);
      return colors[Math.floor(Math.random() * colors.length)]
    })();
    this.stroke = Math.floor(Math.random() * 2);
    this.opacityDegradation = 1 / (Math.random() * 1000);
    this.selfIndex = selfIndex;

    this.topLeft = {
      x: centerX - (1 * multiplier),
      y: centerY - (1 * multiplier),
      control: {
        x: centerX,
        y: centerY - (3 * multiplier)
      }
    }

    this.bottomLeft = {
      x: centerX - (1 * multiplier),
      y: centerY + (1 * multiplier),
      control: {
        x: centerX - (3 * multiplier),
        y: centerY
      }
    }

    this.bottomRight = {
      x: centerX + (1 * multiplier),
      y: centerY + (1 * multiplier),
      control: {
        x: centerX,
        y: centerY + (3 * multiplier)
      }
    }

    this.topRight = {
      x: centerX + (1 * multiplier),
      y: centerY - (1 * multiplier),
      control: {
        x: centerX + (3 * multiplier),
        y: centerY
      }
    }
  }


  move = () => {
    this.context.beginPath();
    this.context.globalCompositeOperation = 'source-over';
    this.context.fillStyle = this.color;
    this.context.strokeStyle = this.color;
    this.context.globalAlpha = this.opacity;
    this.opacity -= this.opacityDegradation;

    this.context.moveTo(this.topLeft.x, this.topLeft.y);

    this.cuadraticBezierCurveTo(
      this.bottomLeft.x,
      this.bottomLeft.y,
      this.bottomLeft.control.x,
      this.bottomLeft.control.y
    );
    if (this.stroke) this.context.stroke();

    this.cuadraticBezierCurveTo(
      this.bottomRight.x,
      this.bottomRight.y,
      this.bottomRight.control.x,
      this.bottomRight.control.y
    );
    if (this.stroke) this.context.stroke();

    this.cuadraticBezierCurveTo(
      this.topRight.x,
      this.topRight.y,
      this.topRight.control.x,
      this.topRight.control.y
    );
    if (this.stroke) this.context.stroke();

    this.cuadraticBezierCurveTo(
      this.topLeft.x,
      this.topLeft.y,
      this.topLeft.control.x,
      this.topLeft.control.y
    );
    if (this.stroke) this.context.stroke();

    if (!this.stroke) this.context.fill();
    this.context.closePath();

    if (this.opacity <= 0) reassignStarIntoArray(Math.floor(Math.random() * window.innerWidth) + 1, Math.floor(Math.random() * window.innerHeight) + 1,  Math.floor(Math.random() * 6) + 2, this.context, this.selfIndex);
  }

  cuadraticBezierCurveTo = (endX, endY, controlX, contolY) => {
    this.context.bezierCurveTo(controlX, contolY, controlX, contolY, endX, endY);
  }
}

function reassignStarIntoArray(centerX, centerY, multiplier, context, selfIndex) {
  starArray[selfIndex] = new Star(centerX, centerY, multiplier, context, selfIndex);
}

var starArray,
  canvas;