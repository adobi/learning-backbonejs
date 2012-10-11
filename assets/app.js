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
			Handlebars.registerPartial('contacts_list', this.getHtml('contacts-list'))
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

	var SidebarView = Backbone.View.extend({
		el: $('.sidebar'),

		template: Tpl.get('contacts'),

		initialize: function() {
			_.bindAll(this, 'render')
			this.dispose()
		},

		events: {
			"click .open-create-form": "proxy",
			"click .open-contat-details": "proxy",
			'click .reset-contacts': "resetContacts"
		},

		render: function() {

			$('.content').empty()

			$(this.el).html(
				this.template()
			)

			this.contacts = new ContactsView({
				el: this.$('.contacts-list'),
				collection: App.contacts
			})
			//console.log(this.contacts.render().el)
			$(this.el).append(this.contacts.render().el)
		},

		resetContacts: function(e) 
		{
			var that = this

			//e.preventDefault()

			$.get('reset.php', function() {
				that.render()
			})
		},

		proxy: function(e) {
			
			//e.preventDefault()
			//new EditContactView({el: $('.content'), collection: App.contacts || new Contacts}).render() 

			//App.navigate(e)
		}

	})

	var ContactsView = Backbone.View.extend({
		template: Tpl.get('contacts-list'),
		
		initialize: function() {
			_.bindAll(this, 'render')
			this.collection.on('change', this.render)
		},

		render: function() {
			var that = this
			this.collection.fetch().done(function(collection, response) {

				$(that.el).html(
					that.template({
						contacts: collection
					})
				)

				return that
			})
			return this
		},

	})

	var EditContactView = Backbone.View.extend({
		template: Tpl.get('create-contact-form'),

		initialize: function() {
			//$(this.el).off()
			this.dispose()
			this.collection.on('add', this.clearInput, this)
		},

		events: {
			'submit .save-contact-form': 'saveConact',
			'click .close': 'close'
		},

		render: function() {
			
			$(this.el).html(this.template())

			return this
		},

		saveConact: function(e) {

			e.preventDefault()

			var ret = this.collection.create({name: this.$('#name').val(), email: this.$('#email').val()}, {wait_:true})
		},

		clearInput: function() {
			this.$('#name').val('')
			this.$('#email').val('')
		},

		close: function(e) {
			//e.preventDefault()

			//$(this.el).empty()

			//App.navigate(e)
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
			'click a[href^="!#"]': 'navigate'
		},
		navigate: function(e) {
			//console.log('hello')
			//e.preventDefault()
			App.router.navigate($(e.target).attr('href'), {trigger: true, replace: true})
		}
	})

	var ContactDetailsView = Backbone.View.extend({
		template: Tpl.get('contanct-details'),
		el: $('.content'),
		events: {
			"click .edit-contact": "editContact",
			"click .delete-contact": "deleteContact"
		},
		initialize: function() {
			this.collection.on('remove', this.onDestroy, this)
		},

		onDestroy: function(model, options) {
			var that = this
			model.destroy({success: function(model, response) {

				$(that.el).empty()

				//App.contactsView.render()
				that.collection.remove(model)
			}})
		},

		render: function() {
			var that = this
				, json
				, item = this.collection.get(this.options.contact_id)
			
			if (item) {
				$(this.el).html(this.template(item.toJSON()))
			} else {

				this.model.set('id', this.options.contact_id).fetch().done(function(response) {
					$(that.el).html(that.template(response))
				})
			}


			return this;
		},

		editContact: function(e) {
			e.preventDefault()
			//console.log('edit')
		},

		deleteContact: function(e) {
			e.preventDefault()

			var el = $(e.target)
					, id = el.data('id')

			this.collection.remove(id)
		}
	})
	
	App.navigate = function(e) {
		//console.log('hello navigate')
		//e.preventDefault()

		//App.router.navigate($(e.target).attr('href'), {trigger: true, replace: true})

		//e.stopPropagation()
	}

	App.DisplayContacts = function() {

		var contacts = new Contacts
		var contact = new Contact

		App.contacts = contacts
		App.contact = contact
		
		new SidebarView().render()

		App.isSidebarRendered = true
	}

	var AppRouter = Backbone.Router.extend({
		initialize: function() {
			_.bindAll(this)
		},
		routes: {
			'': 'home',
			'!/contacts/': 'contacts',
			'!/contacts/:id': 'contacts',
			'!/contacts/edit*id': 'editContact',
			'!/contacts/edit/:id': 'editContact',
			'!/friends': 'friends'
		},
		contacts: function(id) {
			
			App.DisplayContacts()

			if (id) {
				if (!App.contactDetailsView) {
					App.contactDetailsView = new ContactDetailsView({collection: App.contacts, model:App.contact})
				}
				App.contactDetailsView.options.contact_id = id
				App.contactDetailsView.render()
			}

			return false;
		},
		editContact: function(id) {
			
			!App.isSidebarRendered && App.DisplayContacts()

			new EditContactView({el: $('.content'), collection: App.contacts || new Contacts}).render() 

			return false;
		},
		friends: function() {
			
			new FriendsView().render()

			return false;
		},
		home: function() {
			//console.log('hello home')
		}
	})

	$(function() {

		$('body').on('click' , 'a[href^="#"]', function(e) { 
			//console.log('hello')
			//e.preventDefault() 
			//e.stopPropagation()
		})

		//Backbone.emulateHTTP = true 
		Backbone.emulateJSON = true

		Tpl.registerPartial()

		var router = new AppRouter()

		App.router = router

		//new NavigationView

		Backbone.history.start()

	})

}) (window, jQuery);