;(function(window, $) {
	var App = {}
	
	var Tpl = {}
	Tpl = {
		getHtml: function(id) {

			return $('#'+id+'-template').html()
		},

		getTemplate: function(id) {
			
			return Handlebars.compile(this.getHtml(id))

		},

		registerPartial: function() {
			Handlebars.registerPartial('contact_item', this.getHtml('contact-item'))
		}
	}

	var Contact = Backbone.Model.extend({
		//url: 'contact.php',
		urlRoot: 'contact.php'
	})

	var Contacts = Backbone.Collection.extend({
		model: Contact,
		'url': 'contacts.php'
	})

	var EditContactView = Backbone.View.extend({
		//el: $('.content'), 
		//collection: new Contacts(),
		initialize: function() {
			this.collection.on('add', this.clearInput, this)
		},
		events: {
			'submit .save-contact-form': 'saveConact',
			'click .close': 'close'
		},
		render: function() {
			var tpl = Tpl.getTemplate('create-contact-form')
			
			$(this.el).html(tpl())

			return this
		},
		saveConact: function(e) {
			//var form = $(e.target)

			e.preventDefault()
			//console.log(this.collection)
			this.collection.create({name: this.$('#name').val(), email: this.$('#email').val()})
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
		},
		events: {
			"click .open-create-form": "openCreateForm",
			"click .open-contat-details": "openContactDetails"
		},
		render: function() {
			var tpl = Tpl.getTemplate('contacts')

			var that = this
			this.collection.fetch({
				success: function(resp) {
					that.$('.contacts-list').html(tpl(resp.toJSON()[0]))
				}
			})

			return this
		},
		openCreateForm: function(e) {
			e.preventDefault()

			//this.options.editContactView.render()
			App.editView.render()
		},
		appendContact: function(contact) {
			var tpl = Tpl.getTemplate('contact-item')

			this.$('ul').append(tpl(contact.attributes))
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
			this.model.on('destroy', this.onDestroy, this)
		},

		onDestroy: function() {
			App.contactsView.render()
			$(this.el).empty()
			$(this.el).unbind()
		},

		render: function(id) {
			var tpl = Tpl.getTemplate('contanct-details')
					, that = this
			//console.log('hello1')
			var contact = this.model.fetch({ 
							data: { id: this.options.contact_id},
							success: function(resp) {
								
								$('.content').html(tpl(resp.toJSON()))
							}
						})
			//console.log(contact)
			//$(this.el).html(tpl())

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
					
			//var ret = contactModel.destroy({
			//	data: { id: id },
			//});
			//console.log(id)
			this.model.id = id
			
			this.model.destroy({
				success: function(response) {
					console.log('deletes')
				}
			})
		}
	})

	$(function() {
		Backbone.emulateHTTP = true 
		Tpl.registerPartial()

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
		
	})

}) (window, jQuery);