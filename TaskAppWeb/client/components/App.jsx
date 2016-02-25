App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    let handle = Meteor.subscribe('tasks');
    let sort = {
      checked: 1,
      starred: -1,
      createdAt: -1
    };
    return {
      tasksLoading: !handle.ready(),
      tasks: Tasks.find({}, {sort}).fetch(),
      hasTasks: Boolean(Tasks.find().count())
    }
  },
  getInitialState() {
    return {text: ''}
  },
  renderTasks() {
    return this.data.tasks.map((task) => {
      return <Task task={task} key={task._id}/>;
    });
  },
  onChange(event) {
    this.setState({text: event.target.value})
  },
  handleSubmit(event) {
    event.preventDefault();
    let text = this.state.text.trim();
    if (text.length)
      Meteor.call('addTask', text);
    this.setState({text: ''})
  },
  render() {
    let taskList;
    if (this.data.tasksLoading)
      taskList = (
        <div className="empty">Loading...</div>
      )
    else if (this.data.hasTasks)
      taskList = (
        <ul>{this.renderTasks()}</ul>
      )
    else
      taskList = (
        <div className="empty">No Tasks</div>
      )

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <img src="/icons/plus_box.svg"/>
          <input onChange={this.onChange} value={this.state.text} type="text" placeholder="Add a new task..." required/>
        </form>

        {taskList}
      </div>
    )
  }
});
