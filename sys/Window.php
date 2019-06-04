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
        $sql = "SELECT J.id AS id_janela,J.descricao AS nJanela, I.descricao, I.field_element, I.field_type, I.id, I.position_form FROM janela AS J INNER JOIN itens_janela AS I ON I.id_janela = J.id WHERE J.descricao = '$nameWindow' ORDER BY I.position_form ASC";
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
//$_POST['param'][0] Nome da janela.
    public function insertNewRow(){
        //return $_POST['param'];
        $idJanela = $this->getIdJanela($_POST['param'][0]);
        if(!$idJanela):
            return "error";
            exit();
        endif;
        $contador = 0;
        array_splice($_POST['param'], 0, 1); //Remove o nome da janela.
        for ($i=0; $i < count($_POST['param']); $i++) { 
            $data_id = $this->extractId($_POST['param'][$i]);
            $id = $data_id[1];
            $data = $data_id[0];
            $sql = "INSERT INTO data_varchar (id_janela, id_iten_janela, data_value) VALUES ('".$idJanela['id']."', '$id', '$data')";
            $exe_query = mysqli_query($this->conn, $sql);
            if($exe_query){
                $contador += 1;
            }
            //
        }

        if($contador > 1 ){
            $msg = "Foi inserido {$contador} dados!";
        }else{
            $msg = "Foi inserido {$contador} dados!";
        }
     return $msg;
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

//get data for table
    public function getAllData(){
        //nome da janela para pegar infos -> $_POST['param']
        $name = $_POST['param'];
        $sql = "SELECT * from janela WHERE descricao = '$name'";
        $first_query = mysqli_query($this->conn, $sql);
        $id_for_data = mysqli_fetch_assoc($first_query);
        if(!$id_for_data):
            return "Error!";
        endif;
        $id = $id_for_data['id'];
        //select data com id janela.
        $sql = "SELECT * FROM data_varchar WHERE id_janela = $id";
        $exe_query = mysqli_query($this->conn, $sql);
        if( mysqli_num_rows($exe_query) > 0 ){
            while($row = mysqli_fetch_object($exe_query) ){
                $result[] = $row;
            }
        }
        $this->close;
        return $result;
    } 

//functions db
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
