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
                            let color = "yellow";
                            let style = {
                                wordWrap: "break-word",
                            };

                            if (item.stats) {
                                color = "green";
                                style["textDecorationLine"] = 'line-through';
                            }

                            return (
                                <Card key={item.id} color={color} fluid className="rough">
                                    <Card.Content>
                                        <Card.Header textAlign="left">
                                            <div style={style}>{item.task}</div>
                                        </Card.Header>
                                        <Card.Meta textAlign="right">
                                            <Icon
                                                name="check status"
                                                color="blue"
                                                onClick={() => this.updateTask(item._id)}
                                            />
                                            <span style={{ paddingRight: 10 }}> Undo </span>

                                            <Icon
                                                name="delete"
                                                color="red"
                                                onClick={() => this.deleteTask(item._id)}
                                            />
                                            <span style={{ paddingRight: 10 }}> Undo </span>

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
        axios.put(endpoint + "/api/task/" + id, {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
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
