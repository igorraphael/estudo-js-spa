<?php
    function autoload($className) {
        global $_APP_PATH;
        if (!class_exists($className, false)) {
            foreach ($_APP_PATH as $k => $path) {
                if (file_exists($_APP_PATH['sys']. '/' . $className . '.php')) {
                    require_once('sys/' . $className . '.php');
                    break;
                }
            }
        }
    }
    spl_autoload_register('autoload');