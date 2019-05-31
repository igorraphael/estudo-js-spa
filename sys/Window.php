<?php

class Window{

    public function __construct(){
        $this->conn = $this->connectDB();
        $this->close = $this->closeDB();
    }


    public function init() {
        foreach ($_POST as $key => $val) {
            $this->$key = $val;
        }
        if (isset($this->action) && method_exists($this, $this->action)) {
            $_method = $this->action;
            return $this->$_method();
        }
    }

    public function getNameWindow(){
        $sql = "SELECT * FROM janela";
        $exe_query = mysqli_query($this->conn, $sql);
        if( mysqli_num_rows($exe_query) > 0 ){
            while($row = mysqli_fetch_object($exe_query) ){
                $result[] = $row->descricao;
            }
        }
        $this->close;
        return $result;
    }

    public function getWindows(){
        $nameWindow = $_POST['param'];
        $sql = "SELECT J.descricao AS nJanela, I.descricao, I.field_element, I.field_type, I.id FROM janela AS J INNER JOIN itens_janela AS I ON I.id_janela = J.id WHERE J.descricao = '$nameWindow' ";
        $exe_query = mysqli_query($this->conn, $sql);
        if( mysqli_num_rows($exe_query) > 0 ){
            while($row = mysqli_fetch_object($exe_query) ){
                $result[] = $row;
            }
        }else{
            $result = 'Nenhum campo registrado no banco de dados.';
        }
        $this->close;
        return $result;
    }


//function request form and insert 
    public function insertNewRow(){
        //return $_POST['param'];
        $idJanela = $this->getIdJanela($_POST['param'][0]);
        if(!$idJanela):
            return "error";
            exit();
        endif;
        $aa = $this->extractId($_POST['param'][1]);// PAREI AQUI
        // for ($i=1; $i < count($_POST['param']); $i++) { 
        //     # code...
        // }
        //$sql = "INSERT INTO data_varchar VALUES ('$idJanela', '$')" 
        
        // $sql = "INSERT INTO client(`nome`, `rg`, `email`, `dt_nasc`, `money`) VALUES('$nome', '$rg', '$email', '$dt_nasc', '$money')";
        // $exe_query = mysqli_query($this->conn, $sql);
        //     if($exe_query){
        //         $msg = "Cliente cadastrado.";
        //     }else{
        //         $msg = "Error: " . $sql . "<br>" . mysqli_error($this->conn);
        //     }
       
     return $aa;
    }

    public function extractId($item){
        $n = explode("[", $item);// $n[0] = dado informado pelo usuario.
        $n1 = explode("]", $n[1]); //$n1[0] = ID do campo na tabela.
        $newArray = array( $n[0], $n1[0]);
        return $newArray;
    }
    
    //get id 
    public function getIdJanela($name){
        //var_dump($name);
        $sql = "SELECT * FROM janela WHERE descricao = '$name'";
        $exe_query = mysqli_query($this->conn, $sql);
        // if( mysqli_num_rows($exe_query) > 0 ){
        //     while($row = mysqli_fetch_object($exe_query) ){
        //         $result[] = $row->id;
        //     }
        // }
        $row = mysqli_fetch_assoc($exe_query);
        $this->close;
        return $row;

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
