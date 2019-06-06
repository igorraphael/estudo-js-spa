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
//function delete data in db
    public function deleteDataArray(){
        //return $_POST['param'];
        foreach ($_POST['param'] as $key => $value) {
            //$t[$key] = "DELETE data_varchar WHERE id = $value";
            $sql = "DELETE FROM data_varchar WHERE id = $value";
            if (mysqli_query($this->conn, $sql)) {
                $msg = "ok";
            }else{
                $msgError = "Error deleting record: " . mysqli_error($this->conn);
                exit();
            }
        }
        $this->close;//fecha connection db
        if(!empty($msgError) ):
            return $msgError;//se der erro retorna msg de error
        endif;
        return $msg;
    }
    
//function for update row table
public function updateRowTable(){
   for($i = 0; $i < count($_POST['param']); $i++ ){
        $value = $_POST['param'][$i]['value'];
        $id = $_POST['param'][$i]['id_item'];
        $sql = "UPDATE data_varchar SET data_value = '$value' WHERE id = $id";
            if (mysqli_query($this->conn, $sql)) {
                $msg = "ok";
            }else{
                $msgError = "Error update record: " . mysqli_error($this->conn);
                exit();
            }    
    }
   $this->close;//fecha connection db
    if(!empty($msgError) ):
        return $msgError;//se der erro retorna msg de error
    endif;
    return $msg;
}    

//function request form and insert
    public function insertNewRow(){
    //$_POST['param'][0] Nome da janela.
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
            $msg = "ERROR!";
        }
     return $msg;
    }
//retorna id separado do value;
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

//get all data for table
    public function getAllData(){
        //nome da janela para pegar infos -> $_POST['window']
        $name = $_POST['window'];
        $sql = "SELECT * from janela WHERE descricao = '$name'";
        $first_query = mysqli_query($this->conn, $sql);
        $id_for_data = mysqli_fetch_assoc($first_query);
        if(!$id_for_data):
            return "Error!";
        endif;
        $id = $id_for_data['id'];
        //select data com id janela.
        // $sql = "SELECT * FROM data_varchar WHERE id_janela = $id";
        // $exe_query = mysqli_query($this->conn, $sql);
        // if( mysqli_num_rows($exe_query) > 0 ){
        //     while($row = mysqli_fetch_object($exe_query) ){
        //         $result[] = $row;
        //     }
        // }
        //select com inner join
        $sql = "SELECT I.descricao AS label, D.id, D.data_value FROM itens_janela AS I INNER JOIN data_varchar AS D ON I.id = D.id_iten_janela WHERE D.id_janela = $id ORDER BY D.id";
        $exe_query = mysqli_query($this->conn, $sql);
        if( mysqli_num_rows($exe_query) > 0 ){
            while($row = mysqli_fetch_array($exe_query) ){
                //$result[] = $row;
                $result[] = array("window" => $row['label'], "id_item" => $row['id'], "value" => $row['data_value']);
            }
        }
        $this->close;
        return $result;
    } 

//function connect db
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
