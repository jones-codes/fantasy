/* global Warriors */
Warriors = new Mongo.Collection("warriors");
if (Meteor.isServer) {
  Meteor.publish('theWarriors', function(){
    return Warriors.find();
  });
  
  Meteor.methods({
    'draftWarrior': function(selectedWarrior){
      var currentUserId = Meteor.userId();
      Warriors.update(selectedWarrior, {$addtoSet: {draftedBy: currentUserId}});
    },
    'insertWarriorData': function(warriorNameVar, rankVar, weaponVar, armorVar){
      var currentUserId = Meteor.userId();
      rankVar = Number(rankVar);
      Warriors.insert({
        name: warriorNameVar,
        rank: rankVar,
        weapon: weaponVar,
        armor: armorVar,
        createdBy: currentUserId
      });
    },
    'removeWarriorData': function(selectedWarrior){
      var currentUserId = Meteor.userId();
      Warriors.remove(selectedWarrior);
      //Warriors.remove({_id: selectedWarrior, createdBy: currentUserId});
    }
  });
}
if (Meteor.isClient) {
  Meteor.subscribe('theWarriors');
  
  Template.warrior.helpers({
    warriors: function () {
      //Show highest rank at the top
      var currentUserId = Meteor.userId();
      return Warriors.find({draftedBy: undefined}, {sort: {rank: 1}});
      //return Warriors.find({claimedBy: currentUserId}, {sort: {rank: +1}});
    },
    'selectedClass': function () {
      var warriorId = this._id;
      var selectedWarrior = Session.get('selectedWarrior');
      if(warriorId == selectedWarrior){
        return "selected"
      }
    }
  });
  
  Template.currentTeam.helpers({
    currentWarriors: function () {
      //Show highest rank at the top
      var currentUserId = Meteor.userId();
      return Warriors.find({draftedBy: currentUserId}, {sort: {rank: 1}});
    }
  });
  Template.newWarrior.events({
    'submit form': function(event){
      event.preventDefault();
      var warriorNameVar = event.target.warriorName.value;
      var rankVar = event.target.rank.value;
      var weaponVar = event.target.weapon.value;
      var armorVar = event.target.armor.value;
      
      Meteor.call('insertWarriorData', warriorNameVar, rankVar, weaponVar, armorVar);
      event.target.warriorName.value = "";
      event.target.rank.value = "";
      event.target.weapon.value = "";
      event.target.armor.value = "";
      
     }
  });
   Template.warrior.events({
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
      Meteor.call('removeWarriorData', selectedWarrior);
    },
    'click .draft': function(){
      var selectedWarrior = Session.get('selectedWarrior');
      Meteor.call('draftWarrior', selectedWarrior);
    }
  });
  Template.register.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.registerEmail.value;
      var passwordVar = event.target.registerPassword.value;
      var trimInput = function(val) {
        return val.replace(/^\s*|\s*$/g, "");
      }
      var isValidPassword = function(val) {
        return val.length >= 6 ? true : false; 
      }
      emailVar = trimInput(emailVar);
      if(isValidPassword(passwordVar)){
        Accounts.createUser({
        email: emailVar,
        password: passwordVar}, 
        function(error){
          if (error)
          return "The user account creation has failed.";
          else
          return "Success. Account has been created and user has logged in successfully";
        });
      }
      
        return false;
    }
  });
  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;
      var trimInput = function(val) {
        return val.replace(/^\s*|\s*$/g, "");
      }
      emailVar = trimInput(emailVar);
      Meteor.loginWithPassword(emailVar, passwordVar, function(error){
        if(error)
         return "Your login attempt has failed.";
        else
        return "You are now logged in.";
      });
      return false;
    }
  });
  Template.dashboard.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });
}