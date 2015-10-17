/* global Warriors */
Warriors = new Mongo.Collection("warriors");
var rank = 2;

if (Meteor.isClient) {
  Template.body.helpers({
    warriors: function () {
      //Show highest rank at the top
      return Warriors.find({}, {sort: {rank: +1}});
    },
    'selectedClass': function () {
      var warriorId = this._id;
      var selectedWarrior = Session.get('selectedWarrior');
      if(warriorId == selectedWarrior){
        return "selected"
      }
    }
  });
  Template.newWarrior.events({
    'submit form': function(event){
      event.preventDefault();
      var warriorNameVar = event.target.warriorName.value;
      rank = rank + 1;
      Warriors.insert({
        name: warriorNameVar,
        rank: rank
      });
      
      event.target.warriorName.value = "";
     }
  });
   Template.body.events({
    /*'submit .new-warrior': function (event) {
      // Prevent default browser form submit
      event.preventDefault();
      
      // Get value from form element
      var text = event.target.text.value;
      rank = rank + 1;
      //Isert a Warrior into the collection
      Warriors.insert({
        name: text,
        rank: rank,
        createdAt: new Date() //current time
      });
      
      // Clear form
      event.target.text.value = "";
  
    },
    */
    'click .warrior': function(){
      var warriorId = this._id;
      Session.set('selectedWarrior', warriorId);
    },
    'click .remove': function(){
      var selectedWarrior = Session.get('selectedWarrior');
      Warriors.remove(selectedWarrior);
    }
  });
}