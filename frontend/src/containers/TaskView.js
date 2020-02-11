import React, { Component } from 'react';
import axios from 'axios';
import { Row, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
class TaskView extends Component {
    
    state = {
        tasks: []
    };

    fetchImages = () => {
        axios.get("http://127.0.0.1:5000/tasks").then(res => {
          this.setState({
            tasks: res.data
          });
        });
    }

    componentDidMount() {
        this.fetchImages();
    }

    chooseTask(){
        const task_id = document.getElementById('selectBox').value;
        window.location.href = "http://localhost:3000/images/" + task_id;
    }
    
    render() {
        const { tasks } = this.state;
        
        return(
                <div style={{ padding: 80 }}>
                    <div style={{ paddingRight: 100, paddingLeft: 100 }}>
                        <Form.Group controlId="selectBox">
                            <Form.Label>Choose a task:</Form.Label>
                            <Row>
                                <Form.Control as="select" style={{ width:'90%' }}>
                                    {tasks.map(task => {
                                        return (<option key={task.id} value={task.id} >Option {task.id} </option>)
                                    })}    
                                </Form.Control>
                                <Button className='overButton' onClick={this.chooseTask} >
                                    <span >&#10004;</span>
                                </Button>
                            </Row>
                        </Form.Group>
                    </div>
                    <div style={{ padding: 80 }}>
                    <Table striped bordered hover size="sm" >
                    <thead>
                        <tr>
                        <th>Option</th>
                        <th>Images Set</th>
                        <th>Annotations Set</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => {
                            return(
                                <tr key={'id' + task.id} >
                                <td>{task.id}</td>
                                <td>{task.folder_name}</td>
                                <td>{task.super_id}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    </Table>
                    </div>
                </div>

        )
        
    }
}
export default TaskView;
