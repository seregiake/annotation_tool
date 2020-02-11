import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
class AnnotationSection extends Component {

    createMask(){
        console.log('create mask');
        
    }

    handleNumberChange(){
        console.log('click');
    };

    
    render() {
        
        return(
            <div style={{ width:'100%', height:'100%', marginTop:20, marginBottom:20 }}>
                <h3>&#9998; Annotations &#9998;</h3>
                <Row>
                <Col style={{ marginTop:20, marginBottom:20, width:'100%' }}>
                    <h5>Create/Edit an annotation:</h5>
                
                </Col>
                <Col style={{ marginTop:20, marginBottom:20, width:'100%' }}>
                    <h5>Opacity:</h5>
                    <br />
                    <h5>List of annotations:</h5>
                
                </Col>
                </Row>
            </div>
        )
        
    }
    
}
export default AnnotationSection;
