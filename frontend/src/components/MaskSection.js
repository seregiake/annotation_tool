import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import AnnotationSection from './AnnotationSection';

class MaskSection extends Component {

    constructor (props){
        super(props);
        console.log(this.props)
    }

    handleSubmit = (event, requestType) => {
        //event.preventDefault();
        const kernel = event.target.elements.kernel.value;
        const dist = event.target.elements.dist.value;
        const ratio = event.target.elements.ratio.value;

        const user_id = 1;

        console.log(this.props.imageID);

        switch ( requestType ){
            case 'POST':
                return axios.post('http://localhost:5000/masks/' + user_id, {
                    id: this.props.imageID,
                    super: this.props.superID,
                    ratio : ratio,
                    kernel : kernel,
                    dist: dist
                })
                .then(res => console.log(res))
                .catch(error => console.err(error));
            case 'PUT':
                return axios.put('http://localhost:5000/masks/' + user_id + "/" + this.props.imageID + "/" + this.props.superID, {
                    id: this.props.imageID,
                    super: this.props.superID,
                    ratio : ratio,
                    kernel : kernel,
                    dist: dist
                })
                .then(res => console.log(res))
                .catch(error => console.err(error));
            default: return
        }
    }

    handleDelete = (event) => {
        event.preventDefault();
        
    }


    
    render() {
        const { mask, requestType } = this.props;
        console.log(mask.dist +","+ mask.kernel +","+ mask.ratio);
        console.log(requestType);
        return(
            <div>
            <div style={{ position:'relative', width:'100%', height:'100%' }}>
                <Col style={{ position:'absolute', marginTop:20, marginBottom:20, width:'100%' }}>
                    <h3>&#9881; Mask Settings &#9881;</h3>
                    <Form onSubmit={(event) => this.handleSubmit(
                        event,
                        this.props.requestType,
                        this.props.imageID )} >
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
                            <Button htmlType="submit" >{this.props.btnText}</Button>
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
                                list="rate" onChange={changeOpacity(this.id, 'mask_op_value')} />
                        </div>
                        <div className="col">
                            <input type="text" id="mask_op_value" disabled value="50%" size="4" />
                        </div>
                        <div className="col">
                            <label htmlFor="mask_color">Color:</label>
                            <input type="color" id="mask_color" defaultValue="#000000" />
                        </div>
                    </div>
                    <button href="#" onClick={redrawMask()} >Display Mask</button>
                    </Col>
                    </div>
                    <AnnotationSection />
                </Col> 
            </div>
            </div>
        )
        
    }
    
}
export default MaskSection;


function changeOpacity(id, opacity){
    // console.log('change opacity');
}

function redrawMask(){
    // console.log('redraq mask');
}

/*
<div>
<div style={{ position:'relative', width:'100%', height:'100%' }}>
                <Col style={{ position:'absolute', marginTop:20, marginBottom:20, width:'100%' }}>
                    <h3>&#9881; Mask Settings &#9881;</h3>
                    <Row >
                        <Col xs>
                            <label >Kernel:</label>
                            <input type="number" className="form-control" min={0} defaultValue={0} id="kernel" onChange={this.handleNumberChange}
                                    data-toggle="tooltip" data-placement="bottom"
                                    title="Kernel: Width of Gaussian kernel used in smoothing the sample density. Higher means fewer clusters." />
                        </Col>
                        <Col xs>
                            <label >Max-dist:</label>
                            <input type="number" className="form-control" min={0} defaultValue={10} id="dist" onChange={this.handleNumberChange}
                                    data-toggle="tooltip" data-placement="bottom"
                                    title="Max-dist: Cut-off point for data distances. Higher means fewer clusters." />
                        </Col>
                        <Col xs>
                            <label >Ratio:</label>
                            <input type="number" className="form-control" min={0.0} step={0.1} precision={1} max={1.0} defaultValue={0.0} id="ratio" onChange={this.handleNumberChange}
                                    data-toggle="tooltip" data-placement="bottom"
                                    title="Ratio: (between 0 and 1). Balances color-space proximity and image-space proximity. Higher values give more weight to color-space." />
                        </Col>
                    </Row>
                    <br />
                    <button href="#" onClick={this.createMask()} >Create</button>
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
                                list="rate" onChange={changeOpacity(this.id, 'mask_op_value')} />
                        </div>
                        <div className="col">
                            <input type="text" id="mask_op_value" disabled value="50%" size="4" />
                        </div>
                        <div className="col">
                            <label htmlFor="mask_color">Color:</label>
                            <input type="color" id="mask_color" defaultValue="#000000" />
                        </div>
                    </div>
                    <button href="#" onClick={redrawMask()} >Display Mask</button>
                    </Col>
                    </div>
                    <AnnotationSection />
                </Col> 
            </div>
            </div>

*/