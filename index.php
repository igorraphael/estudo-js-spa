<?php
    //init.php
    $_PATH['root'] = $_SERVER['DOCUMENT_ROOT'] . '/project/';
    $_PATH['sys'] = $_PATH['root'] . 'sys/';
    $_PATH['views'] = $_PATH['root'] . 'views/';

    require_once('autoloader.php');
 
    if (isset($_POST['action']) && !empty($_POST['action'])) {
        switch($_POST['action']) {
            // case 'go':
            //     $_page = $_POST['page'] . '.inc';
            //     break;
            default:
                $ctrl_name = ucfirst($_POST['mod']);
                if(class_exists($ctrl_name)) {
                    $_controller = new $ctrl_name();
                    $_response = $_controller->index();
                }
        }
        
        if (isset($_response)) {
            header('Cache-Control: no-store, no-cache, must-revalidate');
            header('Expires: Wed, 05 Jun 1985 05:00:00 GMT');
            header('Content-type: application/json; charset=utf-8');
            echo json_encode($_response);
            exit;
        }
    }



    header('Content-type: text/html; charset=utf-8');
    require_once($_PATH['views'] . (isset($_page) ? $_page : 'index.html'));

    exit;