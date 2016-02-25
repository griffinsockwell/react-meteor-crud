Tasks = new Mongo.Collection("tasks");

Meteor.methods({
  addTask(text) {
    let checked = false;
    let starred = false;

    if (text.length) {
      Tasks.insert({
        text,
        checked,
        starred,
        createdAt: new Date()
      });
    }
  },
  removeTask(id) {
    const task = Tasks.findOne(id);

    Tasks.remove(task)
  },
  setChecked(id, checked) {
    const task = Tasks.findOne(id);

    Tasks.update(id, {
      $set: {
        checked
      }
    });
  },
  setStarred(id, starred) {
    const task = Tasks.findOne(id);

    Tasks.update(id, {
      $set: {
        starred
      }
    });
  }
});
