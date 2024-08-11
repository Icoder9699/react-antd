import "./App.css"
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, Space} from 'antd';
import {useState} from "react";

const App = () => {
    const [form] = Form.useForm();
    const [usersAverageAge, setUsersAverageAge] = useState(0)

    const onFinish = (values) => {
        window.alert(JSON.stringify(values))
        onCalculateUsersAge()
    };

    const onChangeAge = () => {
        console.info('some manipulations')
        onCalculateUsersAge()
    }

    const onRemoveUser = (cb, name) => {
        console.info('some manipulations')
        cb(name)
        onCalculateUsersAge()
    }

    const onAddUser = async (cb) => {
        console.info('some manipulations')
        try {
            await form.validateFields()
            cb()
        } catch (e) {
            console.error(e)
        }

    }

    const onCalculateUsersAge = async () => {
        try {
            await form.validateFields()

            const users = form.getFieldsValue().users

            const averageAge = Math.round((users.reduce((acc, user) => {
                return acc + Number(user.age)
            }, 0) / users.length))

            setUsersAverageAge(averageAge)
        } catch (e) {
            console.error(e)
            setUsersAverageAge(null)
        }
    }

    const validationRules = {
        first: [
            {
                required: true,
                name: "first",
                message: "Please enter first name",
            }
        ],
        last: [
            {
                required: true,
                name: "last",
                message: "Please enter last name",
            }
        ],
        age: [
            {
                required: true,
                name: "age",
                message: "Please enter age",
            }
        ]
    }

    return (
        <>
            <Form
                form={form}
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                style={{maxWidth: 600}}
                autoComplete="off"
            >
                <Form.List name="users" initialValue={Array.from({length: 1}, () => {
                    return {
                        firstName: "",
                        lastName: "",
                        age: 0
                    }
                })}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                display: 'flex', marginBottom: 8,
                            }}
                            align="baseline"
                        >

                            <Form.Item
                                {...restField}
                                name={[name, 'first']}
                                rules={validationRules.first}
                            >
                                <Input placeholder="First Name"/>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                name={[name, 'last']}
                                rules={validationRules.last}
                            >
                                <Input placeholder="Last Name"/>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                name={[name, 'age']}
                                rules={validationRules.age}
                            >
                                <Input placeholder="age" onChange={onChangeAge}/>
                            </Form.Item>

                            <MinusCircleOutlined onClick={() => onRemoveUser(remove, name)}/>
                        </Space>))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => onAddUser(add, name)} block icon={<PlusOutlined/>}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            {/*  average age  */}
            <pre>{usersAverageAge || "users average age"}</pre>
        </>
    )
}
export default App;