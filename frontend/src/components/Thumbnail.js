import React from 'react';
import { Card } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';

class Thumbnail extends React.Component {
    render = () => {
        const image = this.props.image;
        const task = this.props.task;
        return <div style={{ padding: 5, margin: 5, minWidth:200, minHeight:300}}>
            <Grid item md={10} container spacing={10} >        
                <Card className='imageCard' style={{ minWidth:200, minHeight:200 }}>
                    <a href={"/images/" + task + "/" + image.id}>
                        <img src={image.url} alt={image.name} 
                        width='171' height='180' draggable="false"
                        style={{ margin: 5}} />
                    </a>
                    <Card.Body>
                        <p >{image.name}</p>
                    </Card.Body>
                </Card>
            </Grid>
        </div>;
    }
}
export default Thumbnail;