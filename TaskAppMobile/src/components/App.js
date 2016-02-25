'use strict'
import React, {
  Image,
  ListView,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native'
import _ from 'underscore'
import ddpClient from '../ddpClient'
import Task from './Task'
import plus from '../icons/plus/plus.png'

export default React.createClass({
  getInitialState() {
    return {
      tasks: [],
      connected: false,
      text: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  },
  componentWillMount() {
    ddpClient.connect((err, wasReconnect) => {
      let connected = true;
      if (err)
        connected = false;

      this.setState({connected});
      this.makeSubscription();
      this.observeTasks();
    });
  },
  makeSubscription() {
    ddpClient.subscribe("tasks", [], () => {
      this.setState({tasks: ddpClient.collections.tasks});
    });
  },
  observeTasks() {
    let observer = ddpClient.observe("tasks");
    observer.added = (id) => {
      this.setState({tasks: ddpClient.collections.tasks})
    }
    observer.changed = (id, oldFields, clearedFields, newFields) => {
      this.setState({tasks: ddpClient.collections.tasks})
    }
    observer.removed = (id, oldValue) => {
      this.setState({tasks: ddpClient.collections.tasks})
    }
  },
  handleSubmit() {
    let text = this.state.text.trim();
    if (text.length)
      ddpClient.call('addTask', [text]);
    this.setState({text: ''})
  },
  renderTasks() {
    let tasks = this.state.tasks;
    let sortedTasks = _.chain(tasks).sortBy('starred').reverse().sortBy('checked').value();
    return (<ListView dataSource={this.state.dataSource.cloneWithRows(sortedTasks)} renderRow={this.renderTask}/>)
  },
  renderTask(task) {
    return (<Task task={task} key={task._id}/>)
  },
  render() {
    const {tasks, connected} = this.state;

    let hasTasks = _.size(tasks);
    let taskList;
    if (!connected)
      taskList = (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      )
    else if (hasTasks)
      taskList = (this.renderTasks())
    else
      taskList = (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No Tasks</Text>
        </View>
      )

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerImage}>
            <Image source={plus}/>
          </View>
          <View style={styles.headerInput}>
            <TextInput placeholder="Add a new task..." placeholderTextColor="#FFF" underlineColorAndroid="#4A90E2" value={this.state.text} onChangeText={(text) => this.setState({text})} onSubmitEditing={this.handleSubmit} style={styles.headerInputText}/>
          </View>
        </View>

        {taskList}
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    paddingTop: 22,
    paddingLeft: 10,
    paddingRight: 10
  },
  header: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10
  },
  headerImage: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerInput: {
    flex: 7,
    borderRadius: 5
  },
  headerInputText: {
    color: '#FFF',
    fontSize: 18,
    height: 50,
    borderRadius: 5
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100
  },
  emptyText: {
    fontSize: 24,
    color: '#DDD'
  }
})
