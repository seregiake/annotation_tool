import React, { Component } from 'react';
class OutlineCanvas extends Component {

    constructor (props){
        super(props);
        this.state = {
            boundaries: [],
            size: []
        };
    }

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const canvas = this.refs.outline;
        const context = canvas.getContext('2d');
        const { boundaries, size, color } = this.props;

        //console.log(size);
        // eslint-disable-next-line
        if (boundaries != undefined && size != undefined && color != undefined){
            context.canvas.width = size[0];
            context.canvas.height = size[1];
            context.clearRect(0,0, size[0], size[1]);

            // draw children “components”
            outline({context, boundaries, size, color});

        }
    }

    render() {

    return(
        <canvas id="outline" ref="outline" style={{ zIndex: 2, position:'absolute', top:0, left:0,}}>
            Sorry, your browser doesn't support the &lt;canvas&gt; element.
        </canvas>
    )

    
    
    
    }
    
}
export default OutlineCanvas;

function outline(props) {
    const {context, size, boundaries, color} = props;
    let outline_matrix = JSON.parse(boundaries);

    // console.log(outline_matrix[0][0]);

    let outlineLayerData = context.createImageData(size[0], size[1]);
    let outlineImage = outlineLayerData.data;
    // scroll the matrix with boundaries to create the outline image
    let len = outlineLayerData.data.length;
    // console.log(len);
    let col = 0, row = 0;
    let pixel = [];
    for (let i = 0; i < len && row < size[1]; i += 4) {
        pixel = outline_matrix[row][col];
        // console.log("pixel: " + pixel);
        if (String(pixel[0]) === '0') {
            outlineImage[i] = color[0];       // r
            outlineImage[i + 1] = color[1];   // g
            outlineImage[i + 2] = color[2];   // b
            outlineImage[i + 3] = color[3];   // a
        }
        if (col === size[0] - 1) {
            row++;
            col = 0;
        } else {
            col++;
        }

    }

    // draw the outline layer in the 3° canvas
    context.putImageData(outlineLayerData, 0, 0);


}