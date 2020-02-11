import React, { Component } from 'react';
import axios from 'axios';
import BackgroundCanvas from '../components/BackgroundCanvas';
import ColorCanvas from '../components/ColorCanvas';
import OutlineCanvas from '../components/OutlineCanvas';
// import MaskSection from '../components/MaskSection';
import {Col, Row} from "react-bootstrap";
import {Button, Form, Input} from "antd";
import Canvas from "../components/Canvas";
// import AnnotationSection from "../components/AnnotationSection";


class AnnotationView extends Component {

    state = {
        item: [],
        mask: [],
        task: [],
        categories: [],
        annotation: [],
        imageID: this.props.match.params.imageID,
        taskID: this.props.match.params.taskID,
        outlineColor: [0, 0, 0, 127],
        hexMaskColor: '#000000',
        outlineLabel: '50%',
        outlineRange: 50,
        annColor: [255, 0, 0, 255],
        hexAnnColor: '#FF0000',
        annLabel: '50%',
        annRange: 50,

        drawingAreaX: 0,
        drawingAreaY: 0,
        canvasWidth: 0,
        canvasHeight: 0,
        clusterID: 0,
        clusterList: [],
        pointList: [],
        draggedPointList: [],
        draggedMaskPointList: [],
        mouseDrag: false,
        curColor: [255, 0, 0],
        point: []


    }

    fetchImage = () => {
        this.setState({
            imageID: this.props.match.params.imageID,
            taskID: this.props.match.params.taskID
        });
        axios.get("http://127.0.0.1:5000/image/" + this.state.imageID).then(res => {
          this.setState({
            item: res.data
        });
        // console.log(this.state);
        });
        axios.get("http://127.0.0.1:5000/tasks/" + this.state.taskID).then(res => {
          this.setState({
            task: res.data
        });
          axios.get("http://127.0.0.1:5000/categories/" + this.state.task.super_id).then(res => {
          this.setState({
            categories: res.data
        })});
        // console.log(this.state);
        const user_id = 1;
        axios.get("http://127.0.0.1:5000/masks/" + user_id + "/" + this.state.imageID + "/" + this.state.task.super_id).then(res => {
            this.setState({
                mask: res.data
            });
            console.log(this.state);
            });
        });
        
    }


    componentDidMount(){
        this.fetchImage();
        // console.log(this.state);
    }

    componentDidUpdate(){
        this.updateMaskSettings();
        this.createAnnSettings();


    }

    updateMaskSettings(){
        const kernel = document.getElementById('kernel');
        const dist = document.getElementById('dist');
        const ratio = document.getElementById('ratio');

        // eslint-disable-next-line
        if (this.state.mask.kernel != undefined){
            kernel.value = this.state.mask.kernel;
            dist.value = this.state.mask.dist;
            ratio.value = this.state.mask.ratio;

            // console.log(kernel.value);
            // console.log(dist.value);
            // console.log(ratio.value);
        }



    }

    createAnnSettings(){
        // eslint-disable-next-line
        if (this.state.task.super_id != undefined){

            let select = document.getElementById('ann_class');
            select.innerText="";
            let option = document.createElement("option");
            option.id = "0";
            option.value = "0";
            option.label =  "";
            select.append(option);

            let index = 0;
            for( let i = 0; i < this.state.categories.length; i++){
                index = index + 1;
                option = document.createElement("option");
                option.id = index;
                option.value = this.state.categories[i]["id"];
                option.label =  this.state.categories[i]['name'];
                select.append(option);
            }

        }
    }

    handleMaskSubmit = (event) => {
        //event.preventDefault();
        const kernel = event.target.elements.kernel.value;
        const dist = event.target.elements.dist.value;
        const ratio = event.target.elements.ratio.value;

        const user_id = 1;

        let requestType = 'POST';
        if( typeof this.state.mask != 'string' ){
            requestType = 'PUT';
        }

        console.log(this.state.imageID);

        switch ( requestType ){
            case 'POST':
                return axios.post('http://localhost:5000/masks/' + user_id, {
                    id: this.state.imageID,
                    super: this.state.task.super_id,
                    ratio : ratio,
                    kernel : kernel,
                    dist: dist
                })
                .then(res => console.log(res))
                .catch(error => console.err(error));
            case 'PUT':
                return axios.put('http://localhost:5000/masks/' + user_id + "/" + this.state.imageID + "/" + this.state.task.super_id, {
                    id: this.state.imageID,
                    super: this.state.task.super_id,
                    ratio : ratio,
                    kernel : kernel,
                    dist: dist
                })
                .then(res => console.log(res))
                .catch(error => console.err(error));
            default: return
        }
    }

    handleAnnSubmit = (event) => {
        //event.preventDefault();
        const kernel = event.target.elements.kernel.value;
        const dist = event.target.elements.dist.value;
        const ratio = event.target.elements.ratio.value;

        const user_id = 1;

        let requestType = 'POST';
        if( typeof this.state.mask != 'string' ){
            requestType = 'PUT';
        }

        console.log(this.state.imageID);

        switch ( requestType ){
            case 'POST':
                return axios.post('http://localhost:5000/masks/' + user_id, {
                    id: this.state.imageID,
                    super: this.state.task.super_id,
                    ratio : ratio,
                    kernel : kernel,
                    dist: dist
                })
                .then(res => console.log(res))
                .catch(error => console.err(error));
            case 'PUT':
                return axios.put('http://localhost:5000/masks/' + user_id + "/" + this.state.imageID + "/" + this.state.task.super_id, {
                    id: this.state.imageID,
                    super: this.state.task.super_id,
                    ratio : ratio,
                    kernel : kernel,
                    dist: dist
                })
                .then(res => console.log(res))
                .catch(error => console.err(error));
            default: return
        }
    }

    
    render() {
        const { item, mask, task, imageID } = this.state;
        return(
                <div >
                    <Canvas image={item}
                            size={item.size}
                            mask={mask.mask}
                            boundaries={mask.boundaries}
                            annColor={this.state.annColor}
                            outColor={this.state.outlineColor}/>

                    <div style={{ paddingTop:20, minHeight:'800px', color:'rgb(25, 25, 112)' }}>

                        <div style={{ position:'relative', width:'100%', height:'100%' }}>
                            <Col style={{ position:'absolute', marginTop:20, marginBottom:20, width:'100%' }}>
                                <h3>&#9881; Mask Settings &#9881;</h3>

                                <Form onSubmit={(event) => this.handleMaskSubmit(
                                    event)} >
                                <Row>
                                    <Col xs >
                                    <Form.Item label="Kernel" >
                                        <Input id="kernel" type="number" min={0} defaultValue={mask.kernel}
                                                data-toggle="tooltip" data-placement="bottom" style={{ width:'50%'}}
                                                title="Kernel: Width of Gaussian kernel used in smoothing the sample density. Higher means fewer clusters." />
                                    </Form.Item>
                                    </Col> <Col xs >
                                    <Form.Item label="Max-dist">
                                        <Input id="dist" type="number" min={0} defaultValue={mask.dist}
                                                data-toggle="tooltip" data-placement="bottom" style={{ width:'50%'}}
                                                title="Max-dist: Cut-off point for data distances. Higher means fewer clusters." />
                                    </Form.Item>
                                    </Col> <Col xs >
                                    <Form.Item label="Ratio">
                                        <Input id="ratio" type="number" min={0} step={0.1} precision={1} max={1} defaultValue={mask.ratio}
                                                data-toggle="tooltip" data-placement="bottom" style={{ width:'50%'}}
                                                title="Ratio: (between 0 and 1). Balances color-space proximity and image-space proximity. Higher values give more weight to color-space." />
                                    </Form.Item>
                                    </Col>
                                </Row>

                                    <Form.Item >
                                        <br />
                                        <Button htmlType="submit" >Create</Button>
                                        <br />
                                    </Form.Item>
                                </Form>


                                <br /><br />


                                <div style={{ width:'100%', border:'2px dotted rgb(25, 25, 112)', padding:20, background:'rgba(112, 112, 136, 0.2)', color:'rgb(25, 25, 112)'}}>
                                <h5>&#8258; Mask Color &amp; Opacity &#8258;</h5>
                                <br />
                                <Col >
                                <div className="form-row" >
                                <label htmlFor="opacity">Opacity:</label>
                                    <datalist id="rate">
                                        <option value="0"></option>
                                        <option value="10"></option>
                                        <option value="20"></option>
                                        <option value="30"></option>
                                        <option value="40"></option>
                                        <option value="50"></option>
                                        <option value="60"></option>
                                        <option value="70"></option>
                                        <option value="80"></option>
                                        <option value="90"></option>
                                        <option value="100"></option>
                                    </datalist>
                                    <div className="col-9">
                                        <input type="range" id="opacity"
                                               className="form-control-range" min="0" max="100" step="10"
                                               value={ this.state.outlineRange}
                                               onChange={(event) => this.changeOpacity(event) }
                                               list="rate" />
                                    </div>
                                    <div className="col">
                                        <input type="text" id="mask_op_value" disabled value={this.state.outlineLabel} size="4" />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="mask_color">Color:</label>
                                        <input type="color" id="mask_color" defaultValue={this.state.hexMaskColor}
                                            onChange={(event) => this.changeMaskColor(event)} />
                                    </div>
                                </div>
                                </Col>
                                </div>


                                <div style={{ width:'100%', height:'100%', marginTop:20, marginBottom:20 }}>
                                    <h3>&#9998; Annotations &#9998;</h3>
                                    <Row>
                                        <Col style={{ marginTop:20, marginBottom:20, width:'100%' }}>
                                            <h5>Create/Edit an annotation:</h5>
                                            <Form onSubmit={(event) => this.handleAnnSubmit(event)} >
                                            <Row>
                                                <input type="color" id="ann_color" defaultValue={this.state.hexAnnColor}
                                                onChange={(event) => this.changeAnnColor(event)}/>
                                                <select id="ann_class" style={{ width:'70%' }}>

                                                </select>
                                                <button href="#" onClick={saveAnnotation()} >V</button>
                                                <button href="#" onClick={cancelAnnotation()} >X</button>
                                            </Row>
                                            </Form>
                                            <br />
                                            <br />
                                            <label htmlFor="ann_opacity">Opacity:</label>
                                            <datalist id="rate">
                                                <option value="0"></option>
                                                <option value="10"></option>
                                                <option value="20"></option>
                                                <option value="30"></option>
                                                <option value="40"></option>
                                                <option value="50"></option>
                                                <option value="60"></option>
                                                <option value="70"></option>
                                                <option value="80"></option>
                                                <option value="90"></option>
                                                <option value="100"></option>
                                            </datalist>

                                            <input type="range" id="ann_opacity"
                                                   className="form-control-range" min="0" max="100" step="10"
                                                   value={ this.state.annRange}
                                                   onChange={(event) => this.changeAnnOpacity(event) }
                                                   list="rate" />

                                                   <input type="text" id="ann_op_value" disabled value={this.state.annLabel} size="4" />


                                        </Col>
                                        <Col style={{ marginTop:20, marginBottom:20, width:'100%' }}>


                                            <br />
                                            <h5>List of annotations:</h5>

                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                        </div>
                    </div> 
                </div>
    
           
        )
        
    }


    changeOpacity(event){
        //console.log('change opacity');

        let new_opacity = event.target.value;
        let opacity_value = Math.round(((new_opacity * 255)/100));
        let opacity_label = new_opacity + "%";
        console.log(opacity_label);
        console.log(new_opacity);

        this.setState(prevState =>{
            return {
                outlineColor: [prevState.outlineColor[0], prevState.outlineColor[1], prevState.outlineColor[2], opacity_value ],
                outlineLabel: opacity_label,
                outlineRange: new_opacity
            }
        })

    }

    changeAnnOpacity(event){
        //console.log('change opacity');

        let new_opacity = event.target.value;
        let opacity_value = Math.round(((new_opacity * 255)/100));
        let opacity_label = new_opacity + "%";
        console.log(opacity_label);
        console.log(new_opacity);

        this.setState(prevState =>{
            return {
                annColor: [prevState.outlineColor[0], prevState.outlineColor[1], prevState.outlineColor[2], opacity_value ],
                annLabel: opacity_label,
                annRange: new_opacity
            }
        })

    }

    changeMaskColor(event){
        //console.log('change color');

        let hex = event.target.value;
        let rgb_color = hexToRGB(hex);

        this.setState(prevState =>{
            return {
                outlineColor: [rgb_color.r, rgb_color.g, rgb_color.b, prevState.outlineColor[3] ],
                hexMaskColor: hex,
            }
        })

    }

    changeAnnColor(event){
        //console.log('change color');

        let hex = event.target.value;
        let rgb_color = hexToRGB(hex);

        this.setState(prevState =>{
            return {
                annColor: [rgb_color.r, rgb_color.g, rgb_color.b, prevState.annColor[3] ],
                hexAnnColor: hex,
            }
        })

    }
}
export default AnnotationView;


function saveAnnotation(){
    // console.log('change opacity');
}

function cancelAnnotation(){
    // console.log('change opacity');
}

function hexToRGB(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}



/*
<div id="canvases_div" className="overflow-auto" style={{ position:'relative', minHeight:'300px', background:'yellow'}}>
                        <BackgroundCanvas image={item} size={item.size} />
                        <ColorCanvas size={item.size} mask={mask.mask} boundaries={mask.boundaries} color={this.state.annColor}/>
                        <OutlineCanvas size={item.size} boundaries={mask.boundaries} color={this.state.outlineColor} />
                     </div>




<ColorCanvas size={item.size} mask={mask.mask} boundaries={mask.boundaries} color={this.state.annColor} />


<BackgroundCanvas image={item} size={item.size} />
                        <ColorCanvas size={item.size} />
 
                        { this.displayMask(mask, item) }

<ColorCanvas style={{ zIndex: 2, position:'absolute' }} size={item.size} />
<OutlineCanvas style={{ zIndex: 3, position:'absolute' }} size={item.size} />
                     
*/
// <img src={item.url} alt={item.name} draggable="false" />
