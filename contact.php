<?php  
	
	require_once 'data.php';

	$id = @$_REQUEST['id'];

	function get($id) {
		$contacts = $_SESSION['contacts']['contacts'];
		
		foreach ($contacts as $key => $value) {
			
			if ($value['id'] == $id) return $value;
		}

		return 0;
	}

	switch ($_SERVER['REQUEST_METHOD']) {
		case 'GET':
			echo json_encode(get($id));
			break;
		case 'POST':
		case 'PUT':
		case 'DELETE':
	}
	
	die;

?>