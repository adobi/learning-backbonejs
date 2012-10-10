<?php  
	
	require_once 'data.php';

	$id = @$_REQUEST['id'];

	function get($id) {
		$contacts = $_SESSION['contacts'];
		
		foreach ($contacts as $key => $value) {
			
			if ($value['id'] == $id) return $value;
		}

		return 0;
	}
	function remove($id) {
		$contacts = $_SESSION['contacts'];
		
		foreach ($contacts as $key => $value) {
			
			//print_r($id);
			//print_r($value['id'])

			if ($value['id'] == $id) unset($_SESSION['contacts'][$key]);
		}
		//print_r($_SESSION['contacts']);
		$_SESSION['contacts'] = array_values($_SESSION['contacts']);
	}
	function set($id, $data) {
		$contacts = $_SESSION['contacts'];
		
		foreach ($contacts as $key => $value) {
			
			if ($value['id'] == $id) {
				$_SESSION['contacts'][$key] = $data;

			}
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
			parse_str(file_get_contents("php://input"),$data);
			//print_r($data);
			$contact = json_decode($data['model'], true);

			set($_GET['id'], $contact);

			break;
		case 'DELETE':
			//unset($_SESSION['contacts'][0]);
			//$_SESSION['contacts'] = array_values($_SESSION['contacts']);
			remove($_GET['id']);
			break;
	}
	//print_r($_SESSION);
	die;

?>