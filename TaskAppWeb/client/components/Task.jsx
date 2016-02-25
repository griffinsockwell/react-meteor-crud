Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },
  toggleChecked() {
    const {task} = this.props;
    Meteor.call("setChecked", task._id, !task.checked);
  },
  toggleStarred() {
    const {task} = this.props;
    Meteor.call("setStarred", task._id, !task.starred);
  },
  deleteTask() {
    const {task} = this.props;
    if (confirm("Are you sure you want to delete this task?")) {
      Meteor.call("removeTask", task._id);
    }
  },
  render() {
    const {task} = this.props;

    let iconLeft = task.checked
      ? <img src="/icons/checked.svg"/>
      : <img src="/icons/unchecked.svg"/>;

    let checkedText = task.checked
      ? "checked"
      : "";

    let buttonRight;
    if (task.checked)
      buttonRight = (
        <button onClick={this.deleteTask}>
          <img className="trash" src="/icons/delete.svg"/>
        </button>
      )
    else if (task.starred)
      buttonRight = (
        <button onClick={this.toggleStarred}>
          <img src="/icons/starred.svg"/>
        </button>
      )
    else
      buttonRight = (
        <button onClick={this.toggleStarred}>
          <img src="/icons/unstarred.svg"/>
        </button>
      )

    return (
      <li>
        <button onClick={this.toggleChecked}>
          {iconLeft}
        </button>

        <span className={checkedText}>
          {task.text}
        </span>

        {buttonRight}
      </li>
    )
  }
});
