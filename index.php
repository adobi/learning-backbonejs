<?php  
	//require_once 'contacts.php';
?>
<!doctype html>
<html>
	<head>
		<title>Learning Backbone JS</title>
		<link rel="stylesheet" type="text/css" href="assets/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="assets/style.css">
	</head>
	<body>
		<div class="container">
			<div class="hero-unit"><h1>Hello Backbone JS</h1></div>
			<div class="row">
				<div class="span4 contacts">
					<legend>
						Contacts
						<a href="#" class="btn btn-primary pull-right open-create-form"><strong style="font-size:1.3em">+</strong></a>
					</legend>
					<div class="contacts-list"></div>
				</div>
				<div class="span8">
					<div class="content well">
						
					</div>
				</div>
			</div>
		</div>

		<script id="create-contact-form-template" type="text/x-handlebars-template">
			<form class="form-horizontal save-contact-form" method="post" action="">
				<a href="#" class="close pull-right">&times;</a>
			  <div class="control-group">
			    <label class="control-label" for="name">Name</label>
			    <div class="controls">
			      <input type="text" id="name" placeholder="Name">
			    </div>
			  </div>
			  <div class="control-group">
			    <label class="control-label" for="email">Email</label>
			    <div class="controls">
			      <input type="text" id="email" placeholder="Email">
			    </div>
			  </div>
			  <div class="form-actions">
			  	<button type="submit" class="btn btn-primary">Create</button>
			  </div>
			</form>
		</script>
		<script id="contact-item-template" type="text/x-handlebars-template">
			<li>
				<a href="#" class="open-contat-details" data-id="{{id}}">{{name}}</a>
			</li>	
		</script>
		<script id="contacts-template" type="text/x-handlebars-template">
			<ul class="nav nav-list bs-docs-sidenav">{{#contacts}} {{>contact_item}} {{/contacts}}</ul>
		</script>	

		<script id="contanct-details-template" type="text/x-handlebars-template">
			<div class="contact">
				<legend> 
					Contact Details
					<p class="pull-right">
						<a href="#" class="btn edit-contact" data-id="{{id}}">edit</a>
						<a href="#" class="btn btn-danger delete-contact" data-id="{{id}}">delete</a>
					</p>
				</legend>
				<dl class="dl-horizontal">
					<dt>Name:</dt> <dd>{{name}}</dd>
					<dt>Email:</dt> <dd>{{email}}</dd>
				</dl>
			</div>		
		</script>	
		<script>
			App = {}
			App.Data = ''<?php //echo $contacts ?>
		</script>
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="assets/underscore-min.js"></script>
		<script src="assets/backbone-min.js"></script>
		<script src="assets/handlebars.js"></script>
		<script src="assets/app.js"></script>
	</body>
</html>