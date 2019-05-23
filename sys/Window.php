<?php

class Window{

    public function __construct(){
        $this->conn = $this->connectDB();
        $this->close = $this->closeDB();
    }
    public function index(){
        $msg = $this->getWindows();
        return $msg;
    }

    public function getWindows(){
        $sql = "SELECT W.nome_window, I.campo_type, I.title_campo FROM window AS W INNER JOIN itens_window AS I On I.id_window = W.id";
        //$res = $this->conn->query($sql);
        $exe_query = mysqli_query($this->conn, $sql);
        if( mysqli_num_rows($exe_query) > 0 ){
            //$data = mysqli_fetch_array($exe_query, MYSQLI_ASSOC);
            while($row = mysqli_fetch_object($exe_query) ){
                $result[] = $row;
            }
        }
        return $result;
    }







// functions db
    public function connectDB(){
      	//DEV
		$dbname = 'project';
		$host = 'localhost';
		$port = '3306';
		$dbuser = 'root';
		$dbpass = '';
		
		$conn = new \mysqli($host, $dbuser, $dbpass, $dbname, $port);
		if (!$conn) { 
			echo "Error: <b>Impossivel conectar ao MySQL. </b><br />" . PHP_EOL; //Unable to connect to MySQL
			echo "Debugging errno: <b>" . mysqli_connect_errno() . "</b><br />" . PHP_EOL;
			echo "Debugging error: <b>" . mysqli_connect_error() . "</b><br />" . PHP_EOL;
			exit;
		}
		return $conn;  
    }

    public function closeDB(){
        if(isset($conn)){
            mysqli_close($conn);
        }
    }
}
