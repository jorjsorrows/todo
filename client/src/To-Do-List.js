import React, { Component } from 'react';
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

const endpoint = "http://localhost:7000";

class ToDoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: [],
        };
    }

    componentDidMount() {
        this.getTask();
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        let {task}= this.state 
        
        if  (task){
            axios.post(endpoint + "/api/task",
            {task,},
            {headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
        ).then((res)=>{
            this.getTask();
            this.setState({
                task:"",
            });
            console.log(res);
        });
        }
    };

    getTask = () => {
        axios.get(endpoint + "/api/task")
            .then(res => {
                if (res.data) {
                    this.setState({
                        items: res.data.map(item => {
                            let color = item.stats ? 'green' : 'yellow';
                            let style = item.stats ? { textDecorationLine: 'line-through' } : { wordWrap: "break-word" };
    
                            return (
                                <Card key={item.id} color={color} fluid className="rough">
                                    <Card.Content>
                                        <Card.Header textAlign="left" style={style}>
                                            <div>{item.task}</div>
                                        </Card.Header>
                                        <Card.Meta textAlign="right">
                                            <Icon
                                                name="check"
                                                color="green"
                                                onClick={() => this.updateTask(item._id)}
                                            />
                                            <span style={{ paddingRight: 10 }}> Done </span>
    
                                            <Icon
                                                name="undo"
                                                color="blue"
                                                onClick={() => this.undoTask(item._id)}
                                            />
                                            <span style={{ paddingRight: 10 }}> Undo </span>
    
                                            <Icon
                                                name="delete"
                                                color="red"
                                                onClick={() => this.deleteTask(item._id)}
                                            />
                                            <span style={{ paddingRight: 10 }}> Delete </span>
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            );
                        })
                    });
                } else {
                    this.setState({
                        items: []
                    });
                }
            })
            .catch(error => {
                // Handle errors here
                console.error("Error fetching data:", error);
            });
    }
    

    updateTask = (id) => {
        axios.put(endpoint + "/api/task/" + id, { stats: true }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask(); // Refresh the task list after updating
        }).catch(error => {
            console.error("Error updating task:", error);
        });
    }
    

    undoTask = (id) => {
        axios.put(endpoint + "/api/undoTask/" + id, {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    }

    deleteTask = (id) => {
        axios.delete(endpoint + "/api/deleteTask/" + id, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <Header as="h2" color="yellow">
                        To Do List
                    </Header>
                </div>
                <div className='row'>
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            fluid
                            placeholder='Create Task'
                        />
                        {/*<Button>Create Task</Button>*/}
                    </Form>
                </div>
                <div className="row">
                    <Card.Group>{this.state.items}</Card.Group>
                </div>
            </div>
        );
    }
}

export default ToDoList;
