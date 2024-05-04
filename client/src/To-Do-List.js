import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

const endpoint = "http://localhost:7000";

const ToDoList = () => {
    const [task, setTask] = useState("");
    const [items, setItems] = useState([]);

    useEffect(() => {
        getTask();
    }, []);

    const onChange = (event) => {
        setTask(event.target.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (task) {
            axios.post(endpoint + "/api/task",
                { task },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            ).then((res) => {
                getTask();
                setTask("");
                console.log(res);
            });
        }
    };

    const getTask = () => {
        axios.get(endpoint + "/api/task")
            .then(res => {
                if (res.data) {
                    setItems(res.data.map(item => {
                        let color = item.status ? 'green' : 'yellow';
                        let textDecoration = item.status ? 'line-through' : 'none';
                        let style = {
                            wordWrap: "break-word",
                            textDecorationLine: textDecoration
                        };

                        return (
                            <Card key={item._id} color={color} fluid className="rough">
                                <Card.Content>
                                    <Card.Header textAlign="left">
                                        <div style={style}>{item.task}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                        <Icon
                                            name="check"
                                            color="green"
                                            onClick={() => updateTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}> Done </span>

                                        <Icon
                                            name="undo"
                                            color="blue"
                                            onClick={() => undoTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}> Undo </span>

                                        <Icon
                                            name="delete"
                                            color="red"
                                            onClick={() => deleteTask(item._id)}
                                        />
                                        <span style={{ paddingRight: 10 }}> Delete </span>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        );
                    }));
                } else {
                    setItems([]);
                }
            })
            .catch(error => {
                // Handle errors here
                console.error("Error fetching data:", error);
            });
    }

    const updateTask = (id) => {
        axios.put(endpoint + "/api/tasks/" + id, { stats: true }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            getTask(); // Refresh the task list after updating
        }).catch(error => {
            console.error("Error updating task:", error);
        });
    }

    const undoTask = (id) => {
        axios.put(endpoint + "/api/undoTask/" + id, { stats: false }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            getTask();
        });
    }

    const deleteTask = (id) => {
        axios.delete(endpoint + "/api/deleteTask/" + id, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            getTask();
        });
    }

    return (
        <div>
            <div className='row'>

                <Header as="h1" color="yellow">
                    To Do List
                </Header>
            </div>
            <div className='row'>
                <Form onSubmit={onSubmit}>
                    <Input
                        type="text"
                        name="task"
                        onChange={onChange}
                        value={task}
                        fluid
                        placeholder='Create Task'
                    />


                    {/*<Button>Create Task</Button>*/}
                </Form>
            </div>
            <div className="row">
                <Card.Group>{items}</Card.Group>
            </div>
        </div>
    );
}

export default ToDoList;
