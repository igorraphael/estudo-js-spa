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
        $sql = "SELECT * FROM window";
        $exe_query = mysqli_query($this->conn, $sql);
        if( mysqli_num_rows($exe_query) > 0 ){
            while($row = mysqli_fetch_object($exe_query) ){
                $result[] = $row->nome_window;
            }
        }
        $this->close;
        return $result;
    }

    public function getWindows(){
        $nameWindow = $_POST['param'];
        $sql = "SELECT W.nome_window, I.campo_type, I.title_campo FROM window AS W INNER JOIN itens_window AS I On I.id_window = W.id WHERE W.nome_window = '$nameWindow' ";
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
    public function newRequestForm(){
        //$_POST['param']; array with data for insert
        // if(! $_POST['param'] ){
        //     return echo "Não é possivel completar a requisição.";
        // }

        if( $_POST['param'][0] == 'Cadastro_de_cliente' ){
            $response = $this->newClient($_POST['param']);
        }else{
            $this->newProduct($_POST['param']);
        }

        // $nome = $_POST['param'][0];     // Nome 
        // $rg = $_POST['param'][1];       // RG 
        // $email = $_POST['param'][2];    // Email 
        // $dt_nasc = date('Y-m-d');  // Data Nasc 
        // $money = $_POST['param'][4];    // Money
        // $sql = "INSERT INTO client(`nome`, `rg`, `email`, `dt_nasc`, `money`) VALUES('$nome', '$rg', '$email', '$dt_nasc', '$money')";
        // $exe_query = mysqli_query($this->conn, $sql);
        //     if($exe_query){
        //         $msg = "Cliente cadastrado.";
        //     }else{
        //         $msg = "Error: " . $sql . "<br>" . mysqli_error($this->conn);
        //     }
       
        return $response;
    }

    public function newClient($cliente){
        $nome = $cliente[1];     // Nome 
        $rg = $cliente[2];       // RG 
        $email = $cliente[3];    // Email 
        $dt_nasc = date('Y-m-d');         // Data Nasc 
        $money = $cliente[4];    // Money

        $sql = "INSERT INTO client(`nome`, `rg`, `email`, `dt_nasc`, `money`) VALUES('$nome', '$rg', '$email', '$dt_nasc', '$money')";
        $exe_query = mysqli_query($this->conn, $sql);
            if($exe_query){
                $msg = "Cliente cadastrado.";
            }else{
                $msg = "Error: " . $sql . "<br>" . mysqli_error($this->conn);
            }
       
        return $msg;
    }
    
    public function newProduct($product){
        return $product;
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
