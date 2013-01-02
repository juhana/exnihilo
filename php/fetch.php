<?php 

error_reporting( E_ALL );
ini_set( 'display_errors', 1 );


$dbSettings = array(
	'host'		=> 'localhost',
	'database'	=> 'exnihilo',
	'username'	=> 'root',
	'password'	=> 'root',
	'prefix'	=> ''	// if your web site provider forces prefixes in table names, write the prefix here
);

$dsn = "mysql:host={$dbSettings[ 'host' ]};dbname={$dbSettings[ 'database' ]};charset=utf-8;";

try {
	$db = new PDO( 
		$dsn, 
		$dbSettings[ 'username' ], 
		$dbSettings[ 'password' ],  
		array(
	    	PDO::ATTR_PERSISTENT => true
		)
	);
	$db->query( "SET NAMES 'utf8'" );
} catch (PDOException $e) {
	print_r( $e->getMessage() );
}

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

if( !empty( $_GET[ 'word' ] ) ) {
	$prep = $db->prepare( "INSERT INTO {$dbSettings['prefix']}final_words
		SET word = ?" );
	$prep->execute( array( $_GET[ 'word' ] ) );
	die( 'ok' );
}

if( empty( $_GET[ 'side' ] ) || empty( $_GET[ 'nodes' ] ) || !isset( $_GET[ 'message' ] ) ) {
	die( 'Invalid query string.' );
}

// the IP is saved only so that we don't serve  
// playthroughs the reader has played themselves 
$ip = $_SERVER[ 'REMOTE_ADDR' ];

$prep = $db->prepare( "INSERT INTO {$dbSettings['prefix']}playthroughs 
	SET modified = NOW(), side = ?, nodes = ?, message = ?, ip = ?" );
	
$prep->execute( array(
	$_GET[ 'side' ],
	implode( ',', $_GET[ 'nodes' ] ),
	$_GET[ 'message' ],
	$ip
) );

// pick a playthrough that has been picked the least
$prep = $db->prepare( "SELECT id, nodes, message 
	FROM {$dbSettings['prefix']}playthroughs 
	WHERE side != ? AND ip != ?
	ORDER BY used, RAND()
	LIMIT 1"
);

$query = $prep->execute( array( $_GET[ 'side' ], $ip ) );

if( !( $result = $prep->fetch() ) ) {
	die( 'No playthroughs in the database.' );	
}

// increment counter
$db->query( "UPDATE {$dbSettings['prefix']}playthroughs 
	SET used = used + 1 
	WHERE id = '{$result['id']}'"
);

echo json_encode( 
	array( 
		'nodes'	=> $result[ 'nodes' ],
		'message'		=> $result[ 'message' ] 
	)
);
