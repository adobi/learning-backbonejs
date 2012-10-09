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
			//$_SESSION['contacts'][] =
			$contact = json_decode($_POST['model'], true);
			$contact['id'] = rand(1, 100000);
			
			$_SESSION['contacts'][] = $contact;

			echo json_encode($contact);
			//print_r(file_get_contents('php://input'));
			break;
		case 'PUT':
			break;
		case 'DELETE':
			unset($_SESSION['contacts'][0]);
			$_SESSION['contacts'] = array_values($_SESSION['contacts']);
			break;
	}
	//print_r($_SESSION);
	die;

?>