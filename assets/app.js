;(function(window, $) {
	App = {}
	
	var Tpl = {}
	Tpl = {
		getHtml: function(id) {

			return $('#'+id+'-template').html()
		},

		get: function(id) {
			
			return Handlebars.compile(this.getHtml(id))

		},

		registerPartial: function() {
			Handlebars.registerPartial('contact_item', this.getHtml('contact-item'))
		}
	}

	var Contact = Backbone.Model.extend({
		//url: 'contact.php',
		url: function() {
			return 'contact.php?id=' + this.get('id')
		}
	})

	var Contacts = Backbone.Collection.extend({
		model: Contact,
		'url': 'contacts.php'
	})

	var EditContactView = Backbone.View.extend({
		initialize: function() {
			this.collection.on('add', this.clearInput, this)
		},
		events: {
			'submit .save-contact-form': 'saveConact',
			'click .close': 'close'
		},
		render: function() {
			var tpl = Tpl.get('create-contact-form')
			
			$(this.el).html(tpl())

			return this
		},
		saveConact: function(e) {
			//var form = $(e.target)

			e.preventDefault()
			
			var ret = this.collection.create({name: this.$('#name').val(), email: this.$('#email').val()}, {wait:true})

			//console.log(ret.toJSON());

			//console.log(this.collection.toJSON())
		},
		clearInput: function() {
			this.$('#name').val('')
			this.$('#email').val('')
		},
		close: function(e) {
			e.preventDefault()

			$(this.el).empty()
		}
	})

	var ContactsView = Backbone.View.extend({
		initialize: function() {
			this.collection.on('add', this.appendContact, this)
			this.collection.on('remve', this.removeContact, this)
		},
		events: {
			"click .open-create-form": "openCreateForm",
			"click .open-contat-details": "openContactDetails",
			'click .reset-contacts': "resetContacts"
		},
		render: function() {
			//var tpl = Tpl.get('contacts')

			var that = this

			$('.content').empty()

			that.collection.fetch({
				success: function(resp) {
					//console.log(resp.toJSON())
					that.display(resp)
				}
			})
			return this
		},

		resetContacts: function(e) 
		{
			var that = this

			e.preventDefault()

			$.get('reset.php', function() {
				that.render()
			})
		},

		display: function(resp) 
		{
			var tpl = Tpl.get('contacts')

			//this.$('.contacts').html(tpl({contacts: resp.toJSON()}))
			$(this.el).html(tpl({contacts: resp.toJSON()}))
		},

		openCreateForm: function(e) {
			e.preventDefault()

			//this.options.editContactView.render()
			App.editView.render()
		},
		appendContact: function(contact) {
			//console.log('append contact')
			var tpl = Tpl.get('contact-item')

			this.$('ul').append(tpl(contact.attributes))
		},
		removeContact: function() {
			
		},
		openContactDetails: function(e) {
			var el = $(e.target)
			
			e.preventDefault()

			var details = new ContactDetailsView({
				collection: App.contacts, 
				contact_id: el.data('id'),
				model: App.contact
			})
			//console.log('hello')
			details.render()
			//App.detailsView.render()

			//this.options.contactDetailsView.render()
		}
	})

	var ContactDetailsView = Backbone.View.extend({
		el: $('.content'),
		events: {
			"click .edit-contact": "editContact",
			"click .delete-contact": "deleteContact"
		},
		initialize: function() {
			this.collection.on('remove', this.onDestroy, this)
		},

		onDestroy: function(model, options) {
			//App.contactsView.render()
			var that = this
			//console.log('delete from collection: ', model, options.index)
			model.destroy({success: function(model, response) {

				$(that.el).empty()
				$(that.el).unbind()
				App.contactsView.render()
			}})
			//App.contactsView.collection = this.collection
		},

		render: function(id) {
			var tpl = Tpl.get('contanct-details')
					, that = this
			$(this.el).html(tpl(this.collection.get(this.options.contact_id).toJSON()))

			return this;
		},

		editContact: function(e) {
			e.preventDefault()
			console.log('edit')
		},

		deleteContact: function(e) {
			e.preventDefault()

			var el = $(e.target)
					, id = el.data('id')

			this.collection.remove(id)
		}
	})
	
	var FriendsView = Backbone.View.extend({
		el: $('.content'),
		render: function() {
			var tpl = Tpl.get('friends')
			$(this.el).html(tpl())
			$('.sidebar').empty()
			return this;
		}
	})

	var NavigationView = Backbone.View.extend({
		el:'.navigation',
		events: {
			'click a': 'navigate'
		},
		navigate: function(e) {
			e.preventDefault()
			App.router.navigate($(e.target).attr('href'), {trigger: true, replace: true})
		}
	})

	App.Contacts = function() {

		var contacts = new Contacts()
		var contact = new Contact

		var editView = new EditContactView({el: $('.content'), 'collection': contacts})
				//, details = new ContactDetailsView({el:$('.content'), 'collection': contacts})

		var contactsView = new ContactsView({el: $('.contacts'), 'collection': contacts, 'editContactView':editView}).render()

		App.contactsView = contactsView
		App.editView = editView
		//App.detailsView = details
		App.contacts = contacts
		App.contact = contact
		
	}

	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'home',
			'contacts': 'contacts',
			'friends': 'friends'
		},
		contacts: function() {
			//console.log('hello contacts')
			App.Contacts()
		},
		friends: function() {
			
			new FriendsView().render()
		},
		home: function() {
			//console.log('hello home')
		}
	})

	$(function() {
		//Backbone.emulateHTTP = true 
		Backbone.emulateJSON = true

		Tpl.registerPartial()

		var router = new AppRouter()

		App.router = router

		new NavigationView
		//console.log(router)

		Backbone.history.start({pushState: true, root:'/backbonejs/learning-backbonejs/'})
		//Backbone.history.start()
	})

}) (window, jQuery);