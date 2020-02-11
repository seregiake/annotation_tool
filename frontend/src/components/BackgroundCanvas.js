import React, { Component } from 'react';
class BackgroundCanvas extends Component {

    constructor (props){
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        const { image, size } = this.props;

        //console.log(size);
        // eslint-disable-next-line
        if (image != undefined && size != undefined){
            const img = new Image();
            img.src = image.url;
            img.name = image.name;
            img.onload = () => {
                context.canvas.width = size[0];
                context.canvas.height = size[1];
                context.drawImage(img, 0, 0);
            }

        }
    }

    render() {
        return(
            <canvas id="background" ref={this.canvasRef} style={{ zIndex: 1, position:'absolute', top:0, left:0,}}>
                Sorry, your browser doesn't support the &lt;canvas&gt; element.
            </canvas>
        )
  
    }
    
}
export default BackgroundCanvas;
