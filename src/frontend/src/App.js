import './App.css';
import {useState, useEffect} from "react";
import {getAllStudent, deleteStudent} from "./client";
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";


import {
    DesktopOutlined,
    FileOutlined, LoadingOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    UserAddOutlined
} from '@ant-design/icons';

import {
    Breadcrumb,
    Empty,
    Layout,
    Menu,
    Spin,
    Table,
    Button,
    Badge,
    Tag,
    Avatar,
    Radio,
    Popconfirm
} from 'antd';


const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined/>),
    getItem('Option 2', '2', <DesktopOutlined/>),
    getItem('User', 'sub1', <UserOutlined/>, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),]),
    getItem('Team', 'sub2', <TeamOutlined/>, [
        getItem('Team 1', '6'),
        getItem('Team 2', '7')]),
    getItem('Files', '8', <FileOutlined/>),
];

const confirmDelete = (studentId, fetchStudents) => {
    deleteStudent(studentId)
        .then(() => {
            console.log("Student removed")
            fetchStudents()
            successNotification(
                "Student success removed",
                `Student Id ${studentId} was removed to the system`
            )
        })
        .catch(err => {
            console.log(err.response)
            err.response.json()
                .then(res => {
                    errorNotification(
                        "There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`)
                })
        })
};

const TheAvatar = ({name}) => {
    let trim = name.trim();

    if (name.trim().length == 0)
        return <Avatar icon={<UserOutlined/>}/>

    const split = trim.split(" ");

    if (split.length == 1)
        return <Avatar>{split[0].charAt(0)}</Avatar>

    return <Avatar>
        {`${split[0].charAt(0)}${split[split.length - 1].charAt(0)}`}
    </Avatar>
}


const columns = (fetchStudents) => [
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, student) => <TheAvatar name={student.name}/>
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nam',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, student) =>
                <Radio.Group>
                    <Popconfirm
                        title={`Are you sure to delete ${student.name}?`}
                        onConfirm={() => confirmDelete(student.id, fetchStudents)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Radio.Button value="small">Delete</Radio.Button>
                    </Popconfirm>
                    <Radio.Button value="small">Edit</Radio.Button>
                </Radio.Group>
        }
    ]
;

const antIcon = (
    <LoadingOutlined style={{fontSize: 24}} spin/>
);

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () => {
        getAllStudent()
            .then(res => res.json())
            .then(data => {
                setStudents(data);
            })
            .catch(err => {
                console.log(err.response)
                err.response.json()
                    .then(res => {
                        errorNotification(
                            "There was an issue",
                            `${res.message} [${res.status}] [${res.error}]`)
                    })
            })
            .finally(() => setFetching(false))
    }

    useEffect(() => {
        console.log("Component is mounted")
        fetchStudents()
    }, [])

    const renderStudentDrawer = () => {
        return <StudentDrawerForm
            setShowDrawer={setShowDrawer}
            showDrawer={showDrawer}
            fetchStudents={fetchStudents}
        />
    }

    const renderStudents = () => {
        if (fetching)
            return <Spin indicator={antIcon}/>;

        if (students.length <= 0)
            return <Empty/>;

        return (
            <>
                <StudentDrawerForm
                    setShowDrawer={setShowDrawer}
                    showDrawer={showDrawer}
                    fetchStudents={fetchStudents}
                />
                <Table
                    dataSource={students} columns={columns(fetchStudents)}
                    rowKey={student => student.id}
                    title={() =>
                        <>
                            <Tag>
                                Number of students
                            </Tag>

                            <Badge
                                count={students.length}
                                className="site-badge-count"
                                style={{marginBottom: "3px"}}
                            />

                            <br/> <br/>
                        </>
                    }
                    bordered
                    pagination={{
                        pageSize: 20
                    }}
                    scroll={{
                        y: 240
                    }}
                />
            </>

        );
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}/>
                <Content style={{margin: '0 16px'}}>
                    <Button
                        style={{margin: '10px 0px 10px 0px'}}
                        onClick={() => setShowDrawer(!showDrawer)}
                        type="primary"
                        shape="round"
                        icon={<UserAddOutlined/>}>
                        Add New Student
                    </Button>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        {renderStudents()}
                        {renderStudentDrawer()}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    By Ferraz
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;
