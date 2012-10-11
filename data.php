<?php  
	session_start();

	$contacts = array(//'contacts'=> array(
			array('id'=>1, 'name'=>'Nagy Istvan', 'email'=>'istva.nagy@gmail.com'),
			array('id'=>2, 'name'=>'Szabo Istvan', 'email'=>'istvan.szabo@gmail.com'),
			array('id'=>3, 'name'=>'Nagy Kalman', 'email'=>'kalman.nagy@gmail.com'),
	);
	//unset($_SESSION);
	//print_r($_SESSION);
	if (!isset($_SESSION['contacts']) || !$_SESSION['contacts']) {
		$_SESSION['contacts'] = $contacts;
	}
