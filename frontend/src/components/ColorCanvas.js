import React, { Component } from 'react';
class ColorCanvas extends Component {

    constructor (props){
        super(props);
        this.state = {
            drawingAreaX: 0,
            drawingAreaY: 0,
            canvasWidth: 0,
            canvasHeight: 0,
            mask: [],
            clusterID: 0,
            clusterList: [],
            pointList: [],
            draggedPointList: [],
            draggedMaskPointList: [],
            mouseDrag: false,
            curColor: [255, 0, 0],
            outlineColor: [0, 0, 0, 127],
        }
    }

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        //this.updateCanvas();
    }

    updateCanvas() {
        console.log("update");
        const canvas = this.refs.top;
        const context = canvas.getContext('2d');

        const { boundaries, mask, size, color } = this.props;

        // eslint-disable-next-line
        if (boundaries != undefined && size != undefined && color != undefined){
            context.canvas.width = size[0];
            context.canvas.height = size[1];

            // draw children “components”
            //outline({context, boundaries, size, color});

        }
    }

    createColorImage() {
        const { size, mask, color } = this.props;
        const canvas = this.refs.top;
        const context = canvas.getContext('2d');

        let mask_matrix = JSON.parse(mask);

        // console.log(outline_matrix[0][0]);

        let colorLayerData = context.getImageData(0, 0, canvas.width, canvas.width);

        let colorImage = colorLayerData.data;
        // scroll the matrix with boundaries to create the outline image

        // TODO: colora in base alle annotations


        // draw the outline layer in the 3° canvas
        context.putImageData(colorLayerData, 0, 0);


    }


    clickMouse(event){
        const canvas = this.refs.top;
        const context = canvas.getContext('2d');
        const { boundaries, mask, size, color } = this.props;
        context.canvas.width = size[0];
        context.canvas.height = size[1];
        let colorLayerData = context.getImageData(0, 0, canvas.width, canvas.width);
        let colorImage = colorLayerData.data;



        // Update the canvas with the new data


        let [x, y] = this.getMousePos(event);
        console.log("x: " + x + ", y: " + y);
        this.paintAt(x, y, colorImage);

        /*
        for(let i=0; i < colorImage.length; i++){
            colorImage[i] = 255;
        }
        */

        context.putImageData(colorLayerData, 0, 0);

    }

    getMousePos(e){
        const {  size } = this.props;
        let color_canvas = this.refs.top;
        let drawingAreaX = color_canvas.getBoundingClientRect().left;
        let drawingAreaY = color_canvas.getBoundingClientRect().top;

        this.setState(prevState => {
           return {
                drawingAreaX: drawingAreaX,
                drawingAreaY: drawingAreaY,
                canvasWidth: size[0],
                canvasHeight: size[1],
           }
        });

        console.log(this.state);

        // mouse click coordinates on the canvas rounded to manage float case
        let mouseX = Math.round(e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft - drawingAreaX),
            mouseY = Math.round(e.pageY - document.body.scrollTop - document.documentElement.scrollTop - drawingAreaY);

        return [mouseX, mouseY];

    }

    dragStart(event){
        //TODO
    }

    dragOver(event){
        //TODO
    }

    dragEnd(event){
        //TODO
    }

    paintAt(startX, startY, colorImage){
        console.log('COLORA');
        const { size, mask, color } = this.props;
        this.setState({
            canvasWidth: size[0],
            canvasHeight: size[1]
        });

        let mask_matrix = JSON.parse(mask);

        let clusterList = this.state.clusterList;
        let pointList = this.state.pointList;

        // takes pixel RGBA color
        let pixelPos = (startY * size[0] + startX) * 4,
            r = colorImage[pixelPos],
            g = colorImage[pixelPos + 1],
            b = colorImage[pixelPos + 2],
            a = colorImage[pixelPos + 3];

        console.log(r + g + b + a);
        // return if you try to recolor the area with the same color and the same opacity
        if (r == color[0] && g == color[1] && b == color[2] && a == color[3]){

            this.floodFill(startX, startY, r, g, b, a, [0, 0, 0, 0], mask_matrix, colorImage);
            //this.redraw();

            // delete the element from clusterList and pointList
            /*
            clusterList.splice( clusterList.indexOf(mask[startY][startX]), 1 );
            pointList.splice( clusterList.indexOf(mask[startY][startX]), 1);

            this.setState(prevState =>{
                return {
                    clusterList: clusterList,
                    pointList: pointList
                }
            });
            */
            return
        }


        // call floodFill method and pass to it initial (x,y) and initial RGBA of the pixel clicked
        this.floodFill(startX, startY, r, g, b, a, [color[0], color[1], color[2], color[3]], mask_matrix, colorImage);
        //this.redraw();

        /*

        clusterList.push(mask[startY][startX]);
        pointList.push([startX, startY]);

        this.setState(prevState =>{
            return {
                clusterList: clusterList,
                pointList: pointList
            }
        })

         */



    }

    floodFill(startX, startY, startR, startG, startB, startA, newColor, mask, colorImage){
        const { size } = this.props;

        let newPos,
            x,
            y,
            pixelPos,
            reachLeft = false,
            reachRight = false,
            canvasBoundLeft = 0,
            canvasBoundTop = 0,
            canvasBoundRight = canvasBoundLeft + size[0] - 1,
            canvasBoundBottom = canvasBoundTop + size[1] - 1,
            pixelStack = [[startX, startY]],
            cluster_id = mask[startY][startX];


        this.setState({
                clusterID: mask[startY][startX],
            }
        );

        while (pixelStack.length) {

            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];

            // takes current pixel position
            pixelPos = (y * size[0] + x) * 4;

            while (y >= canvasBoundTop && this.matchInitialColor(pixelPos, x, y, startR, startG, startB, startA, newColor, colorImage, mask, cluster_id)) {
                y -= 1;
                pixelPos -= size[0] * 4;
            }

            pixelPos += size[0] * 4;
            y += 1;
            reachLeft = false;
            reachRight = false;

            // go down inside the canvas until initialColor matches
            while (y <= canvasBoundBottom && this.matchInitialColor(pixelPos, x, y, startR, startG, startB, startA, newColor, colorImage, mask, cluster_id)) {

                this.colorPixel(pixelPos, newColor[0], newColor[1], newColor[2], newColor[3], colorImage);

                if (x > canvasBoundLeft) { //check left side pixel
                    if (this.matchInitialColor(pixelPos - 4, x - 1, y, startR, startG, startB, startA, newColor, colorImage, mask, cluster_id)) {
                        if (!reachLeft) {
                            //aggiungi pixel allo stack
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < canvasBoundRight) { //check right side pixel
                    if (this.matchInitialColor(pixelPos + 4, x + 1, y, startR, startG, startB, startA, newColor, colorImage, mask, cluster_id)) {
                        if (!reachRight) {
                            //aggiungi pixel allo stack
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                y += 1;
                pixelPos += size[0] * 4;
            }
        }


    }

    redraw(){
        //console.log("disegna");
    }

    matchInitialColor(pixelPos, x, y, startR, startG, startB, startA, newColor, colorImage, mask, cluster_id){
        // console.log('matchInitialColor');
        let different_cluster = false;
        // console.log(mask[y][x]);
        // console.log(mask[y][x]);
        // eslint-disable-next-line
        if(mask[y][x] != cluster_id){
            // console.log( 'clusterID:' + cluster_id);
            // console.log('mask cluster:' +mask[y][x]);
            different_cluster = true;
        }

        // check if current pixel is in outline image and has different cluster_id
        if (this.matchOutlineBorder(x,y) && different_cluster){
            // console.log('PRIMO RETURN');
            return false;
        }


        let r = colorImage[pixelPos],
            g = colorImage[pixelPos + 1],
            b = colorImage[pixelPos + 2],
            a = colorImage[pixelPos + 3];

        // If the current pixel matches the clicked color
        // eslint-disable-next-line
        /*
        if (r == startR && g == startG && b == startB && a == startA){
            return true;
        }

         */

        // If current pixel color is already colored with new color and opacity
        // eslint-disable-next-line
        if (r == newColor[0] && g == newColor[1] && b == newColor[2] && a == newColor[3] ) {
            // console.log('SECONDO RETURN');
            return false;
        }

        // console.log('ULTIMO RETURN');
        return true;
    }

    colorPixel(pixelPos, r, g, b, a, colorImage) {
        // console.log('COLOR PIXEL');
        colorImage[pixelPos] = r;
        colorImage[pixelPos + 1] = g;
        colorImage[pixelPos + 2] = b;
        colorImage[pixelPos + 3] = a !== undefined ? a : 255;
    }

    matchOutlineBorder(x,y){

        const { boundaries } = this.props;
        let outline_matrix = JSON.parse(boundaries);

        let pixel = outline_matrix[y][x];

        return (String(pixel[0]) === '0');

        /*
        let r = outlineImage[pixelPos],
            g = outlineImage[pixelPos + 1],
            b = outlineImage[pixelPos + 2],
            a = outlineImage[pixelPos + 3];

        return (r === outlineColor[0] && g === outlineColor[1] && b === outlineColor[2] && a == outlineColor[3] );
         */

    }

    render(){

        return(
            <canvas id="color"
                    ref="top"
                    style={{ zIndex: 3, position:'absolute', top:0, left:0,}}
                    onClick={(event) => this.clickMouse(event)}
                    onDragStart={(event) => this.dragStart(event)}
                    onDragOver={(event) => this.dragOver(event)}
                    onDragEnd={(event) => this.dragEnd(event)} >
                Sorry, your browser doesn't support the &lt;canvas&gt; element.
            </canvas>
        )
    }
}
export default ColorCanvas;

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
        if (String(pixel[0]) === '1') {
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

