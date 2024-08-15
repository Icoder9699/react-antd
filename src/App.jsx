import "./App.css"
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, InputNumber, Space, Typography} from 'antd';
import {forwardRef, useState} from "react";

const InputAge = forwardRef((props, ref) => (<InputNumber
    ref={ref}
    placeholder={props.placeholder}
    onChange={props.onChange}
/>))

const App = () => {
    const [form] = Form.useForm();
    const [usersAverageAge, setUsersAverageAge] = useState(0)
    const usersInitialState = Array.from({length: 1}, () => {
        return {
            id: 1, first: "", last: "", age: 0, isUserAdded: false
        }
    })
    const onFinish = (values) => {
        window.alert(JSON.stringify(values))
    };

    const onChangeAge = () => {
        console.info('some manipulations onChangeAge')
        onCalculateUsersAge()
    }

    const onRemoveUser = (cb, name) => {
        console.info('some manipulations onRemoveUser')
        cb(name)
        onCalculateUsersAge()

    }

    const onAddUser = async (cb, index) => {
        console.info('some manipulations onAddUser')
        try {
            form.getFieldsValue().users[index].isUserAdded = true
            console.log(form)
            console.log(await form.getFieldsValue())

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
        first: [{required: true, name: "first", message: "Please enter first name"}],
        last: [{required: true, name: "last", message: "Please enter last name"}],
        age: [() => ({
            validator(_, value) {
                if (!value) {
                    return Promise.reject(new Error("Please enter age"))
                }

                if (value < 18 || value > 26) {
                    return Promise.reject(new Error('Age should be from 18 to 26'));
                }
                console.log('worked')
                return Promise.resolve();
            },
        })]
    }

    return (<>
        <Form
            form={form}
            layout={'vertical'}
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.List plac name="users" initialValue={usersInitialState}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (

                            <div key={key}>
                                <Space
                                    key={key}
                                    style={{display: 'flex', marginBottom: 8}}
                                    align="center"
                                >
                                    <Form.Item
                                        label={'First Name'}
                                        {...restField}
                                        name={[name, 'first']}
                                        rules={validationRules.first}
                                    >
                                        <Input placeholder="Enter first Name" autoFocus/>
                                    </Form.Item>

                                    <Form.Item
                                        label={'Last Name'}
                                        {...restField}
                                        name={[name, 'last']}
                                        rules={validationRules.last}
                                    >
                                        <Input placeholder="Enter last Name"/>
                                    </Form.Item>

                                    <Form.Item
                                        required
                                        label={'Age'}
                                        {...restField}
                                        name={[name, 'age']}
                                        rules={validationRules.age}
                                    >
                                        <InputAge onChange={onChangeAge} placeholder={'Enter age'}/>
                                    </Form.Item>


                                    {
                                        fields.length !== 1
                                            ? <MinusCircleOutlined onClick={() => onRemoveUser(remove, name)}/>
                                            : null
                                    }

                                </Space>

                                {
                                    fields.length !== 0 ?
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => onAddUser(add, key)} block
                                                    icon={<PlusOutlined/>}>
                                                Add field
                                            </Button>
                                        </Form.Item>
                                        : null
                                }
                            </div>
                        ))}

                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>

        <Typography.Paragraph>{usersAverageAge || "users average age"}</Typography.Paragraph>
    </>)
}
export default App;