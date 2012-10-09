<?php  
	session_start();
	print_r($_SESSION);
	unset($_SESSION['contacts']);
?>